const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const { Sessions } = require('../models')
const { response } = require('express')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name = 'SequelizeValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const activeToken = await Sessions.findOne({ where: { token } })
      if (!activeToken) response.status(401).json({ error: 'session invalid' })
      request.decodedToken = jwt.verify(authorization.substring(7), config.SECRET)
    } catch(e) {
      response.status(401).json({ error: 'token invalid' })
    }
  } else {
    response.status(401).json({ error: 'token missing' })
  }

  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}