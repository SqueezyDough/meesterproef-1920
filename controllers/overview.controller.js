import * as api from './api.controller'

exports.index = async (req, res) => {
  const url = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(url, [0, 200])

  console.log(medicines)

  res.render('components/overview/index', {
    medicines: medicines
  })
}
