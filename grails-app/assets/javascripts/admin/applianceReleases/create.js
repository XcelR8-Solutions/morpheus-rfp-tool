$(function() {

    var dataPage = 'admin/applianceReleases/create';

    /**
     * Constructor method only to run if data-page is 'admin/applianceReleases/create'
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
            _updateCodeInputField();
        });

        $('#name').on('input',function(e){
            _updateCodeInputField();
        });

        $(".select-release-type-dropdown select").on('change', function() {
            var releaseTypeId = $('div.select-release-type-dropdown').find('select[name="applianceRelease.releaseType"]').val()
            if (releaseTypeId != 'null') {
                if (releaseTypeId != 'null') {
                    MorpheusHub.ApplianceReleaseService.loadNextVersionNumber({
                        releaseTypeId: releaseTypeId,
                        callback: _consumeNextVersionNumberResponse
                    });
                }
            }
        });
    }

    function _consumeNextVersionNumberResponse(response) {
        if(response) {
            var releaseTypeId = response.releaseTypeId;
            var data = response.data;
            var sortOrderInputField = $('input[name="applianceRelease.sortOrder"]');
            sortOrderInputField.val(data.nextSortOrder);
        }
    }

    function _updateCodeInputField() {
        var codeInputField = $('input[name="applianceRelease.code"]');
        var nameInputField = $('input[name="applianceRelease.name"]');
        var code = nameInputField.val();
        code = code.replace(/\./g, "_");
        codeInputField.val(code);
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
