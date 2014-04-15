var Sync = require('sync');
var BSON = require('mongodb').BSONPure;

var tmp_db_data = [
    //{ type: 'кот', id: 1, group: 'KH', race: 'BRI', color_code: 'ny', details: '11 (25) 73', sex: 'male', birth: '2012-03-14', father_id: null, mother_id: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', description: '' },
    { _id: null, type: 'кот', group: 'KH', race: 'BRI', color_code: 'ny', color_description: '', details: '11.25(73)', sex: 'male', birth: '2012-03-14', father: null, mother: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', gallery_id: '' }
];

module.exports = function(collection, gallery, app){
    app.post('/add', function(req, res){
        //console.log('req.body', req.body);

        // todo добавлять картинки
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

                if(!item){
                    collection.insert.sync(collection, new_item);
                    console.log('Добавлен элемент %s', JSON.stringify(item,null,'\t'));
                } else {
                    // проверяю нужно ли обновлять
                    var update_fields = {};
                    for(var j in item){
                        if(item[j]!=new_item[j]){
                            update_fields[j] = [item[j], new_item[j]];
                            break;
                        }
                    }

                    if(Object.keys(update_fields).length){
                        var o_id = new BSON.ObjectID(id);
                        collection.update.sync(null, {_id: o_id }, {$set: item}, {});
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

            if(!r.length) r = tmp_db_data;

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
            // todo

            return collection.remove.sync(null, {_id: o_id });
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