$(document).ready(function(){
    if ($('body').data('page') === 'register-create' ) {

        //Submit User Registration Form
        /*
        $('.register-form').on("submit", function(e){
            e.preventDefault();

            var $form = $(this); //wrap this in jQuery
            var action = $form.attr('action');
            var data = $form.serialize();
            $.ajax({
                type: "POST",
                url: action,
                data: data,
                success: function(data){
                    if (data.success) {
                        // do good stuff
                        $('.forms-container').hide();
                        $('.success-msg').show();
                        window.location.href = '/dashboard'
                    } else {
                        // bad stuff happened
                        showErrors(data.errors);
                    }
                }
            });
        });

*/
        //Remove Error from input on keypress
  /*
        $( ".register-form input" ).keypress(function() {
            if($(this).hasClass('error')){
                $(this).removeClass('error');
                $('.error-list').fadeOut();
            }
        });
*/
        $(".register-form input[type=text], .register-form input[type=password]").on("focusin", function(){
            $(this).css("border-bottom-color","#fff");
            $(this).next().css("display","none");
        })

        $(".register-form input[type=text], .register-form input[type=password]").on("focusout", function(){
            var value = $(this).val();
            if(value) {
                $(this).css("border-bottom-color","#fff");
            } else {
                $(this).css("border-bottom-color","#8f9090");
            }
        })

        //Display popover error at field level on registration page
        $('[data-toggle="popover"]').popover({template: '<div class="popover" role="tooltip" style="margin: 22px 0 0 -84px;"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');
        $( ".warning-image" ).focus();

    }
    if ($('body').data('page') === 'register-forgotPw' ) {
        //Submit User Registration Form
        $('.forgotpw-form').on("submit", function(e){
            e.preventDefault();

            var $form = $(this); //wrap this in jQuery
            var action = $form.attr('action');
            var data = $form.serialize();
            $.ajax({
                type: "POST",
                url: action,
                data: data,
                success: function(data){
                    if (data.success) {
                        // do good stuff
                        console.log("We did good! Check your email please. -> "+data.email)
                        $('.form-container').hide();
                        $('.success-msg').show();
                    } else {
                        // bad stuff happened
                        showErrors(data.errors);
                    }
                }
            });
        });

        //Remove Error from input on keypress
        $( ".forgotpw-form input" ).keypress(function() {
            if($(this).hasClass('error')){
                $(this).removeClass('error');
                $('.error-list').fadeOut();
            }
        });
    }

    if ($('body').data('page') === 'register-resetPw' ) {
        //Submit User Registration Form
        $('.resetpw-form').on("submit", function(e){
            e.preventDefault();

            var $form = $(this); //wrap this in jQuery
            var action = $form.attr('action');
            var data = $form.serialize();
            $.ajax({
                type: "POST",
                url: action,
                data: data,
                success: function(data){
                    if (data.success) {
                        // do good stuff
                        $('.form-container').hide();
                        $('.success-msg').show();
                    } else {
                        // bad stuff happened
                        showErrors(data.errors);
                    }
                }
            });
        });

        //Remove Error from input on keypress
        $( ".resetpw-form input" ).keypress(function() {
            if($(this).hasClass('error')){
                $(this).removeClass('error');
                $('.error-list').fadeOut();
            }
        });
    }


    if ($('body').data('page') === 'choose-password-create') {

        $(".choose-password-form input[type=password]").on("focusin", function(){
            $(this).css("border-bottom-color","#fff");
            $(this).next().css("display","none");
        })

        $(".choose-password-form input[type=password]").on("focusout", function(){
            var value = $(this).val();
            if(value) {
                $(this).css("border-bottom-color","#fff");
            } else {
                $(this).css("border-bottom-color","#8f9090");
            }
        })

        //Display popover error at field level on registration page
        $('[data-toggle="popover"]').popover({template: '<div class="popover" role="tooltip" style="margin: 22px 0 0 -84px;"><div class="arrow"></div><div class="popover-content">asdf</div></div>'}).popover('show');
        $( ".warning-image" ).focus();
    }


});