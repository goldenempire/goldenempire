$(document).ready(function(){
	//fancybox gallery
	$('.fancybox').fancybox();

	//левое меню
	$('.gEmSidebarMenuTitle').click( function(){
		$(this).next('ul.gEmSidebarMenuList').slideToggle(200);
		$(this).toggleClass('active',200);
	});

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

	//верхнее меню
	proccessTopMenu();
});
// test data
var dataBase = [
    {
        idx: 100,
        logo: 'img/bars1.png',
        name: 'СHEESE CAKE SNEZHNY BARS#1',
        breed: 'Британский к/ш, BRI',
        color: 'Чёрный затушёванный пойнт',
        color_code: 'BRI ns 12 31',
        birth: '13.07.2009',
        father: 200,
        mother: 201,
        category: 'catMale',
        url: 'cats-m-item.html'
    },
    {
        idx: 110,
        logo: 'img/bars2.png',
        name: 'СHEESE CAKE SNEZHNY BARS#2',
        breed: 'Британская к/ш, BRI',
        color: 'Чёрный затушёванный пойнт',
        color_code: 'BRI ns 12 32',
        birth: '13.07.2011',
        father: 200,
        mother: 201,
        category: 'catMale',
        url: 'cats-m-item.html'
    },
    {
        idx: 200,
        logo: 'img/index-cat.jpg',
        name: 'Diamond-Pro Grand Bear',
        breed: 'Британский к/ш, BRI',
        color: 'Чёрный затушёванный пойнт',
        color_code: 'BRI ns 12 33',
        birth: '13.07.2009',
        father: null,
        mother: null,
        category: 'catMale',
        url: 'cats-m-item.html'
    },
    {
        idx: 201,
        logo: 'img/index-cat.jpg',
        name: 'Diamond-Pro Katalina',
        breed: 'Британский к/ш, BRI',
        color: 'Чёрный затушёванный пойнт',
        color_code: 'BRI ns 12 34',
        birth: '13.07.2009',
        father: null,
        mother: null,
        category: 'catFemale',
        url: 'cats-m-item.html'
    }
];

var pageList = [
    {
        text: 'О питомнике',
        url: 'index.html',
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


function proccessTopMenu() {
    var arr = [];
    var gEmMenuList = $('.gEmMenuList');
    gEmMenuList.html('');
    for (var i in pageList) {
        var li = $('<li></li>').appendTo(gEmMenuList);
        var a = $('<a></a>').appendTo(li);
        a.attr('index', i);
        a.text(pageList[i].text);
        a.click(function () {
            topMenuItemClick($(this));
        });
        arr.push(a);
    }
    arr[0].addClass('firstChild');
    arr[arr.length - 1].addClass('lastChild');
    arr[0].click();
}

function displayPage(url, cb) {
    $.get(url, function (data) {
        $('.gEmSectionRight').parent().html(
            $('.gEmSectionRight', $(data)).parent().html()
        );
        cb();
    });
}

function topMenuItemClick(item) {
    var i = item.attr('index');
    var pageItem = pageList[i];
    displayPage(pageItem.url, function(){
        $('.gEmMenuList li a').each(function () {
            $(this).removeClass("active");
        });
        item.addClass("active");

        if ($('.pageIndex').length > 0) {
            displayList(pageItem, getAllByCategory(pageItem.category));
        }

        if ($('.pageSingle').length > 0) {
            displaySingle(pageItem);
        }
    });
}



function displaySingle(pageItem) {

}

function getAllByCategory(categoryName) {
    var a = [];
    for(var i in dataBase){
        if(dataBase[i].category==categoryName){
            a.push(dataBase[i]);
        }
    }
    return a;
}

function displayList(pageItem, dbList) {
    console.log('displayList', pageItem, dbList);
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
                var text = dbItem[dbFieldName];
                if(!text){
                    text = '...';
                }
                pageListItemField.text( text );
                continue;
            }

            pageListItemField = $('#attr_src_'+dbFieldName, pageListItem);
            if(pageListItemField.length>0){
                pageListItemField.attr('src', dbItem[dbFieldName] );
                continue;
            }

            pageListItemField = $('#cat_link_'+dbFieldName, pageListItem);
            if(pageListItemField.length>0){
                var parentsDbItem = getCategoryItemByIdx(dbItem[dbFieldName]);
                if(parentsDbItem){
                    pageListItemField.text( parentsDbItem.name + '; ' + parentsDbItem.color_code );
                    pageListItemField.attr('cat_link', dbItem[dbFieldName]);
                    pageListItemField.click(function(){
                        console.log('displaySingle cat num=', $(this).attr('cat_link'));
                    });
                } else {
                    pageListItemField.text( 'N/A' );
                }

                continue;
            }
        }

        if(i!=dbList.length-1){
            pageIndexSeparator.clone().appendTo( pageIndex );
        }
    }
}

function getCategoryItemByIdx(idx){
    for(var i in dataBase){
        if(dataBase[i].idx==idx){
            return dataBase[i];
        }
    }
    return false;
}

/*
function fillListItemByCategory(categoryName, categoryData, categoryItem) {
    if ('catMale' == categoryName) {
        var gEmIndexItemImg = $('.gEmIndexItemImg', categoryItem);
        gEmIndexItemImg.removeAttr('href');
        $('img', gEmIndexItemImg).attr('src', categoryData.logo);
        //gEmIndexItemImg.attr('idx', categoryData.idx); // TODO or NOT_TODO
        gEmIndexItemImg.click(function () {
            //console.log($(this));
            displayPage(categoryData.url, );
        });
    }
}
*/
