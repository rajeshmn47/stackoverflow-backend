var express = require('express')
var app = express()
const mongoose = require('mongoose')
const User = require('./models/user')
const error = require('./error')
const cors = require('cors')
/* Requiring body-parser package
to fetch the data that is entered
by the user in the HTML form.*/
const bodyParser = require('body-parser')
const user = require('./controllers/signup')
const question = require('./controllers/questionanswers')
const catcherrors = require('./catchasyncerrors')
// Allowing app to use body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
const url = 'http://localhost:3000'
const krl = 'https://stackoverflowclonefrontend.netlify.app'
app.use(cors({ origin: krl, credentials: true }))

app.use('/auth/', user)
app.use('/question/', question)
// Initializing Passport

const uri ='mongodb+srv://rajeshmn47:uni1ver%40se@cluster0.bpxam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.Promise = global.Promise
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log('Error!' + error)
    }
  }
)

// Handling get request on login route
app.get('/', async function (req, res) {
  const d = await User.find()
  res.status(200).json({
    success: true,
    questions: d,
  })
})

app.use(error)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`)
})
