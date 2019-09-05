$(document).ready(function () {
    if ($('body').data('page') === 'dashboard-index') {

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

            instanceDonutCharts();
            instanceCountChart();
            instanceStatusLines();
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

    /*LOAD Availability Dynamic Lines*/
    function instanceStatusLines() {
        var availData = document.getElementById("data-holder");
        if (availData) {
            var availability = availData.getAttribute("data-availability");
            availability = ((availability / 100 ) * 100);

            $('.availability').text(availability.toFixed(2) + "%");
            //IF availability line exists then update bar length
            if ($('.availabilityLine').length) {
                $('.availabilityLineSvg').attr('width', availability.toFixed(2).toString() + '%');
            } else {
                var availabilityLine = d3.select('.instance-availability-line').append("svg")
                    .attr("width", availability.toFixed(2).toString() + '%').attr("height", 15)
                    .attr("class", "availabilityLineSVG");
                availabilityLine.append("line")
                    .attr("class", "availabilityLine")
                    .attr("x1", 0).attr("y1", 7)
                    .attr("x2", '100%').attr("y2", 7)
                    .attr("stroke-width", 15).attr("stroke", "#6acaa9");
            }
        }
    }

    function instanceDonutCharts() {
        $('.chart-line').each(function (instance) {
            var $this = $(this);
            var pct = Math.round(parseFloat($this.data('value') || 0));
            if (pct < 0) {
                pct = 0
            }
            var pctText = pct.toFixed(0)
            var dashPct = Math.round(pct / 100.0 * 161)
            $(this).css('stroke-dasharray', dashPct + ' 9999');
            $(this).siblings('text').text(pctText + '%');
        });
    }


    /*LOADING Polyline & Points per real data*/
    function instanceCountChart() {

		var countData = document.getElementById("data-holder");
        if(countData) {
            var instanceDaysData = countData.getAttribute("data-instance-days-arr-count");
            if(instanceDaysData) {
                var ac = MorpheusHub.AreaChart({
                    rootElement:document.querySelector('.instance-count-chart'),
                    values: JSON.parse(instanceDaysData),
                    height: 52
                });
                ac.init();
            }
        }
    }

});
