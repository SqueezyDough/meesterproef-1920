import fs from 'fs'

exports.home = function(req, res) {
  res.render('components/home/index', {})
}

exports.snapshot = function(req, res) {
  const base64_data = req.body.file.replace(/^data:image\/jpeg;base64,/, '');
  writeSnapshot(base64_data, './temp') 
  res.send('Snapshot created')
}

function  writeSnapshot(base64_data, directory) {
  if(!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  fs.writeFile(`${directory}/out.jpg`, base64_data, 'base64', () => {
  })
}
