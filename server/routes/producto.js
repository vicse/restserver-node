const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//============================
//Obtener todos los productos
//============================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});


//============================
//Obtener un solo producto por ID
//============================

app.get('/productos/:id', verificaToken, (req, res) => {

    let id_pro = req.params.id;

    Producto.findById(id_pro)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'EL id no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

//============================
//Buscar un nuevo producto
//============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //expresión regular
    let reqex = new RegExp(termino, 'i');

    Producto.find({ nombre: reqex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: producto
            });
        });

});


//============================
//Crea un nuevo producto
//============================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//============================
//Actualizar un producto
//============================

app.put('/productos/:id', verificaToken, (req, res) => {

    let id_pro = req.params.id;
    let body = req.body;

    let newCategoria = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    }

    Producto.findOneAndUpdate(id_pro, newCategoria, { new: true, runValidators: true }, (err, productoActualizado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoActualizado) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoActualizado
        });
    });
});


//============================
//Borrar un producto
//============================

app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id_pro = req.params.id;

    cambiaEstado = {
        disponible: false
    }

    Producto.findOneAndUpdate(id_pro, cambiaEstado, { new: true }, (err, productoEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        //productoEliminado === null es igual al !

        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoEliminado,
            message: 'Producto borrado'
        });
    });
});

module.exports = app;