const bodyParser = require('body-parser')
const catchasyncerror = require('../catchasyncerrors')
const Question = require('../models/question')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
var express = require('express')
const router = express.Router()

router.post(
  '/question',
  catchasyncerror(async (req, res, next) => {
    console.log('hi boy')

    console.log(req.body)
    const { author, title, text, tags } = req.body
    const question = Question(req.body)
    await question.save()
    console.log(question, 'k')
    res.status(200).json({
      success: true,
      question: question
    })
  })
)
router.post(
  '/postanswer',
  catchasyncerror(async (req, res, next) => {
    console.log('hi boy')

    console.log(req.body)
    const { authorid, text } = req.body
    console.log(req.body.questionid)
    const question = await Question.findById(req.body.questionid)
    console.log('question', question)
    question.answers.push({ author: authorid, text: text })
    await question.save()
    console.log(question, 'k')
    res.status(200).json({
      success: true,
      question: question
    })
  })
)

router.get(
  '/getquestions',
  catchasyncerror(async (req, res, next) => {
    const questions = await Question.find()

    console.log(questions)
    res.status(200).json({
      success: true,
      questions: questions,
    })
  })
)
router.get('/getonequestion/:id',
  catchasyncerror(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
    question.views = question.views + 1
    await question.save()
    res.status(200).json({
      success: true,
      question: question,
    })
  })
)

router.post('/editonequestion/:id',
  catchasyncerror(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
    question.text = req.body.text
    await question.save()
    console.log(question)
    res.status(200).json({
      success: true,
      question: question,
    })
  })
)


router.get('/deleteonequestion/:id',
  catchasyncerror(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
    await question.remove()
    console.log(question)
    res.status(200).json({
      success: true,
    })
  })
)

router.post('/editoneanswer/:id',
  catchasyncerror(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
    question.answers.forEach((ans) => {
      if (ans._id.toString() === req.body.answerid.toString())
        (ans.text = req.body.text)
    })
    await question.save()
    console.log(question)
    res.status(200).json({
      success: true,
      question: question
    })
  })
)

router.post('/deleteoneanswer/:id',
  catchasyncerror(async (req, res, next) => {
    const question = await Question.findById(req.params.id)
    const answers = question.answers.filter(
      (rev) => rev._id.toString() !== req.body.answerid.toString()
    );

    await Question.findByIdAndUpdate(
      req.params.id,
      {
        answers
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })
    res.status(200).json({
      success: true,
      question: question
    })
  })
)


router.post('/upvotequestion/:id', catchasyncerror(async (req, res, next) => {
  const question = await Question.findById(req.params.id)
  const a = question.votes.find((a) => a.user?.toString() === req.body.user.toString())
  if (a) {
    console.log(a, 'in if')
    question.votes.forEach((vot) => {
      if (vot.user.toString() === req.body.user.toString())
        (vot.vote = vot.vote + req.body.vote)
    })
  }
  else {
    console.log(a, 'in else')
    question.votes.push(req.body)
  }
  await question.save()
  res.status(200).json({
    success: true,
    question: question,
  })
})
)
router.post('/upvoteanswer/:id', catchasyncerror(async (req, res, next) => {
  const question = await Question.findById(req.params.id)
  var k
  question.answers.forEach((ans) => {
    k = ans.votes.find((vote) => (vote.user.toString() === req.body.user.toString()) && (ans._id.toString() === req.body.answerid.toString()))
    console.log(req.body.user.toString(), ans.votes)
    if (k && ans._id.toString() === req.body.answerid.toString()) {
      ans.votes.forEach((vote) => {
        if (vote.user.toString() === req.body.user.toString())
          (vote.vote = vote.vote + req.body.vote)
      })
    }
    else {
      if (ans._id.toString() === req.body.answerid.toString()) {
        if (ans._id.toString() === req.body.answerid.toString())
          ans.votes.push({ user: req.body.user, vote: req.body.vote })
      }

    }
  })

  await question.save()
  console.log(question)
  res.status(200).json({
    success: true,
    question: question,
  })
})
)
module.exports = router
