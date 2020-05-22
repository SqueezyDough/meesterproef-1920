const video = document.getElementById('scannerElement')

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ 
    audio: false, 
    video: {
      width: { ideal: 100},
      height: { ideal: 50}
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
}
