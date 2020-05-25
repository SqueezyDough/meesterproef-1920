import fs from 'fs'
import uid from 'uid'
import * as api from './api.controller'
import * as tesseract from './tesseract.controller'

exports.home = (req, res) => {
  res.render('components/home/index')
}

exports.scanner = async (req, res) => {
  const url = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(url)

  console.log(medicines)

  res.render('components/base/scanner')
}

exports.snapshot = async (req, res) => {
  const file_directory = './temp'
  const file_id = uid()
  const base64_data = req.body.file.replace(/^data:image\/jpeg;base64,/, '')

  writeSnapshot(base64_data, file_id, file_directory )
  const recognised_text = await tesseract.recogniseText(`${file_directory}/${file_id}.jpg`)
  removeSnapshot(file_id, file_directory)

  if (/\S/.test(recognised_text)) {
    const recognised_text_array = recognised_text.replace(/\s+/g,' ').split(' ')
    const rvg_index = recognised_text_array.findIndex(string => {
      return string.toLowerCase() === 'rvg'
    })

    if(rvg_index !== -1) {
      // Found an instance of RVG
      const suspected_rvg_number = recognised_text_array[(rvg_index + 1)]
    }
  }

  res.send(JSON.stringify(recognised_text))
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
