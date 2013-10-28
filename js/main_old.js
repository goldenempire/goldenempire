// test data
var dataBase;

var catList = [];

var db = {
    update : function(arr, cb){
        this.post({ action: "update", data: arr }, cb);
    },
    get : function(cb){
        this.post({ action: "get" }, cb);
    },
    getAll : function(cb){
        this.post({ action: "getAll" }, cb);
    },
    getTest : function(cb){
        this.post({ action: "getTest" }, cb);
    },
    test : function(cb){
        this.post({ action: "test" }, cb);
    },
    login : function(user_name, user_pass, cb){
        this.post({ 'user_name' : user_name, 'user_pass' : user_pass, action: "login" }, cb);
    },
    logout : function(cb){
        this.post({ action: "logout" }, cb);
    },
    post : function(rq_data, cb){
        $.ajax({
            url:"db.php",
            type: "POST",
            data: rq_data,
            dataType:"json",
            success: function(rs_data){
                console.log('post success', rs_data);
                if(rs_data.error){
                    cb(rs_data.error);
                } else {
                    cb(null, rs_data.result);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('post error', xhr.responseText, xhr, ajaxOptions, thrownError);
                if(cb) cb(xhr.status);
            }
        });
    }
};

$(document).ready(function () {

    /*
    db.get(function(e,o){
        console.log(e||o);
        if(!e){
            dataBase = o;
        }
    });

    //console.log('11112222');
    db.getTest(function(e,o){
        console.log('getTest', e||o);
    });
    */

/*
 db.post({ 'action' : 'dir_list', 'dir' : 'uploads'}, function(e,o){
 console.log('dir_list', e||o);
 });
*/

    //fancybox gallery
    $('.fancybox').fancybox();

    //скролл
    $(".gEmPhotoGallBox").niceScroll({
        touchbehavior : false,
        cursorcolor : "#999999",
        cursorborder : "none",
        background : "#ffffff",
        cursoropacitymax : 1,
        cursorborderradius : 0,
        cursorwidth : 5,
        cursorfixedheight : 60,
        autohidemode : false
    });

    $('a.gEmIndexItemImg').mouseenter(function () {
        $(this).find('.hiddenLink').animate({left: 0});
    });
    $('a.gEmIndexItemImg').mouseleave(function () {
        $(this).find('.hiddenLink').animate({left: -256});
    });
    //левое меню
    $('.gEmSidebarMenuTitle').click(function () {
        $(this).next('ul.gEmSidebarMenuList').slideToggle(200);
        $(this).toggleClass('active', 200);
    });
    // верхнее меню
    //proccessTopMenu();

    // авторизация пользователя
    processLogin();
});

$(function() {
    $.fn.scrollToTop = function() {
        $(this).hide().removeAttr("href");
        if ($(window).scrollTop() >= "200") $(this).fadeIn("slow")
        var scrollDiv = $(this);
        $(window).scroll(function() {
            if ($(window).scrollTop() <= "200") $(scrollDiv).fadeOut("slow")
            else $(scrollDiv).fadeIn("slow")
        });
        $(this).click(function() {
            $("html, body").animate({scrollTop: 0}, "slow")
        })
    }
});
$(function() {
    $("#Go_Top").scrollToTop();
});

// test data
var dataBase = [
    {
        idx: 100,
        logo: "img/bars1.png",
        name: "СHEESE CAKE SNEZHNY BARS#1",
        breed: "Британский к/ш, BRI",
        color: "Чёрный затушёванный пойнт",
        color_code: "BRI ns 12 31",
        birth: "13.07.2009",
        father: 200,
        mother: 201,
        category: "catChildren",
        url: "cats-m-item.html",
        state: "Продается"
    },
    {
        idx: 110,
        logo: "img/bars2.png",
        name: "СHEESE CAKE SNEZHNY BARS#2",
        breed: "Британская к/ш, BRI",
        color: "Чёрный затушёванный пойнт",
        color_code: "BRI ns 12 32",
        birth: "13.07.2011",
        father: 200,
        mother: 201,
        category: "catChildren",
        url: "cats-m-item.html",
        state: "Продается"
    },
    {
        idx: 200,
        logo: "img/index-cat.jpg",
        name: "Diamond-Pro Grand Bear",
        breed: "Британский к/ш, BRI",
        color: "Чёрный затушёванный пойнт",
        color_code: "BRI ns 12 33",
        birth: "13.07.2009",
        father: null,
        mother: null,
        category: "catMale",
        url: "cats-m-item.html",
        state: null
    },
    {
        idx: 201,
        logo: "img/index-cat.jpg",
        name: "Diamond-Pro Katalina",
        breed: "Британский к/ш, BRI",
        color: "Чёрный затушёванный пойнт",
        color_code: "BRI ns 12 34",
        birth: "13.07.2009",
        father: null,
        mother: null,
        category: "catFemale",
        url: "cats-m-item.html",
        state: null
    }
];

var pageList = [
    {
        text: 'О питомнике',
        url: 'about.html',
        category: 'mainPage'
    },
    {
        text: 'Акции',
        url: 'cats-m-list.html',
        category: 'stock'
    },
    {
        text: 'Шляпки',
        url: 'cats-m-list.html',
        category: 'hat'
    },
    {
        text: 'Наши коты',
        url: 'cats-m-list.html',
        category: 'catMale'
    },
    {
        text: 'Наши кошки',
        url: 'cats-m-list.html',
        category: 'catFemale'
    },
    {
        text: 'Котята',
        url: 'cats-m-list.html',
        category: 'catChildren'
    },
    {
        text: 'Котята друзей',
        url: 'cats-m-list.html',
        category: 'catChildrenFriends'
    }
];

function proccessTopMenu_old() {
    var arr = [];
    var gEmMenuList = $('.gEmMenu .gEmMenuList');
    gEmMenuList.html('');
    for (var i in pageList) {
        var li = $('<li></li>').appendTo(gEmMenuList);
        var a = $('<a></a>').appendTo(li);
        a.attr('index', i);
        pageList[i].index = i;
        a.text(pageList[i].text);
        a.click(function () {
            topMenuItemClick( $(this) );

            var pageItem = pageList[ $(this).attr('index') ];
            displayPage( pageItem.url, pageItem );
        });
        arr.push(a);
    }
    arr[0].addClass('firstChild');
    arr[arr.length - 1].addClass('lastChild');
    arr[0].click();
}

function topMenuItemClick(self){
    $('.gEmMenuList li a').each(function () {
        $(this).removeClass("active");
    });
    self.addClass("active");
}

function displayPage(url, pageItem, cb) {
    $.get(url, function (data) {
        //console.log( $('.gEmSectionRight', $(data)) );
        $('.gEmSectionRight').replaceWith( $('.gEmSectionRight', $(data)) );

        if ($('.pageIndex').length > 0) {
            displayList(pageItem, getDbByCategory(pageItem.category));
        }

        if ($('.pageSingle').length > 0) {
            displaySingle(pageItem);
        }

        if(cb) cb();
    });
}

function deleteParentTag(tag, tagName){
    var p = tag;
    while(p.get(0).tagName.toLowerCase()!=tagName.toLowerCase()){
        p = p.parent();
        if(!p.length){
            break;
        }
    }
    if(p.length){
        p.remove();
    }
}

function displaySingle(pageItem) {
    console.log('displaySingle', pageItem, getDbItemByIdx(pageItem.cat_idx));
    //getDbItemByIdx(pageItem.cat_idx);
    var pageSingle = $('.pageSingle');
    var dbItem = getDbItemByIdx(pageItem.cat_idx);
    for(var dbFieldName in dbItem){
        // pageSingle

        var pageField = $('#text_'+dbFieldName, pageSingle);

        if('category'==dbFieldName){
            var sc;
            for(var i in pageList){
                if(pageList[i].category==dbItem.category){
                    sc = pageList[i];
                    break;
                }
            }
            console.log( $('[index="'+sc.index+'"]') );
            $('.gEmBreadcrumbsBox').text( sc.text );
            topMenuItemClick( $('[index="'+sc.index+'"]') );
        }

        if(pageField.length>0){
            if(!dbItem[dbFieldName]){
                if('state'==dbFieldName){
                    deleteParentTag(pageField, 'div');
                } else {
                    deleteParentTag(pageField, 'p');
                }
            } else {
                pageField.text( dbItem[dbFieldName] );
            }
            continue;
        }

        pageField = $('#cat_link_'+dbFieldName, pageSingle);
        if(pageField.length>0){
            var parentsDbItem = getDbItemByIdx(dbItem[dbFieldName]);
            if(parentsDbItem){
                pageField.text( parentsDbItem.name + '; ' + parentsDbItem.color_code );
                pageField.attr('cat_idx', dbItem[dbFieldName]);
                pageField.click(function(){
                    //console.log('displaySingle cat num=', $(this).attr('cat_idx'));
                    pageItem.cat_idx = $(this).attr('cat_idx');
                    displayPage(dbItem.url, pageItem);
                });
            } else {
                deleteParentTag(pageField, 'p');
            }

            continue;
        }

        pageField = $('#attr_src_'+dbFieldName, pageSingle);
        if(pageField.length>0){
            pageField.attr('src', dbItem[dbFieldName] );
            //pageField.parent().removeAttribute('href');
            pageField.attr('cat_idx', dbItem.idx);
            pageField.click(function(){
                pageItem.cat_idx = $(this).attr('cat_idx');
                displayPage(dbItem.url, pageItem);
            });

            continue;
        }
    }
}

function getDbByCategory(categoryName) {
    var a = [];
    for(var i in dataBase){
        if(dataBase[i].category==categoryName){
            a.push(dataBase[i]);
        }
    }
    return a;
}

function displayList(pageItem, dbList) {
    //console.log('displayList', pageItem, dbList);
    var gEmBreadcrumbsBox = $('.gEmBreadcrumbsBox:first').clone();
    var gEmIndexItemBox = $('.gEmIndexItemBox:first').clone();
    var pageIndexSeparator = $('.pageIndexSeparator:first').clone();

    var pageIndex = $('.pageIndex');
    pageIndex.html('');
    gEmBreadcrumbsBox.text(pageItem.text).appendTo(pageIndex);

    for (var i in dbList) {
        var pageListItem = gEmIndexItemBox.clone();
        pageListItem.appendTo(pageIndex);

        var dbItem = dbList[i];
        for(var dbFieldName in dbItem){
            var pageListItemField = $('#text_'+dbFieldName, pageListItem);

            if(pageListItemField.length>0){

                //console.log('pageListItemField', pageListItemField);

                if(!dbItem[dbFieldName]){
                    if('state'==dbFieldName){
                        deleteParentTag(pageListItemField, 'div');
                    } else {
                        deleteParentTag(pageListItemField, 'p');
                    }
                } else {
                    pageListItemField.text( dbItem[dbFieldName] );
                }

                continue;
            }

            pageListItemField = $('#attr_src_'+dbFieldName, pageListItem);
            if(pageListItemField.length>0){
                pageListItemField.attr('src', dbItem[dbFieldName] );
                //pageListItemField.parent().removeAttribute('href');
                pageListItemField.attr('cat_idx', dbItem.idx);
                pageListItemField.click(function(){
                    pageItem.cat_idx = $(this).attr('cat_idx');
                    displayPage(dbItem.url, pageItem);
                });

                continue;
            }

            pageListItemField = $('#cat_link_'+dbFieldName, pageListItem);
            if(pageListItemField.length>0){
                var parentsDbItem = getDbItemByIdx(dbItem[dbFieldName]);
                if(parentsDbItem){
                    pageListItemField.text( parentsDbItem.name + '; ' + parentsDbItem.color_code );
                    pageListItemField.attr('cat_idx', dbItem[dbFieldName]);
                    pageListItemField.click(function(){
                        //console.log('displaySingle cat num=', $(this).attr('cat_idx'));
                        pageItem.cat_idx = $(this).attr('cat_idx');
                        displayPage(dbItem.url, pageItem);
                    });
                } else {
                    deleteParentTag(pageListItemField, 'p');
                }

                continue;
            }
        }

        if(i!=dbList.length-1){
            pageIndexSeparator.clone().appendTo( pageIndex );
        }
    }
}

function getDbItemByIdx(idx){
    for(var i in dataBase){
        if(dataBase[i].idx==idx){
            return dataBase[i];
        }
    }
    return false;
}

function processLogin(){
    $('#exit_button').parent().hide();
    $('#enter_button').click(function(){
        if(''==$('#user_name').val()){
            $('#login_hint').text('Пустое имя');
        } else if(''==$('#user_pass').val()){
            $('#login_hint').text('Пустой пароль');
        } else {
            db.login($('#user_name').val(), $('#user_pass').val(), function(e,o){
                if(e){
                    $('#logged_as').text('Вход на сайт');
                    $('#login_box').show();
                    $('#login_hint').text(e);
                    $('#exit_button').parent().hide();
                } else {
                    $('#login_box').hide();
                    $('#logged_as').text(o);
                    $('#exit_button').parent().show();
                }
            });
        }
    });
    $('#exit_button').click(function(){
        $('#exit_button').parent().hide();
        db.logout(function(){
            $('#user_pass').val('');
            $('#logged_as').text('Вход на сайт');
            $('#login_box').show();
            $('#login_hint').text('');
        });
    });

    $('#admin_button').click(function(){
        db.getAll(function(e,arr){
            if(e){
                console.log(e);
                return;
            }

            if(!Array.isArray(arr)){
                arr = [ arr ];
            }

            console.log(arr);
            $('.gEmSectionRight').html('');
            var content = $('<div id="db_append_form"></div>').appendTo( $('.gEmSectionRight') );

            for(var fiend_name in arr[0]){
                if(-1==['id', 'created', 'user', 'confirmed'].indexOf(fiend_name)){
                    var type_text = $('<span>'+translate_db_field[fiend_name]+': '+'<input type="text" id="db_'+fiend_name+
                        '" value="'+arr[0][fiend_name]+'">'+
                        '<br></span>').appendTo(content);
                    $('#db_'+fiend_name).css('color', '#808080');
                    $('#db_'+fiend_name).click(function(){
                        $(this).css('color', '#000');
                        $(this).val('');
                        $(this).attr('edited', 'true');
                    });
                }
            }
            $('<input type="button" id="db_add_row" value="Добавить">').appendTo(content);
            $('#db_add_row').click(function(){
                var add_fields = [];

                $('#db_append_form').find("[edited='true']").each(function(){
                    add_fields.push( $(this).attr('id').replace(/db_/, '') );
                });
                console.log(add_fields);
            });
        });
    });
}

var translate_db_field = {
    logo: "Логотип",
    name: "Имя",
    breed: "Порода",
    color: "Цвет",
    color_code: "Код цвета",
    birth: "Дата рождения",
    father: "Отец",
    mother: "Мать",
    sex: "Пол",
    type: "Тип",
    state: "Статус"
};

function createCatList(){

}
