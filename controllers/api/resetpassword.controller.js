var config = require('config.json');
var express = require('express');
var router = express.Router();
var forgotPasswordService = require('services/forgotpassword.service');

// routes
router.post('/check', validateResetKey);
router.post('/reset', resetPassword);
//router.get('/', resetUserPassword);

module.exports = router;

function validateResetKey(req, res) {

    forgotPasswordService.validateResetKey(req.body.username, req.body.key)
    .then(function(){
        res.sendStatus(200);
    }).catch(function(){
        res.sendStatus(404);
    });
}

function resetPassword(req, res) {

    forgotPasswordService.changePassword(req.body.username, req.body.password, req.body.key)
    .then(function(){
        res.sendStatus(200);
    }).catch(function(){
        res.sendStatus(404);
    });
}