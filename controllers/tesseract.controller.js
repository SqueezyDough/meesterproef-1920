import tesseract from 'node-tesseract-ocr'

export function recogniseText(image_path) {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    }

    return tesseract.recognize(image_path, config)
    .then(text => {
        return text
    })
    .catch(error => {
        console.log(error.message)
    })
}