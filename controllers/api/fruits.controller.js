var config = require('config.json');
var express = require('express');
var router = express.Router();
var fruitsService = require('services/fruits.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/fruit', addFruit);
router.get('/fruits', getAllFruits);
router.get('/fruit/:_id', getFruit);
router.delete('/fruit/:_id', deleteFruit);

module.exports = router;

function authenticateUser(req, res) {
    fruitsService.authenticate(req.body.fruit, req.body.password)
        .then(function (response) {
            if (response) {
                // authentication successful
                res.send({ userId: response.userId, token: response.token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addFruit(req, res) {
    fruitsService.addFruit(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getFruit(req, res) {
    fruitsService.findAll()
        .then(function (fruits) {
            if (fruits) {
                res.send(fruits);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getAllFruits(req, res) {
    fruitsService.findAll()
        .then(function (fruits) {
            if (fruits) {
                res.send(fruits);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteFruit(req, res) {
    
    fruitsService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}