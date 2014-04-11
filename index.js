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


// Dummy users
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.com' }
];

/*
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
 */

var breeds = {
    KH : {
        _dsc : 'Shorthair/Короткошерстная',
        ABT : 'American bobtail/Американский бобтейл',
        ABY : 'Abyssinian/Абиссинская',
        ASH : 'American shorthar/Американская короткошерстная',
        AWH : 'American wirehair/Американская жесткошерстная',
        BEN : 'Bengalian/Бенгальская',
        BOM : 'Bombay/Бомбейская',
        BRI : 'British shorthair/Британская',
        BUL : 'Burmilla/Бурмилла',
        BUR : 'Burmese/Бурмезская',
        CHA : 'Cartesian/Картезианская',
        CRX : 'Cornish-rex/Корниш-рекс',
        CSP : 'Californian splendid/Калифорнийская сияющая',
        DRX : 'Devon-rex/Девон-рекс',
        DSX : 'Russian hairless/Донской сфинкс (Русская бесшерстная)',
        EUR : 'European shorthair/ЕКШ (Европейская короткошерстная)',
        EXO : 'Exotic shorthair/Экзотическая',
        GRX : 'German-rex/Герман-рекс',
        HVB : 'Havana brown/Гавана браун',
        JBT : 'Japanese bobtail/Японский бобтейл',
        KOR : 'Korat/Корат',
        MAN : 'Manx/Мэнская (бесхвостая) кошка',
        MAU : 'Egyptian mau/Египетская мау',
        MUN : 'Manchkin/Манчкин',
        OCI : 'Ocicat/Оцикат',
        PDC : 'Puddle-cat/Пуделькэт',
        RUS : 'Russian blue/Русская голубая',
        SFS : 'Scottish fold (KH)/Скоттиш-фолд (Шотландская вислоухая)',
        SFX : 'Canadian sphinx/Канадский сфинкс',
        SIN : 'Singapura/Сингапура',
        SNO : 'Snow-shoe/Сноу-шу',
        TBT : 'Thai bobtail/Тайский бобтэйл',
        THA : 'Thai/Тайская',
        TOB : 'Toy bobtail/Той-бобтэйл',
        TON : 'Tonkinese/Тонкинская (Тонкинез)',
        URX : 'Ural rex/Уральский рекс'
    },
    SLH : {
        _dsc: 'Half Shorthair/Полудлинношерстная',
        ABT : 'American bobtail/Американский бобтейл',
        BAL : 'Balinesian/Балинезийская',
        CUR : 'Curl/Кёрл',
        CYM : 'Kimrik/Кимрик',
        JAV : 'Javanese/Яванез',
        КАВ : 'Karelian bobtail/Карельский бобтейл',
        КВТ : 'Kurilian bobtail/Курильский бобтейл',
        MCO : 'Maine coon/Мэйн-кун',
        NEV : 'Neva maskarade/Невская маскарадная',
        NIB : 'Nibelung/Нибелунг',
        NFO : 'Norwegian Forest Cat/Норвежская лесная',
        RAG : 'Ragdoll/Регдолл',
        SBI : 'Sacred Birman/Бирмаская',
        SFL : 'Scottish fold/Скоттиш-фолд (Шотландская вислоухая)',
        SIB : 'Siberian/Сибирская',
        SOM : 'Somali/Сомалийская (Сомали)',
        SRX : 'Selkirc rex/Силкирк рекс',
        TIF : 'Tiffani/Тиффани',
        TUA : 'Turkish angora/Турецкая ангора',
        TUV : 'Turkish van/Турецкая ван',
        URX : 'Ural rex/Уральский рекс'
    },
    LN : {
        _dsc : 'Longhair/Длинношерстная',
        PER	: 'Persian/Персидская'
    },
    SOKH : {
        _dsc : 'Siamese-Oriental/Сиам-ориентальная',
        ORI : 'Oriental/Ориентальная',
        SIA : 'Siamese/Сиамская'
    },
    NON : {
        PET : 'Pet cat/Домашняя кошка',
        NON : 'Unregistered race/Не зарегистрированная порода'
    }
};

var colors = {
  a : 'blue/голубой',
  b : 'chocolate (brown, chestnut)/шоколадный (коричневый, каштановый, гавана, шампанский)',
  c : 'lilac (lavender)/лиловый (лавандовый, платиновый)',
  d : 'red, flame/красный',
  e : 'cream/кремовый',
  f : 'tortoiseshell/черепаховый',
  g : 'blue-cream, blue-tortie/голубокремовый, голубочерепаховый',
  h : 'chocolate-tortie/шоколадный черепаховый',
  j : 'lilac-tortie/лиловый черепаховый',
  n : 'black, ebony, seal,  sable, ruddy/черный, соболиный, дикий',
  o : 'sorrel, cinnamon, honey/соррель,красно-коричневый, коричневый, медовый',
  p : 'beige fawn/желто-коричневый, "бежевый олененок"',
  q : 'sorrel tortie/красно-коричневый черепаховый',
  r : 'beige fawn tortie/желто-коричневый черепаховый',
  s : 'silver, smoke/серебристый, дымчатый',
  w : 'white/белый',
  y : 'golden/золотистый',
  x : 'unregistered/не зарегистрированный, непризнанный окрас'
};

