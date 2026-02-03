/*
 * AgeVis - Age distribution visualization
 * @param _parentElement  -- the HTML element in which to draw the visualization
 * @param _data           -- the survey data
 */

class AgeVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain([0, 99]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.agePath = vis.svg.append("path")
            .attr("class", "area area-age");

        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d, index) { return vis.x(index); })
            .y0(vis.height)
            .y1(function (d) { return vis.y(d); });

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Votes");

        vis.svg.append("text")
            .attr("x", vis.width - 5)
            .attr("y", vis.height + 25)
            .text("Age");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        let votesPerAge = d3.range(0, 100).map(function() {
            return 0;
        });

        vis.filteredData.forEach(function(day) {
            d3.range(0, 100).forEach(function(age) {
                votesPerAge[age] += day.ages[age];
            });
        });

        vis.displayData = votesPerAge;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.y.domain(d3.extent(vis.displayData));

        vis.agePath
            .datum(vis.displayData)
            .transition()
            .attr("d", vis.area);

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;

        vis.filteredData = vis.data.filter(function(d) {
            return d.time >= selectionStart && d.time <= selectionEnd;
        });

        vis.wrangleData();
    }
}
