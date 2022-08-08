const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      isValidYear (year) {
        const date = new Date()
        if (year < 1991 || year > date.getFullYear()) {
          throw new Error(`Invalid year. The year must between 1991 and ${date.getFullYear()}`)
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blogs'
})

module.exports = Blog