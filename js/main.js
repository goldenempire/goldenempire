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

var main = {
    is_logged : true,
	scroll : function(){
		var aTag = $('.gEmMenu');
		$('html, body').animate({scrollTop: aTag.offset().top},'slow');
	},
	fill_page : function(tag, in_item){
		var self = this;
		var item = jQuery.extend(true, {}, in_item);
		var father = item.father;
		var mother = item.mother;
		if(item.father){
			item.father = item.father.name;
		}
		if(item.mother){
			item.mother = item.mother.name;
		}

		for(var db_field_name in item){
			$("[id^='db_"+db_field_name+"']", tag).each(function(){
				var pageItem = $(this);
				if(!item[db_field_name]){
					pageItem.hide();
				} else {
					if(-1!=pageItem.attr('id').indexOf('_text')){
						if($('span',pageItem).length){
							$('span',pageItem).text( item[db_field_name] );
						} else {
							pageItem.text( item[db_field_name] );
						}
					} else if(-1!=pageItem.attr('id').indexOf('_src')){
						pageItem.attr('src', item[db_field_name]);
					}
				}
			});
		}

		$('[id*="father"]', tag).click(function(){
			self.get_one(father.id);
		});
		$('[id*="mother"]', tag).click(function(){
			self.get_one(mother.id);
		});

		// todo not 2 click when single
		$('#db_logo_src', tag).click(function(){
			self.get_one(item.id);
		});
	},
	get_one : function(item_id){
		var self = this;
		self.post({ 'action': 'get_one', 'item_id': item_id }, function(item){
			// сюда не прийдем если ошибка

			self.scroll();

			var pageSingle = $('#pageSingle').clone();
			pageSingle.removeClass('hiddenTemplate');
			pageSingle.attr('id', 'pageDisplay');

			self.fill_page(pageSingle, item);

			var parent = $('#pageDisplay').parent();
			$('#pageDisplay').remove();
			pageSingle.appendTo(parent);

			// заполняем родословную
			//console.log( $('.gEmPedigreeTable [rowspan=4]', pageSingle));
			var fatherTag = $('.gEmPedigreeTable [rowspan=4]:eq(0)', pageSingle);
			if(item.father) {
				fatherTag.find('.gEmPedigreeTableItemDesc').text( item.father.name+', '+item.father.breed );
				fatherTag.find('img').attr('src', item.father.logo);
			}
			fatherTag.click(function(){
				self.get_one(item.father.id);
			});

			var motherTag = $('.gEmPedigreeTable [rowspan=4]:eq(1)', pageSingle);
			if(item.mother) {
				motherTag.find('.gEmPedigreeTableItemDesc').text( item.mother.name+', '+item.mother.breed );
				motherTag.find('img').attr('src', item.mother.logo);
			}
			motherTag.click(function(){
				self.get_one(item.mother.id);
			});

			//console.log( fatherTag, motherTag);

			$('.gEmMenuList li span').each(function () {
				// todo улучшить
				var menuTag = $(this);
				$(this).removeClass("active");
				//console.log('---', $(this).attr('category'), item.category, $(this).attr('category')==item.category);
				if($(this).attr('category')==item.category){
					$(this).addClass("active");
					$('.gEmBreadcrumbsBox', pageSingle).empty();
					$('<span></span>')
						.text(menuTag.text())
						.appendTo( $('.gEmBreadcrumbsBox', pageSingle) )
						.click(function(){
							//console.log('clicked!!!');
							self.get_list( item.category );
						});
					$('<span></span>').text(' > '+item.name).appendTo( $('.gEmBreadcrumbsBox', pageSingle) );

				}
			});

			// todo
			// заполнять галерею
		});
	},
	get_list : function(category){
		var self = this;
		self.post({ 'action': 'get_list', 'category': category }, function(items){
			console.log(items);

			var pageList = $('#pageList').clone();

			//console.log(pageList);
			var tagListItemTemplate = $('.gEmIndexItemBox', pageList).clone();
			var tagListSeparatorTemplate = $('.pageIndexSeparator', pageList).clone();
			pageList.empty();

			for(var i in items){
				var tagListItem = tagListItemTemplate.clone();
				self.fill_page(tagListItem, items[i]);
				tagListItem.appendTo(pageList);

				if(i!=items.length-1){
					var tagListSeparator = tagListSeparatorTemplate.clone();
					tagListSeparator.appendTo(pageList);
				}
			}

			var parent = $('#pageDisplay').parent();
			$('#pageDisplay').remove();
			pageList.removeClass('hiddenTemplate');
			pageList.attr('id', 'pageDisplay');
			pageList.appendTo(parent);
		});
	},
    update : function(arr, cb){
        this.post({ action: "update", data: arr }, cb);
    },
    getAll : function(cb){
        this.post({ action: "getAll" }, cb);
    },
    login : function(){
        $('#login_hint').text('');
        var self = this;
        if(!self.is_logged){
            var user_name = $('#user_name').val();
            var user_pass = $('#user_pass').val();
            if(!user_name || !user_pass){
                var text = 'Введите логин';
                if(!user_pass){
                    text = 'Введите пароль';
                }
                $('#login_hint').text(text);
            } else {
                self.post({ 'user_name' : user_name, 'user_pass' : user_pass, action: "login" }, function(user_name, err){
                    if(err){
                        $('#login_hint').text(err);
                    } else {
                        //console.log('welcome ', user_name);
                        $('#login_box').hide();
                        $('#greeting_box').show();
                        $('#admin_box').show();
                        self.is_logged = true;
                        self.user_name = user_name;
                        $('#full_user_name').text(user_name);
                        //$('#enter_button').val('Выйти');
                    }
                });
            }
        } else {
            self.logout();
        }
    },
    upload : function(item_id, cb){
        var self = this;

        var file_data = $("#upload_file_input").prop("files")[0];   // Getting the properties of file from file field

        if(file_data.size>1*1024*1024){
            alert('Изображение превышает 1мб');
            return;
        }

        console.log('file_data', file_data);

        var file_name = item_id+file_data.name.replace(/.*(\.\w+)$/, '$1');

        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append("uploadedfile", file_data);              // Appending parameter named file with properties of file_field to form_data
        form_data.append("file_name", file_name);                 // Adding extra parameters to form_data

        //var data = new FormData();
        //data.append('file',this.files[0]);
        //data.append('uploadedfile',file_data);
        $.ajax({
            url: "php/upload.php",
            /*
             cache: false,
             contentType: false,
             processData: false,
             data: file_data,                         // Setting the data attribute of ajax with file_data
             type: 'post',
             */
            url: "php/upload.php",
            type: "POST",
            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('uploaded ok!', data);
                self.set_logo(item_id, 'img/'+file_name, cb)
            },
            error: function (data) {
                console.log(data.imageURL + "error");
            }
        });
    },
    set_logo : function(id, file_name, cb){
        //var file_data = $("#upload_file_input").prop("files")[0];

        this.post({ action: "set_logo", "file_name" : file_name, 'id' : id }, cb);
    },
    insert : function(cb){
        //var file_data = $("#upload_file_input").prop("files")[0];

        this.post({
            action: "insert",
            //logo : 'img/'+file_data.name,
            logo : '',
            name : $('#db_name').val(),
            breed : $('#db_breed').val(),
            color : $('#db_color').val(),
            color_code : $('#db_color_code').val(),
            birth : $('#db_birth').val(),
            father : 'NULL',
            mother : 'NULL',
            litter : $('#db_litter').val(),
            sex : $('#db_sex').val(),
            type : $('#db_type').val(),
            //category : $('#db_category').val(),
            category : $('input[name=category]:checked', '#db_category').val(),
            state : $('#db_state').val()
        }, cb);
    },
    logout : function(){
        /*
        $('#login_hint').text('');
        $('#greeting_box').hide();
        $('#admin_box').hide();
        var self = this;
        if(self.is_logged){
            $('#exit_button').click();
        }*/
        var self = this;
        self.post({ action: "logout" }, function(data){
            $('#login_box').show();
            $('#greeting_box').hide();
            $('#admin_box').hide();
            self.is_logged = false;
            //$('#enter_button').val('Войти');
            $('#user_pass').val('');
            $('#full_user_name').text('...');
        });
    },
    post : function(rq_data, cb){
        $.ajax({
            url:"php/router.php",
            type: "POST",
            data: rq_data,
            dataType:"json",
            success: function(rs_data){
                console.log('rq_data',rq_data);
                console.log('rs_data',rs_data);
                if((rs_data||{}).error){
					console.log('rs_data.error', rs_data.error);
                    cb(null, rs_data.error);
                } else {
                    cb(rs_data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('post error', xhr.responseText, xhr, ajaxOptions, thrownError);
            }
        });
    }
};

$(document).ready(function () {

    main.login();

	//main.get_one(3);
	//console.log( $(location).attr('href') );
	//console.log( $("[page^='pageAbout']") );
	//$("[page^='pageAbout']").click();

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
    topMenuItemClick();

    // авторизация пользователя
    //processLogin();

    $('#enter_button').click(function(){
        main.login();
    });

    $('#exit_button').click(function(){
        main.logout();
    });

    $('#admin_button').click(function(){
        $('.gEmSectionRight [id^=page]').removeClass('hiddenTemplate');
        $('.gEmSectionRight [id^=page]').addClass('hiddenTemplate');
        $('#pageAdmin').removeClass('hiddenTemplate');
    });

    //$('#ajax_add_file').click(function(){
    $('#db_add_row').click(function(){
        main.insert(function(item_id){
            console.log('main.insert', arguments);
            main.upload(item_id, function(){
            });
        });
    });

});

function topMenuItemClick(){
    $('.gEmMenuList li span').click(function () {
        $('.gEmMenuList li span').each(function () {
			$(this).removeClass("active");
        });
        $(this).addClass("active");


        $('#pageAdmin').addClass('hiddenTemplate');
		$('.gEmSectionRight [id^=page]').removeClass('hiddenTemplate');
		$('.gEmSectionRight [id^=page]').addClass('hiddenTemplate');
		if('pageAbout'==$(this).attr('page')){
			$('#pageAbout').removeClass('hiddenTemplate');
		} else if('pageList'==$(this).attr('page')){
			main.get_list( $(this).attr('category') );
		}
    });

	$("[page^='pageAbout']").click();
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
/*
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
*/