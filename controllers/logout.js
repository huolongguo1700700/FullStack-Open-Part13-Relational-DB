const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')

const { Sessions } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
    const authorization = req.get('authorization')
    const token = authorization.substring(7)
    await Sessions.destroy({
        where: {
          token,
        }
      })
    res.status(200).send()
})

module.exports = router