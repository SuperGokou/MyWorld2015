/*
 * CountVis - Time series visualization with brush and zoom
 * @param _parentElement  -- the HTML element in which to draw the visualization
 * @param _data           -- the survey data (perDayData)
 * @param _eventHandler   -- event handler for cross-visualization communication
 */

class CountVis {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.eventHandler = _eventHandler;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, function(d) { return d.time; }));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(6);

        let minMaxY = [0, d3.max(vis.data.map(function (d) { return d.count; }))];
        vis.y.domain(minMaxY);

        vis.minMaxX = d3.extent(vis.data.map(function (d) { return d.time; }));
        vis.x.domain(vis.minMaxX);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Votes");

        vis.timePath = vis.svg.append("path")
            .attr("class", "area area-time");

        vis.area = d3.area()
            .curve(d3.curveStep)
            .x(function (d) { return vis.x(d.time); })
            .y0(vis.height)
            .y1(function (d) { return vis.y(d.count); });

        vis.currentBrushRegion = null;
        vis.xOrig = vis.x.copy();

        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", function(event) {
                vis.currentBrushRegion = event.selection;
                vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);
                vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
            });

        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush");

        vis.zoomFunction = function(event) {
            vis.xScaleModified = event.transform.rescaleX(vis.xOrig);

            if (vis.currentBrushRegion) {
                vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.xOrig));

                let newXMin = vis.x.invert(vis.currentBrushRegion.map(vis.xScaleModified)[0]);
                let newXMax = vis.x.invert(vis.currentBrushRegion.map(vis.xScaleModified)[1]);

                vis.x.domain([
                    newXMin < vis.minMaxX[0] ? vis.minMaxX[0] : newXMin,
                    newXMax > vis.minMaxX[1] ? vis.minMaxX[1] : newXMax
                ]);
            }
            vis.updateVis();
        };

        vis.zoom = d3.zoom()
            .on("zoom", vis.zoomFunction)
            .scaleExtent([1, 20]);

        vis.brushGroup.call(vis.zoom)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null);

        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.displayData = vis.data;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.brushGroup.call(vis.brush);

        vis.timePath
            .datum(vis.displayData)
            .transition()
            .duration(100)
            .attr("d", vis.area)
            .attr("clip-path", "url(#clip)");

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    onSelectionChange(selectionStart, selectionEnd) {
        d3.select("#time-period-min").text(dateFormatter(selectionStart));
        d3.select("#time-period-max").text(dateFormatter(selectionEnd));
    }
}
