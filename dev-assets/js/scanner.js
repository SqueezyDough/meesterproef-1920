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
          height: { ideal: 360},
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

function getBase64Image() {
  const canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')

  canvas.width = video.offsetWidth
  canvas.height = video.offsetHeight
  context.drawImage(video, 0 ,0, video.offsetWidth, video.offsetHeight)

  return canvas.toDataURL('image/jpeg')
}

function appendTesseractOutput(output) {
  const tesseract_output_container = document.getElementById('tesseract_output_container')
  tesseract_output_container.innerHTML = `Scanned text: ${output}`
}

// TODO EXIT STATEMENT SHOULD BE WHEN MEDICINE HAS BEEN RETRIEVED FROM API, AND WORKER.TERMINATE
// TODO RENAME FUNCTION
async function recognizeRVG(tesseract_worker) {
  let result = null
  const base64_image= getBase64Image()
  await tesseract_worker.load()
  await tesseract_worker.loadLanguage('eng')
  await tesseract_worker.initialize('eng')

  try {
    result = await tesseract_worker.recognize(base64_image)

    if(result.data.text === '') throw 'No words detected'

    const rvg_index = result.data.words.findIndex(word => {
      return word.text.toLowerCase() === 'rvg'
    })

    const rvh_index = result.data.words.findIndex(word => {
      return word.text.toLowerCase() === 'rvh'
    })

    // Check if RVG has been found inside word list
    if(rvg_index === -1 && rvh_index === -1) throw 'RVG/RVH not detected inside words list'
    
    let detected_code = ''
    // Check if RVG code is of correct format
    if(rvg_index !== -1) detected_code = result.data.words[rvg_index+1]
    if(rvh_index !== -1) detected_code = result.data.words[rvh_index+1]

    if(/^\d+$/.test(detected_code.text) !== true) throw 'Suspected code is not of correct format'

    if(detected_code.choices.length > 1) {
      const ordered_coices = detected_code.choices.sort((a, b) => {
        return b.confidence - a.confidence
      })

      // TODO SEARCH API FOR ALL THE CHOICES
    } else {
      // TODO SEARCH API FOR THE CHOICE
      const suspected_code = {
        code: detected_code.text,
        confidence: detected_code.confidence
      }
      
      const suspected_medicines = await searchMedicine(suspected_code)

      const medicine_cards = await fetch('/scan-medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suspected_medicines)
      })
        .then(response => response.json())
      
      const suspected_medicines_container = document.querySelector('.overview__cards')
      medicine_cards.forEach(card => {
        suspected_medicines_container.insertAdjacentHTML('beforeend', card)
      })
    }
  }
  catch(error) {
    console.log(error)
    recognizeRVG(tesseract_worker)
  }
}

async function searchMedicine(suspected_code) {
  const client = algoliasearch('EJEEPP9XOK', 'efe676cfc1248e7b10441ffbc76920cc')
  const index = client.initIndex('dev_MEDICINE')

  const suspected_medicines = index.search(suspected_code.code).then(({ hits }) => {
    return hits
  });

  return suspected_medicines
}
