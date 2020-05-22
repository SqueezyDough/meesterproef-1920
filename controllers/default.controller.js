import fs from 'fs'
import uid from 'uid'
import tesseract from './tesseract.controller'

exports.home = function(req, res) {
  res.render('components/home/index', {})
}

exports.snapshot = function(req, res) {
  const file_directory = './temp'
  const file_id = uid()
  const base64_data = req.body.file.replace(/^data:image\/jpeg;base64,/, '')

  writeSnapshot(base64_data, file_id, file_directory ) 
  tesseract.recogniseText(`${file_directory}/${file_id}.jpg`)

  res.send('Snapshot created')
}

function writeSnapshot(data, filename, directory) {
  if(!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  fs.writeFile(`${directory}/${filename}`, data, 'base64', () => {
  })
}
