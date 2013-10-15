$(document).ready(function(){
	$('a.gEmIndexItemImg').mouseenter(function() {
		$(this).find('.hiddenLink').animate({left:0});
	});
	$('a.gEmIndexItemImg').mouseleave( function(){
		$(this).find('.hiddenLink').animate({left:-256});
	});
	//левое меню
	$('.gEmSidebarMenuTitle').click( function(){
		$(this).next('ul.gEmSidebarMenuList').slideToggle(200);
		$(this).toggleClass('active',200);
	});
});