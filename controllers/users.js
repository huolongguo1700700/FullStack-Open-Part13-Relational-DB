const router = require('express').Router()
const bcrypt = require('bcrypt')
const { tokenExtractor } = require('../utils/middleware')

const { User, Blog, ReadingList } = require('../models')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async(req, res) => {
  const { id } = req.params

  const where = {
    id,
    '$readings.readingLists.user_id$': id,
  }

  if (req.query.read === 'true') {
    where['$readings.readingLists.read$'] = true
  } else if (req.query.read === 'false') {
    where['$readings.readingLists.read$'] = false
  }

  const user = await User.findOne({
    attributes: ['name', 'username'],
    where,
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: [
          {
            model: ReadingList,
            attributes: ['read', 'id'],
          },
        ],
      },
    ],
  })

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
})

router.post('/', async (req, res) => {
    const { name, username, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      name,
      username,
      passwordHash
    })

    res.status(201).json(user)
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router