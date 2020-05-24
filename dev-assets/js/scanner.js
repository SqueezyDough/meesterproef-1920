const video = document.getElementById('scanner_element')
const window_path = window.location.pathname

if (navigator.mediaDevices.getUserMedia) {
  const window_path_split = window_path.split('/')

  switch(window_path_split[1]) {
    case 'scan-medicine':
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
          setInterval(() => {
            createSnapshot(video)
          }, 2000)
        })
        .catch((err) => {
          console.log('Error: ', err)
        })
      break;
  }
} else {
  console.log('Your browser down not support video streams')
}

function createSnapshot(video) {
  const canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')

  canvas.width = video.offsetWidth
  canvas.height = video.offsetHeight
  context.drawImage(video, 0 ,0, video.offsetWidth, video.offsetHeight)

  const image_base64 = canvas.toDataURL('image/jpeg')

  const form_data = new FormData()
  form_data.append('file', image_base64)

  fetch('/upload-snapshot', {
    method: 'POST',
    body: form_data
  })
  .then(response => response.json())
  .then(data => {
    // Display ts output
    appendTesseractOutput(data)
  })
}

function appendTesseractOutput(output) {
  const tesseract_output_container = document.getElementById('tesseract_output_container')
  tesseract_output_container.innerHTML = `Scanned text: ${output}`
}
