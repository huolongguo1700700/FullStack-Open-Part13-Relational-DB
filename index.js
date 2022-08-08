const express = require('express')
const cors = require('cors');
require('express-async-errors')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')

const app = express()

const { PORT, SECRET } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const { errorHandler, requestLogger } = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/reading_lists')
const logoutRouter = require('./controllers/logout')

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(sessions({
  secret: SECRET,
  saveUninitialized:true,
  resave: false
}))

app.use(requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', logoutRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()