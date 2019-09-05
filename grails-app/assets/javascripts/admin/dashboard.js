$(document).ready(function () {
    if ($('body').data('page') === 'admin-dashboard-index') {

        //Show License Details on Key Row click
        $('.license-keys-container').on("click", ".table-data", function () {
            var licenseLink = $(this).parent('tr').find('.license-link-td a');
            licenseLink = licenseLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + licenseLink
            window.location = newUrl;
        });

        var updateStats = function () {
            var usedMemory = parseFloat($('.data-holder').data('used-memory'));
            var maxMemory = parseFloat($('.data-holder').data('max-memory'));
            var usedStorage = parseFloat($('.data-holder').data('used-storage'));
            var maxStorage = parseFloat($('.data-holder').data('max-storage'));
            var cpu = parseFloat($('.data-holder').data('cpu-usage'))

            $('.instances-compute-chart .chart-line').data('value', (cpu));
            $('.instances-storage-chart .chart-line').data('value', (usedStorage / maxStorage) * 100.0);
            $('.instances-memory-chart .chart-line').data('value', (usedMemory / maxMemory) * 100.0);

            organizationCountChart();
        }

        updateStats()

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

    }

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

    function organizationCountChart(){
        var countData = document.getElementById("data-holder");
        var ac = MorpheusHub.AreaChart({
            rootElement:document.querySelector('.organization-count-chart'),
            values: JSON.parse(countData.getAttribute("data-organization-days-arr-count")),
            height: 52
        });
        if (ac) {
            ac.init();
        }
    }

});
