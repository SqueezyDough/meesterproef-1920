const video = document.getElementById('scanner_element')
const window_path = window.location.pathname

if (navigator.mediaDevices.getUserMedia) {
  const window_path_split = window_path.split('/')

  switch(window_path_split[1]) {
    case 'scan-medicine':
      const tesseract_worker = Tesseract.createWorker({
      })

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: 480},
          height: { ideal: 175},
          facingMode: 'environment'
        }
      })
        .then((stream) => {
          video.srcObject = stream
          recognizeRVG(tesseract_worker)
        })
        .catch((err) => {
          console.log('Error: ', err)
        })
      break;
  }
} else {
  console.log('Your browser down not support video streams')
}


// TODO EXIT STATEMENT SHOULD BE WHEN MEDICINE HAS BEEN RETRIEVED FROM API, AND WORKER.TERMINATE
// TODO RENAME FUNCTION
async function recognizeRVG(tesseract_worker, index = null) {
  let recursion_index = index
  let result = null
  const base64_image= getBase64Image()
  await tesseract_worker.load()
  await tesseract_worker.loadLanguage('eng')
  await tesseract_worker.initialize('eng')

  if(recursion_index === null) {
    recursion_index = 1
  } else {
    recursion_index +=1
  }
  if(recursion_index === 10) {
    appendErrorState()
  }
  try {
    result = await tesseract_worker.recognize(base64_image)

    if(result.data.text === '') throw 'No words detected'

    const code_prefix_index = result.data.words.findIndex(word => {
      return word.text.toLowerCase() === 'rvg' || word.text.toLowerCase() === 'rvh' || word.text.toLowerCase() === 'eu'
    })
    
    // Check if RVG has been found inside word list
    //if(code_prefix_index === -1) throw 'RVG/RVH not detected inside words list'
    if(code_prefix_index === -1) {
      nameDetectionHandler(result, tesseract_worker)
    } else {
      if(/^\d+$/.test(result.data.words[code_prefix_index +1].text === false)) throw 'Code is not of correct format'
      codeDetectionHandler(result, code_prefix_index, tesseract_worker)
    }
  }
  catch(error) {
    console.log(error)
    recognizeRVG(tesseract_worker, recursion_index)
  }
}

// TODO check if we need to migrate this to the server

function tesseractReset(tesseract_output_container = undefined, overview_cards_container = undefined) {
  if(tesseract_output_container !== undefined && overview_cards_container !== undefined) {
    tesseract_output_container.innerHTML = ''
    overview_cards_container.innerHTML = ''
  }
  scannerIntroductionToggle()
  const tesseract_worker = Tesseract.createWorker({
  })

  recognizeRVG(tesseract_worker)
}

function nameDetectionHandler(result, tesseract_worker) {
  const additional_words_array = []
  const confident_words = result.data.words.filter(word => {
    const cleaned_string = word.text.replace(/[^\/\-a-zA-Z0-9 ]/g, "")
    if(cleaned_string !== '' && cleaned_string.length > 3) {
      if(word.confidence >= 85) {
        return word
      } else {
        if(cleaned_string !== '' && cleaned_string.length > 3) {
          additional_words_array.push(cleaned_string)
        }
      }
    }
  })

  if(confident_words.length === 0) throw 'Not able to detect words above 85% confidence'

  const cleaned_confident_words = confident_words.map(words => {
    return {text: words.text, confidence: words.confidence}
  })
  
  const suspected_medicines_container = document.querySelector('.overview__cards')
  scannerIntroductionToggle()
  appendLoadingState(suspected_medicines_container)

  const response = fetch('/database-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({confident_words: cleaned_confident_words, additional_words: additional_words_array})
  })
    .then(response => {
      return response.json()
    })
    .then(async suspected_medicines => {
      appendTesseractOutput('name', suspected_medicines.matched_on, suspected_medicines.matched_on_additional)
      const medicine_cards = await retrieveMedicineCards(suspected_medicines.medicines, tesseract_worker)
      removeLoadingState(suspected_medicines_container)
      appendMedicineCards(medicine_cards, suspected_medicines_container)
    })
    .catch(error => {
      console.log(error)
      tesseractReset()
    })
}

