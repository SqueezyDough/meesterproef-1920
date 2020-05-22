import tesseract from 'node-tesseract-ocr'

export default function recogniseText(image_path) {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    }
    
    tesseract.recognize(image_path, config)
    .then(text => {
        console.log("Result:", text)
    })
    .catch(error => {
        console.log(error.message)
    })
}