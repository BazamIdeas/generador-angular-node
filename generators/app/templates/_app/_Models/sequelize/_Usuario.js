'use strict';
module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define('Usuario', {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    codigo: DataTypes.STRING,
    clave_de_pago: DataTypes.STRING,
    activo: DataTypes.INTEGER,
    codigo_qr: DataTypes.STRING
  },  {
    underscored: true,
    paranoid: true,
    tableName: 'usuarios',
    createdAt: 'creado',
    updatedAt: 'actualizado',
    deletedAt: 'borrado',

    indexes: [{
      unique: true, 
      fields: ['usuario','email']
    }]
  });
  Usuario.associate = function(models) {
    Usuario.hasOne(models.Cliente, { foreignKey:'usuario_id', as: '_cliente' } );
    Usuario.belongsTo(models.Rol, { foreignKey:'rol_id', as: '_rol' } );
  };
  Usuario.beforeCreate((usuario, options) => {
    usuario.password = require('password-hash').generate(usuario.password);
  });
  return Usuario;
};