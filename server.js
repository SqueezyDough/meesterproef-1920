import express from 'express'
import compression from 'compression'
import router from './routes/index.routes'
import errorRouter from './routes/error.routes'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'


dotenv.config()

// mongo db connection
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`

mongoose.connect(url, {	useNewUrlParser: true, useUnifiedTopology: true });

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
      },
      {
        dir: path.join(__dirname, '/views/components/overview/partials'),
        namespace: 'overview'
      }      
    ]
  }))
  .use('/', router)
  .use('/', errorRouter)
  .listen(PORT, () => console.log(`Using port: ${PORT}`))
