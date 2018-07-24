$(document).on("turbolinks:load", function(){
    $.get("/home/biorepo_data.json", function(data) {
        console.log(data);

        data.sample_types.forEach(function(d) {
            d.count = +d.count
        });
        var g1Margin = {"left":80, "top":20, "right": 20, "bottom":90}
        var g1_height = 600 - g1Margin.top - g1Margin.bottom;
        var g1_width = 500 - g1Margin.left - g1Margin.right;

        var g1 = d3.select("#samples_count_chart")
            .append("svg")
            .attr("width", g1_width + g1Margin.left + g1Margin.right)
            .attr("height", g1_height + g1Margin.top + g1Margin.bottom)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+g1Margin.left+","+g1Margin.top+")");



        var sample_bars = g1.selectAll("rect").data(data.sample_types);

        var sampleDomainCategories = data.sample_types.map(function(stype) {return stype.material});
        var sampleBarXScale = d3.scaleBand()
            .domain(sampleDomainCategories)
            .range([0, g1_width])
            .paddingInner(0.3)
            .paddingOuter(0.3);

        var sampleBarYMax = d3.max(data.sample_types, function (d) {return +d.count});
        var sampleBarYScale = d3.scaleLog()
            .domain([1, sampleBarYMax])
            .range([g1_height, 0])
            .base(4);

        var sampleBarsColor = d3.scaleOrdinal().domain(sampleDomainCategories).range(d3.schemeCategory10);

        sample_bars.enter()
            .append("rect")
            .attr("x", function(d) { return sampleBarXScale(d.material) })
            .attr("y", function(d) { return sampleBarYScale(d.count) })
            .attr("width", sampleBarXScale.bandwidth)
            .attr("height", function(d) { return g1_height - sampleBarYScale(d.count) })
            .attr("fill", function(d) { return sampleBarsColor(d.material) });

        var sampleBarsBottomAxis = d3.axisBottom(sampleBarXScale);
        var sampleBarsLeftAxis = d3.axisLeft(sampleBarYScale)
            .ticks(12);

        g1.append("g")
            .attr("class", "bottom axis")
            .attr("transform", "translate(0,"+g1_height+")")
            .call(sampleBarsBottomAxis)
            .selectAll("text")
                .attr("y", 20)
                .style("font-size","16px");

        g1.append("text")
            .attr("class", "x axis-label")
            .attr("x", g1_width / 2)
            .attr("y", g1_height + 75)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Sample Material");

        g1.append("g")
            .attr("class", "left axis")
            .call(sampleBarsLeftAxis)
            .selectAll("text")
                .style("font-size", "12px");

        g1.append("text")
            .attr("class", "y axis-label")
            .attr("x", - (g1_height / 2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Number of Subjects with Sample Type");

        // END SAMPLE TYPES BAR CHART

        // BEGIN RACE PIE CHART

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
        var raceColors = d3.scaleOrdinal().range(d3.schemeCategory20);

        var arc = d3.arc()
            .innerRadius(0)
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
            .style("fill", function(d, i) { return raceColors(i); });

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
                .text(race);
        });
        g2.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Race");

        // END RACE PIE CHART

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
            .attr("transform", "translate("+ (g3Radius + 25) + "," + (g3Height / 2 + 5) + ")");

        var courseColors = d3.scaleOrdinal().range(d3.schemeCategory20);
        var courseList = data.disease_course.map(function(d) { return d.disease_course;});
        console.log(courseList);

        var arc = d3.arc()
            .innerRadius(0)
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
            .style("fill", function(d, i) { return courseColors(i); });

        var g3Legend = g3.append("g")
            .attr("transform", "translate(" + (g2Width -250) + "," + (g2Height - 265)+")" );
        courseList.forEach(function(course, i) {
            var g3LegendRow = g3Legend.append("g")
                .attr("transform", "translate(0," + (i * 20) + ")");
            g3LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", courseColors(i));

            g3LegendRow.append("text")
                .attr("x", 20)
                .attr("y", 10)
                .attr("text-anchor", "start")
                .style("text-transform", "capitalize")
                .text(course);
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
            .innerRadius(0)
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
            .style("fill", function(d, i) { return sexColors(i); });

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
                .text(sex);
        });
        g4.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Sex");

        // END SEX PIE CHART


        // START EDSS PIE CHART
        var g5Height = 200;
        var g5Width = 350;
        var g5Radius = Math.min(g5Width, g5Height) / 2

        data.disease_course.forEach(function(d) {
            d.count = + d.count;
        });

        var g5 = d3.select("#edss_chart")
            .append("svg")
            .attr("width", g5Width)
            .attr("height",g5Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g5Radius + 25) + "," + (g5Height / 2 + 5) + ")");

        var edssColors = d3.scaleOrdinal().range(d3.schemeCategory20);
        var edssList = data.edss_scores.map(function(d) { return d.score;});
        console.log(edssList);

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(g5Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g5Group = g5.selectAll(".arc")
            .data(pie(data.edss_scores))
            .enter().append("g")
            .attr("class", "arc");

        g5Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return edssColors(i); });

        var g5Legend = g5.append("g")
            .attr("transform", "translate(" + (g5Width -250) + "," + (g5Height - 265)+")" );
        edssList.forEach(function(edss, i) {
            var g5LegendRow = g5Legend.append("g")
                .attr("transform", "translate(0," + (i * 20) + ")");
            g5LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", edssColors(i));

            g5LegendRow.append("text")
                .attr("x", 20)
                .attr("y", 10)
                .attr("text-anchor", "start")
                .style("text-transform", "capitalize")
                .text(edss);
        });
        g5.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("EDSS Scores");


        // END EDSS PIE CHART

        // START HISPANIC PIE CHART
        var g6Height = 200;
        var g6Width = 350;
        var g6Radius = Math.min(g6Width, g6Height) / 2

        data.hispanic.forEach(function(d) {
            d.count = + d.count;
        });

        var g6 = d3.select("#hispanic_chart")
            .append("svg")
            .attr("width", g6Width)
            .attr("height",g6Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g6Width - g6Radius - 10) + "," + (g6Height / 2 + 5) + ")");

        var hispanicColors = d3.scaleOrdinal().range(d3.schemeCategory20);
        var hispanicList = data.hispanic.map(function(d){ return d.is_hispanic; });

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(g6Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g6Group = g6.selectAll(".arc")
            .data(pie(data.hispanic))
            .enter().append("g")
            .attr("class", "arc");

        g6Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return hispanicColors(i); });

        var g6Legend = g6.append("g")
            .attr("transform", "translate(" + (g6Width -450) + "," + (g6Height - 260)+")" );
        hispanicList.forEach(function(h, i) {
            var g6LegendRow = g6Legend.append("g")
                .attr("transform", "translate(0," + (i * 20) + ")");
            g6LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", hispanicColors(i));

            g6LegendRow.append("text")
                .attr("x", -10)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .style("text-transform", "capitalize")
                .text(h);
        });
        g6.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 5)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Hispanic ethnicity");
        // END HISPANIC PIE CHART

        // START AGE ONSET PIE CHART
        var g7Height = 200;
        var g7Width = 350;
        var g7Radius = Math.min(g7Width, g7Height) / 2

        data.age_onset.forEach(function(d) {
            d.count = + d.count;
        });

        var g7 = d3.select("#age_onset_chart")
            .append("svg")
            .attr("width", g7Width)
            .attr("height",g7Height)
            //.attr("style", "border:1px solid green")
            .append("g")
            .attr("transform", "translate("+ (g7Radius + 25) + "," + (g7Height / 2 + 5) + ")");

        var onsetColors = d3.scaleOrdinal().range(d3.schemeCategory20);
        var onsetList = data.age_onset.map(function(d) { return d.age_range;});
        console.log(onsetList);

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(g7Radius - 20);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var g7Group = g7.selectAll(".arc")
            .data(pie(data.age_onset))
            .enter().append("g")
            .attr("class", "arc");

        g7Group.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) { return onsetColors(i); });

        var g7Legend = g7.append("g")
            .attr("transform", "translate(" + (g7Width -250) + "," + (g7Height - 265)+")" );
        onsetList.forEach(function(age, i) {
            var g7LegendRow = g7Legend.append("g")
                .attr("transform", "translate(0," + (i * 20) + ")");
            g7LegendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", onsetColors(i));

            g7LegendRow.append("text")
                .attr("x", 75)
                .attr("y", 10)
                .attr("text-anchor", "end")
                .style("text-transform", "capitalize")
                .text(age);
        });
        g7.append("text")
            .attr("class", "pie-chart label")
            .attr("x", 0)
            .attr("y", -90)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Onset Age");


        // END AGE ONSET PIE CHART




    }); // closes AJAX call to /home/biorepo_data.json
});