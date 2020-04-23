const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
const app = express();

const Usuario = require('../models/usuario');
const Libros = require('../models/libro');
//para que use la dependecia
app.use(fileUpload());


app.put('/upload/:ruta/:id', (req, res) => {
    let id = req.params.id;
    let ruta = req.params.ruta;
    let archivo = req.files.archivo;
    //el pat nos ayuda a definir las rutas del sistema y nos regresera el nombre de la extencion del archivo
    let nombre = uniqid() + path.extname(archivo.name);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado ningun archivo'

        });

    }

    let validExtensions = ['image/jpg', 'image/gif', 'image/jpeg', 'image/png'];

    if (!validExtensions.includes(archivo.mimetype)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Solo las extensiones <jpg, gif, jpeg, png> son validas Porfavor suba otro archivo'

        });
    }
    archivo.mv(`uploads/${ruta}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: `ocurrio un error en el servidor al tratar de subir la imagen: ${err}`
            });
        }
    }); //move


    switch (ruta) {
        case 'libro':
            imagenLibro(id, res, nombre);
            break;
        case 'usuario':
            imagenUsuario(id, res, nombre);
            break;

        default:
            console.log('ruta no valida');
            break;
    }
});

function imagenLibro(id, res, nombreImagen) {
    Libros.findById(id, (err, PR) => {
        if (err) {
            borrarArchivo(nombreImagen, 'libro');
            return res.status(400).json({
                ok: false,
                mensaje: `ocurrio un error al momento de subir la imagen: ${err}`
            });

        }
        if (!PR) {
            borrarArchivo(nombreImagen, 'libro');
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe ese libro'
            });
        }

        PR.img = nombreImagen;
        PR.save((err, libroDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'libro');
                return res.status(500).json({
                    ok: false,
                    mensaje: `Ocurrio un error al momento de relacionar el archivo con el regsitro ${err}`
                });
            }
            return res.json({
                ok: true,
                mensaje: 'la imagen se ha subido con exito',
                Libros: libroDB
            })

        })
    });
}

function imagenUsuario(id, res, nombreImagen) {
    Usuario.findById(id, (err, usr) => {
        if (err) {
            borrarArchivo(nombreImagen, 'usuario');
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de subir la imagen: ${err}`
            });
        }

        if (!usr) {
            borrarArchivo(nombreImagen, 'usuario');
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario especificado'
            });
        }

        usr.img = nombreImagen;
        //cuando se invoca el save actualiza o guarda todo lo que tenga la variable
        usr.save((err, usrDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'usuario');
                return res.status(500).json({
                    ok: false,
                    mensaje: `Ocurrio un error al momento de relacionar el archivo con el regsitro ${err}`
                });
            }

            return res.json({
                ok: true,
                mensaje: 'la imagen a sido subida con exito',
                Usuario: usrDB
            });
        });

    });
}

function borrarArchivo(nombreImagen, ruta) {
    //Dirname nos regresera un string y nos da la ruta de la imagen
    let pathImg = path.resolve(__dirname, `../../uploads/${ruta}/${nombreImagen}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }

    console.log('imagen borrada');
}

module.exports = app;