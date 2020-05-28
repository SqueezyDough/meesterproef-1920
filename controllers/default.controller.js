import * as api from './api.controller'

exports.home = (req, res) => {
  res.render('components/home/index')
}

exports.scanner = async (req, res) => {
  const url = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(url)

  res.render('components/base/scanner', {
    medicines: medicines
  })
}