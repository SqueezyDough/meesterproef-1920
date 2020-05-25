const video = document.getElementById('scanner_element')
const window_path = window.location.pathname

if (navigator.mediaDevices.getUserMedia) {
  const window_path_split = window_path.split('/')

  switch(window_path_split[1]) {
    case 'scan-medicine':
      const tesseract_worker = Tesseract.createWorker({
        //logger: m => console.log(m)
      })
      //Tesseract.setLogging(true)

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
async function recognizeRVG(tesseract_worker) {
  let result = undefined
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
    
    // Check if RVG has been found inside word list
    if(rvg_index === -1) throw 'RVG not detected inside words list'
    
    // Check if RVG code is of correct format
    if(/^\d+$/.test(result.data.words[rvg_index+1].text) !== true) throw 'Suspected code is not of correct format'
    
    console.log(result.data.words[rvg_index+1])
    console.log(result.data.words)
  }
  catch(error) {
    console.log(error)
    recognizeRVG(tesseract_worker)
  }
}
