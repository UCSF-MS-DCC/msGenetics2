$(document).on("turbolinks:load", function(){
    $.get("/home/biorepo_data.json", function(data) {
        console.log(data);
        var t = d3.transition().duration(2500);
        var g1Margin = {"left":80, "top":100, "right": 20, "bottom":75}
        var g1_height = 700 - g1Margin.top - g1Margin.bottom;
        var g1_width = 600 - g1Margin.left - g1Margin.right;

        var g1 = d3.select("#samples_count_chart")
            .append("svg")
            .attr("width", g1_width + g1Margin.left + g1Margin.right)
            .attr("height", g1_height + g1Margin.top + g1Margin.bottom)
            //.attr("style", "border:1px solid green")
            .attr("style", "border-right:1px solid grey;")
            .append("g")
            .attr("transform", "translate("+g1Margin.left+","+g1Margin.top+")");

        var sampleTypes = data.samples.map(function(obj) { return obj.sampleType });

        var popTypes = data.samples[0].values.map(function(obj) { return obj.population; })

        var x0 = d3.scaleBand()
            .domain(sampleTypes)
            .range([0, g1_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        var x1 = d3.scaleBand()
            .domain(popTypes)
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

        var yMax = d3.max(data.samples, function(sampleType) { return d3.max(sampleType.values, function(d) {  return +d.count }) });

        var y = d3.scaleLinear()
            .domain([0,yMax])
            .range([g1_height, 0]);

        //console.log("y test", y(500))
        var sampleBarsColor = d3.scaleOrdinal().domain(popTypes).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var slice = g1.selectAll(".slice")
            .data(data.samples)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate("+(x0(d.sampleType)) + ",0)" });

        // slice.selectAll("rect")
        //     .data(function(d) { return d.values; })
        //     .enter().append("rect")
        //     .attr("width", x1.bandwidth())
        //     .attr("x", function(d) { return x1(d.population); })
        //     .style("fill", function(d) { return sampleBarsColor(d.population); })
        //     .attr("y", function(d) { return y(+d.count); })
        //     .attr("height", function(d) { return g1_height - y(+d.count); })

        // var samplesBottomAxis = d3.axisBottom(x0);
        // var samplesLeftAxis = d3.axisLeft(y)
        //     .ticks(12)

        var xAxisGroup = g1.append("g")
            .attr("class", "bottom-axis")
            .attr("transform", "translate(0,"+g1_height+")");

        var yAxisGroup = g1.append("g")
            .attr("class", "left-axis");

        g1.append("text")
            .attr("class", "y axis-label")
            .attr("x", - (g1_height / 2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Study Participants with Samples");

        var g1Legend = g1.append("g")
            .attr("transform", "translate(15,-90)");
        popTypes.forEach(function(population, i) {
            var g1LegendRow = g1Legend.append("g")
                .attr("transform", "translate(0,"+i * 20+")");
            g1LegendRow.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", sampleBarsColor(population));

            g1LegendRow.append("text")
                .attr("x", 20)
                .attr("y", 13)
                .attr("text-anchor", "start")
                .style("text-transform", "capitalize")
                .text(population);
        })


        // END SAMPLE TYPES BAR CHART

        // BEGIN ANCESTRY PIE CHART

        data.race.forEach(function(d) {
            d.count = + d.count;
        });

        var g2Height = 200;
        var g2Width = 350;
        var g2Radius = Math.min(g2Width, g2Height) / 2;

        var g2 = d3.select("#race_chart")
            .append("svg")
            .attr("width", g2Width)
            .attr("height",g2Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g2Width - g2Radius - 10) + "," + (g2Height / 2 + 5)+ ")");

        var raceList = data.race.map(function(d) { return d.race; });
        var raceColors = d3.scaleOrdinal().range(["#845EC2", "#4B4453", "#B0A8B9", "#C34A36", "#FF8066", "#4E8397", "#F3C5FF"]);

        var arc = d3.arc()
            .innerRadius(g2Radius - 60)
            .outerRadius(g2Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g2Group = g2.selectAll(".arc")
            .data(pie(data.race))
            .enter().append("g")
            .attr("class", "arc");

        g2Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return raceColors(i); })
            .attr("class", "changeCursor");

        var g2Legend = g2.append("g")
            .attr("transform", "translate(" + (g2Width -450) + "," + (g2Height - 265)+")" );
        raceList.forEach(function(race, i) {
            var g2LegendRow = g2Legend.append("g")
                .attr("transform", "translate(0,"+ (i * 20) + ")");
            g2LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", raceColors(i));

            g2LegendRow.append("text")
                .attr("x", -10)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .style("text-transform", "capitalize")
                .attr("class", "changeCursor")
                .text(race)
                .on('click', function() { sendQuery("race", race); if ($(this).hasClass("underlinedText") ) { $(this).removeClass("underlinedText"); $(this).attr({'fill':'black'}); } else { $(this).addClass("underlinedText"); $(this).attr({'fill':'lightgrey'}); } });
        });
        g2.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Ancestry (self-declared)");

        sendQuery();

        // END ANCESTRY PIE CHART

        // BEGIN DISEASE COURSE PIE CHART

        var g3Height = 200;
        var g3Width = 350;
        var g3Radius = Math.min(g3Width, g3Height) / 2

        data.disease_course.forEach(function(d) {
            d.count = + d.count;
        });

        var g3 = d3.select("#disease_course_chart")
            .append("svg")
            .attr("width", g3Width)
            .attr("height",g3Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g3Width - g3Radius - 10) + "," + (g3Height / 2 + 5) + ")");

        var courseColors = d3.scaleOrdinal().range(["#845EC2", "#4B4453", "#B0A8B9", "#C34A36", "#FF8066", "#4E8397", "#F3C5FF"]);
        var courseList = data.disease_course.map(function(d) { return d.disease_course;});

        var arc = d3.arc()
            .innerRadius(g3Radius - 60)
            .outerRadius(g3Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g3Group = g3.selectAll(".arc")
            .data(pie(data.disease_course))
            .enter().append("g")
            .attr("class", "arc");

        g3Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return courseColors(i); })
            .attr("class", "changeCursor");

        var g3Legend = g3.append("g")
            .attr("transform", "translate(" + (g3Width -460) + "," + (g3Height - 280)+")" );
        courseList.forEach(function(course, i) {
            var g3LegendRow = g3Legend.append("g")
                .attr("transform", "translate(0," + (i * 20) + ")");
            g3LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", courseColors(i));

            g3LegendRow.append("text")
                .attr("x",-10)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .style("text-transform", "capitalize")
                .attr("class", "changeCursor")
                .text(course)
                .on('click', function() { sendQuery("course", course); if ($(this).hasClass("underlinedText") ) { $(this).removeClass("underlinedText");; $(this).attr({'fill':'black'}); } else { $(this).addClass("underlinedText"); $(this).attr({'fill':'lightgrey'}); } });
        });
        g3.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("MS Course");
        // END DISEASE COURSE PIE CHART

        // START SEX PIE CHART
        var g4Height = 200;
        var g4Width = 350;
        var g4Radius = Math.min(g4Width, g4Height) / 2

        data.sex.forEach(function(d) {
            d.count = + d.count;
        });

        var g4 = d3.select("#sex_chart")
            .append("svg")
            .attr("width", g4Width)
            .attr("height",g4Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g4Width - g4Radius -10) + "," + (g4Height / 2 + 5) + ")");

        var sexColors = d3.scaleOrdinal().range(d3.schemeCategory20);
        var sexList = data.sex.map(function(d) { return d.sex; });

        var arc = d3.arc()
            .innerRadius(g4Radius - 60)
            .outerRadius(g4Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g4Group = g4.selectAll(".arc")
            .data(pie(data.sex))
            .enter().append("g")
            .attr("class", "arc");

        g4Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return sexColors(i); })
            .attr("class", "changeCursor");

        var g4Legend = g4.append("g")
            .attr("transform", "translate(" + (g4Width -450) + "," + (g4Height - 260)+")" );
        sexList.forEach(function(sex, i) {
            var g4LegendRow = g4Legend.append("g")
                .attr("transform", "translate(0,"+ (i * 20) + ")");
            g4LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", sexColors(i));

            g4LegendRow.append("text")
                .attr("x", -10)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .style("text-transform", "capitalize")
                .attr("class", "changeCursor")
                .text(sex)
                .on('click', function() { sendQuery("sex", sex); if ($(this).hasClass("underlinedText") ) { $(this).removeClass("underlinedText"); $(this).attr({'fill':'black'}); } else { $(this).addClass("underlinedText"); $(this).attr({'fill':'lightgrey'}); } });
        });
        g4.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Sex");

        // END SEX PIE CHART

        // START EDSS HISTOGRAM
        // var g5Margin = {"left":75, "top":15, "right":10, "bottom":60}
        // var g5Height = 250 - g5Margin.top - g5Margin.bottom;
        // var g5Width = 350 - g5Margin.left - g5Margin.right;
        //
        //
        // data.disease_course.forEach(function(d) {
        //     d.count = + d.count;
        // });
        //
        // var g5 = d3.select("#edss_chart")
        //     .append("svg")
        //     .attr("width", g5Width + g5Margin.left + g5Margin.right)
        //     .attr("height",g5Height + g5Margin.top + g5Margin.bottom)
        //     //.attr("style", "border:1px solid green")
        //     .append("g")
        //     .attr("transform", "translate("+ g5Margin.left + "," + g5Margin.top + ")");
        //
        // var edss_bars = g5.selectAll("rect").data(data.edss_scores);
        //
        // var edssList = data.edss_scores.map(function(d) { return d.score;});
        //
        // var edssBarXScale = d3.scaleBand()
        //     .domain(edssList)
        //     .range([0, g5Width])
        //     .paddingInner(0.1)
        //     .paddingOuter(0);
        //
        // var edssBarYMax = d3.max(data.edss_scores, function (d) {return +d.count});
        // var edssBarYScale = d3.scaleLog()
        //     .domain([1, edssBarYMax])
        //     .range([g5Height, 30])
        //     .base(5);
        //
        // edss_bars.enter()
        //     .append("rect")
        //     .attr("x", function(d) { return edssBarXScale(d.score) })
        //     .attr("y", function(d) { return edssBarYScale(d.count) })
        //     .attr("width", edssBarXScale.bandwidth)
        //     .attr("height", function(d) { return g5Height - edssBarYScale(d.count)  })
        //     .attr("class", "changeCursor")
        //     .attr("fill", "lightblue")
        //     .attr("data-selected", "false")
        //     .on('click', function(d) { alert($(this).data("selected")); $(this).data({"selected": true} )  });
        //
        // var edssBarsBottomAxis = d3.axisBottom(edssBarXScale);
        // var edssBarsLeftAxis = d3.axisLeft(edssBarYScale)
        //     .ticks(4);
        //
        // g5.append("g")
        //     .attr("class", "bottom axis")
        //     .attr("transform", "translate(0,"+g5Height+")")
        //     .call(edssBarsBottomAxis)
        //     .selectAll("text")
        //     .attr("y", 5)
        //     .attr("x", -8)
        //     .attr("text-anchor", "end")
        //     .attr("transform", "rotate(-60)")
        //     .style("font-size","14px");
        //
        // g5.append("text")
        //     .attr("class", "x axis-label")
        //     .attr("x", g5Width / 2)
        //     .attr("y", g5Margin.top)
        //     .attr("font-size", "18px")
        //     .attr("text-anchor", "middle")
        //     .text("Recent EDSS");
        //
        // g5.append("g")
        //     .attr("class", "left axis")
        //     .call(edssBarsLeftAxis)
        //     .selectAll("text")
        //     .style("font-size", "12px");
        //
        // g5.append("text")
        //     .attr("class", "y axis-label")
        //     .attr("x", - (g5Height / 2))
        //     .attr("y", -60)
        //     .attr("font-size", "12px")
        //     .attr("text-anchor", "middle")
        //     .attr("transform", "rotate(-90)")
        //     .text("N Subjects");
        //

        // END EDSS HISTOGRAM

        // START AGE ONSET HISTOGRAM
        var g7Margin = {"left":125, "top":15, "right":0, "bottom":60}
        var g7Height = 250 - g7Margin.top - g7Margin.bottom;
        var g7Width = 350 - g7Margin.left - g7Margin.right;


        data.age_onset.forEach(function(d) {
            d.count = + d.count;
        });

        var g7 = d3.select("#age_onset_chart")
            .append("svg")
            .attr("width", g7Width + g7Margin.left + g7Margin.right)
            .attr("height",g7Height + g7Margin.top + g7Margin.bottom)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ g7Margin.left + "," + g7Margin.top + ")");

        var onset_bars = g7.selectAll("rect").data(data.age_onset);

        var onsetList = data.age_onset.map(function(d) { return d.age_range;});

        var onsetBarXScale = d3.scaleBand()
            .domain(onsetList)
            .range([0, g7Width])
            .paddingInner(0.05)
            .paddingOuter(0);

        var onsetBarYMax = d3.max(data.age_onset, function (d) {return +d.count});
        var onsetBarYScale = d3.scaleLog()
            .domain([1, onsetBarYMax])
            .range([g7Height, 30])
            .base(5);

        onset_bars.enter()
            .append("rect")
            .attr("x", function(d) { return onsetBarXScale(d.age_range) })
            .attr("y", function(d) { return onsetBarYScale(d.count) })
            .attr("width", onsetBarXScale.bandwidth)
            .attr("height", function(d) { return g7Height - onsetBarYScale(d.count)  })
            .attr("fill", "#ff8c00")
            .attr("class", "changeCursor")
            .on('click', function(d) { sendQuery("age_range", d.age_range); if ($(this).hasClass("selectedBar")) { $(this).removeClass("selectedBar"); $(this).attr("fill", "#ff8c00") } else { $(this).addClass("selectedBar"); $(this).attr("fill", "whitesmoke"); $(this).attr("stroke", "lightgrey"); } } );

        var onsetBarsBottomAxis = d3.axisBottom(onsetBarXScale);
        var onsetBarsLeftAxis = d3.axisLeft(onsetBarYScale)
            .ticks(4);

        g7.append("g")
            .attr("class", "bottom axis")
            .attr("transform", "translate(0,"+g7Height+")")
            .call(onsetBarsBottomAxis)
            .selectAll("text")
            .attr("y", 5)
            .attr("x", -8)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")
            .style("font-size","14px");

        g7.append("text")
            .attr("class", "x axis-label")
            .attr("x", g7Width / 2)
            .attr("y", g7Margin.top)
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .text("Age of Onset");

        g7.append("g")
            .attr("class", "left axis")
            .call(onsetBarsLeftAxis)
            .selectAll("text")
            .style("font-size", "12px");

        g7.append("text")
            .attr("class", "y axis-label")
            .attr("x", - (g7Height / 2))
            .attr("y", -50)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("N Subjects");
        // END AGE ONSET HISTOGRAM

        // START GRAPH UPDATE CODE
        var params = {}
        function sendQuery(param, value) {
            //console.log(param, value)
            // each time a user clicks a graphic element, it is either added to the query string filter (click on) or removed from it (click off)
            // the first part of the function handles managing the filtering parameters and building the query string to attach to the AJAX request
            queryUrl = "/home/biorepo_data.json";
            if (param) {
                if (params[param]) {
                    if (params[param].indexOf(value) === -1) {
                        params[param].push(value);
                    }
                    else {
                        idx = params[param].indexOf(value);
                        params[param].splice(idx, 1);
                        if (params[param].length < 1) {
                            delete params[param];
                        }
                    }
                }
                else {
                    params[param] = [value]
                }
                queryString = "?";
                paramsArray = [];
                Object.keys(params).forEach(function(key) {
                    values = params[key]
                    values.forEach(function(value){
                        paramsArray.push(key+"[]="+value);
                    })
                });
                //console.log(paramsArray)
                queryString += paramsArray.join("&");
                //console.log(queryString)
                queryUrl = queryUrl + queryString;
                console.log(queryUrl);
            }
            //console.log(params)

            $.get(queryUrl).done(function(data) {
                console.log("done", data);

                sampleTypes = data.samples.map(function(obj) { return obj.sampleType });

                popTypes = data.samples[0].values.map(function(obj) { return obj.population; });

                x0.domain(sampleTypes);
                x1.domain(popTypes);

                var yMax = d3.max(data.samples, function(sampleType) { return d3.max(sampleType.values, function(d) {  return +d.count }) });
                y.domain([0,yMax]);
                // In order for the rects to properly resize it is necessary to join the new data to the slice elements from the samples graph.
                slice.data(data.samples);
                // JOIN data to existing elements
                var rects = slice.selectAll("rect")
                    .data(function(d) { return d.values; });

                // EXIT existing elements not present in new data
                rects.exit().remove();

                // UPDATE existing elements present in new data
                rects.attr("width", x1.bandwidth()).transition(t)
                    .attr("x", function(d) { return x1(d.population); })
                    .attr("y", function(d) { return y(+d.count); })
                    .attr("height", function(d) { return g1_height - y(+d.count); });

                // ENTER new elements present in new data
                rects.enter().append("rect")
                    .attr("width", x1.bandwidth())
                    .attr("x", function(d) { return x1(d.population); })
                    .style("fill", function(d) { return sampleBarsColor(d.population); })
                    .attr("y", function(d) { return y(+d.count); })
                    .attr("height", function(d) { return g1_height - y(+d.count); });

                var samplesBottomAxis = d3.axisBottom(x0);
                var samplesLeftAxis = d3.axisLeft(y)
                    .ticks(12);

                xAxisGroup.transition(t).call(samplesBottomAxis)
                    .selectAll("text")
                    .attr("y", 15)
                    .attr("font-size", 16);

                yAxisGroup.transition(t).call(samplesLeftAxis)
                    .selectAll("text")
                    .style("font-size", 12);

            });
        }
    }); // closes AJAX call to /home/biorepo_data.json

});

