const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const { v4: uuidv4 } = require('uuid')

const User = require('../models/user')
const { Sessions } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)


  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }


  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(
    userForToken,
    config.SECRET
  )

  Sessions.create({ id: uuidv4(), token: token })

  response
    .status(200)
    .send({ token: token, username: user.username, name: user.name })
})

module.exports = router