async function codeDetectionHandler(result, code_prefix_index, tesseract_worker) {
  const detected_code = result.data.words[code_prefix_index +1]

  const suspected_medicines_container = document.querySelector('.overview__cards')

  appendTesseractOutput('code', detected_code.text)
  scannerIntroductionToggle()
  appendLoadingState(suspected_medicines_container)

  if(detected_code.choices.length > 1) {
    // TODO SEARCH API FOR ALL THE CHOICES IF THERE ARE ANY
    const ordered_coices = detected_code.choices.sort((a, b) => {
      return b.confidence - a.confidence
    })
  } else { 
    const suspected_code = {
      code: detected_code.text,
      confidence: detected_code.confidence
    }
    const suspected_medicines = await searchMedicine(suspected_code)
    const medicine_cards = await retrieveMedicineCards(suspected_medicines, tesseract_worker)

    removeLoadingState(suspected_medicines_container)
    appendMedicineCards(medicine_cards, suspected_medicines_container)
  }
}


// HELPER FUNCTIONS
function getBase64Image() {
  const canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')

  canvas.width = video.offsetWidth
  canvas.height = video.offsetHeight
  context.drawImage(video, 0 ,0, video.offsetWidth, video.offsetHeight)

  return canvas.toDataURL('image/jpeg')
}

function appendMedicineCards(medicine_cards, suspected_medicines_container) {
  medicine_cards.forEach(card => {
    suspected_medicines_container.insertAdjacentHTML('beforeend', card)
  })
}

function appendTesseractOutput(output_type, matched_on, matched_on_additional = null) {
  const tesseract_output_container = document.getElementById('tesseract_output_container')

  if(output_type === 'name' && matched_on_additional === null) tesseract_output_container.innerHTML = `<p>Wij hebben het volgende gescand: <ul class="_inline"><li class="output-highlight">${matched_on}</li></ul>`
  if(output_type === 'name' && matched_on_additional !== null) tesseract_output_container.innerHTML = `<p>Wij hebben het volgende gescand: <ul class="_inline"><li class="output-highlight">${matched_on}</li><li class="output-highlight _secondary">${matched_on_additional}</li></ul>`
  if(output_type === 'code') tesseract_output_container.innerHTML = `<p>Wij hebben de code: <em class="output-highlight">${matched_on}</em> gescand</p>` 
  tesseract_output_container.insertAdjacentHTML('beforeend', '<button id="tesseract_output_incorrect" class="btn -secondary -small"><span>Scan opnieuw</scan></button>')

  document.getElementById('tesseract_output_incorrect').addEventListener('click', event => {
    tesseractReset(tesseract_output_container,document.querySelector('.overview__cards'))
  })  
}

function appendErrorState() {
  const tesseract_output_container = document.getElementById('tesseract_output_container')
  tesseract_output_container.innerHTML = '<a href="#scanner__introduction" class="output-highlight _error">Scannen duurt langer dan normaal, bekijk onderstaande tips.</a>'
}

function appendLoadingState(suspected_medicines_container) {
  suspected_medicines_container.innerHTML = '<img class="overview__cards__loading-state" src="/visuals/gif/loading-state.gif" alt="Loading overview">'
}

function removeLoadingState(suspected_medicines_container) {
  suspected_medicines_container.innerHTML = ''
}

function scannerIntroductionToggle() {
  const scanner__introduction = document.querySelector('.scanner__introduction')
  if(scanner__introduction.classList.contains('_hide')) scanner__introduction.classList.remove('_hide')
  else {
    scanner__introduction.classList.add('_hide')
  }
}

async function searchMedicine(suspected_code) {
  const form_data = new FormData()
  form_data.append('suspected_code', suspected_code)

  const suspected_medicines = await fetch('/tesseract-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(suspected_code)
  })
    .then(response => response.json())

  return suspected_medicines
}

async function retrieveMedicineCards(suspected_medicines, tesseract_worker) {
  const medicine_cards = await fetch('/scan-medicine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(suspected_medicines)
  })
    .then(response => response.json())

  await tesseract_worker.terminate()
  return medicine_cards
}
