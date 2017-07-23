/*
 * May Scripts File
 * Author: Eddie Machado
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/


/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *	// update the viewport, in case the window size has changed
 *	viewport = updateViewportDimensions();
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function


/*
 * Put all your regular jQuery in here.
*/
jQuery(document).ready(function($) {

    /*
    *
    *  f(320)=20
    *  f(1280)=40
    *
    * 40-20
    * -----
    * 1280-320
    *
    * 40
    * ---
    * 960
    *
    * 1/20
    *
    * f(x)=48*x+b
    * f(320)=1/24*320+b=20
    * b = 20 - 15360
    * b = -15340
    *
    *
    *
    * */


    function ratio(x)
    {
        return ((4*x)/181) + 11.71;
    }

    $(window).resize(function(){

        //var agrandissement = 100 + (($(window).width()-320)/1280)*100;
        $('body').css('font-size', ratio($(window).width()) + 'px');

        $('body').addClass('loaded');

    }).trigger('resize');

    var $actual_section = $('.section').first().addClass('active-section');
    var $section_slide_in;
    var $sections = $('.section');
    var first_scroll = 0;

    $(document).scroll(function(){

        if(first_scroll > 10)
        {
            $('.navigation-fixed .inner-navigation').addClass('hidden');
        }
        first_scroll++;

        setScroll();

    }).trigger('scroll');

    function setScroll()
    {
        $sections.each(function(){

            var window_top = $(document).scrollTop() + $('#header-text').height();

            if(    window_top >= $(this).position().top
                && window_top < ($(this).position().top + $(this).outerHeight( true )))
            {
                $actual_section.removeClass('active-section');
                $(this).addClass('active-section');
                $actual_section = $(this);
            }

            if(
                window_top < $(this).position().top
                && $(this).position().top < $(document).scrollTop() + $(window).height())
            {
                $(this).addClass('slide-in');
            }
            else
            {
                $(this).removeClass('slide-in')
            }

            if(    window_top <= ($(this).position().top + $(this).outerHeight( true ))
                && ($(this).position().top + $(this).outerHeight( true )) < $(document).scrollTop() + $(window).height())
            {
                $(this).addClass('slide-out');
            }
            else
            {
                $(this).removeClass('slide-out');
            }
        });

        $('#header-text .inner-header-text .text').html($actual_section.data('header'));
        var text_width = $('#header-text .inner-header-text .text').outerWidth()*102;
        $('#header-text .inner-header-text').outerWidth(text_width);
    }


    $(window).on('resize', function(){
        if($(window).width() >= 768)
        {
            var header_text_height = $('#header-text').height();
            var height = $(window).height() - header_text_height;
            $('.project-images').height(height);
            $('.project-informations').css('min-height', $(window).height());
        }
        else
        {
            $('.project-images').height('auto');
            $('.project-informations').css('min-height', '0px');
        }

        setScroll();

    }).trigger('resize');



    var defile;
    var psinit = 0; // position horizontale de depart
    var pscrnt = psinit;

    setInterval(function(){
        if (!defile) defile = document.getElementById('inner-header-text');
        if (defile) {
            if(pscrnt < ( - defile.offsetWidth) ){
                pscrnt = psinit;
            } else {
                pscrnt+= -1; // pixel par deplacement
            }
            defile.style.left = pscrnt+"px";
        }

    }, 20);

    $('.project-images').each(function(){
        var slider = initslider($(this));
        var gallery = $(this).find('.gallery');

        $(window).on('resize', function(){

            sliderInstance = slider.data('royalSlider');
            sliderInstance.width = 0;
            sliderInstance.height = 0;
            sliderInstance.st.imageScalePadding = gallery.height()*0.06;
            sliderInstance.updateSliderSize(true);

        }).trigger('resize');
    });

    $('#navigation-left').on('click', function(){
       $('#menu').toggleClass('active');
        $('#press').removeClass('active');

        if($('#menu').hasClass('active') || $('#press').hasClass('active'))
            $('#overlay').addClass('active');
    });

    $('#navigation-right').on('click', function(){
       $('#press').toggleClass('active');
        $('#menu').removeClass('active');

        if($('#menu').hasClass('active') || $('#press').hasClass('active'))
            $('#overlay').addClass('active');

    });

    $('.close').on('click', function(){
        $(this).parent('.can-be-closed').removeClass('active');
        $('#overlay').removeClass('active');

    });

    $('#overlay').on('click', function(){
        $(this).removeClass('active');
        $('#press').removeClass('active');
        $('#menu').removeClass('active');
    });


    $(window).on('resize', function(){
        $('#introduction').height($(window).height()-$("#header-text").height());
    }).trigger('resize');

    $('a[href^="#"]').on('click', function(e){
        e.preventDefault();

        var the_id = $(this).attr("href");

        var decalage = $(the_id).offset().top - ($("#header-text").height()) + 1;

        if($(the_id).css('padding-top').replace("px", "") > 0)
            decalage += parseFloat($(the_id).css('padding-top').replace("px", ""));

        //if($(the_id).previousElementSibling section-null

        var $previous_hr = $(the_id).prev('.section-null');
        if($(the_id).prev('.section-null').length > 0)
            decalage -= parseFloat($previous_hr.css('padding-bottom').replace("px", ""));


        /*console.log($(the_id).find(':first-child').prop("tagName"));

        if($(the_id).find(':first-child').tagname == 'hr')
        {
            console.log('commence par un HR');
        }
*/
        $('body').animate({
            scrollTop: decalage
        }, 'slow', function(){


            var text = $(the_id).data('header');
            if($(the_id).hasClass('with-sub-sections')){
                
                text = $(the_id).find('.section').first().data('header');
            }



            $('#header-text .inner-header-text .text').html(text);
            var text_width = $('#header-text .inner-header-text .text').outerWidth()*102;
            $('#header-text .inner-header-text').outerWidth(text_width);
        });

        $(this).parents('.can-be-closed').removeClass('active');
        $('#overlay').removeClass('active');

        return false;
    });

}); /* end of as page load scripts */

function initslider($container){

    slider = $container.find('.gallery');

    slider.royalSlider({
        addActiveClass: true,
        arrowsNav: false,
        controlNavigation: 'none',
        imageScalePadding: slider.height()*0.06,
        autoScaleSlider:false,
        autoHeight: false,
        loop: true,
        transitionSpeed: 500,
        fadeinLoadedSlide: true,
        globalCaption: false,
        keyboardNavEnabled: true,
        globalCaptionInside: false,
        imageAlignCenter:true
    }).data('royalSlider');

    var sliderInstance = slider.data('royalSlider');

    sliderInstance.ev.on('rsAfterInit', function() {

    });

    function updCount() {
        $container.find('.count').html((sliderInstance.currSlideId+1) + '/' + sliderInstance.numSlides);
    }

    sliderInstance.ev.on('rsAfterSlideChange', updCount); updCount();

    return slider;
}
