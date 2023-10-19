'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sescription.belongsTo(models.User, {
        foreignKey: 'id_benhVien',
      });
    }
  }
  Sescription.init({
    id_benhVien: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Sescription',
  });
  return Sescription;
};