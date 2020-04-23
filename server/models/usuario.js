const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
    values: ['ADMIN_ROLe', 'USER_ROLE'],
    mensaje: '{VALUE} No es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        require: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'El correo es necesario']
    },
    google: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
});
usuarioSchema.plugin(uniqueValidator, {
    messege: '{PATH} Debe ser unico y diferente'
});
module.exports = mongoose.model('Usuario', usuarioSchema);