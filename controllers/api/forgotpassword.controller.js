var config = require('config.json');
var express = require('express');
var router = express.Router();
var forgotPasswordService = require('services/forgotpassword.service');

// routes
router.post('/', resetUserPassword);
router.get('/', resetUserPassword);

module.exports = router;

function resetUserPassword(req, res) {

    forgotPasswordService.resetByEmail(req.body.email)
    .then(function(){
        res.send(200);
    }).catch(function(){
        res.sendStatus(404);
    });
}