require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, x-Request-With, Content-Type,Accept, Authorization, token'

    );

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, DELETE,OPTIONS'
    );
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));
app.use(require('./routes/libro'));
app.use(require('./routes/login'));
app.use(require('./routes/upload'));
app.use(require('./routes/imagen'));
app.use(require('./routes/prestamo'));


// mongoose.connect('mongodb://localhost:27017/biblioteca', (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos ONLINE');
// });
// app.listen(process.env.PORT, () => {
//     console.log('Escuchando el puerto 3000');
// });


mongoose.connect('mongodb+srv://admin:ruizmoreno@cluster0-hy7of.mongodb.net/biblioteca?retryWrites=true&w=majority', (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
});