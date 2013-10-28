var catList = [];

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
            url:"php/db.php",
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
    proccessTopMenu();

    // авторизация пользователя
    processLogin();
});

function topMenuItemClick(self){
    $('.gEmMenuList li a').each(function () {
        $(this).removeClass("active");
    });
    self.addClass("active");

    $('#pageSales').click(function(){

    });
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

// dropzone
$(function() {

    $('#upload_all').click(function(){
        console.log($(this)) ;
        $.get('upload.php', function(data){
            console.log('data', data);

        });
    });

    previewTemplate = $.trim($('#dz-preview-template').hide().html());

    options = {
        //url: 'http://www.torrentplease.com/dropzone.php',
        url : 'jdb/upload.php',
        paramName: "userfile",
        clickable: true,
        previewTemplate: previewTemplate,
        parallelUploads: 3,
        thumbnailWIdth: 100
    }

    var dropzone = new Dropzone('.dropfiles', options);

    dropzone.on('drop', function(e) {
        $('.dropfiles').removeClass('enter');
    });

    dropzone.on('dragenter', function(e) {
        $('.dropfiles').addClass('enter');
    });

    dropzone.on('dragleave', function(e) {
        $('.dropfiles').removeClass('enter');
    });

    dropzone.on('sending', function(file, xhr, formData) {
        console.log('sending', arguments);
        preview = $(file.previewElement);
        preview.find('.file-progress').fadeIn(20);
    });

    dropzone.on('success', function(file, responce) {
        console.log('success', arguments);

        preview = $(file.previewElement);
        preview.find('.file-progress').fadeOut(20);
        preview.find('.close').on('click', function(e) {
            preview.fadeOut(100, function() {
                dropzone.removeFile(file);
            })
        });
    });

    dropzone.on('removedfile', function(file, serverFileName)
    {
        //fileList['serverFileName'] = {"serverFileName" : serverFileName, "fileName" : file.name };

        alert(file.name);
        alert(serverFileName);
    });

    db.post({ 'action' : 'dir_list', 'dir' : 'uploads'}, function(e,o){
        console.log('dir_list', e||o);
        if(e) return;

        //var mockFile = o[0];//{ name: "banner2.jpg", size: 12345 };
        //dropzone.options.addedfile.call(dropzone, mockFile);
        //dropzone.options.thumbnail.call(dropzone, mockFile, "http://goldenempire.com.ua/uploads/"+o[0]);
        dropzone.emit("addedfile", o[0]);
    });

});