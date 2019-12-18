//Incluir el fichero con la definición de la BD
var db = require('../db/db');
var ObjectId = require('mongodb').ObjectId;

//Incluir la función de validación
const { validationResult } = require('express-validator');

//Conectar con la BD
db.connect('mongodb://localhost:27017', function (err) {
    if (err) {
        throw ('Fallo en la conexión con la BD');
    }
});

//Mostrar todas las personas
module.exports.personas_list = function (req, res) {
    db.get().db('personas').collection('personas').find().toArray(function (err, result) {
        if (err) {
            throw ('Fallo en la conexión con BD');
        } else {
            res.send(result);
        }
    })
};

//Mostrar personas por id
module.exports.personas_getId = function (req, res, next) {
    if (db.get() === null) {
        next(new Error('La conexión no está establecida'));
        return;
    }

    db.get().db('personas').collection('personas').find({_id: ObjectId(req.params.id)}).toArray(function (err, result) {
        if (err) {
            next(new Error('Fallo en el listado de personas'));
            return;
        } else {
            //Si fue bien, devolver el resultado al cliente
            res.send(result)
        }
    });
};

//Crear una persona
module.exports.personas_create = function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }

    if(db.get() === null) {
        next(new Error('La conexión no está establecida'));
        return;
    }

    const persona = {};
    persona.name = req.body.name;
    persona.surname = req.body.surname;
    persona.age = req.body.age;
    persona.dni = req.body.dni;
    persona.dob = req.body.dob;
    persona.fc = req.body.fc;
    persona.gender = req.body.gender;

    if (db.get() === null) {
        next(new Error('La conexión no está establecida'));
        return;
    }

    db.get().db('personas').collection('personas').insertOne(persona, function (err, result) {
        if (err) {
            throw ('Fallo en la conexión con la BD');
        } else {
            res.send(result);
        }
    });
};

//Actualizar personas
module.exports.personas_update_one = function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }

    if (db.get() === null) {
        next(new Error('La conexión no está establecida'));
        return;
    }

    const filter = {_id: ObjectId(req.params.id)};
    const update = {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            dni: req.body.dni,
            dob: req.body.dob,
            fc: req.body.fc,
            gender: req.body.gender
        }
    };

    //Insertar un documento
    db.get().db('personas').collection('personas').updateOne(filter, update,
        function (err, result) {
            //Si se produjo un error, enviar el error a la siguiente función
            if (err) {
                next(new Error('Fallo en la actualización de la DB'));
                return;
            } else {
                //Si funcionó, devolver el resultado al cliente
                res.send(result);
            }
        });
};

//Borrar personas
module.exports.personas_delete_one = function (req, res, next) {
    if (db.get() === null) {
        next(new Error('La conexión no está establecida'));
        return;
    }
    const filter = {_id: ObjectId(req.params.id)};
    //Eliminar un documento
    db.get().db('personas').collection('personas').deleteOne(filter, function (err, result) {
        //Si se produjo un error, enviar el error a la siguiente función
        if (err) {
            next(new Error('Fallo en el borrado de los datos de la BD'));
            return;
        } else {
            //Si funcionó, devolver el resultado al cliente
            res.send(result);
        }
    });
};
