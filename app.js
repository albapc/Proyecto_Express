var express = require('express'); //Express.js
var path = require('path'); //Tratamiento de rutas de ficheros
var cookieParser = require('cookie-parser'); //Módulo para cookies
var logger = require('morgan'); //Módulo para log de las peticiones http

//Se definen las rutas de la aplicación
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var personasRouter = require('./routes/personas-routes');

var app = express(); //Se crea la aplicación

//Se configura el módulo para generar un log de las peticiones que recibe el servidor y verlas por la consola
app.use(logger('dev'));
//Se configura un middleware para que traduzca todas las peticiones de tipo JSON para facilitar su tratamiento
app.use(express.json());
//Middleware para decodificar el contenido de los parámetros que vengan codificados en las peticiones
app.use(express.urlencoded({extended: false}));
//Inicializa el módulo para facilitar el tratamiento de cookies
app.use(cookieParser());
//Le indica a Express que esta carpeta (public) contiene contenido estático
app.use(express.static(path.join(__dirname, 'public')));

//Se definen las rutas de la aplicación
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/personas', personasRouter);

//Se exporta la aplicación para que pueda ser utilizada desde otros ficheros que incluyan app.js
module.exports = app;
