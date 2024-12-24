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

function updateColors(platform) {
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

document.getElementById("platform-select").addEventListener("change", (e) => {
  updateColors(e.target.value);
});

updateColors("netflix");