var details = {    
  '01' : 'van/ван',
  '02' : 'harlequin/арлекин',
  '03' : 'bicolour/двухцветный, биколор',
  '04' : 'mitted/white point с белыми отметинами для колор-пойнтов',
  '05' : 'snowshoe/сноу-шу',
  '09' : ' little white spots/белая пятнистость 1-2 см брак для LH',
  '11' : 'shaded/затушеванные (1:4 вepxнeй чacти вoлoca зaтeмнeнa)',
  '12' : 'tipped, shel/завуалированные (1:8 вepxнeй чacти вoлoca зaтeмнeнa)',
  '21' : 'tabby, agouti/полосатость, агути-фактор',
  '22' : 'blotched, marble/мраморный окрас',
  '23' : 'mackerel, tiger/тигровый окрас',
  '24' : 'spotted/пятнистый окрас',
  '25' : 'ticked/тикированный, или абиссинский окрас',
  '31' : 'burmese colour/бурмесский окрас',
  '32' : 'tonkinese colour/тонкинский окрас',
  '33' : 'himalayan (siam) colour/гималайский или сиамский окрас',
  '34' : 'singapura colour/сингапурский окрас',
  '35' : 'abyssinian colour/абиссинский окрас, тикинг',
//НАЧИНАЮЩИЕСЯ С 5 (ДЛИНА ХВОСТА)
  '51' : 'rumpy/бесхвостость',
  '52' : 'rumpy riser/остаток хвоста - 1-2 позвонка',
  '53' : 'stumpy/боб - 7-13 см. свернутого хвоста',
  '54' : 'longy длинный/нормальный хвост',
//НАЧИНАЮЩИЕСЯ С 6 (ЦВЕТ ГЛАЗ)
  '61' : 'blue/голубой',
  '62' : 'yellow, golden/желтый, оранжевый, золотистый',
  '63' : 'oddeyed/разноглазие',
  '64' : 'green/зеленый',
  '65' : 'burmese/цвет глаз бурмесских кошек',
  '66' : 'tonkinese/цвет глаз тонкинских кошек',
  '67' : 'himalayan or siam/цвет глаз гималайских и сиамских кошек',
//НАЧИНАЮЩИЕСЯ С 7 (ПОСТАВ УШЕЙ)
  '71' : 'straight ears/страйт (прямые уши)',
  '72' : 'curled ears/керл (закручены назад)',
  '73' : 'folded ears/фолд (вперед)'
};

/*
fs.writeFileSync('./static/jdb/breeds.json', JSON.stringify(breeds,null,'\t'));
fs.writeFileSync('./static/jdb/details.json', JSON.stringify(details,null,'\t'));
fs.writeFileSync('./static/jdb/colors.json', JSON.stringify(colors,null,'\t'));
*/

var q = fs.readFileSync('./static/jdb/colors.json').toString();
q = JSON.parse(q);

var tmp_db_data = [
    //{ type: 'кот', id: 1, group: 'KH', race: 'BRI', color_code: 'ny', details: '11 (25) 73', sex: 'male', birth: '2012-03-14', father_id: null, mother_id: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', description: '' },
    { type: 'кот', id: 1, group: 'KH', race: 'BRI', color_code: 'ny', color_description: '', details: '11 (25) 73', sex: 'male', birth: '2012-03-14', father: null, mother: null, litter: null, name : 'Golden Khalif of Britain Yard', state: 'Закрытый производитель', details_description: '' }
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


app.get('/all/:lng', function (req, res) {
    /*
    var lng = req.params.lng;
    if(-1==['ru', 'en'].indexOf(lng)){
        lng = 'en';
    }

    for(var i in tmp_db_data){
        var d = tmp_db_data[i];

        var m = d.color_code.match(/\w{1}/g);
        var color = [];
        for(var j in m){
            if(colors[m[j]]){
                color.push(colors[m[j]].split('/')[ lng=='ru'?1:0 ]);
            }
        }
        d.color = color.join(', ');


        if(d.description) continue;

        m = d.details.match(/\d{2}/g);
        var description = {
            'Длина хвоста' : [],
            'Цвет глаз' : [],
            'Постав ушей' : [],
            'Окрас' : []
        };
        console.log(m);
        for(var j in m){
            if(!m[j]) continue;

            if(details[m[j]]){
                var key = 'Окрас';
                if('5'==m[j][0]){
                    key = 'Длина хвоста';
                }

                if('6'==m[j][0]){
                    key = 'Цвет глаз';
                }

                if('7'==m[j][0]){
                    key = 'Постав ушей';
                }

                description[key].push(details[m[j]].split('/')[ lng=='ru'?1:0 ]);
            }

            console.log(m[j], key);
        }

        for(var j in description){
            if(!description[j].length) delete description[j];
            else description[j] = description[j].join(', ');
        }

        //var m = d.details.match(/\w{1,2}/);
        console.log(description);

        d.description = description;
    }*/

    res.json(tmp_db_data);
});



app.get('/breed/', function(){

});