$(document).ready(function () {

    if ($('body').data('page') === 'support-index') {
        //Set Hover Icon on mouseenter
        $(document).on("mouseenter", "a.vote", function (e) {
            var aImgs = $(this).find('img.vote-icon');
            aImgs.css("display", "none");
            var hover = $(this).find('img.hover');
            hover.css("display", "block");
        });

        //Remvoe Hover Icon on mouseleave
        $(document).on("mouseleave", "a.vote", function (e) {
            var aImgs = $(this).find('img.vote-icon');
            aImgs.css("display", "none");
            var def = $(this).find('img.default');
            def.css("display", "block");
        });


        $(document).on("click", ".vote", function (e) {
            e.preventDefault();
            var data = {
                refType: $(this).data("reftype"),
                refId: $(this).data("refid"),
                voteUp: $(this).data("voteup")
            }
            $.ajax({
                type: "POST",
                url: $(this).attr('href'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        reloadPosts();
                    }
                }
            });

        });

        function reloadPosts() {
            $.ajax({
                type: "POST",
                url: '/dashboard/reloadPosts',
                data: {},
                success: function (response) {
                    $('.forum-posts').html($(response));
                    if (response.success) {
                        console.log("YEA ")
                    }
                }
            });
        }

    }

})