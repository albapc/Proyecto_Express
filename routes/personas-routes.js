var express = require('express');
var router = express.Router();
var personas_controller = require('../controllers/personas-controller');

//Incluir la función de validación
const {check} = require('express-validator');

//Reglas de validación
const valid_persona = [
    check('name')
        .isLength({min: 3}).withMessage('El nombre tiene que tener un minimo de 3 caracteres') //minimo de caracteres
        .isAlpha().withMessage('solo se admiten letras'), //solo admite letras

    check('surname').custom((value, {req}) => { //el req en este caso no es indispensable
        if (isNaN(value)) {
            return true;
        } else {
            throw new Error('No se permiten numeros')
        }
    }).withMessage('No se permiten numeros')
        .isLength({min: 3}).withMessage('Los apellidos tienen que tener 3 caracteres como minimo'),

    check('age').custom((value) => {
        if (value < 0 || value > 125) {
            throw new Error('Tiene que ser un numero entre 0 y 125')
        } else {
            return true;
        }
    }).withMessage('La edad tiene que ser un numero entre 0 y 125')
        .isNumeric().withMessage('Solo se permiten numeros'), //solo admite numeros

    check('dni').custom((value) => {
        let numeros = value.slice(0, 7);
        let letra = value.slice(value.charAt(8));
        if (isNaN(numeros)) {
            throw new Error('El dni tiene que contener 8 numeros')
        } else if (!isNaN(letra)) {
            throw new Error('El ultimo caracter tiene que ser una letra')
        } else {
            return true;
        }
    }).withMessage('Dni no valido')
        .isLength({min: 9, max: 9}).withMessage('El dni tiene que tener un total de 9 caracteres'),

    check('dob')
        .isISO8601().withMessage('Solo se permiten fechas en formato ISO8601. Por ejemplo: 1983-10-30'),

    check('fc')
        .isLength({min: 4}).withMessage('El color tiene que tener mas de 3 caracteres')
        .isAlpha().withMessage('No se admiten numeros'),

    check('gender')
        .isIn(['Hombre', 'HOMBRE', 'hombre', 'Mujer', 'MUJER', 'mujer', 'Otro', 'OTRO', 'otro', 'No especificado',
            'NO ESPECIFICADO', 'no especificado']).withMessage('Solo se admiten los siguientes valores:' +
        'Hombre, Mujer, Otro o No especificado')
];

//CREATE persona
router.post('/', valid_persona, personas_controller.personas_create);

//READ persona
router.get('/:id', personas_controller.personas_getId); //obtener personas por su id
router.get('/', personas_controller.personas_list); //lista de personas

//UPDATE personas por su id
router.put('/:id', valid_persona, personas_controller.personas_update_one);

//DELETE personas por su id
router.delete('/:id', personas_controller.personas_delete_one);

module.exports = router;
