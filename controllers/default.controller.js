import * as api from './api.controller'
import * as models from './tesseract-models.controller'

exports.home = (req, res) => {
  res.render('components/home/index')
}

exports.scanner = async (req, res) => {
  const url = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(url)

  console.log(medicines)

  res.render('components/base/scanner', {
    medicines: medicines
  })
}