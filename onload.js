$(window).scroll(function(){
var marginTop = $(window).scrollTop();
var limit = $(".container").height() - $(".left-column").height();
    if(marginTop < limit )
        $(".left-column").css("margin-top",marginTop);
});
