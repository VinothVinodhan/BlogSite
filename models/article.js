const mongoose = require('mongoose')

// instead of id in url we will be using marked & slugify
// marked: used create markdown convert into html
// slugify: convert title into url from slug which we can use instead of url
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
// reason of putting {} is, we only need JSDM portion from jsdm
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        // default will call function,
        default: Date.now()
    },
    // we are putting this slug into data base so that we do not need to calculate everytime
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

//prevalidate: any function we do like update,edit,create below function will be validated
// lower: true, convert slug into lower case
// strict: true, to remove any character that do not fit in the url
// example, if we pass any charecter in title, this STRICT will remove that from the url
// next(): this function takes next functionL yes. otherwise our if condition will throw error
// finally change in all pages, wherever we pass ID, change into slug
articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if (this.markdown) {
        // convert into html & sanitize the html
        // to remove any sort of malicious code (any html code)
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)