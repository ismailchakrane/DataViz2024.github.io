import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

// Platform colors
const platformColors = {
  Netflix: "#E50914",
  Hulu: "#1CE783",
  Disney: "#113CCF",
  Amazon: "#00A8E1",
};

// -----------------------------------------------
// Treemap Genre and Rating Visualization
// -----------------------------------------------
const width = 1500;
const height = 460;

// Create SVG elements for visualizations
const svgGenre = d3
  .select("#visualizationGenre")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font", "10px sans-serif");

const svgCls = d3
  .select("#visualizationCls")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font", "10px sans-serif");

// Color scale for non-platform categories
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let currentNode = null; // Récupérer le noeud objet de zoom
let nodeStack = []; // Garder mémoire l'historique de zoom

// Variables pour le filtrage
let isYearFilterEnabledGenre = true;
let isYearFilterEnabledCls = true;
let typeCls = "All";
let typeGenre = "All";

d3.csv("data/streaming_data.csv").then(function (data) {
  data.forEach((d) => {
    d.year_added = +d.year_added;
    d.duration_num = +d.duration_num;
  });

  const years = [...new Set(data.map((d) => d.year_added))].sort();
  const continents = ["All", ...new Set(data.map((d) => d.continent))];
  const types = ["All", ...new Set(data.map((d) => d.type))];

  // Initalisation des filtres
  setupFilters(years, continents, "Genre");
  setupFilters(years, continents, "Cls");

  // Initialisation des visus
  updateVisualization(data, "genre", svgGenre);
  updateVisualization(data, "rating", svgCls);

  // Event handlers
  document
    .getElementById("yearSliderGenre")
    .addEventListener("input", () =>
      updateVisualization(data, "genre", svgGenre)
    );
  document
    .getElementById("continentSelectGenre")
    .addEventListener("change", () =>
      updateVisualization(data, "genre", svgGenre)
    );
  document
    .getElementById("yearSliderCls")
    .addEventListener("input", () =>
      updateVisualization(data, "rating", svgCls)
    );
  document
    .getElementById("continentSelectCls")
    .addEventListener("change", () =>
      updateVisualization(data, "rating", svgCls)
    );

  document
    .getElementById("voirToutBtnCls")
    .addEventListener("click", () => toggleVoirTout(data, "rating", svgCls));
  document
    .getElementById("voirToutBtnGenre")
    .addEventListener("click", () => toggleVoirTout(data, "genre", svgGenre));

  document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const isMovieCheckedCls = document.getElementById("movieCheckboxCls").checked;
      const isTVShowCheckedCls = document.getElementById("tvShowCheckboxCls").checked;
      const isMovieCheckedGenre = document.getElementById("movieCheckboxGenre").checked;
      const isTVShowCheckedGenre = document.getElementById("tvShowCheckboxGenre").checked;
  
      if (isMovieCheckedCls && isTVShowCheckedCls) {
        typeCls =  "All";
        updateVisualization(data, "rating",svgCls);
      } else if (isMovieCheckedCls) {
        typeCls =  "Movie";
        updateVisualization(data, "rating", svgCls);
      } else if (isTVShowCheckedCls) {
        typeCls = "TV Show";
        updateVisualization(data, "rating", svgCls);
      } else {
        typeCls = "All";
        document.getElementById("movieCheckboxCls").checked = true;
        document.getElementById("tvShowCheckboxCls").checked = true;
        updateVisualization(data, "rating", svgCls);
      }

      if (isMovieCheckedGenre && isTVShowCheckedGenre) {
        typeGenre =  "All";
        updateVisualization(data, "genre", svgGenre);
      } else if (isMovieCheckedGenre) {
        typeGenre =  "Movie";
        updateVisualization(data, "genre", svgGenre);
      } else if (isTVShowCheckedGenre) {
        typeGenre = "TV Show";
        updateVisualization(data, "genre", svgGenre);
      } else {
        typeGenre = "All";
        document.getElementById("movieCheckboxGenre").checked = true;
        document.getElementById("tvShowCheckboxGenre").checked = true;
        updateVisualization(data, "genre", svgGenre);
      }

    });
  }); 
});

function setupFilters(years, continents, info) {
  const yearSlider = document.getElementById("yearSlider" + info);
  yearSlider.min = Math.min(...years);
  yearSlider.max = Math.max(...years);
  yearSlider.value = yearSlider.max;
  document.getElementById("yearValue" + info).textContent = yearSlider.value;

  const continentSelect = document.getElementById("continentSelect" + info);
  continentSelect.innerHTML = continents
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
}

