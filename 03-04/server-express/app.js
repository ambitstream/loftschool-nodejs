const express = require('express')
const app = express()

app.set('views', './views/pages')
app.set('view engine', 'pug')

app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/admin', (req, res) => {
  res.render('admin')
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
