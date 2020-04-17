// can create, no read, edit and delete yet

const express = require('express');
const router = express.Router();
const ingredientsModel = require('../models/ingredientsModel');

//Read
router.get('/', (req,res) => {
    ingredientsModel.find({}, function(err, ingredients) {
        if (err) throw err;
        console.log(ingredients);
        res.send(ingredients);
    });
});

//Create
router.post('/add', (req,res) => {
    const ingredient = new ingredientsModel({
        name: req.body.name,
        unit: req.body.unit,
        quantity: req.body.quantity
    });

    ingredient.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

//Update
router.put('/edit/:ingredientId', (req,res) => {
    const query = {
        _id: req.params.ingredientId
    }

    const update = {
        content: req.body.content
    };

    ingredientsModel.updateOne(query, update, {new: true}, function(err, ingredients) {
        if (err) throw err;
        console.log(ingredients);
        res.send(ingredients);
    });
});

//Delete
router.delete('/delete/:ingredientId', (req,res) => {
    const query = {
        _id: req.params.ingredientId
    }

    commentsModel.remove(query, function(err, ingredients) {
        if (err) throw err;
        console.log(ingredients);
        res.send(ingredients);
    });
});

module.exports = router;