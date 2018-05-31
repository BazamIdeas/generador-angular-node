'use strict';

const authConfig = require('config').auth,
    JwtService   = require('app/Services').JwtService,
    moment       = require('moment');

module.exports = {
    
    auth: (roles = []) => {
        return (req, res, next) => {

            if (authConfig.enabled) {

                if(!req.headers.authorization){
                    return res.status(403).json({msg: "No autorizado"})
                }
                
                const token = req.headers.authorization

                JwtService.decodificar(token, (err, decoded) => {

                    if (err){
                        return res.status(400).json({msg: "Token invalido"});
                    }

                    if (decoded.exp <= moment().unix()){
                        return res.status(401).json({msg: "Token expirado"})
                    }

                    if (roles.indexOf(decoded.rol) == -1 && roles.length){
                        return res.status(400).json({msg: "Su rol no tiene los permisos adecuados"});
                    }

                    req.auth = decoded.data
                    next();
                })

            } else {

                req.auth = {id: 1, rol:  1};
                next();

            }
        }
    },

}