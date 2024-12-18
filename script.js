import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

const colorPalettes = {
  netflix: {
    background: "#141414",
    primary: "#E50914",
    secondary: "#FFFFFF",
  },
  amazon: {
    background: "#232F3E",
    primary: "#00A8E1",
    secondary: "#FF9900",
  },
  disney: {
    background: "#0C204F",
    primary: "#113CCF",
    secondary: "#FFFFFF",
  },
  hulu: {
    background: "#101820",
    primary: "#1CE783",
    secondary: "#FFFFFF",
  },
};

// Function to update visualization based on platform
function updateVisualization(platform) {
  const palette = colorPalettes[platform];

  d3.select("#visualisations").style("background", palette.background);

  d3.select("#viz").selectAll("*").remove();

  const svg = d3.select("#viz")
    .append("svg")
    .attr("width", 400)
    .attr("height", 250);

  svg.append("text")
    .text(platform.toUpperCase())
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("fill", palette.primary)
    .style("font-size", "40px")
    .style("font-family", "Arial Black");
}

// Event listener for platform select
document.getElementById("platform-select").addEventListener("change", (e) => {
  updateVisualization(e.target.value);
});

// Call initial visualization
updateVisualization("netflix");

// -----------------------------------------------
// New Functionality: Dynamic Bar Chart
// -----------------------------------------------

// Dimensions for bar chart
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 50 };

// Container for the bar chart
const chartContainer = d3.select("#chart")
  .attr("width", width)
  .attr("height", height);

// Initialize scales and axes
const xScale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.2);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

const xAxis = chartContainer.append("g").attr("transform", `translate(0,${height - margin.bottom})`);
const yAxis = chartContainer.append("g").attr("transform", `translate(${margin.left},0)`);

// Function to update bar chart
function updateBarChart(filteredData) {
  xScale.domain(filteredData.map(d => d.genre));
  yScale.domain([0, d3.max(filteredData, d => +d.count)]);

  xAxis.call(d3.axisBottom(xScale));
  yAxis.call(d3.axisLeft(yScale));

  const bars = chartContainer.selectAll(".bar").data(filteredData, d => d.genre);

  bars
    .transition().duration(500)
    .attr("x", d => xScale(d.genre))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.count));

  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.genre))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.count))
    .style("fill", "#69b3a2");

  bars.exit().remove();
}

d3.csv("data/cleaned_datasets/steaming_data.csv").then(data => {
  const years = [...new Set(data.map(d => d.year_added))].sort((a, b) => b - a);

  const yearSelect = d3.select("#year-select");
  years.forEach(year => {
    yearSelect.append("option").attr("value", year).text(year);
  });

  function filterData() {
    let filtered = data;

    const selectedPlatform = d3.select("#platform-select").node().value;
    if (selectedPlatform !== "all") {
      filtered = filtered.filter(d => d.platform === selectedPlatform);
    }

    const selectedType = d3.select("#type-select").node().value;
    if (selectedType !== "all") {
      filtered = filtered.filter(d => d.type === selectedType);
    }

    const selectedYear = d3.select("#year-select").node().value;
    if (selectedYear !== "all") {
      filtered = filtered.filter(d => d.year_added === selectedYear);
    }

    updateBarChart(filtered);
  }

  d3.selectAll("#platform-select, #type-select, #year-select").on("change", filterData);

  filterData();
});

