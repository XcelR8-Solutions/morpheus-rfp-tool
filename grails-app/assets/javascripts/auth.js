$(document).ready(function () {
    if ($('body').data('page') === 'user-login') {

        $('.modalClose').mouseenter(function (e) {
            $('img.default').hide();
            $('img.hover').show();
        });

        $('.modalClose').mouseleave(function (e) {
            $('img.hover').hide();
            $('img.default').show();
        });


        $(".login-form input[type=text], .login-form input[type=password]").on("focusin", function(){
            $(this).css("border-bottom-color","#fff");
            $(this).next().css("display","none");
        })

        $(".login-form input[type=text], .login-form input[type=password]").on("focusout", function(){
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

        //display red/blue required field indicator bars to user
        $(".reset-pw-form input[type=text]").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".reset-pw-form input[type=text]").on("keypress", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })

        $(".modalClose").on("click", function() {
            $(".status-message-content.error").hide();
        });
        $(".reset-password-cancel").on("click", function() {
            $(".status-message-content.error").hide();
        });
    }
});
