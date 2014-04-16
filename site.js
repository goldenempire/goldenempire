require('date-utils');
var fs = require('fs');
var Sync = require('sync');
var ejs = require('ejs');

module.exports = function(app, db_cats, db_gallery){
    app.get('/hat', function(req, res){
        //res.render('list', {});

        Sync(function(){
            var list = db_cats.find({type: "шляпки"}).toArray.sync(db_cats);
            if(!list.length) return 'Нет данных';


        }, function(){

        });

        console.log (
            ejs.render(
                fs.readFileSync('./views/list.html').toString()
            )
        );
    });

    app.get('/cat', function(req, res){
        res.redirect('/cat/male');
    });

    app.get('/cat/male', function(req, res){
        res.redirect('/cat/male');
    });
};