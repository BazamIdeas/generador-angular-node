'use strict';

const Router    = require("express").Router(),
    Controllers = require("app/Controllers"),
    Middlewares = require("app/Middlewares");

//Middlewares para todas las rutas de este archivo
//Router.use(Middlewares.AuthorizationMiddleware.cliente);

Router.get('/', Middlewares.AuthorizationMiddleware.auth([2]), Controllers.UsuarioController.todos);

module.exports = Router;