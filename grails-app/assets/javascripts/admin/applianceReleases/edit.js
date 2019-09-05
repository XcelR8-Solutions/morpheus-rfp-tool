$(function() {

    var dataPage = 'admin/applianceReleases/edit';

    /**
     * Constructor method only to run if data-page is 'admin/applianceReleases/edit'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _initSummerNote();
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the appliance releases section
     * @private
     */
    function _observeEvents() {
        $("#name").change( function () {
            var inputField = $('input[name="applianceRelease.name"]');
            console.log("inputField: " + inputField);
        });

        $('#name').on('input',function(e){
            var codeInputField = $('input[name="applianceRelease.code"]');
            var nameInputField = $('input[name="applianceRelease.name"]');
            console.log('Changed! ' + nameInputField.val());
            var code = nameInputField.val();
            code = code.replace(/\./g, "_");
            codeInputField.val(code);
        });
    }

    function _initSummerNote() {
        $('#summernote').summernote({
            airMode: false,
            tabsize: 2,
            height: 200,
            disableDragAndDrop: true,
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['style']],
                ['sty', ['bold', 'italic', 'underline']],
//                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'hr']],
                ['view', ['codeview','help']]
            ]
        });
    }

    init();

});
