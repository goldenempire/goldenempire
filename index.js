require('date-utils');
var fs = require('fs');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: process.env.LOG_DIR||'/var/log/goldenempire/server.log', category: 'server' }
    ]
});
var logger = log4js.getLogger('server');
var conf = require('./conf/conf');

if (process.env.PORT) {
    conf.port = process.env.PORT;
}

process.on('uncaughtException', function (ce) {
    if (!(ce instanceof Error)) {
        ce = new Error(ce);
    }
    console.log(ce.stack);
});

// говорю что к-во слушателей не ограничено
//process.setMaxListeners(0);

//------------------------------------------------------------------------------------//

// конфигурю express ( в скобочках чтоб красивее )
var express = require('express');
var app = express();
var static_dir = process.cwd() + '/static';
app.configure(function () {

    //app.setMaxListeners(0);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(static_dir));
    // Register ejs as .html. If we did
    // not call this, we would need to
    // name our views foo.ejs instead
    // of foo.html. The __express method
    // is simply a function that engines
    // use to hook into the Express view
    // system by default, so if we want
    // to change "foo.ejs" to "foo.html"
    // we simply pass _any_ function, in this
    // case `ejs.__express`.

    app.engine('.html', require('ejs').__express);

    // Optional since express defaults to CWD/views
    app.set('views', __dirname + '/views');

    // Without this you would need to
    // supply the extension to res.render()
    // ex: res.render('users.html').
    app.set('view engine', 'html');

    // Ловим внутренние ошибки средствами express'a
    //Error.stackTraceLimit = Infinity; // можно установить для дебага
    app.use(function (e, req, res, next) {
        // обезопасим себя ибо тут может вылететь в корку
        try {
            res.json([e]);
        } catch (ce) {
            console.log(ce);
        }
    });
});
// \конфигурю express ( в скобочках чтою красивее )

//------------------------------------------------------------------------------------//
require('./top_menu')(app);
//------------------------------------------------------------------------------------//

// запускаю сервачек
app.listen(conf.port, function () {
    logger.info('started at ', conf);
});
// \запускаю сервачек

//------------------------------------------------------------------------------------//

var q = fs.readFileSync('./static/jdb/colors.json').toString();
q = JSON.parse(q);

