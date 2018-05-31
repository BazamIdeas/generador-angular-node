'use strict';

const UsuarioRepo = require("app/Repositories").UsuarioRepo;

class UsuarioController {

    todos(req, res) {
        UsuarioRepo.todos((err, usuarios) => {
            if (err) return res.status(500).json({data: null, err: err});

            if (!usuarios.length) return res.status(404).json({data: null});

            return res.status(200).json({data: usuarios})
        })
    }
}

module.exports = new UsuarioController;