const jwt = require('jsonwebtoken')
const User = require('../models/user');
const { getTokenFrom } = require('./getTokenFrom')
const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request);
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Token missing!' });
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const userid = decodedToken.id;
  if (!userid) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = await User.findById(decodedToken.id)
  if (!request.user) {
    return response.status(404).json({ error: 'user not found' });
  }
  next()
}

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
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'Expected `username` to be unique'  //I guess this is currently the only case where this can happen?
    });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'Invalid token'
    });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'Token expired'
    });
  } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
    return response.status(400).json({
      error: 'Invalid JSON in request'
    });
  }

  // Do not call next(), do not pass go, do not collect 200$
  return response.status(500).json({
    error: 'An unexpected error occurred'
  });
};

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler
}