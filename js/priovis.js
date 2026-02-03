/*
 * PrioVis - Priority ranking bar chart
 * @param _parentElement  -- the HTML element in which to draw the visualization
 * @param _data           -- the survey data (perDayData)
 * @param _metaData       -- metadata containing priority labels
 */

class PrioVis {

    constructor(_parentElement, _data, _metaData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.metaData = _metaData;
        this.filteredData = this.data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2)
            .domain(d3.range(0, 15));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Votes");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        let votesPerPriority = d3.range(0, 15).map(function() {
            return 0;
        });

        vis.filteredData.forEach(function(day) {
            d3.range(0, 15).forEach(function(priority) {
                votesPerPriority[priority] += day.priorities[priority];
            });
        });

        vis.displayData = votesPerPriority;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.y.domain([0, d3.max(vis.displayData)]);

        let bars = vis.svg.selectAll(".bar")
            .data(vis.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition()
            .attr("width", vis.x.bandwidth())
            .attr("height", function (d) {
                return vis.height - vis.y(d);
            })
            .attr("x", function (d, index) {
                return vis.x(index);
            })
            .attr("y", function (d) {
                return vis.y(d);
            });

        bars.exit().remove();

        vis.svg.select(".y-axis").call(vis.yAxis);

        vis.svg.select(".x-axis").call(vis.xAxis)
            .selectAll("text")
            .text(function(d) {
                return vis.metaData.priorities[d]["item-title"];
            })
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
    }

    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;

        vis.filteredData = vis.data.filter(function(d) {
            return d.time >= selectionStart && d.time <= selectionEnd;
        });

        vis.wrangleData();
    }
}
