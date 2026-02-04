# MY World 2015 Interactive Dashboard

D3.js visualization exploring the United Nations MY World 2015 global survey, which asked millions of people to rank the issues that matter most for a better life.

## Overview

**[Demo](https://supergokou.github.io/MyWorld2015/)**


The dashboard provides three coordinated visualizations that respond to user interactions:

| Component | Type | Interaction |
|-----------|------|-------------|
| **CountVis** | Time series area chart | Brush to select date range, scroll to zoom |
| **AgeVis** | Age distribution area chart | Updates based on selected date range |
| **PrioVis** | Priority ranking bar chart | Shows 15 development priorities by popularity |

## Features

- **Date range brush**: Select any time period to filter all visualizations
- **Zoom interaction**: Scroll on the time series to zoom in/out
- **Cross-filtering**: All charts update in sync based on selection
- **Responsive layout**: Bootstrap grid adapts to screen size

## Tech Stack

- **D3.js v7** - Data visualization and DOM manipulation
- **Bootstrap 5.1** - Responsive grid and typography
- **Google Fonts** - Neuton serif for headlines

No build tools required. The page runs as static HTML with JavaScript modules.

## Project Structure

```
MY-World-2015/
├── index.html              # Main page with layout and script tags
├── css/
│   └── style.css           # Custom colors and typography
├── js/
│   ├── main.js             # Data loading and visualization orchestration
│   ├── countvis.js         # CountVis class (time series + brush/zoom)
│   ├── agevis.js           # AgeVis class (age distribution)
│   └── priovis.js          # PrioVis class (priority bar chart)
├── data/
│   ├── perDayData.json     # Survey responses aggregated by day
│   └── myWorldFields.json  # Metadata for priorities and demographics
└── fonts/
    └── glyphicons-*        # Bootstrap icon fonts
```

## Usage

1. Open `index.html` in a web browser
2. Drag on the time series chart to select a date range
3. All visualizations update to show data within the selected period
4. Scroll on the chart to zoom in/out on the time axis

## Data Source

United Nations Millennium Campaign - MY World 2015 global survey

The survey asked participants to rank 16 development priorities including education, healthcare, jobs, food security, and political voice. Data has been aggregated by day and filtered to remove incomplete records.

## Architecture

The application uses an event-driven architecture:

1. **main.js** loads JSON data and creates visualization instances
2. **CountVis** triggers `selectionChanged` events when the brush moves
3. **AgeVis** and **PrioVis** listen for events and filter their data accordingly
4. All visualizations use the D3 update pattern (enter, update, exit)

## License

Educational use - CS 171 Data Visualization
