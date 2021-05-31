const express = require('express')
const mongoose = require('mongoose')
// to get the article
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection;
db.once("open", () => {
    console.log('Database connected')
})

// view engine = is going to convert ejs code into html
// we will be writing views use ejs
app.set('view engine', 'ejs')

// ** this urlencoded come first
// below line is to access Article form inside article.js
app.use(express.urlencoded({ extended: false }))

// check in index.ejs delete line
app.use(methodOverride('_method'))

// to get static files inside public folder
app.use(express.static(__dirname + '/public'))

app.get('/', async (req, res) => {
    // const articles = [{
    //     title: 'Test Article1',
    //     createdAt: new Date(),
    //     description: 'Test description1'
    // },
    // {
    //     title: 'Test Article2',
    //     createdAt: new Date(),
    //     description: 'Test description2'
    // }]
    // to get all articles
    // sort function is to get newer articles first
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

// to tell app to use router
// every page like edit, view will be /articles/edit, /articles/view, hence app.use we are passing /articles
app.use('/articles', articleRouter)

app.listen(5000, () => {
    console.log(`Server is started on http://localhost:5000`)
})