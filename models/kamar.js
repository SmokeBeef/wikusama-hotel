const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Kamar extends Model {
    static associate(models) {
      this.belongsTo(models.tipe_kamar, { foreignKey: 'id_tipe_kamar' });
    }
  }
  Kamar.init(
    {
      nomor_kamar: DataTypes.INTEGER,
      id_tipe_kamar: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'kamar',
    }
  );
  return Kamar;
};