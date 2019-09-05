$(document).ready(function () {
    if ($('body').data('page') === 'admin-usage-index') {

        $(document).on("click", ".company-list a, .filter-company-list a", function(e){
            console.log("company-list clicked-->  company:" + $(this).data('company-id') + " company-name: " + $(this).data('company-name'));
            if ($(this).data('company-id')) {
                window.location = '/admin/usage/' + $(this).data('company-id');
            } else {
                window.location = '/admin/usage/';
            }
        });
        $(document).on("click", ".appliance-list a", function(e){
            console.log("appliance-list clicked-->  company: " + $(this).data('company-id') + " appliance: " + $(this).data('appliance-id'));
            if ($(this).data('company-id') && $(this).data('appliance-id')) {
                window.location = '/admin/usage/' + $(this).data('company-id') + '/' + $(this).data('appliance-id');
            } else {
                window.location = '/admin/usage/' + $(this).data('company-id');
            }
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
//            organizationCountChart();
            instanceCountChart();
            appsCountChart();
            backupSuccessRateLine();
            backupsConfiguredCountChart();
            backupsSizeCountChart();
            checksChartGraph();
            responseTimeChartGraph();
            monitoringAvailabilityLine();
            backupStatusLines();
//            loginCountChart();
        }

        updateStats()

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

    /*
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
*/
    /*LOADING Instances Polyline & Points per real data*/
    function instanceCountChart() {
		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.instance-count-chart'),
			values: JSON.parse(countData.getAttribute("data-instance-days-arr-count")),
			height: 52
		});
		ac.init();
    }

    /*LOADING Apps Polyline & Points per real data*/
    function appsCountChart() {
		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.apps-count-chart'),
			values: JSON.parse(countData.getAttribute("data-apps-days-arr-count")),
			height: 52
		});
		ac.init();
    }

    /*LOADING Apps Polyline & Points per real data*/
    function backupsConfiguredCountChart() {
		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.backups-configured-count-chart'),
			values: JSON.parse(countData.getAttribute("data-backups-configured-days-arr-count")),
			height: 52
		});
		ac.init();

    }

    /*LOADING Backup Size Polyline & Points per real data*/
    function backupsSizeCountChart() {
		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.backups-size-count-chart'),
			values: JSON.parse(countData.getAttribute("data-backups-size-days-arr-count")),
			height: 52
		});
		ac.init();
    }

    /*LOADING Login Polyline & Points per real data*/
    function loginCountChart() {
		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.login-count-chart'),
			values: JSON.parse(countData.getAttribute("data-login-days-arr-count") || "[0,0,0,0,0,0,0]"),
			height: 52
		});
		if (ac) {
			ac.init();
		}
    }

    /*LOAD Backup Success Dynamic Lines*/
    function backupSuccessRateLine() {
        var backupSuccessData = document.getElementById("data-holder");
        if (backupSuccessData) {
            var backupSuccessRate = backupSuccessData.getAttribute("data-backup-success-rate");
            backupSuccessRate = validatePercentValue((backupSuccessRate / 100 ) * 100);
            $('.backup-success').text(backupSuccessRate.toFixed(2) + "%");
            //IF backup success line exists then update bar length
            if ($('.backupSuccessLine').length) {
                $('.backupSuccessSvg').attr('width', backupSuccessRate.toFixed(2).toString() + '%');
            } else {
                var backupSuccessLine = d3.select('.backup-success-line').append("svg")
                    .attr("width", backupSuccessRate.toFixed(2).toString() + '%').attr("height", 15)
                    .attr("class", "backupSuccessLineSVG");
                backupSuccessLine.append("line")
                    .attr("class", "backupSuccessLine")
                    .attr("x1", 0).attr("y1", 7)
                    .attr("x2", '100%').attr("y2", 7)
                    .attr("stroke-width", 15).attr("stroke", "#6acaa9");
            }
        }
    }

    /*LOAD Monitoring Availability Dynamic Lines*/
    function monitoringAvailabilityLine() {
        var monitoringAvailabilityData = document.getElementById("data-holder");
        if (monitoringAvailabilityData) {
            var monitoringAvailability = monitoringAvailabilityData.getAttribute("data-monitoring-availability");
            monitoringAvailability = validatePercentValue((monitoringAvailability / 100 ) * 100);
            $('.monitoring-availability-count').text(monitoringAvailability.toFixed(2) + "%");
            //IF monitoring availability line exists then update bar length
            if ($('.monitoringAvailabilityLine').length) {
                $('.monitoringAvailabilitySvg').attr('width', monitoringAvailability.toFixed(2).toString() + '%');
            } else {
                var monitoringAvailabilityLine = d3.select('.monitoring-availability-line').append("svg")
                    .attr("width", monitoringAvailability.toFixed(2).toString() + '%').attr("height", 15)
                    .attr("class", "monitoringAvailabilitySvg");

                monitoringAvailabilityLine.append("line")
                    .attr("class", "monitoringAvailabilityLine")
                    .attr("x1", 0).attr("y1", 7)
                    .attr("x2", '100%').attr("y2", 7)
                    .attr("stroke-width", 15).attr("stroke", "#6acaa9");
            }
        }
    }

    function validatePercentValue(value) {
        return Math.min(value, 100)
    }

    /*LOAD Monitoring Check Count Chart*/
    function checksChartGraph(){

		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.checks-count-chart'),
			values: JSON.parse(countData.getAttribute("data-checks-days-arr-count")),
			height: 52
		});
		ac.init();
    }


    /*LOAD Running/Stopped Dynamic Lines*/
    function backupStatusLines(){
        var runData = document.getElementById("data-holder");
        if(runData){
            var failed = parseInt(runData.getAttribute("data-backups-failed"));
            var succeeded = parseInt(runData.getAttribute("data-backups-succeeded"));
            var completed = failed + succeeded
            var runTotal = 0, stopTotal = 0;
            if(completed && completed != 0){
                stopTotal = ((failed / completed ) * 100);
                runTotal = (succeeded / completed) * 100;

            }
            $('.backup-succeeded-total').text(succeeded);
            $('.backup-failed-total').text(failed);
            //IF running line exists thne update run bar length
            if($('.runLine').length) {
                $('.runLineSvg').attr('width',runTotal.toString() + '%');
            }else {
                var runLine = d3.select('.backup-running-line').append("svg")
                    .attr("width", runTotal.toString() + '%').attr("height", 3)
                    .attr("class","runLineSvg");
                runLine.append("line")
                    .attr("class", "runLine")
                    .attr("x1", 0).attr("y1", -1)
                    .attr("x2", runTotal.toString() + '%').attr("y2", -1)
                    .attr("stroke-width", 6).attr("stroke", "#6acaa9");
            }
            //IF stopped line exists thne update run bar length
            if($('.stopLine').length) {
                $('.stopLineSvg').attr('width',stopTotal.toString()+'%');
            }else{
                var stopLine = d3.select('.backup-stopped-line').append("svg")
                    .attr("width", stopTotal.toString()+'%').attr("height", 3)
                    .attr("class","stopLineSvg");
                stopLine.append("line")
                    .attr("class","stopLine")
                    .attr("x1", 0).attr("y1", -1)
                    .attr("x2", stopTotal.toString()+'%').attr("y2", -1)
                    .attr("stroke-width", 6).attr("stroke", "#f26e5e");
            }
        }
    }


    /*LOAD Monitoring ResponseTime Count Chart*/
    function responseTimeChartGraph(){

		var countData = document.getElementById("data-holder");
		var ac = MorpheusHub.AreaChart({
			rootElement:document.querySelector('.responseTime-count-chart'),
			values: JSON.parse(countData.getAttribute("data-responseTime-days-arr-count")),
			height: 52
		});
		ac.init();
    }

    $(document).on('mouseenter', ".expandable", function () {
        var $this = $(this);
        if (this.offsetWidth < this.scrollWidth) {
            $this.tooltip({
                title: $this.text(),
                placement: "bottom"
            });
            $this.tooltip('show');
        }
    });

});
