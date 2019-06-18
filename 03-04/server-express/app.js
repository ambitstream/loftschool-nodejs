const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const productsController = require('./controllers/products.js')
const skillsController = require('./controllers/skills.js')
const app = express()

app.set('views', './views/pages')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './public'
}))

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
    const skills = await skillsController.get()
    res.render('admin', {
      skills
    })
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
app.get('/login', (req, res) => {
  res.render('login')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send('Server error')
})

app.listen('3000', () => {
  console.log('Server running on port 3000')
})
