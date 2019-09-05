// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require jquery-3.2.1.min
//= require d3.min.js
//= require c3.min.js
//= require moment.min.js
//= require webcomponents-lite.min.js
//= require /webjars/typeaheadjs/0.11.1/bloodhound.js
//= require_tree .
//= require_self
//= require /webjars/bootstrap/3.3.7-1/js/bootstrap.min
//= require /webjars/bootstrap-tagsinput/0.5/bootstrap-tagsinput
//= require /webjars/typeaheadjs/0.11.1/typeahead.bundle.js

if (typeof jQuery !== 'undefined') {
    (function($) {
        $('#spinner').ajaxStart(function() {
            $(this).fadeIn();
        }).ajaxStop(function() {
            $(this).fadeOut();
        });
    })(jQuery);
}

Function.prototype.debounce = function (delay) {
    var fn = this
    return function () {
        fn.args = arguments
        fn.timeout_id && clearTimeout(fn.timeout_id)
        fn.timeout_id = setTimeout(function () {
            return fn.apply(fn, fn.args)
        }, delay)
    }
}

/*
 * Replace all SVG images with inline SVG
 */
$(document).ready(function () {
	$(document).on('submit', function (event) {
		var elements = Array.prototype.slice.call(this.querySelectorAll('input'));
		var isValid = true;
		for (var i =0; i < elements.length; i++) {
			if (!elements[i].validity.valid){
				isValid = false;
			}
		}
		if (!isValid) {
			event.preventDefault();
		}

	})
    /*
     jQuery('img.svg').each(function(){
     var $img = jQuery(this);
     var imgID = $img.attr('id');
     var imgClass = $img.attr('class');
     var imgURL = $img.attr('src');

     jQuery.get(imgURL, function(data) {
     // Get the SVG tag, ignore the rest
     var $svg = jQuery(data).find('svg');

     // Add replaced image's ID to the new SVG
     if(typeof imgID !== 'undefined') {
     $svg = $svg.attr('id', imgID);
     }
     // Add replaced image's classes to the new SVG
     if(typeof imgClass !== 'undefined') {
     $svg = $svg.attr('class', imgClass+' replaced-svg');
     }

     // Remove any invalid XML tags as per http://validator.w3.org
     $svg = $svg.removeAttr('xmlns:a');

     // Replace image with new SVG
     $img.replaceWith($svg);

     }, 'xml');
     });
     */

    //Nav Hover User UX
    $('.nav-user-item').mouseenter(function () {
        $('.dropdown-toggle', this).trigger('click');
    });
    $('.nav-user-item').mouseleave(function () {
        $('.dropdown-toggle', this).trigger('click');
    });

    //Set Active Icon for Active LI
    if ($('.sub-links li').hasClass('active')) {
        var activeLi = $('.sub-links').find('li.active');
        activeLi.find('img.icon').css("display", "none");
        var selcted = activeLi.find('img.active');
        selcted.css("display", "block");
        activeLi.find('span').css('color', '#479bb9');
    }

    //Set Hover Icon on mouseenter
    $('.sub-links li').mouseenter(function () {
        if (!$(this).hasClass('active')) {
            var liImgs = $(this).find('img.icon');
            liImgs.css("display", "none");
            var hover = $(this).find('img.hover');
            hover.css("display", "block");
        }
    });

    //Remvoe Hover Icon on mouseleave
    $('.sub-links li').mouseleave(function () {
        if (!$(this).hasClass('active')) {
            var liImgs = $(this).find('img.icon');
            liImgs.css("display", "none");
            var def = $(this).find('img.default');
            def.css("display", "block");
        }
    });

    //Set Selected on Click
    $('.sub-links li').on("click", function () {
        /*
         if (!$(this).hasClass('active')) {
         var liImgs = $(this).find('img.icon');
         liImgs.css("display", "none");
         var selected = $(this).find('img.active');
         selected.css("display", "block");
         }else{
         var liImgs = $(this).find('img.icon');
         liImgs.css("display", "none");
         var def = $(this).find('img.default');
         def.css("display", "block");
         }
         */
    });


});

