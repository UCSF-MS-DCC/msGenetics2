$(document).on("turbolinks:load", function(){

    if (window.location.pathname === "/biorepository") {
        $('#infoModal').modal('show');
        seenModal = true;
    }

    // Hide the request modal on submitting
    $('#requestForm').on('submit', function() {
        alert("Thank you for your interest. Our biorepository manager will contact you by  email.");
        $('#formModal').modal('hide');
    });

    $('.scroll-to-table').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#dashtop").offset().top
        }, 500);
    });

    if (window.location.pathname === "/dashboard") {
        $.get("/home/biorepo_data.json", function(data) {
            function addUnderScores(str) {
                if (str.split(" ").length > 1) {
                    return str.split(" ").join("_");
                } else {
                    return str;
                }
            }
            var activeGraphSelections = {};
            var activeUnrelatedGraphSelections = {};

            function updateSelections(category, value) {
                var queryURL = "/home/biorepo_update.json";
                //parse the activeGraphSelections hash that contains all the phenotypes the user has selected
                //and build a query string to attach to the base update URL
                if (activeGraphSelections[category]) {
                    var idx = activeGraphSelections[category].indexOf(value)
                    if (idx  > -1) {
                        activeGraphSelections[category].splice(idx, 1);
                    } else {
                        activeGraphSelections[category].push(value);
                    }
                } else {
                    activeGraphSelections[category] = [value];
                }
                var queryString = "?";
                var paramsArray = [];
                Object.keys(activeGraphSelections).forEach(function (key) {
                    var values = activeGraphSelections[key];
                    values.forEach(function (value) {
                        paramsArray.push(key + "[]=" + value);
                    })
                });
                queryString += paramsArray.join("&");
                if (paramsArray.length > 0) {
                    queryURL = queryURL + queryString;
                };
                //call the update url and write the results to the table
                $.get(queryURL, function(data) {
                    $('#cases-serum').text(data.serum.cases);
                    $('#related-serum').text(data.serum.related_unaffected);
                    $('#cases-plasma').text(data.plasma.cases);
                    $('#related-plasma').text(data.plasma.related_unaffected);
                    $('#cases-dna').text(data.dna.cases);
                    $('#related-dna').text(data.dna.related_unaffected);
                });

                //update the text list showing phenotypes
                var courses = activeGraphSelections.disease_course ? activeGraphSelections.disease_course : []; var ages = activeGraphSelections.age_range ?  activeGraphSelections.age_range : [];
                var sexes = activeGraphSelections.sex ? activeGraphSelections.sex : [];
                var ancestries = [];
                if (activeGraphSelections.race) {
                    ancestries = activeGraphSelections.race.map(function(value) {
                        var firstLetter = value.charAt(0).toUpperCase();
                        var letters = value.split('');
                        letters[0] = firstLetter;
                        if (letters.indexOf(' ') !== -1) {
                            nextCapIdx = letters.indexOf(' ') + 1;
                            letters[nextCapIdx] = letters[nextCapIdx].toUpperCase();
                        }
                        return letters.join('');
                    })
                }
                var courseString = courses.length > 0 ? courses.join(", ") : "All";
                var ageOnsetString = ages.length > 0 ? ages.join(", ") : "All";
                var sexString = sexes.length > 0 ? sexes.join(", ") : "All";
                var ancestryString = ancestries.length > 0 ? ancestries.join(", ") : "All";

                if (courses.length + ages.length + sexes.length + ancestries.length < 1) {
                    courseString = "-";
                    ageOnsetString = "-";
                    sexString = "-";
                    ancestryString = "-";
                }

                $('#pheno-box-course-list').text(courseString);
                $('#pheno-box-age-list').text(ageOnsetString);
                $('#pheno-box-sex-list').text(sexString);
                $('#pheno-box-ancestry-list').text(ancestryString);

                // Prefill the phenotypes box in the request form
                formString = "Disease Course: "+ courseString +"\nAge of Onset: "+ ageOnsetString +"\nSex: "+ sexString + "\nAncestry: " + ancestryString;
                $('#formStudyGroup').val(formString);

            } //closes updateSelections function definition
            function updateUnrelatedSelections(category, value) {
                var queryURL = "/home/biorepo_update_unrelated.json";
                //parse the activeGraphSelections hash that contains all the phenotypes the user has selected
                //and build a query string to attach to the base update URL
                if (activeUnrelatedGraphSelections[category]) {
                    var idx = activeUnrelatedGraphSelections[category].indexOf(value)
                    if (idx  > -1) {
                        activeUnrelatedGraphSelections[category].splice(idx, 1);
                    } else {
                        activeUnrelatedGraphSelections[category].push(value);
                    }
                } else {
                    activeUnrelatedGraphSelections[category] = [value];
                }
                var queryString = "?";
                var paramsArray = [];
                Object.keys(activeUnrelatedGraphSelections).forEach(function (key) {
                    var values = activeUnrelatedGraphSelections[key];
                    values.forEach(function (value) {
                        paramsArray.push(key + "[]=" + value);
                    })
                });
                queryString += paramsArray.join("&");
                if (paramsArray.length > 0) {
                    queryURL = queryURL + queryString;
                };
                //call the update url and write the results to the table
                $.get(queryURL, function(data) {
                    $('#controls-serum').text(data.serum);
                    $('#controls-plasma').text(data.plasma);
                    $('#controls-dna').text(data.dna);
                });

                //update the text list showing phenotypes
                var sexes = activeUnrelatedGraphSelections.sex ? activeUnrelatedGraphSelections.sex : [];
                var ancestries = [];
                if (activeUnrelatedGraphSelections.race) {
                    ancestries = activeUnrelatedGraphSelections.race.map(function(value) {
                        var firstLetter = value.charAt(0).toUpperCase();
                        var letters = value.split('');
                        letters[0] = firstLetter;
                        if (letters.indexOf(' ') !== -1) {
                            nextCapIdx = letters.indexOf(' ') + 1;
                            letters[nextCapIdx] = letters[nextCapIdx].toUpperCase();
                        }
                        return letters.join('');
                    })
                }
                var sexString = sexes.length > 0 ? sexes.join(", ") : "All";
                var ancestryString = ancestries.length > 0 ? ancestries.join(", ") : "All";

                if (sexes.length + ancestries.length < 1) {
                    sexString = "-";
                    ancestryString = "-";
                }

                $('#unrelated-pheno-box-sex-list').text(sexString);
                $('#unrelated-pheno-box-ancestry-list').text(ancestryString);

                // Prefill the phenotypes box in the request form
                formString = "Sex: "+ sexString + "\nAncestry: " + ancestryString;
                $('#formStudyGroupUnaffected').val(formString);

            } //closes updateUnrelatedSelections function definition

            // Add hook to reset dashboard button
            $('#resetButton').on('click', function(){
                activeGraphSelections = {};
                activeUnrelatedGraphSelections = {};
                $('.legendEntry').removeClass('legendEntryActive').addClass('legendEntryInactive');
                $('.graphElement').removeClass('activeGraphElement').addClass('inactiveGraphElement');
                $('.legendSwatch').removeClass('activeGraphElement').addClass('inactiveGraphElement');
                updateSelections();
                updateUnrelatedSelections();
            });

             var t = d3.transition().duration(1500);
            // var g1Margin = {"left": 80, "top": 100, "right": 20, "bottom": 75}
            // var g1_height = 500 - g1Margin.top - g1Margin.bottom;
            // var g1_width = 550 - g1Margin.left - g1Margin.right;
            //
            // var g1 = d3.select("#samples_count_chart")
            //     .append("svg")
            //     .attr("width", g1_width + g1Margin.left + g1Margin.right)
            //     .attr("height", g1_height + g1Margin.top + g1Margin.bottom)
            //     //.attr("style", "border:1px solid green")
            //     .attr("style", "border-right:1px solid grey;")
            //     .append("g")
            //     .attr("transform", "translate(" + g1Margin.left + "," + g1Margin.top + ")");
            //
            // var sampleTypes = data.samples.map(function (obj) {
            //     return obj.sampleType
            // });
            //
            // var popTypes = data.samples[0].values.map(function (obj) {
            //     return obj.population;
            // })
            //
            // var x0 = d3.scaleBand()
            //     .domain(sampleTypes)
            //     .range([0, g1_width])
            //     .paddingInner(0.2)
            //     .paddingOuter(0.1);
            //
            // var x1 = d3.scaleBand()
            //     .domain(popTypes)
            //     .rangeRound([0, x0.bandwidth()])
            //     .padding(0.05);
            //
            // var yMax = d3.max(data.samples, function (sampleType) {
            //     return d3.max(sampleType.values, function (d) {
            //         return +d.count
            //     })
            // });
            //
            // var y = d3.scaleLinear()
            //     .domain([0, yMax])
            //     .range([g1_height, 0]);
            //
            // var sampleBarsColor = d3.scaleOrdinal().domain(popTypes).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#B0A8B9"]);
            //
            // var slice = g1.selectAll(".slice")
            //     .data(data.samples)
            //     .enter().append("g")
            //     .attr("class", "g")
            //     .attr("transform", function (d) {
            //         return "translate(" + (x0(d.sampleType)) + ",0)"
            //     });
            //
            // var xAxisGroup = g1.append("g")
            //     .attr("class", "bottom-axis")
            //     .attr("transform", "translate(0," + g1_height + ")");
            //
            // var yAxisGroup = g1.append("g")
            //     .attr("class", "left-axis");
            //
            // g1.append("text")
            //     .attr("class", "y axis-label")
            //     .attr("x", -(g1_height / 2))
            //     .attr("y", -60)
            //     .attr("font-size", "20px")
            //     .attr("text-anchor", "middle")
            //     .attr("transform", "rotate(-90)")
            //     .text("Study Participants with Samples");
            //
            // var g1Legend = g1.append("g")
            //     .attr("transform", "translate(15,-90)");
            // popTypes.forEach(function (population, i) {
            //     var g1LegendRow = g1Legend.append("g")
            //         .attr("transform", "translate(0," + i * 20 + ")");
            //     g1LegendRow.append("rect")
            //         .attr("width", 15)
            //         .attr("height", 15)
            //         .attr("fill", sampleBarsColor(population));
            //
            //     g1LegendRow.append("text")
            //         .attr("x", 20)
            //         .attr("y", 13)
            //         .attr("text-anchor", "start")
            //         .style("text-transform", "capitalize")
            //         .text(population);
            // })


            // END SAMPLE TYPES BAR CHART

            // BEGIN ANCESTRY PIE CHART

            data.race.forEach(function (d) {
                d.count = +d.count;
            });

            var g2Height = 220;
            var g2Width = 450;
            var g2Radius = Math.min(g2Width, g2Height) / 2;

            var g2 = d3.select("#race_chart")
                .append("svg")
                .attr("width", g2Width)
                .attr("height", g2Height)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + (g2Radius + 70) + "," + (g2Height / 2 + 15) + ")");

            var raceList = data.race.map(function (d) {
                return d.race;
            });
            var raceColors = d3.scaleOrdinal().range(["red", "lime", "blue", "purple", "gold", "cyan", "green", "blue"]);

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(g2Radius - 20);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });

            var g2Group = g2.selectAll(".arc")
                .data(pie(data.race));

            g2Group.enter().append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .style("fill", function (d, i) {
                    return raceColors(i);
                })
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.data.race) })
                .on('click', function (d, i) {
                    //sendQuery("course", course);
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                        $('#legendEntry'+addUnderScores(d.data.race)).removeClass('legendEntryInactive');
                        $('#legendEntry'+addUnderScores(d.data.race)).addClass('legendEntryActive');
                        $('#legendSwatch'+addUnderScores(d.data.race)).removeClass('inactiveGraphElement');
                        $('#legendSwatch'+addUnderScores(d.data.race)).addClass('activeGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                        $('#legendEntry'+addUnderScores(d.data.race)).addClass('legendEntryInactive');
                        $('#legendEntry'+addUnderScores(d.data.race)).removeClass('legendEntryActive');
                        $('#legendSwatch'+addUnderScores(d.data.race)).addClass('inactiveGraphElement');
                        $('#legendSwatch'+addUnderScores(d.data.race)).removeClass('activeGraphElement');
                    }
                    updateSelections("race", d.data.race)
                })

            var g2Legend = g2.append("g")
                .attr("transform", "translate(" + (g2Width - 335) + "," + (g2Height - 310) + ")");

            raceList.forEach(function (race, i) {
                var g2LegendRow = g2Legend.append("g")
                    .attr("transform", "translate(0," + (i * 16) + ")");
                g2LegendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", raceColors(i))
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px")
                    .attr("class", "inactiveGraphElement legendSwatch legendEntry" + addUnderScores(race))
                    .attr("id", "legendSwatch" + addUnderScores(race));

                g2LegendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .attr("class", "legendEntry legendEntryInactive")
                    .attr("id", "legendEntry" + addUnderScores(race))
                    .style("font-size", "11pt")
                    .text(race)
                    .on('click', function (d, i) {
                        if ($(this).hasClass('legendEntryInactive')) {
                            $(this).removeClass('legendEntryInactive');
                            $(this).addClass('legendEntryActive');
                            $('#graphElement' + addUnderScores(race)).removeClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(race)).addClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(race)).removeClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(race)).addClass('activeGraphElement');

                        } else {
                            $(this).removeClass('legendEntryActive');
                            $(this).addClass('legendEntryInactive');
                            $('#graphElement' + addUnderScores(race)).addClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(race)).removeClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(race)).addClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(race)).removeClass('activeGraphElement');
                        }
                        updateSelections("race", race)
                    });
            });
            g2.append("text")
                .attr("class", "pie-chart label")
                .attr("x", 0)
                .attr("y", -108)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Ancestry (self-declared)");

            // END ANCESTRY PIE CHART
            // BEGIN DISEASE COURSE PIE CHART

            var g3Height = 220;
            var g3Width = 350;
            var g3Radius = Math.min(g3Width, g3Height) / 2

            data.disease_course.forEach(function (d) {
                d.count = +d.count;
            });

            var g3 = d3.select("#disease_course_chart")
                .append("svg")
                .attr("width", g3Width)
                .attr("height", g3Height)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + (g3Width - g3Radius - 10) + "," + (g3Height / 2 + 15) + ")");

            var courseColors = d3.scaleOrdinal().range(["red", "lime", "orangered", "purple", "gold", "cyan", "green", "blue"]);
            var courseList = data.disease_course.map(function (d) {
                return d.disease_course;
            });

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(g3Radius - 20);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });

            var g3Group = g3.selectAll(".arc")
                .data(pie(data.disease_course));

            g3Group.enter().append("path")
                .attr("d", arc)
                .attr("class", "arc")
                .style("fill", function (d, i) {
                    return courseColors(i);
                })
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.data.disease_course) })
                .on('click', function (d, i) {
                    //sendQuery("course", course);
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                        $('#legendEntry'+d.data.disease_course).removeClass('legendEntryInactive');
                        $('#legendEntry'+d.data.disease_course).addClass('legendEntryActive');
                        $('#legendSwatch'+d.data.disease_course).removeClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.disease_course).addClass('activeGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                        $('#legendEntry'+d.data.disease_course).addClass('legendEntryInactive');
                        $('#legendEntry'+d.data.disease_course).removeClass('legendEntryActive');
                        $('#legendSwatch'+d.data.disease_course).addClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.disease_course).removeClass('activeGraphElement');
                    }
                    updateSelections("disease_course", d.data.disease_course)
                })

            var g3Legend = g3.append("g")
                .attr("transform", "translate(" + (g3Width - 500) + "," + (g3Height - 300) + ")");
            courseList.forEach(function (course, i) {
                var g3LegendRow = g3Legend.append("g")
                    .attr("transform", "translate(0," + (i * 16) + ")");
                g3LegendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", courseColors(i))
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px")
                    .attr("class", "inactiveGraphElement legendSwatch legendEntry" + addUnderScores(course))
                    .attr("id", "legendSwatch" + addUnderScores(course));

                g3LegendRow.append("text")
                    .attr("x", -10)
                    .attr("y", 10)
                    .attr("text-anchor", "end")
                    .style("text-transform", "capitalize")
                    .attr("class", "legendEntry legendEntryInactive")
                    .attr("id", "legendEntry" + addUnderScores(course))
                    .style("font-size", "11pt")
                    .text(course)
                    .on('click', function (d, i) {
                        if ($(this).hasClass('legendEntryInactive')) {
                            $(this).removeClass('legendEntryInactive');
                            $(this).addClass('legendEntryActive');
                            $('#graphElement' + addUnderScores(course)).removeClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(course)).addClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(course)).removeClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(course)).addClass('activeGraphElement');


                        } else {
                            $(this).removeClass('legendEntryActive');
                            $(this).addClass('legendEntryInactive');
                            $('#graphElement' + addUnderScores(course)).addClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(course)).removeClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(course)).addClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(course)).removeClass('activeGraphElement');
                        }
                        updateSelections("disease_course", course)
                    })
                });
            g3.append("text")
                .attr("class", "pie-chart label")
                .attr("x", 0)
                .attr("y", -108)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("MS Course");
            // END DISEASE COURSE PIE CHART

            // START SEX PIE CHART
            var g4Height = 220;
            var g4Width = 350;
            var g4Radius = Math.min(g4Width, g4Height) / 2

            data.sex.forEach(function (d) {
                d.count = +d.count;
            });

            var g4 = d3.select("#sex_chart")
                .append("svg")
                .attr("width", g4Width)
                .attr("height", g4Height)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + (g4Width - g4Radius - 10) + "," + (g4Height / 2 + 15) + ")");

            var sexColors = d3.scaleOrdinal().range(["orangered", "purple", "lime"]);
            var sexList = data.sex.map(function (d) {
                return d.sex;
            });

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(g4Radius - 20);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });

            var g4Group = g4.selectAll(".arc")
                .data(pie(data.sex));

            g4Group.enter().append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .style("fill", function (d, i) {
                    return sexColors(i);
                })
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.data.sex) })
                .on('click', function (d, i) {
                    //sendQuery("course", course);
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                        $('#legendEntry'+d.data.sex).removeClass('legendEntryInactive');
                        $('#legendEntry'+d.data.sex).addClass('legendEntryActive');
                        $('#legendSwatch'+d.data.sex).removeClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.sex).addClass('iactiveGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                        $('#legendEntry'+d.data.sex).addClass('legendEntryInactive');
                        $('#legendEntry'+d.data.sex).removeClass('legendEntryActive');
                        $('#legendSwatch'+d.data.sex).addClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.sex).removeClass('iactiveGraphElement');
                    }
                    updateSelections("sex", d.data.sex.charAt(0))
                });


            var g4Legend = g4.append("g")
                .attr("transform", "translate(" + (g4Width - 480) + "," + (g4Height - 290) + ")");
            sexList.forEach(function (sex, i) {
                var g4LegendRow = g4Legend.append("g")
                    .attr("transform", "translate(0," + (i * 16) + ")");
                g4LegendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", sexColors(i))
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px")
                    .attr("class", "inactiveGraphElement legendSwatch legendEntry" + addUnderScores(sex))
                    .attr("id", "legendSwatch" + addUnderScores(sex));

                g4LegendRow.append("text")
                    .attr("x", -10)
                    .attr("y", 10)
                    .attr("text-anchor", "end")
                    .style("text-transform", "capitalize")
                    .attr("class", "legendEntry legendEntryInactive")
                    .attr("id", "legendEntry" + addUnderScores(sex))
                    .style("font-size", "11pt")
                    .text(sex)
                    .on('click', function (d, i) {
                        if ($(this).hasClass('legendEntryInactive')) {
                            $(this).removeClass('legendEntryInactive');
                            $(this).addClass('legendEntryActive');
                            $('#graphElement' + addUnderScores(sex)).removeClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(sex)).addClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)).removeClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)).addClass('activeGraphElement');

                        } else {
                            $(this).removeClass('legendEntryActive');
                            $(this).addClass('legendEntryInactive');
                            $('#graphElement' + addUnderScores(sex)).addClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(sex)).removeClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)).addClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)).removeClass('activeGraphElement');
                        }
                        updateSelections("sex", sex.charAt(0))
                    });
            });
            g4.append("text")
                .attr("class", "pie-chart label")
                .attr("x", 0)
                .attr("y", -108)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Sex");

            // END SEX PIE CHART
            // START AGE ONSET HISTOGRAM
            var g7Margin = {"left": 80, "top": 15, "right": 75, "bottom": 50}
            var g7Height = 220 - g7Margin.top - g7Margin.bottom;
            var g7Width = 400 - g7Margin.left - g7Margin.right;


            data.age_onset.forEach(function (d) {
                d.count = +d.count;
            });

            var g7 = d3.select("#age_onset_chart")
                .append("svg")
                .attr("width", g7Width + g7Margin.left + g7Margin.right)
                .attr("height", g7Height + g7Margin.top + g7Margin.bottom)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + g7Margin.left + "," + g7Margin.top + ")");

            var onsetList = data.age_onset.map(function (d) {
                return d.age_range;
            });

            var onsetBarXScale = d3.scaleBand()
                .domain(onsetList)
                .range([0, g7Width])
                .paddingInner(0.05)
                .paddingOuter(0);

            var onsetBarYMax = d3.max(data.age_onset, function (d) {
                return +d.count
            });
            var onsetBarYScale = d3.scaleLinear()
                .domain([1, onsetBarYMax])
                .range([g7Height, 30]);
            var onsetBars = g7.selectAll("rect").data(data.age_onset);
            // REMOVE any objects not in the new data set (should be none)
            //onsetBars.exit().remove();
            // UPDATE existing objects dimensions and properties with new values
            onsetBars.transition(t)
                .attr("x", function (d) {
                    return onsetBarXScale(d.age_range)
                })
                .attr("y", function (d) {
                    return onsetBarYScale(d.count)
                })
                .attr("width", onsetBarXScale.bandwidth)
                .attr("height", function (d) {
                    return g7Height - onsetBarYScale(d.count)
                })
                //.attr("fill", "#ff8c00")
                .attr("fill", "#6231f7")
                .attr("class", "graphElement");
            // ENTER new objects if needed (should not be)
            onsetBars.enter()
                .append("rect")
                .attr("x", function (d) {
                    return onsetBarXScale(d.age_range)
                })
                .attr("y", function (d) {
                    return onsetBarYScale(d.count)
                })
                .attr("width", onsetBarXScale.bandwidth)
                .attr("height", function (d) {
                    return g7Height - onsetBarYScale(d.count)
                })
                //.attr("fill", "#ff8c00")
                .attr("fill", "#6231f7")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.age_range) })
                .on('click', function (d, i) {
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                    }
                    updateSelections("age_range", d.age_range)
                });

            var onsetXAxis = d3.axisBottom(onsetBarXScale);
            var onsetYAxis = d3.axisLeft(onsetBarYScale)
                .ticks(3);

            var onsetAxisBottom = g7.append("g")
                .attr("class", "bottom axis")
                .attr("transform", "translate(0," + g7Height + ")");

            onsetAxisBottom.call(onsetXAxis)
                .selectAll("text")
                .attr("y", 5)
                .attr("x", -8)
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-40)")
                .style("font-size", "12px");

            var onsetAxisLeft = g7.append("g")
                .attr("class", "left axis");

            onsetAxisLeft.call(onsetYAxis)
                .selectAll("text")
                .style("font-size", "12px");

            g7.append("text")
                .attr("class", "histogram-label")
                .attr("x", 100)
                .attr("y", 0)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Age of Onset");


            // END AGE ONSET HISTOGRAM
            // START UNRELATED UNAFFECTED SEX PIE CHART
            var g8Height = 220;
            var g8Width = 350;
            var g8Radius = Math.min(g8Width, g8Height) / 2

            data.sex.forEach(function (d) {
                d.count = +d.count;
            });

            var g8 = d3.select("#unrelated_sex_chart")
                .append("svg")
                .attr("width", g8Width)
                .attr("height", g8Height)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + (g8Width - g8Radius - 10) + "," + (g8Height / 2 + 15) + ")");

            var sexColors = d3.scaleOrdinal().range(["orangered", "purple", "lime"]);
            var sexList = data.unrelated_sex.map(function (d) {
                return d.sex;
            });

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(g8Radius - 20);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });

            var g8Group = g8.selectAll(".arc")
                .data(pie(data.unrelated_sex));

            g8Group.enter().append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .style("fill", function (d, i) {
                    return sexColors(i);
                })
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.data.sex)+"unrelated" })
                .on('click', function (d, i) {
                    //sendQuery("course", course);
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                        $('#legendEntry'+d.data.sex+"unrelated").removeClass('legendEntryInactive');
                        $('#legendEntry'+d.data.sex+"unrelated").addClass('legendEntryActive');
                        $('#legendSwatch'+d.data.sex+"unrelated").removeClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.sex+"unrelated").addClass('iactiveGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                        $('#legendEntry'+d.data.sex+"unrelated").addClass('legendEntryInactive');
                        $('#legendEntry'+d.data.sex+"unrelated").removeClass('legendEntryActive');
                        $('#legendSwatch'+d.data.sex+"unrelated").addClass('inactiveGraphElement');
                        $('#legendSwatch'+d.data.sex+"unrelated").removeClass('iactiveGraphElement');
                    }
                    updateUnrelatedSelections("sex", d.data.sex.charAt(0))
                });


            var g8Legend = g8.append("g")
                .attr("transform", "translate(" + (g8Width - 480) + "," + (g8Height - 290) + ")");
            sexList.forEach(function (sex, i) {
                var g8LegendRow = g8Legend.append("g")
                    .attr("transform", "translate(0," + (i * 16) + ")");
                g8LegendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", sexColors(i))
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px")
                    .attr("class", "inactiveGraphElement legendSwatch legendEntry" + addUnderScores(sex)+"unrelated")
                    .attr("id", "legendSwatch" + addUnderScores(sex)+"unrelated");

                g8LegendRow.append("text")
                    .attr("x", -10)
                    .attr("y", 10)
                    .attr("text-anchor", "end")
                    .style("text-transform", "capitalize")
                    .attr("class", "legendEntry legendEntryInactive")
                    .attr("id", "legendEntry" + addUnderScores(sex)+"unrelated")
                    .style("font-size", "11pt")
                    .text(sex)
                    .on('click', function (d, i) {
                        if ($(this).hasClass('legendEntryInactive')) {
                            $(this).removeClass('legendEntryInactive');
                            $(this).addClass('legendEntryActive');
                            $('#graphElement' + addUnderScores(sex)+"unrelated").removeClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(sex)+"unrelated").addClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)+"unrelated").removeClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)+"unrelated").addClass('activeGraphElement');

                        } else {
                            $(this).removeClass('legendEntryActive');
                            $(this).addClass('legendEntryInactive');
                            $('#graphElement' + addUnderScores(sex)+"unrelated").addClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(sex)+"unrelated").removeClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)+"unrelated").addClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(sex)+"unrelated").removeClass('activeGraphElement');
                        }
                        updateUnrelatedSelections("sex", sex.charAt(0))
                    });
            });
            g8.append("text")
                .attr("class", "pie-chart label")
                .attr("x", 0)
                .attr("y", -108)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Sex");

            // END SEX PIE CHART
            // BEGIN ANCESTRY PIE CHART

            data.race.forEach(function (d) {
                d.count = +d.count;
            });

            var g9Height = 220;
            var g9Width = 450;
            var g9Radius = Math.min(g9Width, g9Height) / 2;

            var g9 = d3.select("#unrelated_race_chart")
                .append("svg")
                .attr("width", g9Width)
                .attr("height", g9Height)
                //.attr("style", "border:1px solid green")
                .append("g")
                .attr("transform", "translate(" + (g9Radius + 70) + "," + (g9Height / 2 + 15) + ")");

            var raceList = data.unrelated_race.map(function (d) {
                return d.race;
            });
            var raceColors = d3.scaleOrdinal().range(["red", "lime", "blue", "purple", "gold", "cyan", "green", "blue"]);

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(g9Radius - 20);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });

            var g9Group = g9.selectAll(".arc")
                .data(pie(data.unrelated_race));

            g9Group.enter().append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .style("fill", function (d, i) {
                    return raceColors(i);
                })
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("class", function(d, i) { return "graphElement inactiveGraphElement" })
                .attr("id", function(d, i) { return "graphElement"+ addUnderScores(d.data.race)+"unrelated" })
                .on('click', function (d, i) {
                    //sendQuery("course", course);
                    if ($(this).hasClass('inactiveGraphElement')) {
                        $(this).removeClass('inactiveGraphElement');
                        $(this).addClass('activeGraphElement');
                        $('#legendEntry'+addUnderScores(d.data.race)+"unrelated").removeClass('legendEntryInactive');
                        $('#legendEntry'+addUnderScores(d.data.race)+"unrelated").addClass('legendEntryActive');
                        $('#legendSwatch'+addUnderScores(d.data.race)+"unrelated").removeClass('inactiveGraphElement');
                        $('#legendSwatch'+addUnderScores(d.data.race)+"unrelated").addClass('activeGraphElement');
                    } else {
                        $(this).removeClass('activeGraphElement');
                        $(this).addClass('inactiveGraphElement');
                        $('#legendEntry'+addUnderScores(d.data.race)+"unrelated").addClass('legendEntryInactive');
                        $('#legendEntry'+addUnderScores(d.data.race)+"unrelated").removeClass('legendEntryActive');
                        $('#legendSwatch'+addUnderScores(d.data.race)+"unrelated").addClass('inactiveGraphElement');
                        $('#legendSwatch'+addUnderScores(d.data.race)+"unrelated").removeClass('activeGraphElement');
                    }
                    updateUnrelatedSelections("race", d.data.race)
                })

            var g9Legend = g9.append("g")
                .attr("transform", "translate(" + (g9Width - 335) + "," + (g9Height - 310) + ")");

            raceList.forEach(function (race, i) {
                var g9LegendRow = g9Legend.append("g")
                    .attr("transform", "translate(0," + (i * 16) + ")");
                g9LegendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", raceColors(i))
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px")
                    .attr("class", "inactiveGraphElement legendSwatch legendEntry" + addUnderScores(race)+"unrelated")
                    .attr("id", "legendSwatch" + addUnderScores(race)+"unrelated");

                g9LegendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .attr("class", "legendEntry legendEntryInactive")
                    .attr("id", "legendEntry" + addUnderScores(race)+"unrelated")
                    .style("font-size", "11pt")
                    .text(race)
                    .on('click', function (d, i) {
                        if ($(this).hasClass('legendEntryInactive')) {
                            $(this).removeClass('legendEntryInactive');
                            $(this).addClass('legendEntryActive');
                            $('#graphElement' + addUnderScores(race)+"unrelated").removeClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(race)+"unrelated").addClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(race)+"unrelated").removeClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(race)+"unrelated").addClass('activeGraphElement');

                        } else {
                            $(this).removeClass('legendEntryActive');
                            $(this).addClass('legendEntryInactive');
                            $('#graphElement' + addUnderScores(race)+"unrelated").addClass('inactiveGraphElement');
                            $('#graphElement' + addUnderScores(race)+"unrelated").removeClass('activeGraphElement');
                            $('#legendSwatch' + addUnderScores(race)+"unrelated").addClass('inactiveGraphElement');
                            $('#legendSwatch' + addUnderScores(race)+"unrelated").removeClass('activeGraphElement');
                        }
                        updateUnrelatedSelections("race", race)
                    });
            });
            g9.append("text")
                .attr("class", "pie-chart label")
                .attr("x", 0)
                .attr("y", -108)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Ancestry (self-declared)");

            // END ANCESTRY PIE CHART

            //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ START GRAPH UPDATE CODE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
            // The params hash holds the categories and values selected to be hidden from the graphs.
            var params = {};


            function sendQuery(param, value) {
                // each time a user clicks a graphic element, it is either added to the query string filter (click on) or removed from it (click off)
                // the first part of the function handles managing the filtering parameters and building the query string to attach to the AJAX request
                queryUrl = "/home/biorepo_data.json";
                if (param) {
                    var legendClass = '.legendEntry' + addUnderScores(value);
                    if (params[param]) {
                        if (params[param].indexOf(value) === -1) {
                            params[param].push(value);
                            $(legendClass).removeClass('legendEntryActive');
                            $(legendClass).addClass('legendEntryInactive');
                        }
                        else {
                            idx = params[param].indexOf(value);
                            params[param].splice(idx, 1);
                            if (params[param].length < 1) {
                                delete params[param];
                            }
                            $(legendClass).removeClass('legendEntryInactive');
                            $(legendClass).addClass('legendEntryActive');
                        }
                    }
                    else {
                        params[param] = [value];
                        $(legendClass).removeClass('legendEntryActive');
                        $(legendClass).addClass('legendEntryInactive');
                    }
                    queryString = "?";
                    paramsArray = [];
                    Object.keys(params).forEach(function (key) {
                        values = params[key];
                        values.forEach(function (value) {
                            paramsArray.push(key + "[]=" + value);
                        })
                    });
                    queryString += paramsArray.join("&");
                    queryUrl = queryUrl + queryString;
                }
                // Update the request form by prefilling the phenotypes field with values NOT filtered from the graphs (i.e. that are not part of the params hash). See _form_modal.html.erb view
                $('#formStudyGroup').val(addFormPhenotypes(params));
                // make AJAX call to the biorepository data endpoint and redraw the graphs
                $.get(queryUrl).done(function (data) {

                    sampleTypes = data.samples.map(function (obj) {
                        return obj.sampleType
                    });

                    popTypes = data.samples[0].values.map(function (obj) {
                        return obj.population;
                    });

                    x0.domain(sampleTypes);
                    x1.domain(popTypes);

                    var yMax = d3.max(data.samples, function (sampleType) {
                        return d3.max(sampleType.values, function (d) {
                            return +d.count
                        })
                    });
                    y.domain([0, yMax]);
                    // In order for the rects to properly resize it is necessary to join the new data to the slice elements from the samples graph.
                    slice.data(data.samples);
                    // JOIN data to existing elements
                    var rects = slice.selectAll("rect")
                        .data(function (d) {
                            return d.values;
                        });

                    // EXIT existing elements not present in new data
                    rects.exit().remove();

                    // UPDATE existing elements present in new data
                    rects.attr("width", x1.bandwidth()).transition(t)
                        .attr("x", function (d) {
                            return x1(d.population);
                        })
                        .attr("y", function (d) {
                            return y(+d.count);
                        })
                        .attr("height", function (d) {
                            return g1_height - y(+d.count);
                        });

                    // ENTER new elements present in new data
                    rects.enter().append("rect")
                        .attr("width", x1.bandwidth())
                        .attr("x", function (d) {
                            return x1(d.population);
                        })
                        .style("fill", function (d) {
                            return sampleBarsColor(d.population);
                        })
                        .attr("y", function (d) {
                            return y(+d.count);
                        })
                        .attr("height", function (d) {
                            return g1_height - y(+d.count);
                        });

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

                    // update and redraw the doughnut charts
                    function arcTween(a) {
                        var i = d3.interpolate(this._current, a);
                        this._current = i(0);
                        return function (b) {
                            return arc(i(b));
                        };
                    }

                    var g2arcs = g2.selectAll(".arc")
                        .data(pie(data.race));

                    g2arcs.transition(t)
                        .attrTween("d", arcTween);

                    g2arcs.enter().append("path")
                        .attr("class", "arc graphElement")
                        .attr("fill", function (d, i) {
                            return raceColors(i);
                        })
                        .attr("d", arc)
                        .each(function (d) {
                            this._current = d;
                        })
                        .on('mouseover', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.race)).addClass("underlineLegendEntry")
                        })
                        .on('mouseout', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.race)).removeClass("underlineLegendEntry")
                        })
                        .on('click', function (d, i) {
                            sendQuery("race", d.data.race);
                        });

                    var g3arcs = g3.selectAll(".arc")
                        .data(pie(data.disease_course));

                    g3arcs.transition(t)
                        .attrTween("d", arcTween);

                    g3arcs.enter().append("path")
                        .attr("class", "arc graphElement")
                        .attr("fill", function (d, i) {
                            return courseColors(i);
                        })
                        .attr("d", arc)
                        .each(function (d) {
                            this._current = d;
                        })
                        .on('mouseover', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.disease_course)).addClass("underlineLegendEntry")
                        })
                        .on('mouseout', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.disease_course)).removeClass("underlineLegendEntry")
                        })
                        .on('click', function (d, i) {
                            sendQuery("course", d.data.disease_course);
                        });

                    var g4arcs = g4.selectAll(".arc")
                        .data(pie(data.sex));

                    g4arcs.transition(t)
                        .attrTween("d", arcTween);

                    g4arcs.enter().append("path")
                        .attr("class", "arc graphElement")
                        .attr("fill", function (d, i) {
                            return sexColors(i);
                        })
                        .attr("d", arc)
                        .each(function (d) {
                            this._current = d;
                        })
                        .on('mouseover', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.sex)).addClass("underlineLegendEntry")
                        })
                        .on('mouseout', function (d, i) {
                            $('.legendEntry' + addUnderScores(d.data.sex)).removeClass("underlineLegendEntry")
                        })
                        .on('click', function (d, i) {
                            sendQuery("sex", d.data.sex);
                        });
                    // update and redraw the age of onset histogram

                    onsetList = data.age_onset.map(function (d) {
                        return d.age_range;
                    });
                    onsetBarXScale.domain(onsetList);
                    onsetBarYMax = d3.max(data.age_onset, function (d) {
                        return +d.count;
                    });
                    onsetBarYScale.domain([0, onsetBarYMax]);
                    //JOIN data to objects
                    var onsetBars = g7.selectAll("rect").data(data.age_onset);
                    // REMOVE any objects not in the new data set (should be none)
                    //onsetBars.exit().remove();
                    // UPDATE existing objects dimensions and properties with new values
                    onsetBars.transition(t)
                        .attr("x", function (d) {
                            return onsetBarXScale(d.age_range)
                        })
                        .attr("y", function (d) {
                            return onsetBarYScale(d.count)
                        })
                        .attr("width", onsetBarXScale.bandwidth)
                        .attr("height", function (d) {
                            return g7Height - onsetBarYScale(d.count)
                        })
                        //.attr("fill", "#ff8c00")
                        .attr("fill", "#6231f7")
                        .attr("class", "graphElement");
                    // ENTER new objects if needed (should not be)
                    onsetBars.enter()
                        .append("rect")
                        .attr("x", function (d) {
                            return onsetBarXScale(d.age_range)
                        })
                        .attr("y", function (d) {
                            return onsetBarYScale(d.count)
                        })
                        .attr("width", onsetBarXScale.bandwidth)
                        .attr("height", function (d) {
                            return g7Height - onsetBarYScale(d.count)
                        })
                        //.attr("fill", "#ff8c00")
                        .attr("fill", "#6231f7")
                        .attr("class", "graphElement")
                        .on('click', function (d, i) {
                            sendQuery("age_range", d.age_range)
                        });

                    var onsetXAxis = d3.axisBottom(onsetBarXScale);
                    var onsetYAxis = d3.axisLeft(onsetBarYScale)
                        .ticks(3);

                    onsetAxisBottom.call(onsetXAxis)
                        .selectAll("text")
                        .attr("y", 5)
                        .attr("x", -8)
                        .attr("text-anchor", "end")
                        .attr("transform", "rotate(-40)")
                        .style("font-size", "12px");

                    onsetAxisLeft.transition(t).call(onsetYAxis)
                        .selectAll("text")
                        .style("font-size", "12px");


                }); // closes sendQuery callback function
            }

        }); // closes AJAX call to /home/biorepo_data.json
    }
});

