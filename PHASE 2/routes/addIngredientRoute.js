const express = require('express');
const router = express.Router();
const ingredientsModel = require('../models/ingredientsModel');

router.post('/', (req,res) => {
    const Ingredients = new ingredientsModel({
        name: req.body.name,
        unit: req.body.unit,
        quantity: req.body.quantity
    });

    Ingredients.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

module.exports = router;