function getFormObj(formId) {
    var formObj = {};
    var inputs = $('#' + formId).serializeArray();
    $.each(inputs, function (i, input) {
        formObj[input.name] = input.value;
    });
    return formObj;
}


function showErrors(errors, element) {
    var errorList = $("<ul class='error-list'>");
    $('.error-list').remove();
    $('input').removeClass('error');
    for (field in errors) {
        errorList.append("<li>" + errors[field] + "</li>")
        $('input[name=' + field + ']').addClass('error');
    }
    if (!element) {
        $('.error').after(errorList).show(1500);
    } else {
        $(element).html("").append(errorList).show(500);
    }
}

//Build the share url for the social box clicked and return
function buildShareUrl(event) {
    var share = '', postUrl = window.location.href, title = document.title;
    var encodedURL = encodeURIComponent(postUrl), encodedTitle = encodeURIComponent(title);
    if (event.currentTarget.classList.contains("facebook")) {
        /*available params: url*/
        share = 'http://www.facebook.com/sharer/sharer.php?u=' + postUrl;
    } else if (event.currentTarget.classList.contains("twitter")) {
        /*available params: text, url, hashtags*/
        share = 'https://twitter.com/intent/tweet?text=' + encodedTitle + '&url=' + encodedURL;
    } else if (event.currentTarget.classList.contains("google")) {
        /*available params: url*/
        share = 'https://plus.google.com/share?url=' + postUrl;
    } else if (event.currentTarget.classList.contains("linkedIn")) {
        /*available params: title, url, summary, source*/
        share = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodedURL + '&title=' + title + '&summary=&source=';
    }
    return share
}


//Go back one from <a onclick> events
function goBack() {
    window.history.back();
}


//SET Status Text & Styles
//Takes object with properties [type, message, duration]
//Property status.type dataType = String; Valid values =  ('alert','error', 'neutral', 'good'); default = 'alert'
//Property status.message dataType = String; default = 'No status message declared.'
//Property status.hide dataType = Boolean; default = false
//Property status.duration dataType = int; default = 4000
function statusBox(status) {
    var statType = status.type ? status.type : 'alert';
    var statMsg = status.message ? status.message : 'No status message declared.';
    var hide = status.hide = true ? status.hide : false;
    var statDuration = status.duration ? status.duration : 4000;
    //STATUS Message Box Colors
    var red = 'rgba(244, 110, 93, 1)', opacRed = 'rgba(244, 110, 93, 0.11)';
    var yellow = 'rgba(244, 208, 83, 1)', yellowOpac = 'rgba(244, 208, 83, 0.11)';
    var blue = 'rgba(120, 197, 225, 1)', blueOpac = 'rgba(120, 197, 225, 0.11)';
    var green = '#3c763d', greenOpac = '#dff0d8', greenBorder = '#d6e9c6';
    var statusContainer = $('.status-message-container');
    var statusBox = $('.status-message-content');
    statusBox.show();
    var statusMsg = $('.status-msg');
    statusMsg.text(statMsg);
    switch (statType) {
        case 'alert':
            statusBox.css('border', '1px solid ' + yellow);
            statusBox.css('background-color', yellowOpac);
            statusMsg.css('color', yellow);
            break;
        case 'error':
            statusBox.css('border', '1px solid ' + red);
            statusBox.css('background-color', opacRed);
            statusMsg.css('color', red);
            break;
        case 'neutral':
            statusBox.css('border', '1px solid ' + blue);
            statusBox.css('background-color', blueOpac);
            statusMsg.css('color', blue);
            break;
        case 'good':
            statusBox.css('border', '1px solid ' + greenBorder);
            statusBox.css('background-color', greenOpac);
            statusMsg.css('color', green);
            break;
    }
    statusContainer.removeClass('hidden');
    if (hide) {
        statusBox.delay(statDuration).fadeOut(function () {
            statusContainer.addClass('hidden');
        });
    }
}

//READ URL PARAMS
/*
 * use this function assuming the URL is,
 http://dummy.com/?technology=jquery&blog=jquerybyexample.

 var tech = getUrlParameter('technology');
 var blog = getUrlParameter('blog');
 * */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


//Active bootstrap tab dynamically
function activateTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};
