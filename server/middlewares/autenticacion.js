const jwt = require('jsonwebtoken');


//==============================
// Verificar Token            
//==============================

let verificaToken = (req, res, next) => {

    // recuperamos el token de los headers 
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //Acceder a la información del token 
        req.usuario = decoded.usuario;
        next();

    });

};


//==============================
// Verificar AdminROle            
//==============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};


//==============================
// Verificar token para imagen            
//==============================
let verificaTokenImg = (req, res, next) => {

    //req.query para obtener parametros especiales
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //Acceder a la información del token 
        req.usuario = decoded.usuario;
        next();

    });

}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}