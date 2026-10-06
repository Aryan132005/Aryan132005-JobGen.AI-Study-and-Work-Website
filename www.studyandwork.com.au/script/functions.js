//***************************
// FlexSlider Loader
//***************************

jQuery(window).load(function() {
    jQuery(".ec-loading-section").fadeOut("slow");
});

( function ( $ ) {
    'use strict';
    jQuery(document).ready(function($) {
 
        //***************************
        // FlexSlider Function
        //***************************
        jQuery('.flexslider').flexslider({
            animation: "slide",
            prevText: "<em class='fa fa-angle-left'></em>",
            nextText: "<em class='fa fa-angle-right'></em>",
            start: function(slider) {
                jQuery('body').removeClass('loading');
            }
        });

        jQuery('.ec-twitter').flexslider({
            animation: "fade",
            prevText: "<em class='fa fa-angle-left'></em>",
            nextText: "<em class='fa fa-angle-right'></em>",
            start: function(slider) {
                jQuery('body').removeClass('loading');
            }
        });

        //***************************
        // Click to Top Button
        //***************************
        
		// hide #back-top first
	$(".backtop-btn").hide();
	
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 500) {
				$('.backtop-btn').fadeIn(500);
			} else {
				$('.backtop-btn').fadeOut(500);
			}
		});

	  // scroll body to 0px on click
		$('.backtop-btn').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});

        //***************************
        // Countdown Function
        //***************************
        jQuery(function() {
            var austDay = new Date();
            austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
            jQuery('#Countdown').countdown({
                until: austDay
            });
            jQuery('#year').text(austDay.getFullYear());
        });

        //***************************
        // PrettyPhoto Function
        //***************************
        jQuery("area[data-rel^='prettyPhoto']").prettyPhoto();

        jQuery(".gallery:first a[data-rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'normal',
            theme: 'light_square',
            slideshow: 3000,
            autoplay_slideshow: true
        });
        jQuery(".gallery:gt(0) a[data-rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'fast',
            slideshow: 10000,
            hideflash: true
        });

        jQuery("#custom_content a[data-rel^='prettyPhoto']:first").prettyPhoto({
            custom_markup: '<div id="map_canvas" style="width:260px; height:265px"></div>',
            changepicturecallback: function() {
                initialize();
            }
        });

        jQuery("#custom_content a[data-rel^='prettyPhoto']:last").prettyPhoto({
            custom_markup: '<div id="bsap_1259344" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div><div id="bsap_1237859" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6" style="height:260px"></div><div id="bsap_1251710" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div>',
            changepicturecallback: function() {
                _bsap.exec();
            }
        });

        //***************************
        // Owl Carousel
        //***************************
        var owl = $(".owl-carousel");
        owl.owlCarousel({
            items: 4,
            margin: 30,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 2,
                    nav: true
                },
                1000: {
                    items: 4,
                    nav: true
                }
            },
            autoplay: true,
            autoplayTimeout: 1000,
            autoplayHoverPause: true,
            nav: true,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
        });

        //***************************
        // Responsive Video Function
        //***************************
        jQuery(".ec-main-content").fitVids();

        //***************************
        // Responsive Menu Function
        //***************************
        jQuery(function() {
            jQuery('#as-menu').asmenu();
        });

        //***************************
        // WordCounter Function
        //***************************
        jQuery(".word-count").counterUp({
            delay: 10,
            time: 1000
        });

        //***************************
        // Trigger ColorSwitcher Function
        //***************************
       jQuery(".ec-handle").click(function(){
          jQuery(".ec-colorswitcher").trigger('click')
          jQuery(this).toggleClass('btnclose');
          jQuery(".ec-colorswitcher") .toggleClass('sidebarmain');
          return false;
        });
       jQuery('.ec-boxed').on('click', function(){
          jQuery(".ec-main-wrapper").addClass('wrapper-boxed');
          jQuery(".ec-main-wrapper").removeClass('wrapper-wide');
      });
      jQuery('.ec-wide').on('click', function(){
          jQuery(".ec-main-wrapper").addClass('wrapper-wide');
          jQuery(".ec-main-wrapper").removeClass('wrapper-boxed');
      });

    });
} ( jQuery ) )

//===========   DatePicker FuncTion //
 jQuery(function() {
    jQuery('#datetimepicker2').datetimepicker({
      pickTime: true
    });
  });

 jQuery(function() {
    jQuery('#datetimepicker3').datetimepicker({
      pickDate: false
    });
  });
  
  
  
  


//***************************
// Parallax Function
//***************************
function fullscreenFix(){var a=$("body").height();$(".content-b").each(function(){$(this).innerHeight()<=a&&$(this).closest(".fullscreen").addClass("not-overflow")})}function backgroundResize(){var a=$(window).height();$(".background").each(function(){var i=$(this),t=i.width(),e=i.height(),s=i.attr("data-img-width"),o=i.attr("data-img-height"),n=s/o,r=parseFloat(i.attr("data-diff"));r=r?r:0;var c=0;if(i.hasClass("parallax")&&!$("html").hasClass("touch")){c=a-e}o=e+c+r,s=o*n,t>s&&(s=t,o=s/n),i.data("resized-imgW",s),i.data("resized-imgH",o),i.css("background-size",s+"px "+o+"px")})}function parallaxPosition(){var a=$(window).height(),i=$(window).scrollTop(),t=i+a,e=(i+t)/2;$(".parallax").each(function(){var s=$(this),o=s.height(),n=s.offset().top,r=n+o;if(t>n&&r>i){var c=(s.data("resized-imgW"),s.data("resized-imgH")),l=0,d=-c+a,h=a>o?c-o:c-a;n-=h,r+=h;var u=l+(d-l)*(e-n)/(r-n),g=s.attr("data-oriz-pos");g=g?g:"50%",$(this).css("background-position",g+" "+u+"px")}})}"ontouchstart"in window&&(document.documentElement.className=document.documentElement.className+" touch"),$("html").hasClass("touch")||$(".parallax").css("background-attachment","fixed"),$(window).resize(fullscreenFix),fullscreenFix(),$(window).resize(backgroundResize),$(window).focus(backgroundResize),backgroundResize(),$("html").hasClass("touch")||($(window).resize(parallaxPosition),$(window).scroll(parallaxPosition),parallaxPosition());



   $(window).on('load',function(){
    var delayMs = 1500; // delay in milliseconds

    setTimeout(function(){
        $('#myModal').modal('show');
    }, delayMs);
});  

