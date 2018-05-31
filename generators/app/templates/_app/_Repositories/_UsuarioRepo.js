'use strict';

const sq        = require('app/Models/sequelize');
const Usuario   = sq.Usuario;
const Cliente   = sq.Cliente;

const Services = require('app/Services');

const _he          = require('app/Helpers');
const passwordHash = require('password-hash');
const fs           = require('fs');

class UsuarioRepo {

    async login(req, cb) {

        let body  = req.body;

        let loginDatos = {
            usuario: body.usuario,
            password: body.password
        }

        let usuario;
        let datos;

        try {
            usuario = await Usuario.findOne({ 
                where: {usuario: loginDatos.usuario}, 
                attributes: ['id', 'usuario', 'password', 'avatar', 'activo', 'rol_id'] 
            });

            if (usuario == null) {
                cb(null, 'DATOS_INCORRECTOS');
                return null;
            }

            if (!usuario.activo) {
                cb(null, 'NO_ACTIVO');
                return null;  
            }

            if ( !passwordHash.verify(loginDatos.password, usuario.password) ) {
                cb(null, 'DATOS_INCORRECTOS');
                return null;
            }

            datos       = usuario.toJSON();
            datos.token = Services.JwtService.crearToken({
                id: usuario.id, rol: usuario.rol_id
            }, usuario.rol_id);

            cb(null, datos);
        } catch (err) {
            cb(err);
            return null;
        }
    }

    async todos(cb) {

        let usuarios;

        try {
            usuarios = await Usuario.findAll({ include: [{ model: Cliente, as: '_cliente' }] });
            cb(null, usuarios);
        } catch (error) {
            cb(error);
            return null;
        }
    }

    async guardar(req, cb) {

        let body  = req.body;

        let transaction;
        let usuario;

        let usuarioDatos = {
            rol_id: 2,
            usuario: body.usuario,
            email: body.email,
            password: body.password,
            codigo: _he.randomStr(16)
        }

        try {
            transaction = await sq.sequelize.transaction();

            usuario = await Usuario.create(usuarioDatos, { include: [{ model: Cliente, as: '_cliente' }] , transaction});

            await transaction.commit()

            await usuario.reload();

            cb(null, usuario.toJSON());
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }
    }

    async editar(req, cb) {

    }

    async cambiarAvatar(req, cb) {

        const auth = req.auth;
        const avatar = req.files.avatar;

        if (avatar.type.indexOf('image') == -1) {
            cb(null, 'FORMATO_INVALIDO');
            return null;  
        }

        const nombre = _he.randomStr(16) + '_' + auth.id;
        const temporal = avatar.path;
        const carpetaObjetivo = '/resources/avatares/' + nombre + '.' + avatar.type.split('/')[1];

        let usuario;

        try {
            usuario = await Usuario.findById( auth.id )

            fs.renameSync(temporal, carpetaObjetivo);

            if ( fs.existsSync('.' + usuario.avatar) ) {
                fs.unlinkSync('.' + usuario.avatar);
            }

            await usuario.update({avatar: carpetaObjetivo});

            cb(null, usuario.toJSON());
        } catch (err) {
            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }
    }
}

module.exports = new UsuarioRepo;