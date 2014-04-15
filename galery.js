var fs = require('fs');
var util = require('util');
var Sync = require('sync');

var BSON = require('mongodb').BSONPure;

module.exports = function(collection, gallery, app){
    app.post('/gallery/upload', function(req, res){
        // http://howtonode.org/af136c8ce966618cc0857dbc5e5da01e9d4d87d5/really-simple-file-uploads

        console.log('req.body', req.body);

        Sync(function(){
            var cat_id = req.body.cat_id;

            if(!cat_id) throw 'Не указан id кота';

            var o_id = new BSON.ObjectID(cat_id);
            var cat =  collection.find(o_id).toArray.sync(null)[0];
            if(!cat) throw 'Нет кота с id='+cat_id;


            var arr = req.files;
            if(!arr.length) arr=[arr];
            if(arr.length>1) throw 'Разрешена только поодиночная загрузка';
            if(arr.length<1) throw 'Нет файлов для выгрузки';


            var file = arr[0].file;

            var galery_item = {
                cat_id : cat_id,
                original_file_name : file.originalFilename
            };
            //console.log(galery_item);

            var exist_arr = gallery.find(galery_item).toArray.sync(gallery);
            if(exist_arr.length) throw util.format('Файл "%s" уже привязан к "%s"', galery_item.original_file_name, cat.name);

            var file_name = file.path.split('/');
            file_name = file_name[file_name.length-1];
            galery_item.file_name = file_name;
            gallery.insert.sync(gallery, galery_item);

            fs.writeFileSync(__dirname+'/static/gallery/'+file_name, fs.readFileSync(file.path));

            //return gallery.find().toArray.sync(null);
            //console.log(gallery.find().toArray.sync(null));
            return true;
        }, process_response(req, res));
    });

    app.post('/gallery/remove', function(req, res){
        Sync(function(){
            var arr = gallery.find().toArray.sync(null);
            if(arr.length<0) throw 'Отсутствует файл '+req.body.name;

            gallery.remove.sync(gallery, req.body);

            return true;
        }, process_response(req, res));
    });
};

function process_response(req, res){
    return function(e,o){
        if(e) {
            console.log(req.url, req.body, e.stack||e);
            return res.send(500, e.message||e);
        }

        res.send(o);
    }
}