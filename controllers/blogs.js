const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    const searchQuery = `%${req.query.search}%`

    where[Op.or] = [
      { title: { [Op.iLike]: searchQuery }},
      { author: { [Op.iLike]: searchQuery }}
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'id']
    },
    order: [['likes', 'DESC']],
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) res.status(404).end()
  else if (!user || user.id !== blog.userId) res.status(401).json({ error: 'Unauthorized' })
  else {
    await blog.destroy()
    res.status(204).end()

  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

module.exports = router