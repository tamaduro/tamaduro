var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('forgotpassword');
});

router.post('/', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/reset',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('forgotpassword', { error: `Ocorreu um erro: ${error}` });
        }

        res.render('forgotpassword', {
            message: "Um link de confirmação foi enviado para o e-mail cadastrado. Verifique sua caixa de entrada."
        });
    });
});

module.exports = router;