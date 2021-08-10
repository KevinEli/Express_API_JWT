const router = require('express').Router();
const User = require('../models/User').schema;
const schemaRegister = require('../models/User').schemaRegister;


router.post('/register', async(req, res) => {

    const { error } = schemaRegister.validate(req.body);

    if(error){
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
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




module.exports = router;