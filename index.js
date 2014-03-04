require('date-utils');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/server.log', category: 'server' }
    ]
});
var logger = log4js.getLogger('server');
var conf = require('./conf/conf');

if(process.env.PORT){
    conf.port = process.env.PORT;
}

process.on('uncaughtException', function (ce) {
    if(!(ce instanceof Error)){
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
app.configure(function() {

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
    app.use(function(e, req, res, next) {
        // обезопасим себя ибо тут может вылететь в корку
        try {
            res.json([e]);
        } catch(ce) {
            console.log(ce);
        }
    });
});
// \конфигурю express ( в скобочках чтою красивее )

//------------------------------------------------------------------------------------//
require('./top_menu')(app);
//------------------------------------------------------------------------------------//

// запускаю сервачек
app.listen(conf.port, function() {
    logger.info('started at ', conf);
});
// \запускаю сервачек

//------------------------------------------------------------------------------------//


// Dummy users
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/:page', function(req, res){
    console.log(req.params);
    res.render(req.params.page, {
        title: 'about'
    });
});

app.get('/list/:category', function(req, res){
    res.render('list', {
        title: 'list/'+req.params.category
    });
});