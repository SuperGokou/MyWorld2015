let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

let promises = [
    d3.json("data/perDayData.json"),
    d3.json("data/myWorldFields.json")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data);
    })
    .catch(function (err) {
        console.error("Failed to load data:", err);
    });

function createVis(data) {
    let perDayData = data[0];
    let metaData = data[1];

    let allData = perDayData.map(function (d) {
        let result = {
            time: dateParser(d.day),
            count: +d["count(*)"]
        };

        result.priorities = d3.range(0, 15).map(function (i) {
            return d["sum(p" + i + ")"];
        });

        result.ages = d3.range(0, 100).map(function () {
            return 0;
        });

        d.age.forEach(function (a) {
            if (a.age < 100) {
                result.ages[a.age] = a["count(*)"];
            }
        });

        return result;
    });

    let eventHandler = {
        bind: (eventName, handler) => {
            document.body.addEventListener(eventName, handler);
        },
        trigger: (eventName, extraParameters) => {
            document.body.dispatchEvent(new CustomEvent(eventName, {
                detail: extraParameters
            }));
        }
    };

    let countVis = new CountVis("countvis", allData, eventHandler);
    let ageVis = new AgeVis("agevis", allData);
    let prioVis = new PrioVis("priovis", allData, metaData);

    eventHandler.bind("selectionChanged", function(event) {
        let rangeStart = event.detail[0];
        let rangeEnd = event.detail[1];

        ageVis.onSelectionChange(rangeStart, rangeEnd);
        prioVis.onSelectionChange(rangeStart, rangeEnd);
        countVis.onSelectionChange(rangeStart, rangeEnd);
    });
}
