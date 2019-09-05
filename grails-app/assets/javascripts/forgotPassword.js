$(document).ready(function () {
    if ($('body').data('page') === 'forgot-password-create') {

        $(".forgot-password-form input[type=password]").on("focusin", function(){
            $(this).css("border-bottom-color","#fff");
            $(this).next().css("display","none");
        })

        $(".forgot-password-form input[type=password]").on("focusout", function(){
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