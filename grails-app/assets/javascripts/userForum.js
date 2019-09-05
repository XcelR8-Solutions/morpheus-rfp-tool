$(document).ready(function () {
    if ($('body').data('page') === 'forum-index') {
        //On Question Search Bar
        $('.filters').on('keyup', 'input', function () {
            var phrase = $('.filters').find('input[name=phraseFilter]').val();

            loadQuestions(phrase);
        }.debounce(200))
    }

});

//Perform AJAX magic to filter forum list
function loadQuestions(phrase) {
    $.ajax({
        url: '/forum/listQuestions',
        method: 'POST',
        data: {phrase: phrase}
    }).then(function (response) {
        $('.user-forum-container').html(response);
    })
}