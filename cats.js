var fs = require('fs');
var Sync = require('sync');
var BSON = require('mongodb').BSONPure;

var tmp_db_data = [
    //{ type: 'кот', id: 1, group: 'KH', race: 'BRI', color_code: 'ny', details: '11 (25) 73', sex: 'male', birth: '2012-03-14', father_id: null, mother_id: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', description: '' },
    { type: 'кот', group: 'KH', race: 'BRI', color_code: 'ny', color_description: '', details: '11.25(73)', sex: 'male', birth: '2012-03-14', father: null, mother: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', logo: '' }
];

module.exports = function(collection, gallery, app){
    app.post('/add', function(req, res){
        //console.log('req.body', req.body);

        // todo порверить существование картинки
        Sync(function(){
            var a = req.body;

            var all_items = collection.find().toArray.sync(null);
            var items = {};
            for(var i in all_items){
                items[all_items[i]._id] = all_items[i];
            }

            for(var i in a){
                var new_item = a[i];
                var id = new_item._id;
                delete new_item._id;

                var item = items[id];

                //console.log('item', item);

                if(!item){
                    collection.insert.sync(collection, new_item);
                    console.log('Добавлен элемент %s', JSON.stringify(new_item,null,'\t'));
                } else {
                    // проверяю нужно ли обновлять
                    var update_fields = {};
                    for(var k in new_item){
                        if(-1==Object.keys(item).indexOf(k)) continue;
                        if(item[k]!=new_item[k]){
                            update_fields[k] = new_item[k];
                        }
                    }

                    //console.log('update_fields', update_fields);
                    //console.log('id', id);
                    //console.log('new_item', new_item);

                    if(Object.keys(update_fields).length){
                        var o_id = new BSON.ObjectID(id);
                        //collection.update.sync(collection, {_id: o_id }, {$set: item}, {});
                        collection.update.sync(collection, {_id: o_id }, {$set: update_fields}, {});
                        console.log('Обновлен элемент %j', id, JSON.stringify(update_fields,null,'\t'));
                    }
                }
            }
            return true;
        }, process_response(req, res));
    });

    app.get('/get', function(req, res){
        Sync(function(){
            var r = collection.find().toArray.sync(null);

            if(!r.length) {
                collection.insert.sync(collection, tmp_db_data);
                r = collection.find().toArray.sync(collection);
            }

            return r;
        }, process_response(req, res));
    });

    app.get('/del/:id', function(req, res){
        Sync(function(){
            var o_id = new BSON.ObjectID(req.params.id);

            var item =  collection.find(o_id).toArray.sync(null)[0];

            // удаляю id удаляемого родителя из всех потомков
            var parent = ('male'==item.sex)?'father':'mother';
            var search_child_condition = {};
            search_child_condition[ parent ] = item._id;
            var child_items =  collection.find(search_child_condition).toArray.sync(null);
            //console.log(child_items);
            search_child_condition[parent] = null;
            for(var i in child_items){
                var c_id = new BSON.ObjectID(child_items[i]._id);

                collection.update.sync(null, {_id: c_id }, {$set: search_child_condition}, {});
            }

            // удаляю все связанные картинки
            var gallery_remove_query = {cat_id: req.params.id};
            var gallery_remove_items = gallery.find(gallery_remove_query).toArray.sync(gallery);
            gallery.remove.sync(gallery, gallery_remove_query);
            for(var i in gallery_remove_items){
                var unlink_file_name = process.env.GALLERY_PATH+'/'+gallery_remove_items[i].file_name;
                fs.unlinkSync(unlink_file_name);
                console.log('Удален файл "%s" для "%s"', unlink_file_name, item.name);
            }

            return collection.remove.sync(collection, {_id: o_id });
        }, process_response(req, res));

    });
};

function process_response(req, res){
    return function(e,o){
        if(e) {
            console.log(e.stack||e);
            return res.send(500, e.message||e);
        }

        res.send(o);
    }
}