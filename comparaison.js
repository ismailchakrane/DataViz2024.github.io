import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

// -----------------------------------------------
// Treemap Genre and Age Visualization
// -----------------------------------------------
const width = 1260;
const height = 460;
const margin = { top: 20, right: 10, bottom: 20, left: 10 };

// Creation des éléments svg pour les visualisations
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

// Création de l'échelle de couleur
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv('streaming_data.csv').then(function(data) {
    data.forEach(d => {
        d.year_added = +d.year_added;
        d.duration_num = +d.duration_num;
    });

    const years = [...new Set(data.map(d => d.year_added))].sort();
    const continents = ['All', ...new Set(data.map(d => d.continent))];
    const types = ['All', ...new Set(data.map(d => d.type))];

    // Initialisation des filtres
    setupFilters(years, continents, types, "Genre");
    setupFilters(years, continents, types, "Cls");
    // Initialisation des visualisations
    updateVisualizationGenre(data);
    updateVisualizationCls(data);

    // Gestion des événements pour la mise à jour des visualisations
    document.getElementById('yearSliderGenre').addEventListener('input', () => updateVisualizationGenre(data));
    document.getElementById('continentSelectGenre').addEventListener('change', () => updateVisualizationGenre(data));
    document.getElementById('typeSelectGenre').addEventListener('change', () => updateVisualizationGenre(data));

    document.getElementById('yearSliderCls').addEventListener('input', () => updateVisualizationCls(data));
    document.getElementById('continentSelectCls').addEventListener('change', () => updateVisualizationCls(data));
    document.getElementById('typeSelectCls').addEventListener('change', () => updateVisualizationCls(data));
});

// Fonction pour initialiser les filtres
function setupFilters(years, continents, types, info) {
    // Initialisation du slider pour les années
    const yearSlider = document.getElementById('yearSlider'+info);
    yearSlider.min = Math.min(...years);
    yearSlider.max = Math.max(...years);
    yearSlider.value = yearSlider.max;
    document.getElementById('yearValue'+info).textContent = yearSlider.value;

    // Initialisation des listes déroulantes pour les continents et les types
    const continentSelect = document.getElementById('continentSelect'+info);
    continentSelect.innerHTML = continents.map(c => 
        `<option value="${c}">${c}</option>`).join('');

    const typeSelect = document.getElementById('typeSelect'+info);
    typeSelect.innerHTML = types.map(t => 
        `<option value="${t}">${t}</option>`).join('');
}

// Fonction pour la mise à jour de la visualisation treemap du genre
function updateVisualizationGenre(data) {
    // Récupération des valeurs des filtres
    const yearValue = document.getElementById('yearSliderGenre').value;
    const continentValue = document.getElementById('continentSelectGenre').value;
    const typeValue = document.getElementById('typeSelectGenre').value;
    document.getElementById('yearValueGenre').textContent = yearValue;

    // Filtrage des données
    const filtered = data.filter(d => {
        return d.year_added == yearValue &&
            (continentValue === 'All' || d.continent === continentValue) &&
            (typeValue === 'All' || d.type === typeValue);
    });

    // Création des groupes de genres
    const genreGroups = d3.group(filtered, d => d.genre);
    let hierarchyData = {
        children: Array.from(genreGroups, ([genre, items]) => ({
            genre,
            value: items.length,
            items
        }))
    };

    // Tri des groupes par valeur et sélection des 25 premiers
    hierarchyData.children.sort((a, b) => b.value - a.value);
    hierarchyData.children = hierarchyData.children.slice(0, 25);

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value);

    // Mise à jour du treemap
    treemapGenre(root);

    const nodes = svgGenre.selectAll('g')
        .data(root.leaves(), d => d.data.genre);

    nodes.exit().remove();

    const nodesEnter = nodes.enter()
        .append('g');

    nodesEnter.append('rect');
    nodesEnter.append('text');

    // Animation pour la transition des groupes
    const nodesUpdate = nodes.merge(nodesEnter)
        .transition()
        .duration(750)
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Mise à jour des rectangles et du texte
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

    // Gestion des événements pour l'affichage du tooltip
    const allNodes = svgGenre.selectAll('g');

    allNodes.selectAll('rect')
        .on('mouseover', showTooltipGenre)
        .on('mouseout', hideTooltip);
}

// Fonction pour la mise à jour de la visualisation treemap de la classification d'âge
function updateVisualizationCls(data) {
    // Récupération des valeurs des filtres
    const yearValue = document.getElementById('yearSliderCls').value;
    const continentValue = document.getElementById('continentSelectCls').value;
    const typeValue = document.getElementById('typeSelectCls').value;
    document.getElementById('yearValueCls').textContent = yearValue;

    // Filtrage des données
    const filtered = data.filter(d => {
        return d.year_added == yearValue &&
            (continentValue === 'All' || d.continent === continentValue) &&
            (typeValue === 'All' || d.type === typeValue);
    });

    const ratingGroups = d3.group(filtered, d => d.rating);

    // Création des groupes de classification d'âge
    let hierarchyData = {
        children: Array.from(ratingGroups, ([rating, items]) => ({
            rating,
            value: items.length,
            items
        }))
    };

    // Tri des groupes par valeur et sélection des 15 premiers
    hierarchyData.children.sort((a, b) => b.value - a.value);
    hierarchyData.children = hierarchyData.children.slice(0, 14);

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value);

    // Mise à jour du treemap
    treemapCls(root);

    const nodes = svgCls.selectAll('g')
        .data(root.leaves(), d => d.data.rating);

    nodes.exit().remove();

    const nodesEnter = nodes.enter()
        .append('g');

    nodesEnter.append('rect');
    nodesEnter.append('text');

    // Animation pour la transition des groupes
    const nodesUpdate = nodes.merge(nodesEnter)
        .transition()
        .duration(750)
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Mise à jour des rectangles et du texte
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

    // Gestion des événements pour l'affichage du tooltip
    const allNodes = svgCls.selectAll('g');

    allNodes.selectAll('rect')
        .on('mouseover', showTooltipRating)
        .on('mouseout', hideTooltip);
}

