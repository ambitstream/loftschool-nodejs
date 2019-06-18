const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const flash = require('express-flash')

const productsController = require('./controllers/products.js')
const skillsController = require('./controllers/skills.js')
const authController = require('./controllers/auth.js')
const app = express()

app.set('views', './views/pages')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './public'
}))
app.use(session({
  key: 'user_sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}))
app.use(flash())
app.use(express.static('./public'))

app.get('/', async (req, res) => {
  try {
    const products = await productsController.get()
    const skills = await skillsController.get()
    res.render('index', {
      products,
      skills
    })
  } catch (e) {
    console.error(e)
  }
})
app.get('/admin', async (req, res) => {
  try {
    if (req.session.isAuth) {
      const skills = await skillsController.get()
      res.render('admin', {
        skills
      })
    } else {
      res.redirect('/login')
    }

  } catch (e) {
    console.log(e)
  }
})
app.post('/admin/upload', async (req, res) => {
  try {
    const skills = await skillsController.get()
    await productsController.add({...req.files, ...req.body})
    res.render('admin', {
      skills
    })
  } catch (e) {
    console.error(e)
  }
})
app.post('/admin/skills', async (req, res) => {
  try {
    let skills = await skillsController.get()
    skills = await skillsController.add(req.body)
    res.render('admin', {
      skills
    })
  } catch (e) {
    console.error(e)
  }
})
app.get('/login', async (req, res) => {
  try {
    const messages = req.flash('msgslogin')
    const msgslogin = typeof messages === 'object' && messages.length ? messages[0] : null
    res.render('login', {
      msgslogin
    })
  } catch (e) {
    console.log(e)
  }
})
app.post('/login', async (req, res) => {
  try {
    await authController.auth(req.body)
    req.session.isAuth = true
    console.log('post')
    console.log(req.session)
    res.redirect('/admin')
  } catch (e) {
    console.log(e)
    req.flash('msgslogin', e)
    res.redirect('/login');
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send('Server error')
})

app.listen('3000', () => {
  console.log('Server running on port 3000')
})
