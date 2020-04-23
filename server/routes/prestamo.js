const express = require('express');
const app = express();
const _ = require('underscore');
const Prestamo = require('../models/prestamo');
const { verificarToken } = require('../middlewere/autenticacion');

app.get('/prestamo', [verificarToken], function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    Prestamo.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, prestamo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ocurrio un error al consular tus prestamos'
                });
            }
            res.json({
                ok: true,
                mensaje: 'consulta realizada con exito',
                prestamo
            });

        });
});
app.post('/prestamo', [verificarToken], function(req, res) {
    let body = req.body;
    console.log(body);
    let prestamo = new Prestamo({
        usuario: body.usuario,
        libro: body.libro,
        fechaPrestamo: body.fechaPrestamo,
        fechaEntrega: body.fechaEntrega
    });
    prestamo.save((err, prestamoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `hubo un error al momento de agregar el prestamo ${ err }`
            });
        }
        res.json({
            ok: true,
            mensaje: 'el prestamo se agrego correctamente ',
            prestamoDB
        });
    });
});
app.put('/prestamo/:id', [verificarToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['usuario', 'libro', 'fechaPrestamo', 'fechaEntrega']);
    Prestamo.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, prestamoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de actualizar ${err}`
            });
        }
        return res.json({
            ok: true,
            mensaje: 'Cambios guardados con exito',
            prestamo: prestamoDB
        });
    });
});


app.delete('/prestamo/:id', [verificarToken], function(req, res) {
    let id = req.params.id;
    Prestamo.deleteOne({ _id: id }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (resp.deletedCount === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    id,
                    msg: 'prestamo no encontrado'
                }
            });
        }
        return res.status(200).json({
            ok: true,
            resp
        });

    });
});

module.exports = app;