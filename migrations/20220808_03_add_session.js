const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}