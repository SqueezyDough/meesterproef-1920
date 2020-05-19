import express from 'express'
import compression from 'compression'
import router from './routes/index.routes'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8888,
  APP = express(),
  URLENCODEDPARSER = bodyParser.urlencoded({ extended: true })

APP
  .use(compression())
  .use(express.static('static'))
  .use(bodyParser.json())
  .use(URLENCODEDPARSER) 
  .set('view engine', 'hbs')
  .engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: 'views/components/base/layouts',
    partialsDir: [
      {
        dir: path.join(__dirname, '/views/components/base/partials'),
        namespace: 'base'
      },
      {
        dir: path.join(__dirname, '/views/components/home/partials'),
        namespace: 'home'
      }    
    ]
  }))
  .use('/', router)
  .listen(PORT, () => console.log(`Using port: ${PORT}`))