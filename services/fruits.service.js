var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('fruits');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.addFruit = addFruit;
service.delete = _delete;
service.findAll = findAll;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.fruits.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.fruits.findById(_id, function (err, fruit) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (fruit) {
            // return fruit
            deferred.resolve(fruit);
        } else {
            // fruit not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function addFruit(fruitParam) {
    var deferred = Q.defer();

    // validation
    db.fruits.findOne(
        { name: fruitParam.name },
        function (err, fruit) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (fruit) {
                // fruit already exists
                deferred.reject('A fruta "' + fruitParam.name + '" já está cadastrada');
            } else {
                addFruit();
            }
        });

    function addFruit() {
        
        var fruit = fruitParam;

        db.fruits.insert(
            fruit,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.fruits.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function findAll() {
    var deferred = Q.defer();

    db.collection("fruits").find({}).toArray(function(err, fruits) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (fruits) {
            // return fruits
            deferred.resolve(fruits);
        } else {
            // fruits not found
            deferred.resolve();
        }
        
        db.close();
    });

    return deferred.promise;
}