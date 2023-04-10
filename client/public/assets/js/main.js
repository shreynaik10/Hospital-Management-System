(function ($) {
    'use strict';

	/*------------- preloader js --------------*/
	function loader() {
		$(window).on('load', function () {
			$('#ctn-preloader').addClass('loaded');
			$("#loading").fadeOut(500);
			// Una vez haya terminado el preloader aparezca el scroll

			if ($('#ctn-preloader').hasClass('loaded')) {
				// Es para que una vez que se haya ido el preloader se elimine toda la seccion preloader
				$('#preloader').delay(900).queue(function () {
					$(this).remove();
				});
			}
		});
	}
	loader();


	// sticky
	var wind = $(window);
	var sticky = $('#sticky-header');
	wind.on('scroll', function () {
		var scroll = wind.scrollTop();
		if (scroll < 100) {
			sticky.removeClass('sticky-on');
		} else {
			sticky.addClass('sticky-on');
		}
	});

	// data - background image
	$("[data-background]").each(function () {
		$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
	})
	// data - color
	$("[data-bg-color]").each(function () {
		$(this).css("background", $(this).attr("data-bg-color"))
	})

	// active mobile-menu
	jQuery('#mobile-menu').meanmenu({
		meanScreenWidth: '991',
		meanMenuContainer: '.mobile-menu'
	});

	// Activate hero slider
	var slider = $('.hero-slider, .hero-slider-area-2');
	slider.owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		margin: 0,
		smartSpeed: 800,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut',
		loop: true,
		slideSpeed: 3000,
		nav: false,
		dots: false,
		navText: ["<i class='fal fa-angle-left'></i>", "<i class='fal fa-angle-right'></i>"],
		//autoplay: true,
	});

	slider.on('translate.owl.carousel', function () {
		var layer = $("[data-animation]");
		layer.each(function () {
			var s_animation = $(this).data('animation');
			$(this).removeClass('animated ' + s_animation).css('opacity', '0');
		});
	});

	$("[data-delay]").each(function () {
		var animation_del = $(this).data('delay');
		$(this).css('animation-delay', animation_del);
	});

	$("[data-duration]").each(function () {
		var animation_dur = $(this).data('duration');
		$(this).css('animation-duration', animation_dur);
	});

	slider.on('translated.owl.carousel', function () {
		var layer = slider.find('.owl-item.active').find("[data-animation]");
		layer.each(function () {
			var s_animation = $(this).data('animation');
			$(this).addClass('animated ' + s_animation).css("opacity", "1");
		});
	});

	// feature-carousel active
	$('.feature-carousel').owlCarousel({
		loop: true,
		smartSpeed: 800,
		nav: true,
		dots: true,
		margin: 30,
		navText: ["<i class='fal fa-angle-left'></i>", "<i class='fal fa-angle-right'></i>"],
		//autoplay: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			768: {
				items: 2
			},
			1200: {
				items: 3
			}
		}
	});

	// doctor-carousel active
	$('.doctor-carousel').owlCarousel({
		loop: true,
		smartSpeed: 800,
		nav: false,
		dots: false,
		navText: ["<i class='fal fa-angle-left'></i>", "<i class='fal fa-angle-right'></i>"],
		//autoplay: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			576: {
				items: 2
			},
			992: {
				items: 3
			},
			1200: {
				items: 4
			},
			1500: {
				items: 5
			}
		}
	});

	// doctor-carousel active
	$('.brand-carousel').owlCarousel({
		loop: true,
		smartSpeed: 800,
		nav: false,
		dots: false,
		margin: 30,
		navText: ["<i class='fal fa-angle-left'></i>", "<i class='fal fa-angle-right'></i>"],
		//autoplay: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			576: {
				items: 2
			},
			992: {
				items: 3
			},
			1200: {
				items: 4
			},
			1500: {
				items: 5
			}
		}
	});

	// case-active
	if ($(".gallery-active").length) {
		$('.gallery-active').slick({
			dots: false,
			arrows: true,
			infinite: true,
			speed: 300,
			prevArrow: '<button type="button" class="slick-prev"><i class="far fa-long-arrow-left"></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i class="far fa-long-arrow-right"></i></button>',
			slidesToScroll: 1,
			centerMode: true,
			centerPadding: '250px',
			slidesToShow: 2,
			responsive: [
				{
					breakpoint: 1500,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
						centerPadding: '100px',
					}
				},
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerPadding: '250px',
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerPadding: '150px',
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerPadding: '0px',
						arrows: false,
					}
				},
				{
					breakpoint: 550,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerPadding: '0px',
						arrows: false,
					}
				}
			]
		});
	}
	// doctor-carousel active
	$('.doctor-carousel-2').owlCarousel({
		items: 4,
		loop: true,
		smartSpeed: 800,
		nav: false,
		dots: false,
		autoWidth: true,
		//autoplay: true,
		center: true,
		responsiveClass: true,
	});

	// doctor-carousel active
	$('.service-carousel').owlCarousel({
		items: 1,
		loop: true,
		smartSpeed: 800,
		animateOut: 'slideOutDown',
		animateIn: 'slideInDown',
		nav: false,
		dots: false,
		nav: true,
		navText: ["<i class='fal fa-arrow-left'></i>", "<i class='fal fa-arrow-right'></i>"],
		dots: false,
		//autoplay: true,
	});

	// postbox_gallery active
	$('.postbox_gallery').owlCarousel({
		items: 1,
		loop: true,
		smartSpeed: 800,
		nav: false,
		dots: false,
		nav: true,
		navText: ["<i class='fal fa-arrow-left'></i>", "<i class='fal fa-arrow-right'></i>"],
		dots: false,
		//autoplay: true,
	});

	// Activate counter
	$('.counter').countUp({
		'time': 1500,
		'delay': 10
	});

	// Activate scroll to top
	$("#scroll-top").on('click', function () {
		$('html , body').animate({
			scrollTop: 0
		}, 1000);
	});

	// Nice select
	$('select').niceSelect();

	// Access instance of plugin
	$('.datepicker-here').data('datepicker')

	// offcanvas menu
	$(".hamburger-menu-trigger").on("click", function () {
		$(".extra-info,.offcanvas-overly").addClass("active");
		return false;
	});
	$(".menu-close,.offcanvas-overly").on("click", function () {
		$(".extra-info,.offcanvas-overly").removeClass("active");
	});

	// masonry active
	$('.blog-masonry').imagesLoaded(function () {
		// init Isotope
		var $grid = $('.blog-masonry').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-item',
			}
		});
	});

	// isotop active
	$('.row-portfolio').imagesLoaded(function () {
		// init Isotope
		var $grid = $('.row-portfolio').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-sizer'
			}
		});

		// filter items on button click
		$('.portfolio-filter').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});

	});

	//for menu active class
	$('.portfolio-filter button').on('click', function (event) {
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
		event.preventDefault();
	});

	// Activate lightcase
	$('a[data-rel^=lightcase]').lightcase();

	// Active wow js
	new WOW().init();

	/*-------------------------
		showlogin toggle function
	--------------------------*/
	$('#showlogin').on('click', function () {
		$('#checkout-login').slideToggle(900);
	});

	/*-------------------------
		showcoupon toggle function
	--------------------------*/
	$('#showcoupon').on('click', function () {
		$('#checkout_coupon').slideToggle(900);
	});

	/*-------------------------
		Create an account toggle function
	--------------------------*/
	$('#cbox').on('click', function () {
		$('#cbox_info').slideToggle(900);
	});

	/*-------------------------
		Create an account toggle function
	--------------------------*/
	$('#ship-box').on('click', function () {
		$('#ship-box-info').slideToggle(1000);
	});
	// map active
	function basicmap() {
		// Basic options for a simple Google Map
		// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		var mapOptions = {
			// How zoomed in you want the map to start at (always required)
			zoom: 11,
			scrollwheel: false,
			// The latitude and longitude to center the map (always required)
			center: new google.maps.LatLng(40.6700, -73.9400), // New York
			// This is where you would paste any style found on Snazzy Maps.
			styles: [{
				"stylers": [{
					"hue": "#AADAFF"
				}]
			}, {
				"featureType": "road",
				"elementType": "labels",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [{
					"lightness": 100
				}, {
					"visibility": "simplified"
				}]
			}]
		};
		// Get the HTML DOM element that will contain your map
		// We are using a div with id="map" seen below in the <body>
		var mapElement = document.getElementById('contact-map');

		// Create the Google Map using our element and options defined above
		var map = new google.maps.Map(mapElement, mapOptions);

		// Let's also add a marker while we're at it
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(40.6700, -73.9400),
			map: map,
			icon: "assets/images/icons/map-marker.png",
			title: 'Cryptox'
		});
	}
	if ($('#contact-map').length != 0) {
		google.maps.event.addDomListener(window, 'load', basicmap);
	}

})(jQuery);