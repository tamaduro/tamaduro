var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    request.post({
        url: config.apiUrl + '/resetpass/check',
        form: {
            key: req.param('key'),
            username: req.param('username'),
        },
        json: true
    }, function (error, response, body) {
        
        if (error || response.statusCode == 404){
            res.render('resetpassword', {
                error: "O link não é válido/expirou. Por favor, tente novamente."
            });
        } else if (response.statusCode == 200){
            res.render('resetpassword', {
                success: true
            })
        }
    });
});

router.post('/', function (req, res) {
    request.post({
        url: config.apiUrl + '/resetpass/reset',
        form: {
            username: req.param('username'),
            password: req.body.password,
            key: req.param('key'),
        },
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('resetpassword', { error: `Ocorreu um erro ao redefinir a senha: ${error}` });
        }
        req.session.success = 'Senha alterada com sucesso.';
        res.redirect('/login');
    });
});

module.exports = router;