function updateVisualization(data, type, svg) {
  const prefix = type === "genre" ? "Genre" : "Cls";
  const typeValue = type === "genre" ? typeGenre : typeCls;

  const yearSlider = document.getElementById(`yearSlider${prefix}`);

  const continentValue = document.getElementById(
    `continentSelect${prefix}`
  ).value;

  let yearValue = undefined;
  if (!yearSlider.disabled) {
    yearValue = yearSlider.value;
    document.getElementById(`yearValue${prefix}`).textContent = yearValue;
  }

  let filtered = null;

  if (prefix == "Cls" && isYearFilterEnabledCls) {
    filtered = data.filter((d) => {
      return (
        d.year_added == yearValue &&
        (continentValue === "All" || d.continent === continentValue) &&
        (typeValue === "All" || d.type === typeValue)
      );
    });
  } else if (prefix == "Genre" && isYearFilterEnabledGenre) {
    filtered = data.filter((d) => {
      return (
        d.year_added == yearValue &&
        (continentValue === "All" || d.continent === continentValue) &&
        (typeValue === "All" || d.type === typeValue)
      );
    });
  } else {
    filtered = data.filter((d) => {
      return (
        (continentValue === "All" || d.continent === continentValue) &&
        (typeValue === "All" || d.type === typeValue)
      );
    });
  }

  const groups = d3.group(filtered, (d) =>
    type === "genre" ? d.genre : d.rating
  );
  const hierarchyData = {
    name: type === "genre" ? "All Genres" : "All Ratings",
    children: Array.from(groups, ([name, items]) => ({
      name,
      value: items.length,
      items,
    })),
  };

  svg.selectAll("*").remove();

  const root = d3
    .hierarchy(hierarchyData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  const treemap = d3
    .treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3);

  treemap(root);

  const cell = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  cell
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill-opacity", 0.6)
    .attr("fill", (d) => {
      if (d.depth === 0) return "#fff"; // Root node is white
      if (d.data.items && d.data.items[0].platform) {
        return platformColors[d.data.name] || colorScale(d.data.name);
      }
      return colorScale(d.data.name);
    })
    .style("cursor", "pointer")
    .on("click", (event, d) => zoom(d));

  cell
    .append("text")
    .attr("x", 4)
    .attr("y", 13)
    .text((d) => `${d.data.name} (${d.value})`);

  function zoom(node) {
    if (node === currentNode && nodeStack.length > 1) {
      // Reset to initial treemap if we click the same node again
      nodeStack.pop();
      const previousNode = nodeStack[nodeStack.length - 1];
      resetZoom(previousNode);
    } else {
      // Zoom into the clicked node
      nodeStack.push(node);
      currentNode = node;

      // Create a platform breakdown for the clicked node
      const platformCounts = d3.rollup(
        node.data.items,
        (v) => v.length,
        (d) => d.platform
      );

      // Create a new hierarchy for the platform breakdown (subtree)
      const platformHierarchy = {
        name: "Platforms",
        children: Array.from(platformCounts, ([platform, count]) => ({
          name: platform,
          value: count,
          platform,
        })),
      };

      const platformRoot = d3
        .hierarchy(platformHierarchy)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

      // Update the treemap with platform-level data
      const treemap = d3
        .treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3);

      treemap(platformRoot);

      svg.selectAll("*").remove(); // Remove previous treemap nodes

      const platformCell = svg
        .selectAll("g")
        .data(platformRoot.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      platformCell
        .append("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill-opacity", 0.6)
        .attr("fill", (d) =>
          d.depth === 1 ? platformColors[d.data.platform] : "#fff"
        ) // No fill for total node
        .style("cursor", "pointer")
        .on("click", (event, d) => zoom(d)); // Recursive zoom for platform nodes

      platformCell
        .append("text")
        .attr("x", 4)
        .attr("y", 13)
        .text((d) => `${d.data.name} (${d.value})`);
    }
  }

  function resetZoom(node) {
    // Clear previous zoom state
    svg.selectAll("*").remove();

    // Return to the top level (root)
    updateVisualization(data, type, svg);
    nodeStack = []; // Clear the stack to reset zoom history
    currentNode = null; // Reset current zoom state
  }
}

