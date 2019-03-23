var config = require('config.json');
var express = require('express');
var router = express.Router();
var resetPasswordService = require('services/resetpassword.service');

// routes
router.post('/', resetUserPassword);
router.get('/', resetUserPassword);

module.exports = router;

function resetUserPassword(req, res) {

    resetPasswordService.resetByEmail(req.body.email)
    .then(function(){
        res.send(200);
    }).catch(function(){
        res.sendStatus(500);
    });
}