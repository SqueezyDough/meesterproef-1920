import fs from 'fs'
import path from 'path'
import { compile } from 'handlebars'

exports.home = (req, res) => {
  res.render('components/home/index')
}

exports.scanner = async (req, res) => {
  res.render('components/base/scanner')
}

exports.scannerPost = async (req, res) => {
  const partials = [],
    card_partial = compile(fs.readFileSync(path.resolve(__dirname, "../views/components/overview/partials/_card.hbs"), 'utf8')),
    best_choice_partial = compile(fs.readFileSync(path.resolve(__dirname, "../views/components/overview/partials/_best-choice-container.hbs"), 'utf8')),
    other_choices_partial = compile(fs.readFileSync(path.resolve(__dirname, "../views/components/overview/partials/_other-choices-container.hbs"), 'utf8'))
  
  if(req.body.length > 1) {
    const best_choice_output =  await best_choice_partial({medicine: card_partial(req.body[0])})
    partials.push(best_choice_output)

    req.body.shift()
    const other_choices_cards = req.body.map(medicine => {
      return card_partial(medicine)
    })

    const other_choices_output = await other_choices_partial({medicines: other_choices_cards})
    partials.push(other_choices_output)
  } else {
    console.log(req.body)
    const best_choice_output =  await best_choice_partial({medicine: card_partial(req.body)})
    partials.push(best_choice_output)
    console.log(partials)
  }
  
  res.send(partials)
}