// Fonction pour l'affichage du tooltip pour le treemap du genre
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
// Fonction pour l'`affichage du tooltip pour le treemap de la classification d'âge
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

// Fonction pour cacher le tooltip
function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}

// -----------------------------------------------
// Evolution du contenu
// -----------------------------------------------

// Initialisation des couleurs des plateformes
const platformColors = {
    "Netflix": "#E50914",
    "Hulu": "#1CE783",
    "Disney": "#113CCF",
    "Amazon": "#00A8E1"
};

// Fonction pour la création des graphiques d'évolution
function createChart(containerId, data, metric, yAxisLabel) {

    const margin = {top: 40, right: 120, bottom: 60, left: 80};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Suppression des éléments existants
    d3.select(`#${containerId}`).selectAll("*").remove();

    // Création de l'élément svg
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Création des échelles
    const x0 = d3.scaleBand()
        .domain(d3.range(2006, 2022))
        .rangeRound([0, width])
        .paddingOuter(0.1)
        .paddingInner(0.1);

    const x1 = d3.scaleBand()
        .domain(Object.keys(platformColors))
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[metric])])
        .nice()
        .range([height, 0]);

    // Création des axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Année");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text(yAxisLabel);

    // Création du tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip-common")
        .style("opacity", 0);

    x1.rangeRound([0, x0.bandwidth()]);
    const groupedData = d3.group(data, d => d.year_added);

    // Création des barres
    const yearGroups = svg.selectAll(".year-group")
        .data(Array.from(groupedData))
        .join("g")
        .attr("class", "year-group")
        .attr("transform", d => `translate(${x0(d[0])},0)`);

    yearGroups.selectAll("rect")
        .data(d => d[1])
        .join("rect")
        .attr("x", d => x1(d.platform))
        .attr("width", x1.bandwidth())
        .attr("y", d => y(d[metric]))
        .attr("height", d => height - y(d[metric]))
        .attr("fill", d => platformColors[d.platform])
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                Année: ${d.year_added}<br/>
                Plateforme: ${d.platform}<br/>
                ${yAxisLabel}: ${d[metric]}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Création de la légende
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 10}, 0)`);

    // Création des éléments de la légende
    Object.entries(platformColors).forEach(([platform, color], i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color);

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("class", "text-sm")
            .text(platform);
    });
}

d3.csv("streaming_data.csv").then(function(rawData) {
    // Initialisation des filtres
    const continents = ['All', ...new Set(rawData.map(d => d.continent))];
    const audiences = ['All', ...new Set(rawData.map(d => d.audience))];

    const continentSelect = document.getElementById('continent-select');
    continentSelect.innerHTML = continents.map(c => 
        `<option value="${c}">${c}</option>`).join('');

    const typeSelect = document.getElementById('audience-select');
    typeSelect.innerHTML = audiences.map(t => 
            `<option value="${t}">${t}</option>`).join('');

    // Fonction pour la mise à jour des graphiques
    function updateCharts(selectedContinent, selectedAudience) {
        let filteredData = rawData;
        
        // Filtrage additionnel des données en fonction des continents et des audiences
        if (selectedContinent !== 'All') {
            filteredData = filteredData.filter(d => d.continent === selectedContinent);
        }
        if (selectedAudience !== 'All') {
            filteredData = filteredData.filter(d => d.audience === selectedAudience);
        }

        // Création des données pour les graphiques
        const contentQuantityData = d3.rollup(
            filteredData,
            v => v.length,
            d => d.year_added,
            d => d.platform
        );

        const movieDurationData = d3.rollup(
            filteredData.filter(d => d.type === "Movie"),
            v => d3.sum(v, d => parseInt(d.duration_num)),
            d => d.year_added,
            d => d.platform
        );

        const tvSeasonsData = d3.rollup(
            filteredData.filter(d => d.type === "TV Show"),
            v => d3.sum(v, d => parseInt(d.duration_num)),
            d => d.year_added,
            d => d.platform
        );

        // Création des graphiques
        createChart(
            "content-quantity-chart", 
            processRollupData(contentQuantityData), 
            "value",
            "Nombre de titres"
        );
        
        createChart(
            "movie-duration-chart", 
            processRollupData(movieDurationData), 
            "value",
            "Durée (minutes)"
        );
        
        createChart(
            "tv-seasons-chart", 
            processRollupData(tvSeasonsData), 
            "value",
            "Nombre de saisons"
        );
    }

    // Fonction pour la transformation des données rollup en un format adapté pour les graphiques
    function processRollupData(rollupData) {
        const processedData = [];
        rollupData.forEach((yearValue, year) => {
            yearValue.forEach((value, platform) => {
                processedData.push({
                    year_added: +year,
                    platform: platform,
                    value: value
                });
            });
        });
        return processedData;
    }

    // Gestion des événements pour la mise à jour des graphiques
    d3.select("#continent-select").on("change", function() {
        updateCharts(this.value, d3.select("#audience-select").property("value"));
    });

    d3.select("#audience-select").on("change", function() {
        updateCharts(d3.select("#continent-select").property("value"), this.value);
    });

    updateCharts('All', 'All');
});