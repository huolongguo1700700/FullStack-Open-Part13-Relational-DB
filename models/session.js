const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Sessions extends Model {}

Sessions.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'sessions',
  }
)

module.exports = Sessions