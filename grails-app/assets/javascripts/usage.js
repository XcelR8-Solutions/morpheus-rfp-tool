$(document).ready(function() {
    if ($('body').data('page') === 'usage-index') {


        var updateStats = function() {
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
            appsCountChart();
            instanceStatusLines();
            backupsConfiguredCountChart();
            backupsSizeCountChart();
        }

        updateStats()

        $(document).on("click", ".appliance-list a", function(e) {
            console.log("appliance-list clicked-->  company: " + $(this).data('company-id') + " appliance: " + $(this).data('appliance-id'));
            var text = $(this).text();
            $('.appliance-list').text(text);
            if ($(this).data('appliance-id')) {
                window.location = '/usage/' + $(this).data('appliance-id');
            } else {
                window.location = '/usage/';
            }
        });
    }

    function instanceDonutCharts() {
        $('.chart-line').each(function(instance) {
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

    /*LOADING Instances Polyline & Points per real data*/
    function instanceCountChart() {
        var countData = document.getElementById("data-holder");
        var ac = MorpheusHub.AreaChart({
            rootElement: document.querySelector('.instance-count-chart'),
            values: JSON.parse(countData.getAttribute("data-instance-days-arr-count")),
            height: 52
        });
        ac.init();

    }

    /*LOADING Apps Polyline & Points per real data*/
    function appsCountChart() {
        var countData = document.getElementById("data-holder");
        var ac = MorpheusHub.AreaChart({
            rootElement: document.querySelector('.apps-count-chart'),
            values: JSON.parse(countData.getAttribute("data-apps-days-arr-count")),
            height: 52
        });
        ac.init();
    }

    /*LOADING Apps Polyline & Points per real data*/
    function backupsConfiguredCountChart() {
        var countData = document.getElementById("data-holder");
        var ac = MorpheusHub.AreaChart({
            rootElement: document.querySelector('.backups-configured-count-chart'),
            values: JSON.parse(countData.getAttribute("data-backups-configured-days-arr-count")),
            height: 52
        });
        ac.init();

    }

    /*LOADING Apps Polyline & Points per real data*/
    function backupsSizeCountChart() {

        var countData = document.getElementById("data-holder");
        var ac = MorpheusHub.AreaChart({
            rootElement: document.querySelector('.backups-size-count-chart'),
            values: JSON.parse(countData.getAttribute("data-backups-size-days-arr-count")),
            height: 52
        });
        ac.init();

    }

    /*LOAD Monitoring Availability Dynamic Lines*/
    function instanceStatusLines() {
        var availData = document.getElementById("data-holder");
        if (availData) {
            var availability = availData.getAttribute("data-availability");
            availability = ((availability / 100) * 100);

            $('.monitoring-availability').text(availability.toFixed(2) + "%");
            //IF availability line exists then update bar length
            if ($('.availabilityLine').length) {
                $('.availabilityLineSvg').attr('width', availability.toFixed(2).toString() + '%');
            } else {
                var availabilityLine = d3.select('.monitoring-availability-line').append("svg")
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

});