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
});