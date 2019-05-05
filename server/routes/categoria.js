const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==============================
//Mostrar todas las categorias 
//==============================
app.get('/categoria', verificaToken, (req, res) => {

    //Sort para ordenar la lista

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});


//========================
//Mostrar una categoria por ID
//=========================
app.get('/categoria/:id', (req, res) => {

    let cat_id = req.params.id;

    Categoria.findById(cat_id, (err, categoriaDB) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'EL id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//===========================
//Crea una categoria
//===========================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===========================
//Actualizar una categoria por ID
//===========================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let cat_id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findOneAndUpdate(cat_id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===========================
//Elimina una categoria por ID
//===========================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id_cat = req.params.id;

    Categoria.findOneAndRemove(id_cat, (err, categoriaBorrada) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    });

});


module.exports = app;