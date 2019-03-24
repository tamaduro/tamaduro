var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var nodeMailer = require('nodemailer');
var bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

var db = mongo.db(config.connectionString, { native_parser: true });
var userService = require('./user.service.js');
db.bind('resetRequests');

var service = {};

service.resetByEmail = resetByEmail;
service.validateResetKey = validateResetKey;
service.changePassword = changePassword;

function resetByEmail(email) {
    var deferred = Q.defer();
    let validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 1);
    
    let timestamp = validUntil.getTime();

    if(_.isEmpty(email)) {
        deferred.reject('Por favor, informe um e-mail.');
    }

    userService.getByEmail(email).then(function(user){
        
        let requestId = uuid();

        db.resetRequests.insert({
            timestamp: timestamp,
            username: user.username,
            requestId: bcrypt.hashSync(requestId, 10)
        }, function(err, doc){
            if (err) deferred.reject(err.name + ': ' + err.message);

            sendResetEmail(email, `http://localhost:8092/resetpassword?username=${user.username}&key=${requestId}`).then(function(err, info){
                
                if (err){
                    deferred.reject(err);
                }    

                deferred.resolve();
            });
        })


    }).catch(function(){
        deferred.reject('Não há um usuario cadastrado com o e-mail informado.');
    });

    return deferred.promise;
}

function validateResetKey(username, key){
    var deferred = Q.defer();

    let now = new Date().getTime();
    
    a = db.resetRequests.find({
        username: username,
        timestamp: { $gt: now }
    }).toArray(function(err, items){
        
        items.forEach(item => {
            if (bcrypt.compareSync(key, item.requestId)){
                deferred.resolve();
            }
        });

        deferred.reject();
    });

    return deferred.promise;
}

function changePassword(username, password, key){
    var deferred = Q.defer();

    let now = new Date().getTime();
    
    a = db.resetRequests.find({
        username: username,
        timestamp: { $gt: now }
    }).toArray(function(err, items){
        
        items.forEach(item => {
            if (bcrypt.compareSync(key, item.requestId)){
                db.resetRequests.remove({
                    username: username
                }, function(err){
                    if (!err){
                        changeUserPassword(username, password);
                    }
                });
            }
        });

        deferred.reject();
    });

    function changeUserPassword(username, password){
        userService.getByUsername(username).then(function(user){
            
            userService.update(user._id, {
                password: password
            }, true).then(function(){
                deferred.resolve('Senha alterada com sucesso.');
            }).catch(function(err){
                deferred.reject('Erro ao atualizar a senha: ' + err.message);
            });

        }).catch(function(err){
            deferred.reject('Usuário não encontrado.');
        })
    }

    return deferred.promise;
}

function sendResetEmail(email, link){
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'apptamaduro@gmail.com',
            pass: 'tamaduro123'
        }
    });
    let mailOptions = {
        from: '"Tá Maduro" <apptamaduro@gmail.com>',
        to: email,
        subject: 'Redefina a sua senha - Confirmação', 
        text: `
            Uma solicitação de redefinição de senha foi feita. 
            Clique no link à seguir para confirmá-la. 
            Caso não tenha sido você que tenha feito a solicitação, apenas ignore essa mensagem.
            Link: ${link}`,
        html: `
            Uma solicitação de redefinição de senha foi feita. 
            Clique no link à seguir para confirmá-la. 
            Caso não tenha sido você que tenha feito a solicitação, apenas ignore essa mensagem.
            Link: ${link}`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = service;