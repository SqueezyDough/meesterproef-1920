import fs from 'fs'
import path from 'path'
import { compile } from 'handlebars'

exports.home = (req, res) => {
  res.render('components/home/index')
}

exports.scanner = async (req, res) => {
  res.render('components/base/scanner', {

  })
}

exports.scannerPost = async (req, res) => {
  const partials = [],
    card_partial = compile(fs.readFileSync(path.resolve(__dirname, "../views/components/overview/partials/_card.hbs"), 'utf8'))
  
  if(req.body.length > 1) {
    req.body.forEach(medicine => {
      partials.push(card_partial(medicine))
    })
  } else {
    partials.push(card_partial(req.body))
  }
  
  res.send(partials)
}