// Fonction pour le filtrage par année ou non
function toggleVoirTout(data, type, svg) {
  if (type === "genre") {
    isYearFilterEnabledGenre = !isYearFilterEnabledGenre;
    const yearSlider = document.getElementById("yearSliderGenre");
    if (isYearFilterEnabledGenre) {
      yearSlider.disabled = false;
      document.getElementById("yearValueGenre").textContent = yearSlider.value;
      document.getElementById("voirToutBtnGenre").textContent = "Voir tout";
    } else {
      yearSlider.disabled = true;
      document.getElementById("yearValueGenre").textContent = "Tous les ans";
      document.getElementById("voirToutBtnGenre").textContent =
        "Filtrer par année";
    }
    updateVisualization(data, "genre", svg);
  } else if (type === "rating") {
    isYearFilterEnabledCls = !isYearFilterEnabledCls;
    const yearSlider = document.getElementById("yearSliderCls");
    if (isYearFilterEnabledCls) {
      yearSlider.disabled = false;
      document.getElementById("yearValueCls").textContent = yearSlider.value;
      document.getElementById("voirToutBtnCls").textContent = "Voir tout";
    } else {
      yearSlider.disabled = true;
      document.getElementById("yearValueCls").textContent = "Tous les ans";
      document.getElementById("voirToutBtnCls").textContent =
        "Filtrer par année";
    }
    updateVisualization(data, "rating", svg);
  }
}
// -----------------------------------------------
// Evolution du contenu
// -----------------------------------------------

// Fonction pour la création des graphiques d'évolution
function createChart(containerId, data, metric, yAxisLabel) {
  const margin = { top: 40, right: 120, bottom: 60, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Suppression des éléments existants
  d3.select(`#${containerId}`).selectAll("*").remove();

  // Création de l'élément svg
  const svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Création des échelles
  const x0 = d3
    .scaleBand()
    .domain(d3.range(2006, 2022))
    .rangeRound([0, width])
    .paddingOuter(0.1)
    .paddingInner(0.1);

  const x1 = d3.scaleBand().domain(Object.keys(platformColors)).padding(0.05);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[metric])])
    .nice()
    .range([height, 0]);

  // Création des axes
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .text("Année");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .text(yAxisLabel);

  // Création du tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-common")
    .style("opacity", 0);

  x1.rangeRound([0, x0.bandwidth()]);
  const groupedData = d3.group(data, (d) => d.year_added);

  // Création des barres
  const yearGroups = svg
    .selectAll(".year-group")
    .data(Array.from(groupedData))
    .join("g")
    .attr("class", "year-group")
    .attr("transform", (d) => `translate(${x0(d[0])},0)`);

  yearGroups
    .selectAll("rect")
    .data((d) => d[1])
    .join("rect")
    .attr("x", (d) => x1(d.platform))
    .attr("width", x1.bandwidth())
    .attr("y", (d) => y(d[metric]))
    .attr("height", (d) => height - y(d[metric]))
    .attr("fill", (d) => platformColors[d.platform])
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `
                Année: ${d.year_added}<br/>
                Plateforme: ${d.platform}<br/>
                ${yAxisLabel}: ${d[metric]}
            `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Création de la légende
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 10}, 0)`);

  // Création des éléments de la légende
  Object.entries(platformColors).forEach(([platform, color], i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color);

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("class", "text-sm")
      .text(platform);
  });
}

d3.csv("data/streaming_data.csv").then(function (rawData) {
  // Initialisation des filtres
  const continents = ["All", ...new Set(rawData.map((d) => d.continent))];
  const audiences = ["All", ...new Set(rawData.map((d) => d.audience))];

  const continentSelect = document.getElementById("continent-select");
  continentSelect.innerHTML = continents
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");

  const audienceSelect = document.getElementById("audience-select");
  audienceSelect.innerHTML = audiences
    .map((t) => `<option value="${t}">${t}</option>`)
    .join("");

  // Fonction pour la mise à jour des graphiques
  function updateCharts(selectedContinent, selectedAudience) {
    let filteredData = rawData;

    // Filtrage additionnel des données en fonction des continents et des audiences
    if (selectedContinent !== "All") {
      filteredData = filteredData.filter(
        (d) => d.continent === selectedContinent
      );
    }
    if (selectedAudience !== "All") {
      filteredData = filteredData.filter(
        (d) => d.audience === selectedAudience
      );
    }

    // Création des données pour les graphiques
    const contentQuantityData = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => d.year_added,
      (d) => d.platform
    );

    const movieDurationData = d3.rollup(
      filteredData.filter((d) => d.type === "Movie"),
      (v) => d3.sum(v, (d) => parseInt(d.duration_num)),
      (d) => d.year_added,
      (d) => d.platform
    );

    const tvSeasonsData = d3.rollup(
      filteredData.filter((d) => d.type === "TV Show"),
      (v) => d3.sum(v, (d) => parseInt(d.duration_num)),
      (d) => d.year_added,
      (d) => d.platform
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
          value: value,
        });
      });
    });
    return processedData;
  }

  // Gestion des événements pour la mise à jour des graphiques
  d3.select("#continent-select").on("change", function () {
    updateCharts(this.value, d3.select("#audience-select").property("value"));
  });

  d3.select("#audience-select").on("change", function () {
    updateCharts(d3.select("#continent-select").property("value"), this.value);
  });

  updateCharts("All", "All");
});
