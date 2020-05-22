import fs from 'fs'
import uid from 'uid'
import * as tesseract from './tesseract.controller'

exports.home = function(req, res) {
  res.render('components/home/index', {})
}

exports.snapshot = async function(req, res) {
  const file_directory = './temp'
  const file_id = uid()
  const base64_data = req.body.file.replace(/^data:image\/jpeg;base64,/, '')

  writeSnapshot(base64_data, file_id, file_directory )
  const recognised_text = await tesseract.recogniseText(`${file_directory}/${file_id}.jpg`)
  removeSnapshot(file_id, file_directory)

  console.log(recognised_text)

  res.send('Snapshot scanned')
}

function writeSnapshot(data, filename, directory) {
  if(!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  fs.writeFile(`${directory}/${filename}.jpg`, data, 'base64', () => {
  })
}

function removeSnapshot(filename, directory) {
  fs.unlink(`${directory}/${filename}.jpg`, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}
