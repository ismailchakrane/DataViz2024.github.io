const typingSpeed = 100;
const titleText = "Streaming Platforms";
let index = 0;

function typeTitle() {
  if (index < titleText.length) {
    document.getElementById('typed-text').textContent += titleText.charAt(index);
    index++;
    setTimeout(typeTitle, typingSpeed);
  }
}

window.addEventListener('load', () => {
  setTimeout(typeTitle, 500);
});

const width = 960;
const height = 500;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .classed("block mx-auto", true);

// Use a more pleasing projection
const projection = d3.geoNaturalEarth1();
const path = d3.geoPath().projection(projection);

const countryData = [
  { country: "Afghanistan", movies: 30 },
  { country: "USA", movies: 120 },
  { country: "France", movies: 80 },
  { country: "India", movies: 50 },
  { country: "Brazil", movies: 20 }
];

const colorScale = d3.scaleQuantize()
  .domain([0, d3.max(countryData, d => d.movies)])
  .range(["#fca5a5", "#f87171", "#ef4444", "#b91c1c"]);

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {
  // Fit the projection to the data and the SVG size
  projection.fitSize([width, height], data);

  const tooltip = d3.select("body").append("div")
    .classed("hidden absolute bg-gray-900 text-white text-sm p-2 rounded shadow-lg", true);

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {
      const country = countryData.find(c => c.country === d.properties.name);
      return country ? colorScale(country.movies) : "#1f2937";
    })
    .attr("stroke", "#e5e7eb")
    .on("mouseover", (event, d) => {
      const country = countryData.find(c => c.country === d.properties.name);
      if (country) {
        tooltip.html(
          `<strong>Country:</strong> ${country.country}<br><strong>Movies:</strong> ${country.movies}`
        )
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .classed("hidden", false);
      }
    })
    .on("mousemove", (event, d) => {
      tooltip.style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.classed("hidden", true);
    });

  // Create the legend
  const legend = d3.select("#legend");
  colorScale.range().forEach(color => {
    const [min, max] = colorScale.invertExtent(color);
    legend.append("div")
      .classed("flex items-center", true)
      .html(
        `<div class='w-4 h-4 mr-2' style='background-color:${color}'></div>` +
        `<span>${min.toFixed(0)} - ${max.toFixed(0)}</span>`
      );
  });
});