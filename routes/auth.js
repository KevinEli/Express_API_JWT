const router = require('express').Router();
const User = require('../models/User').schema;
const bcrypt = require('bcrypt');
const schemaRegister = require('../models/User').schemaRegister;
const schemaLogin = require('../models/User').schemaLogin;
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {

    const { error } = schemaRegister.validate(req.body);

    if(error)
        return res.status(400).json({ error: error.details[0].message });

    const existeEmail = await User.findOne({email: req.body.email});
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    const password = await bcrypt.hash(req.body.password, salt);

    if(existeEmail)
        return res.status(400).json({ error: 'el Email ya se encuentra registrado'});

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });

    try{
        const userDB = await user.save();
        res.json({
            error: null,
            data: userDB
        })

    } catch(error){
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {

    const { error } = schemaLogin.validate(req.body);

    if(error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({ error: 'Credenciales Invalidas' });

    const token = jwt.sign({
      name: user.name,
      id: user.id
    }, process.env.TOKEN_SECRET);


    res.header('auth-token', token).json({
        error:null,
        data: token
    });

});


module.exports = router;