const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')

const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const readingList = await ReadingList.create({ blogId, userId })
  res.json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params
  const readingList = await ReadingList.findByPk(id)

  if (readingList && req.body.read) {
    const updatedReadingList = await readingList.update({
      read: req.body.read,
    })
    res.json(updatedReadingList)
  } else if (readingList) {
    res.status(400).json({ error: 'missing read property' })
  } else {
    res.status(404).end()
  }
})

module.exports = router