const video = document.getElementById('scannerElement')

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ 
        audio: false, 
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    })
    .then((stream) => {
        video.srcObject = stream
    })
    .catch((err) => {
        console.log('Error: ', err)
    })
} else {
    console.log('Your browser down not support video streams')
}