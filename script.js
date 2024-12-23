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

// -----------------------------------------------
// Functionality: Treemap Genre and Age Visualization
// -----------------------------------------------
const width = 1460;
const height = 600;
const margin = { top: 20, right: 10, bottom: 20, left: 10 };

const svgGenre = d3.select('#visualizationGenre')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const treemapGenre = d3.treemap()
  .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
  .padding(2);

const svgCls= d3.select('#visualizationCls')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const treemapCls = d3.treemap()
  .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
  .padding(2);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv('streaming_data.csv').then(function(data) {
    data.forEach(d => {
        d.year_added = +d.year_added;
        d.duration_num = +d.duration_num;
    });

    const years = [...new Set(data.map(d => d.year_added))].sort();
    const continents = ['All', ...new Set(data.map(d => d.continent))];
    const types = ['All', ...new Set(data.map(d => d.type))];

    setupFilters(years, continents, types, "Genre");
    setupFilters(years, continents, types, "Cls");
    updateVisualizationGenre(data);
    updateVisualizationCls(data);

    document.getElementById('yearSliderGenre').addEventListener('input', () => updateVisualizationGenre(data));
    document.getElementById('continentSelectGenre').addEventListener('change', () => updateVisualizationGenre(data));
    document.getElementById('typeSelectGenre').addEventListener('change', () => updateVisualizationGenre(data));

    document.getElementById('yearSliderCls').addEventListener('input', () => updateVisualizationCls(data));
    document.getElementById('continentSelectCls').addEventListener('change', () => updateVisualizationCls(data));
    document.getElementById('typeSelectCls').addEventListener('change', () => updateVisualizationCls(data));
});

function setupFilters(years, continents, types, info) {
    const yearSlider = document.getElementById('yearSlider'+info);
    yearSlider.min = Math.min(...years);
    yearSlider.max = Math.max(...years);
    yearSlider.value = yearSlider.max;
    document.getElementById('yearValue'+info).textContent = yearSlider.value;

    const continentSelect = document.getElementById('continentSelect'+info);
    continentSelect.innerHTML = continents.map(c => 
        `<option value="${c}">${c}</option>`).join('');

    const typeSelect = document.getElementById('typeSelect'+info);
    typeSelect.innerHTML = types.map(t => 
        `<option value="${t}">${t}</option>`).join('');
}

function updateVisualizationGenre(data) {
    const yearValue = document.getElementById('yearSliderGenre').value;
    const continentValue = document.getElementById('continentSelectGenre').value;
    const typeValue = document.getElementById('typeSelectGenre').value;
    document.getElementById('yearValueGenre').textContent = yearValue;

    const filtered = data.filter(d => {
        return d.year_added == yearValue &&
            (continentValue === 'All' || d.continent === continentValue) &&
            (typeValue === 'All' || d.type === typeValue);
    });

    const genreGroups = d3.group(filtered, d => d.genre);
    let hierarchyData = {
        children: Array.from(genreGroups, ([genre, items]) => ({
            genre,
            value: items.length,
            items
        }))
    };

    hierarchyData.children.sort((a, b) => b.value - a.value);
    hierarchyData.children = hierarchyData.children.slice(0, 25);

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value);

    treemapGenre(root);

    const nodes = svgGenre.selectAll('g')
        .data(root.leaves(), d => d.data.genre);

    nodes.exit().remove();

    const nodesEnter = nodes.enter()
        .append('g');

    nodesEnter.append('rect');
    nodesEnter.append('text');

    const nodesUpdate = nodes.merge(nodesEnter)
        .transition()
        .duration(750)
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    nodesUpdate.select('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style('fill', d => colorScale(d.data.genre));
    

    nodesUpdate.select('text')
        .attr('x', 5)
        .attr('y', 20)
        .text(d => `${d.data.genre} (${d.data.value})`)
        .attr('class', 'text-wrap')
        .style('font-size', '6px')
        .style('fill', 'white');

    const allNodes = svgGenre.selectAll('g');
    allNodes.selectAll('rect')
        .on('mouseover', showTooltipGenre)
        .on('mouseout', hideTooltip);
}

function updateVisualizationCls(data) {
  const yearValue = document.getElementById('yearSliderCls').value;
  const continentValue = document.getElementById('continentSelectCls').value;
  const typeValue = document.getElementById('typeSelectCls').value;
  document.getElementById('yearValueCls').textContent = yearValue;

  const filtered = data.filter(d => {
      return d.year_added == yearValue &&
          (continentValue === 'All' || d.continent === continentValue) &&
          (typeValue === 'All' || d.type === typeValue);
  });

  const ratingGroups = d3.group(filtered, d => d.rating);
  let hierarchyData = {
      children: Array.from(ratingGroups, ([rating, items]) => ({
          rating,
          value: items.length,
          items
      }))
  };

  hierarchyData.children.sort((a, b) => b.value - a.value);
  hierarchyData.children = hierarchyData.children.slice(0, 16);

  const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value);

  treemapCls(root);

  const nodes = svgCls.selectAll('g')
      .data(root.leaves(), d => d.data.rating);

  nodes.exit().remove();

  const nodesEnter = nodes.enter()
      .append('g');

  nodesEnter.append('rect');
  nodesEnter.append('text');

  const nodesUpdate = nodes.merge(nodesEnter)
      .transition()
      .duration(750)
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

  nodesUpdate.select('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style('fill', d => colorScale(d.data.rating));
  

  nodesUpdate.select('text')
      .attr('x', 5)
      .attr('y', 20)
      .text(d => `${d.data.rating} (${d.data.value})`)
      .attr('class', 'text-wrap')
      .style('font-size', '6px')
      .style('fill', 'white');

  const allNodes = svgCls.selectAll('g');
  allNodes.selectAll('rect')
      .on('mouseover', showTooltipRating)
      .on('mouseout', hideTooltip);
}

function showTooltipGenre(event, d) {
    const platformCounts = d3.rollup(d.data.items, v => v.length, d => d.platform);
    let content = `<div class="bg-white p-3 rounded shadow-lg border border-gray-200">
        <p class="font-bold mb-2">${d.data.genre}</p>`;
    for (const [platform, count] of platformCounts) {
        content += `<p>${platform}: ${count}</p>`;
    }
    content += `<p class="font-bold mt-2">Total: ${d.data.value}</p></div>`;
    d3.select('body').append('div')
        .attr('class', 'tooltip absolute z-50')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .html(content);
}

function showTooltipRating(event, d) {
  const platformCounts = d3.rollup(d.data.items, v => v.length, d => d.platform);
  let content = `<div class="bg-white p-3 rounded shadow-lg border border-gray-200">
      <p class="font-bold mb-2">${d.data.rating}</p>`;
  for (const [platform, count] of platformCounts) {
      content += `<p>${platform}: ${count}</p>`;
  }
  content += `<p class="font-bold mt-2">Total: ${d.data.value}</p></div>`;
  d3.select('body').append('div')
      .attr('class', 'tooltip absolute z-50')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px')
      .html(content);
}

function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}