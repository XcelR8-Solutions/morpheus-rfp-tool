$(document).ready(function () {

    if ($('body').data('page') === 'adminForum-index') {

        //On Question Search Bar
        $('.adminForum-questions-filters').on('keyup', 'input', function () {
            var phrase = $('.adminForum-questions-filters').find('input[name=phraseFilter]').val();
            var status = $('.adminForum-questions-filters').find('select[name=questionStatusFilter]').val();
            var username = $('.adminForum-questions-filters').find('select[name=questionUserFilter]').val();
            loadQuestions(phrase, status, username);
        }.debounce(200))

        /*On Question Selection*/
        $('.adminForum-questions-filters').on('change', 'select', function () {
            var phrase = $('.adminForum-questions-filters').find('input[name=phraseFilter]').val();
            var status = $('.adminForum-questions-filters').find('select[name=questionStatusFilter]').val();
            var username = $('.adminForum-questions-filters').find('select[name=questionUserFilter]').val();
            console.log(username)
            console.log(status)
            loadQuestions(phrase, status, username);
        });
    }

    if ($('body').data('page') === 'adminForum-show') {

        //EDIT QUESTION
        $('.edit-question-submit').on("click", function (e) {
            $('.edit-question-form').submit();
        });

        $('.edit-question-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#edit-question-modal').modal('toggle');
                        location.reload();
                    }
                }
            });
        });

        $(document).on("click", ".vote", function (e) {
            var data = {
                refType: $(this).data("reftype"),
                refId: $(this).data("refid"),
                voteUp: $(this).data("voteup")
            }
            $.ajax({
                type: "POST",
                url: '/admin/forum/voteQuestion',
                data: data,
                success: function (response) {
                    if (response.success) {
                        location.reload();
                    }
                }
            });
        });

        //REPLY TO QUESTION
        $('.reply-question-submit').on("click", function (e) {
            $('.reply-question-form').submit();
        });

        $('.reply-question-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#reply-question-modal').modal('toggle');
                        location.reload();
                    }
                }
            });
        });

        //DELETE ANSWER
        $('.delete-answer').on("click", function (e) {
            //Todo..should set up ajax on delete
        });

        //EDIT ANSWER CLICK (populate modal details)
        $('.edit-answer-btn').on("click", function (e) {
            var uuid = $(this).data('uuid');
            var answer = $(this).data('answer');
            $('#edit-answer-modal').modal('toggle');
            $('.edit-answer').val(answer);
            $('.edit-uuid').val(uuid)
        });

        //EDIT ANSWER SUBMIT
        $('.edit-answer-submit').on("click", function (e) {
            var answer = $('.edit-answer').val();
            if (answer) {
                $('.edit-answer-form').submit();
            } else {
                alert("You cannot save a blank answer!")
            }

        });

        $('.edit-answer-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#edit-answer-modal').modal('toggle');
                        location.reload();
                    }
                }
            });
        });

    }

});

//Perform AJAX magic to filter admin forum list
function loadQuestions(phrase, status, username) {
    if (status) {
        if (status == "Approved") {
            status = true
        } else {
            status = false
        }
    }

    $.ajax({
        url: '/admin/forum/listQuestions',
        method: 'POST',
        data: {phrase: phrase, status: status, username: username}
    }).then(function (response) {
        $('.adminForum-questions-container').html(response);
    })
}