var MorpheusHub = MorpheusHub || {};
MorpheusHub.infrastructureUsage = MorpheusHub.infrastructureUsage || {};

(function() {
    var self = this;

    var init = function() {
        console.log("MorpheusHub.infrastructureUsage init called");

        if ($('body').data('page') === 'infrastructure-usage-index') {

            $(document).on("click", ".company-list a", function(e) {
                console.log("company-list clicked-->  company:" + $(this).data('company-id') + " company-name: " + $(this).data('company-name'));
                if ($(this).data('company-id')) {
                    window.location = '/admin/infrastructureUsage/' + $(this).data('company-id');
                } else {
                    window.location = '/admin/infrastructureUsage/';
                }
            });
            $(document).on("click", ".appliance-list a", function(e) {
                console.log("appliance-list clicked-->  company: " + $(this).data('company-id') + " appliance: " + $(this).data('appliance-id'));
                if ($(this).data('company-id') && $(this).data('appliance-id')) {
                    window.location = '/admin/infrastructureUsage/' + $(this).data('company-id') + '/' + $(this).data('appliance-id');
                } else {
                    window.location = '/admin/infrastructureUsage/' + $(this).data('company-id');
                }
            });


            var countData = document.getElementById("data-holder");
            var days = JSON.parse(countData.getAttribute("data-days"));
            var hostStats = JSON.parse(countData.getAttribute("data-host-count-by-day"));
            var containerStats = JSON.parse(countData.getAttribute("data-container-count-by-day"));
            var memoryStats = JSON.parse(countData.getAttribute("data-managed-memory-by-day"));

            var halfHours = JSON.parse(countData.getAttribute("data-halfhours"));
            var instanceStats = JSON.parse(countData.getAttribute("data-instance-count-by-halfhour"));


            days.splice(0, 0, 'x');
            hostStats.splice(0, 0, 'hosts');
            containerStats.splice(0, 0, 'containers');
            memoryStats.splice(0, 0, 'memory');
            halfHours.splice(0, 0, 'x');
            instanceStats.splice(0, 0, 'instances');
            var showDecimalValue = (memoryStats[memoryStats.length - 1] > 5) ? false : true

            //console.log(days)
            //console.log(hostStats)
            //console.log(containerStats)
            //console.log(memoryStats)
            //console.log(halfHours)
            //console.log(instanceStats)

            var timeSelection = $("#chartTimeframe").val();
            var chartMetric = $("#chartMetric").val();
            console.log("metric:timeframe --> " + chartMetric + ":" + timeSelection);

            var xDateMax = days[days.length - 1]
            var xDateMin = days[(days.length - 1) - (timeSelection - 1)]
            //console.log("xDateMax: " + xDateMax);
            //console.log("xDateMin: " + xDateMin);
            var config = {}
            config.tooltip_format_title = function(d) { return d.toISOString().slice(0, 16).replace(/T/g, " ") }


            var chart = c3.generate({
                data: {
                    x: 'x',
                    columns: [
                        filterDataByDays(days, timeSelection),
                        filterDataByDays(hostStats, timeSelection),
                        filterDataByDays(containerStats, timeSelection),
                        filterDataByDays(memoryStats, timeSelection)
                    ],
                    hide: ['memory']
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        },
                        localtime: false,
                        max: xDateMax,
                        min: xDateMin,
                        padding: { left: 0, right: 0 }
                    },
                    y: {
                        min: 0,
                        padding: { top: 0, bottom: 0 }
                    }
                },
                tooltip: {
                    contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
                        var $$ = this,
                            config = $$.config,
                            titleFormat = config.tooltip_format_title || defaultTitleFormat,
                            nameFormat = config.tooltip_format_name || function(name) { return name; },
                            valueFormat = config.tooltip_format_value || defaultValueFormat,
                            text, i, title, value, name, bgcolor;
                        for (i = 0; i < d.length; i++) {
                            if (!(d[i] && (d[i].value || d[i].value === 0))) { continue; }

                            if (!text) {
                                title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                                text = "<div class='tooltip-header'>" + (title || title === 0 ? title + "</div>" : "");
                            }

                            value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                            if (value !== undefined) {
                                name = nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index);
                                bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                                text += "<div class='tooltip-row'>";
                                text += "<div class='color' style='background-color:" + bgcolor + "'></div><span>" + name + "</span>";
                                text += "<div class='value'>" + value + "</div>";
                                text += "</div>";
                            }
                        }
                        return text;
                    }
                }
            });

            var chartDetailed = c3.generate({
                bindto: "#chartDetailed",
                data: {
                    x: 'x',
                    columns: [
                        halfHours,
                        instanceStats
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            fit: false,
                            culling: false,
                            format: function(x) {
                                if (x.getHours() == 0 && x.getMinutes() == 0) {
                                    var format = d3.time.format("%m-%d");
                                    return format(x)
                                }
                            }
                        },
                        localtime: true,
                        max: halfHours[halfHours.length - 1],
                        min: halfHours[1],
                        padding: { left: 0, right: 0 }
                    },
                    y: {
                        min: 0,
                        padding: { top: 0, bottom: 0 }
                    }
                },
                padding: {
                    right: 14
                },
                tooltip: {
                    contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
                        var $$ = this,
                            config = $$.config,
                            titleFormat = function(d) { return d.toLocaleString('en-US', { hour12: false }).slice(0, this.length - 3).replace(/,/g, "").replace(/\//g, "-") },
                            nameFormat = config.tooltip_format_name || function(name) { return name; },
                            valueFormat = config.tooltip_format_value || defaultValueFormat,
                            text, i, title, value, name, bgcolor;
                        for (i = 0; i < d.length; i++) {
                            if (!(d[i] && (d[i].value || d[i].value === 0))) { continue; }

                            if (!text) {
                                title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                                text = "<div class='tooltip-header'>" + (title || title === 0 ? title + "</div>" : "");
                            }

                            value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                            if (value !== undefined) {
                                name = nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index);
                                bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                                text += "<div class='tooltip-row'>";
                                text += "<div class='color' style='background-color:" + bgcolor + "'></div><span>" + name + "</span>";
                                text += "<div class='value'>" + value + "</div>";
                                text += "</div>";
                            }
                        }
                        return text;
                    }
                }
            });

            chartDetailed.show(['x', 'instances']);

            // Redraw chart depending on which metric option is selected
            $(document).on("change", "#chartMetric", function(e) {
                var timeSelection = $("#chartTimeframe").val();
                var chartMetric = $("#chartMetric").val();
                console.log("metric:timeframe --> " + chartMetric + ":" + timeSelection);

                if ((timeSelection == "7d") && (chartMetric == 'memory' || chartMetric == 'hosts')) {
                    $("#chartDetailed").hide();
                    $("#chart").show();

                    $("#chartTimeframe").val(30);
                    $("#chartTimeframe").change();
                }

                if (chartMetric == 'instances') {
                    $("#chart").hide();
                    $("#chartDetailed").show();
                    $("#chartTimeframe").val("7d");
                    $("#chartTimeframe").change();
                } else if (chartMetric == 'hosts') {
                    chart.hide(['x', 'memory']);
                    chart.internal.loadConfig({
                        axis: {
                            x: {
                                padding: { left: 0, right: 0 }
                            },
                            y: {
                                tick: {
                                    format: function(d) {
                                        return d;
                                    }
                                },
                                min: 0,
                                padding: { top: 0, bottom: 0 }
                            }
                        }
                    })
                    chart.show(['x', 'hosts', 'containers']);
                } else if (chartMetric == 'memory') {
                    chart.hide(['x', 'hosts', 'containers']);
                    chart.internal.loadConfig({
                        axis: {
                            x: {
                                padding: { left: 0, right: 0 }
                            },
                            y: {
                                tick: {
                                    format: function(gb) {
                                        if (showDecimalValue)
                                            return gb.toFixed(1) + 'GB';
                                        else
                                            return parseInt(gb) + 'GB';
                                    }
                                },
                                min: 0,
                                padding: { top: 0, bottom: 0 }
                            }
                        }
                    })
                    chart.show(['x', 'memory']);
                }
            });

            // Redraw chart depending on which timeframe option is selected
            $(document).on("change", "#chartTimeframe", function(e) {
                var timeSelection = $("#chartTimeframe").val();
                if (timeSelection == "7d") {
                    $("#chart").hide();
                    $("#chartDetailed").show();
                    $("#chartMetric").val('instances');
                } else {
                    if ($("#chartMetric").val() == 'instances') {
                        $("#chartMetric").val('hosts');
                        $("#chartMetric").change();
                    }
                    $("#chartDetailed").hide();
                    $("#chart").show();
                    var chartMetric = $("#chartMetric").val();
                    console.log("metric:timeframe --> " + chartMetric + ":" + timeSelection);

                    //chart.unload(['x','hosts', 'containers', 'memory']);
                    chart.load({
                        columns: [
                            filterDataByDays(days, timeSelection),
                            filterDataByDays(hostStats, timeSelection),
                            filterDataByDays(containerStats, timeSelection),
                            filterDataByDays(memoryStats, timeSelection)
                        ]
                    });
                    chart.flush()

                    var xDateMax = days[days.length - 1]
                    var xDateMin = days[(days.length - 1) - (timeSelection - 1)]
                    chart.axis.range({ max: { x: xDateMax }, min: { x: xDateMin } });
                }
            });

            function filterDataByDays(array, days) {
                var dataName = array[0]
                var filteredData = array.slice(array.length - days, array.length);
                filteredData.splice(0, 0, dataName);
                return filteredData;
            }

        }

    };

    MorpheusHub.infrastructureUsage = {
        init: init
    };
})();

$(document).ready(function() {
    console.log("MorpheusHub.infrastructureUsage: document is ready");
    MorpheusHub.infrastructureUsage.init();
});