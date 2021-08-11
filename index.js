const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

//Importar Rutas
const authRoutes = require('./routes/auth');
const dashboadRoutes = require('./routes/dashboard');
const verifyToken = require('./middleware/validate-token');


// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.g6hmk.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const option = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(uri,option)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))



// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/dashboard', verifyToken, dashboadRoutes);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})
