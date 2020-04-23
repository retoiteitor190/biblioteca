const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
const Libro = require('./libro');
const Usuario = require('./usuario');
 
let schema = mongoose.Schema;
 
let PrestamoSchema = new schema({
    usuario: {
        type: schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
 
    },
 
    libro: {
        type: schema.Types.ObjectId,
        ref: 'Libro',
        required: true
    },
 
    fechaPrestamo: {
        type: String,
        required: [true, 'la fecha de prestamos es necesaria'],
 
    },
 
    fechaEntrega: {
        type: String,
        required: [true, 'es necesaria la fecha de entrga del libro']
    }



 
});
 
PrestamoSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});
module.exports = mongoose.model('Prestamo', PrestamoSchema);