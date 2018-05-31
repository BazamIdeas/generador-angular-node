'use strict';

const crypto = require('crypto');

//Archivo para funciones custom
//Se agrega la funcion al json helpers para que este disponible en cualquier archivo donde lo requieran
exports.randomStr = (l,c) => { 
    if (c == null || c == 'l') {
        return crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toLowerCase() 
    } else {
        return crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase()    
    }
};

exports.otherExample = () => { return 'other example' };