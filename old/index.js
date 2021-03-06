require('date-utils');
var fs = require('fs');
var log4js = require('log4js');
var Sync = require('sync');
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

if(!process.env.GALLERY_PATH) {
    process.env.GALLERY_PATH = process.cwd()+'/static/gallery';
}

console.log( process.env.GALLERY_PATH );

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
        if(e) console.log(e.stack||e);

        try {
            res.json([e]);
        } catch (ce) {
            console.log(ce.stack||ce);
        }
    });
});
// \конфигурю express ( в скобочках чтою красивее )

// запускаю сервачек
app.listen(conf.port, function () {
    logger.info('started at ', conf);
});
// \запускаю сервачек

//------------------------------------------------------------------------------------//

var q = fs.readFileSync('./static/jdb/colors.json').toString();
q = JSON.parse(q);

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

app.get('/admin.html', function(req, res, next){
    if(req.query){
        if(req.query.login=='test'){
            if(req.query.pass=='test'){
                return next();
            }
        }
    }

    res.redirect('/forbidden.html');
});

/*
 ===
/cat/male - все коты
/cat/female - все кошки
/cat/children - все котята
/cat/children/male - все котята мальчики
/cat/children/female - все котята девочки
/cat/:id - один кот
/cat/BRIny11.34 - или так один кот
/hat/:id - одна шапка
 ===
*/

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;

MongoClient.connect('mongodb://127.0.0.1:27017/goldenempire', function(e, db) {
    if(e) throw e;

    var db_cats = db.collection('db_cats1');
    var db_gallery = db.collection('gallery');

    db_cats.find().toArray(function(err, items) {
        console.log(arguments);
    });

    db_gallery.find().toArray(function(err, items) {
        console.log(arguments);
    });

    //db_cats.remove(function(){});
    //db_gallery.remove(function(){});

    require('./cats')(db_cats, db_gallery, app);
    require('./gallery')(db_cats, db_gallery, app);

    require('./site')(app, db_cats, db_gallery);
});
