'use strict';
module.exports = (sequelize, DataTypes) => {
  var Vote = sequelize.define('Vote', {
    TipId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    votePositive: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Vote.hasMany(models.Tips)
      }
    }
  });

  return Vote;
};
