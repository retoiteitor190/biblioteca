const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewere/autenticacion');

app.get('/usuario', [verificarToken], function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;
    desde = Number(desde);
    limite = Number(desde);

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `Ocurrio un error al momento de consultar ${err}`
                });
            }
            res.json({
                ok: true,
                mensaje: 'Consulta realizada con exito',
                usuario
            });

        });
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    console.log(body);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 15),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de guardar ${err}`
            });
        }
        res.status({
            ok: true,
            mensaje: 'El usuario se a insertado con exito',
            usuario: usuarioDB
        });

    });
});
app.put('/usuario/:id', [verificarToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'estado', 'role', 'email']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de actualizar ${err}`
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Cambios guardados con exito',
            usuario: usrDB
        });
    });
});

app.delete('/usuario/:id', [verificarToken], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de eliminar el usuario ${err}`
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Registro borrado con exito',
            resp
        });
    });
});
module.exports = app;