var tmp_db_data = [
    //{ type: 'кот', id: 1, group: 'KH', race: 'BRI', color_code: 'ny', details: '11 (25) 73', sex: 'male', birth: '2012-03-14', father_id: null, mother_id: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', description: '' },
    { _id: 1, type: 'кот', group: 'KH', race: 'BRI', color_code: 'ny', color_description: '', details: '11.25(73)', sex: 'male', birth: '2012-03-14', father: null, mother: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', details_description: '' }
];

var tmp_db_data1 = [
    {'id': 26, 'breed': 'BRI', 'logo': 'img/26.jpg', 'name': 'Golden Khalif of Britain Yard', 'color': 'ny 11 золотой затушеванный', 'color_code': 'BRI ns 12 34', 'birth': '2012-03-14', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'male', 'type': 'cat', 'category': 'коты', 'state': 'Закрытый производитель', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 21:47:26'},
    {'id': 32, 'breed': 'SSS', 'logo': 'img/32.jpg', 'name': 'GoldenEmpire Agata', 'color': 'ау11(25) голубая золотая затушеванная', 'color_code': 'SSS ау11', 'birth': '2013-01-29', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'female', 'type': 'cat', 'category': 'кошки', 'state': 'Производитель на условиях', 'user': 1, 'confirmed': 1, 'created': '2013-12-23 10:55:54'},
    {'id': 27, 'breed': 'BRI', 'logo': 'img/27.png', 'name': 'Yavira Ceasar', 'color': 'ny 11(25) золотой затушеванный (тикированный)', 'color_code': 'BRI ny 11(25)', 'birth': '2010-08-10', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'male', 'type': 'cat', 'category': 'коты', 'state': 'Закрытый производитель', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 21:52:57'},
    {'id': 28, 'breed': 'SFS', 'logo': 'img/28.png', 'name': 'Legend of Stonehenje Arshibald', 'color': 'ny11  золотой затушеванный', 'color_code': 'SFS ny 11(25)', 'birth': '2012-07-20', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'male', 'type': 'cat', 'category': 'коты', 'state': 'Закрытый производитель', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 22:10:39'},
    {'id': 29, 'breed': 'SSS', 'logo': 'img/29.png', 'name': 'GoldenEmpire Benjamin', 'color': 'ns11  серебристый затушеванный', 'color_code': 'SFS ny 11(25)', 'birth': '2013-03-06', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'male', 'type': 'cat', 'category': 'коты', 'state': 'Закрытый производитель', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 22:15:20'},
    {'id': 30, 'breed': 'BRI', 'logo': 'img/30.jpg', 'name': 'Happy Bears Gaia Silver lady', 'color': 'ns11  серебристая затушеванная', 'color_code': 'BRI ns 11(25)', 'birth': '2012-08-18', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'female', 'type': 'cat', 'category': 'кошки', 'state': 'Производитель на условиях', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 22:30:23'},
    {'id': 31, 'breed': 'BRI', 'logo': 'img/31.jpg', 'name': 'Your Majesty Unbelievable Beauty', 'color': 'ns11  серебристая затушеванная', 'color_code': 'BRI ns 11(25)', 'birth': '2012-08-17', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'female', 'type': 'cat', 'category': 'кошки', 'state': 'Производитель на условиях', 'user': 1, 'confirmed': 1, 'created': '2013-12-21 23:08:36'},
    {'id': 33, 'breed': 'SFL', 'logo': 'img/33.jpg', 'name': 'Mafdet Mint Kinder Smile', 'color': 'Лиловый золотой затушеванный су11', 'color_code': 'SFL  cy11', 'birth': '2012-09-10', 'father': null, 'mother': null, 'litter': 'null', 'sex': 'male', 'type': 'cat', 'category': 'коты', 'state': 'Закрытый производитель', 'user': 1, 'confirmed': 1, 'created': '2014-01-18 23:12:00'}
];

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;

MongoClient.connect('mongodb://127.0.0.1:27017/goldenempire', function(err, db) {
    if(err) throw err;

    var collection = db.collection('db_cats1');
    //var collection = db.collection('test_insert');

    app.post('/add', function(req, res){
        //console.log('req.body', req.body);

        var rslts = [];

        var a = req.body;
        for(var i in a){
            var id = a[i]._id;
            delete a[i]._id;

            var o_id = null;
            try {
                o_id = new BSON.ObjectID(id);
            } catch(ce){
                //console.log(ce.stack);
            }

            update(a[i]);
        }

        function update(item){
            collection.find(o_id).toArray(function(err, results) {
                if(err) return db_callback(err);

                if(1==results.length && o_id){
                    console.log('update', item);
                    collection.update({_id: o_id }, {$set: item}, {}, db_callback);
                } else {
                    console.log('insert', item);
                    collection.insert(item, db_callback);
                }
            });
        }

        function db_callback(){
            rslts.push(arguments);
            if(rslts.length==a.length){
                collection.count(function(err, count) {
                    console.log('count', count);

                    res.send(rslts);
                });
            }
        }
    });

    app.get('/get', function(req, res){
        collection.find().toArray(function(err, results) {
            //console.log('get', arguments);
            if(err) return res.send({ error: e });
            if(!results.length) results = tmp_db_data;
            res.send(results);
        });

        collection.count(function(err, count) {
            console.log('count', count);
        });
    });

    app.get('/del/:id', function(req, res){
        var o_id = null;
        var e = null;
        try {
            o_id = new BSON.ObjectID(req.params.id);
        } catch(ce){
            e = ce;
            console.log(ce.stack);
        }

        if(e) return res.send({ error: e});

        collection.remove({_id: o_id }, function(e, result){
            console.log(arguments);
            if(e) return res.send({error:e});
            res.send({result:result});
        });
    });
});