import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

// Definition de la palette de couleurs pour chaque plateforme
const colorPalettes = {
  Netflix: {
    background: "#141414",
    primary: "#E50914",
    secondary: "#FFFFFF",
  },
  Amazon: {
    background: "#232F3E",
    primary: "#00A8E1",
    secondary: "#FF9900",
  },
  Disney: {
    background: "#0C204F",
    primary: "#113CCF",
    secondary: "#FFFFFF",
  },
  Hulu: {
    background: "#101820",
    primary: "#1CE783",
    secondary: "#FFFFFF",
  },
};

let year = "2021";
let audience = "All";
let continent = "All";
let currentPlatform = "Netflix";
let isYearFilterEnabled = true;

d3.csv("data/streaming_data.csv").then(function (data) {
  data.forEach((d) => {
    d.year_added = +d.year_added;
    d.duration_num = +d.duration_num;
  });

  // Initialisation des filtres
  setupFilters(data, currentPlatform);
  // Utilisation de la palette de couleurs Netflix par défaut
  updatePlatform(currentPlatform);
  // Initialisation de la visualisation avec Netflix
  updateVisualisation(
    data,
    currentPlatform,
    colorPalettes[currentPlatform],
    year,
    audience,
    continent
  );

  // Gestion des événements pour la mise à jour des visualisations
  document.querySelectorAll("#platform-row a").forEach((platformElement) => {
    platformElement.addEventListener("click", (e) => {
      e.preventDefault();
  
      document.querySelectorAll("#platform-row a").forEach(el => el.classList.remove("glow"));
      platformElement.classList.add("glow");

      const selectedPlatform = platformElement.getAttribute("data-platform");
  
      updatePlatform(selectedPlatform);
      updateVisualisation(
        data,
        selectedPlatform,
        colorPalettes[selectedPlatform],
        "2021",
        audience,
        continent
      );
      setupFilters(data, selectedPlatform);
    });
  }); 
  document.getElementById("voirToutBtn").addEventListener("click", () => {
    const activeButton = document.querySelector("#yearButtons button.bg-blue-500");
    const currentYear = activeButton ? activeButton.textContent : latestYear.toString();
    toggleVoirTout(
      data,
      currentPlatform,
      colorPalettes[currentPlatform],
      currentYear,
      audience,
      continent
    );
  });
});

// Fonction pour mettre à jour la palette de couleurs suivant la plateforme
function updatePlatform(platform) {
  // Mise à jour de la plateforme sélectionnée
  currentPlatform = platform;

  // Récupération de la palette de couleurs correspondant à la plateforme
  const palette = colorPalettes[platform];

  // Mise à jour des couleurs de fond et de texte
  d3.select("#visualisations").style("background", palette.background);

  // Suppression des éléments existants
  d3.select("#platform").selectAll("*").remove();

  // Création du texte pour la plateforme
  const svg = d3
    .select("#platform")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  svg
    .append("text")
    .text(platform.toUpperCase())
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("fill", palette.primary)
    .style("font-size", "80px")
    .style("font-family", "Arial Black");
}

// Fonction pour initialiser les filtres
function setupFilters(data, platform) {
  const platformData = data.filter((d) => d.platform === platform);
  const years = [...new Set(platformData.map((d) => d.year_added))].sort();
  
  const yearButtons = d3.select("#yearButtons")
    .selectAll("button")
    .data(years)
    .join("button")
    .attr("class", "px-4 py-2 rounded-md transition-colors")
    .text(d => d);

  const latestYear = Math.max(...years);
  updateSelectedYear(latestYear);

  yearButtons.on("click", function(event, year) {
    if (!document.getElementById("yearButtons").classList.contains("disabled")) {
      updateSelectedYear(year);
      updateVisualisation(
        data,
        platform,
        colorPalettes[platform],
        year.toString(),
        audience,
        continent
      );
    }
  });

  function updateSelectedYear(selectedYear) {
    yearButtons
      .classed("bg-blue-500 text-white", d => d === selectedYear)
      .classed("bg-gray-700 text-gray-200 hover:bg-gray-600", d => d !== selectedYear);
  }
}

// Function to update visualizations
function updateVisualisation(
  data,
  platform,
  palette,
  year,
  audience,
  continent
) {
  // Filter data based on selected criteria
  let filteredData = undefined;

  let releaseData = data.filter(
    (d) =>
      d.platform === platform &&
      (continent === "All" || d.continent === continent) &&
      (audience === "All" || d.audience === audience)
  );

  const yearButtonsContainer = document.getElementById("yearButtons");
  if (!yearButtonsContainer.classList.contains("disabled")) {
    document.getElementById("yearValue1").textContent = year;
    document.getElementById("yearValue1").style.color = palette.primary;
    filteredData = data.filter(
      (d) =>
        d.platform === platform &&
        d.year_added === parseInt(year) &&
        (continent === "All" || d.continent === continent) &&
        (audience === "All" || d.audience === audience)
    );
  } else {
    document.getElementById("yearValue1").textContent = "Tous les ans";
    document.getElementById("yearValue1").style.color = palette.primary;
    filteredData = releaseData;
  }

  if (filteredData.length === 0) {
    // Clear visualizations
    const elementsToClear = [
      "#genres",
      "#ratings",
      "#donut",
      "#release",
      "#map svg",
    ];
    elementsToClear.forEach((selector) =>
      d3.select(selector).selectAll("*").remove()
    );

    // Hide containers (remove them from layout)
    [
      "dashboard-container",
      "visualisation-container-1",
      "visualisation-container-2",
      "visualisation-container-3",
      "map-container",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.style.display = "none";
    });

    // Show no-data message
    const messageElement = document.getElementById("data-message");
    if (messageElement) {
      messageElement.style.display = "grid";
      messageElement.innerHTML = `<div style="padding: 20px; border: 1px solid #ccc; text-align: center; color: ${palette.primary}">
          Aucune donnée disponible
        </div>`;
    }
    return;
  } else {
    // Hide no-data message
    const messageElement = document.getElementById("data-message");
    if (messageElement) {
      messageElement.style.display = "none";
    }

    // Show containers (restore layout space)
    [
      "dashboard-container",
      "visualisation-container-1",
      "visualisation-container-2",
      "visualisation-container-3",
      "map-container",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.style.display = "grid";
    });
  }

  // Update metrics based on filtered data
  const totalTitles = filteredData.length;
  const totalGenres = new Set(filteredData.map((d) => d.genre)).size;
  const totalRatings = new Set(filteredData.map((d) => d.rating)).size;
  const totalCountries = new Set(filteredData.map((d) => d.country)).size;

  const metrics = [
    { id: "titlesValue1", value: totalTitles },
    { id: "countryValue1", value: totalCountries },
    { id: "ratingsValue1", value: totalRatings },
    { id: "genreValue1", value: totalGenres },
  ];

  metrics.forEach((metric) => {
    const element = document.getElementById(metric.id);
    if (element) {
      element.textContent = metric.value;
      element.style.color = palette.primary;
    }
  });

  // Create visualizations
  createGenresChart(filteredData, palette);
  createRatingsChart(filteredData, palette);
  createDonutChart(filteredData, palette, totalTitles);
  createReleaseChart(releaseData, palette);
  createMap(filteredData, platform, palette);
  createContinentChart(filteredData, palette, data);
  createAudienceChart(filteredData, palette, data);
}

// Fonction pour créer le graphique des genres
function createGenresChart(filteredData, palette) {
  // Création des données pour les genres
  const genresData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.genre
  );

  const genresArray = Array.from(genresData, ([key, value]) => ({
    key,
    value,
  }));

  // Suppression des éléments existants
  d3.select("#genres").selectAll("*").remove();

  // Création du graphique à barres pour les genres
  const svgGenres = d3
    .select("#genres")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400)
    .attr("viewBox", "0 0 500 400")
    .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = { top: 40, right: 20, bottom: 40, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Ajout des échelles pour les axes x et y
  const xScaleGenres = d3
    .scaleLinear()
    .domain([0, d3.max(genresArray, (d) => d.value)])
    .range([0, width]);

  const yScaleGenres = d3
    .scaleBand()
    .domain(genresArray.map((d) => d.key))
    .range([0, height])
    .padding(0.1);

  // Création du graphique
  const chart = svgGenres
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  chart
    .selectAll("rect")
    .data(genresArray)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => yScaleGenres(d.key))
    .attr("width", (d) => xScaleGenres(d.value))
    .attr("height", yScaleGenres.bandwidth())
    .attr("fill", palette.primary);

  chart
    .selectAll("text")
    .data(genresArray)
    .enter()
    .append("text")
    .attr("x", (d) => xScaleGenres(d.value) + 5)
    .attr("y", (d) => yScaleGenres(d.key) + yScaleGenres.bandwidth() / 2)
    .attr("dy", ".35em")
    .text((d) => d.value)
    .style("font-size", "8px")
    .attr("fill", palette.secondary);

  chart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleGenres).ticks(5));

  chart.append("g").call(d3.axisLeft(yScaleGenres));
}

// Fonction pour créer le graphique des ratings
function createRatingsChart(filteredData, palette) {
  // Création des données pour les ratings
  const ratingsData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.rating
  );

  const ratingsArray = Array.from(ratingsData, ([key, value]) => ({
    key,
    value,
  }));

  // Suppression des éléments existants
  d3.select("#ratings").selectAll("*").remove();

  // Création du graphique à barres pour les ratings
  const svgRatings = d3
    .select("#ratings")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400)
    .attr("viewBox", "0 0 500 400")
    .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = { top: 40, right: 20, bottom: 40, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Ajout des échelles pour les axes x et y
  const xScaleRatings = d3
    .scaleLinear()
    .domain([0, d3.max(ratingsArray, (d) => d.value)])
    .range([0, width]);

  const yScaleRatings = d3
    .scaleBand()
    .domain(ratingsArray.map((d) => d.key))
    .range([0, height])
    .padding(0.1);

  // Création du graphique
  const chart = svgRatings
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  chart
    .selectAll("rect")
    .data(ratingsArray)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => yScaleRatings(d.key))
    .attr("width", (d) => xScaleRatings(d.value))
    .attr("height", yScaleRatings.bandwidth())
    .attr("fill", palette.primary);

  chart
    .selectAll("text")
    .data(ratingsArray)
    .enter()
    .append("text")
    .attr("x", (d) => xScaleRatings(d.value) + 5)
    .attr("y", (d) => yScaleRatings(d.key) + yScaleRatings.bandwidth() / 2)
    .attr("dy", ".35em")
    .text((d) => d.value)
    .style("font-size", "8px")
    .attr("fill", palette.secondary);

  chart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleRatings).ticks(5));

  chart.append("g").call(d3.axisLeft(yScaleRatings));
}

// Fonction pour créer le graphique en donut
function createDonutChart(filteredData, palette, totalTitles) {
  // Création des données pour les types
  const typesData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.type
  );
  const typesArray = Array.from(typesData, ([key, value]) => ({ key, value }));

  // Suppression des éléments existants
  d3.select("#donut").selectAll("*").remove();

  // Création du graphique en donut
  const svgDonut = d3
    .select("#donut")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400)
    .attr("viewBox", "0 0 500 400")
    .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = { top: 20, right: 10, bottom: 20, left: 10 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const radius = Math.min(width, height) / 2;

  // Création du groupe pour le graphique
  const g = svgDonut
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    );

  const color = d3
    .scaleOrdinal()
    .domain(typesArray.map((d) => d.key))
    .range([palette.primary, palette.secondary]);

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  const path = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

  const label = d3
    .arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  // Ajout des tooltips pour les arcs
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("font-size", "12px");

  // Création des arcs pour les types
  const arc = g
    .selectAll(".arc")
    .data(pie(typesArray))
    .enter()
    .append("g")
    .attr("class", "arc");

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => color(d.data.key))
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .html(
          `<strong>${d.data.key}</strong><br>Count: ${
            d.data.value
          }<br>Percentage: ${Math.round((d.data.value / totalTitles) * 100)}%`
        );
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  arc
    .append("text")
    .attr("transform", (d) => `translate(${label.centroid(d)})`)
    .attr("dy", "0.35em")
    .style("fill", palette.background);
}

// Fonction pour créer le graphique de type "Release"
function createReleaseChart(data, palette) {
  // Création des données pour les années
  const years = [...new Set(data.map((d) => d.year_added))].sort();

  const movieCounts = years.map(
    (year) =>
      data.filter((d) => d.type === "Movie" && d.year_added === year).length
  );
  const tvCounts = years.map(
    (year) =>
      data.filter((d) => d.type === "TV Show" && d.year_added === year).length
  );

  // Suppression des éléments existants
  d3.select("#release").selectAll("*").remove();

  // Création du graphique pour les releases
  const svg = d3
    .select("#release")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  const margin = { top: 20, right: 30, bottom: 50, left: 60 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max([...movieCounts, ...tvCounts])])
    .range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  g.append("g").call(d3.axisLeft(y));

  const line = d3
    .line()
    .x((d, i) => x(years[i]))
    .y((d) => y(d));

  g.append("path")
    .datum(movieCounts)
    .attr("fill", "none")
    .attr("stroke", palette.primary)
    .attr("stroke-width", 1.5)
    .attr("d", line);

  g.append("path")
    .datum(tvCounts)
    .attr("fill", "none")
    .attr("stroke", palette.secondary)
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Ajout des points pour les releases avec des tooltips pour affichage de la valeur au survol pour les movies
  const dotsMovies = g
    .selectAll(".dotMovie")
    .data(movieCounts)
    .enter()
    .append("g")
    .attr("class", "dotMovie");

  dotsMovies
    .append("circle")
    .attr("fill", palette.primary)
    .attr("cx", (d, i) => x(years[i]))
    .attr("cy", (d) => y(d))
    .attr("r", 5)
    .on("mouseenter", function (event, d) {
      d3.select(this).transition().duration(200).attr("r", 8);
      d3.select(this.parentNode)
        .append("text")
        .attr("x", d3.select(this).attr("cx"))
        .attr("y", d3.select(this).attr("cy") - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d);
    })
    .on("mouseleave", function () {
      d3.select(this).transition().duration(200).attr("r", 5);
      d3.select(this.parentNode).select("text").remove();
    });

  // Ajout des points pour les releases avec des tooltips pour affichage de la valeur au survol pour les TV Shows
  const dotsTV = g
    .selectAll(".dotTV")
    .data(tvCounts)
    .enter()
    .append("g")
    .attr("class", "dotTV");

  dotsTV
    .append("circle")
    .attr("fill", palette.secondary)
    .attr("cx", (d, i) => x(years[i]))
    .attr("cy", (d) => y(d))
    .attr("r", 5)
    .on("mouseenter", function (event, d) {
      d3.select(this).transition().duration(200).attr("r", 8);
      d3.select(this.parentNode)
        .append("text")
        .attr("x", d3.select(this).attr("cx"))
        .attr("y", d3.select(this).attr("cy") - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d);
    })
    .on("mouseleave", function () {
      d3.select(this).transition().duration(200).attr("r", 5);
      d3.select(this.parentNode).select("text").remove();
    });

  svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2}, 20)`)
    .selectAll("text")
    .data(["Movies", "TV Shows"])
    .enter()
    .append("text")
    .attr("x", -10)
    .attr("y", (d, i) => i * 20)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text((d) => d)
    .attr("fill", (d, i) => (i === 0 ? palette.primary : palette.secondary));
}

// Fonction pour créer la carte
function createMap(data, platform, palette) {
  d3.select("#map svg").remove();

  const width = d3.select("#map").node().getBoundingClientRect().width;
  const height = d3.select("#map").node().getBoundingClientRect().height;

  const breaks = [1, 2, 5, 10, 20, 50, 100, 250];
  
  const themes = {
    Amazon: [
      "#FFF8E1", "#FFE0B2", "#FFB74D", "#FFA726", 
      "#FB8C00", "#F57C00", "#EF6C00", "#E65100"
    ],
    Disney: [
      "#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", 
      "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"
    ],
    Hulu: [
      "#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", 
      "#66BB6A", "#4CAF50", "#43A047", "#388E3C"
    ],
    Netflix: [
      "#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", 
      "#EF5350", "#F44336", "#E53935", "#D32F2F"
    ],
  };

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3
    .geoMercator()
    .scale(140)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip hidden")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #000")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("box-shadow", "2px 2px 6px rgba(0, 0, 0, 0.3)");

  const colors = themes[platform];

  const countryCounts = new Map();
  data.forEach((d) => {
    let country = d.country.trim();
    switch (country) {
      case "United States":
        country = "United States of America";
        break;
      case "West Germany":
      case "East Germany":
        country = "Germany";
        break;
      case "Soviet Union":
        country = "Russia";
        break;
      case "Vatican City":
        country = "Italy";
        break;
      case "Hong Kong":
        country = "China";
        break;
    }

    if (!countryCounts.has(country)) {
      countryCounts.set(country, { tvShows: 0, movies: 0, shows: 0 });
    }
    if (d.type === "TV Show") {
      countryCounts.get(country).tvShows += 1;
    } else if (d.type === "Movie") {
      countryCounts.get(country).movies += 1;
    }
    countryCounts.get(country).shows += 1;
  });

  const countryData = Array.from(countryCounts, ([country, counts]) => ({
    country,
    shows: counts.shows,
    tvShows: counts.tvShows,
    movies: counts.movies,
  }));

  const colorScale = d3
    .scaleThreshold()
    .domain(breaks)
    .range(colors);

  const legendWidth = 250;
  const legendHeight = 20;
  const legendMargin = { top: 20, right: 20, bottom: 30 };
  
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - legendWidth - legendMargin.right}, ${legendMargin.top})`);

  const legendStops = breaks.map((value, i) => ({
    value: value,
    color: colors[i]
  }));

  const blockWidth = legendWidth / legendStops.length;
  
  legend.selectAll("rect")
    .data(legendStops)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * blockWidth)
    .attr("width", blockWidth)
    .attr("height", legendHeight)
    .style("fill", d => d.color);

  legend.selectAll("text")
    .data(breaks)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * blockWidth)
    .attr("y", legendHeight + 15)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "white")
    .text(d => d);

  d3.json("data/custom.geo.json").then((worldData) => {
    svg
      .selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("fill", (d) => {
        const country = countryData.find(
          (c) => c.country === d.properties.name
        );
        return country ? colorScale(country.shows) : palette.background;
      })
      .on("mouseover", function (event, d) {
        const country = countryData.find(
          (c) => c.country === d.properties.name
        );
        if (country) {
          tooltip
            .html(
              `<strong>${country.country}</strong><br>
               <strong>Total Shows:</strong> ${country.shows}<br>
               <strong>TV Shows:</strong> ${country.tvShows}<br>
               <strong>Movies:</strong> ${country.movies}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px")
            .classed("hidden", false);
        }
      })
      .on("mouseout", () => tooltip.classed("hidden", true));

    d3.selectAll("path.border").style("display", "none");
  });
}

// Fonction pour créer le graphique des audiences
function createAudienceChart(filteredData, palette, data) {
  const audienceData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.audience
  );

  const audienceArray = Array.from(audienceData, ([key, value]) => ({
    key,
    value,
  }));

  d3.select("#audience").selectAll("*").remove();

  const svgAudience = d3
    .select("#audience")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  const margin = { top: 40, right: 20, bottom: 40, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(audienceArray.map((d) => d.key))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(audienceArray, (d) => d.value)])
    .range([height, 0]);

  const chart = svgAudience
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  chart
    .selectAll("rect")
    .data(audienceArray)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.key))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value))
    .attr("fill", palette.primary)
    .style("cursor", "pointer")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d3.color(palette.primary).brighter(0.5));
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("fill", palette.primary);
    })
    .on("click", function (event, d) {
      audience = audience === d.key ? "All" : d.key;
      const activeButton = document.querySelector("#yearButtons button.bg-blue-500");
      const currentYear = activeButton ? activeButton.textContent : latestYear.toString();
      updateVisualisation(
        data,
        currentPlatform,
        colorPalettes[currentPlatform],
        currentYear,
        audience,
        continent
      );
    });

  chart
    .selectAll("text")
    .data(audienceArray)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.key) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.value) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", palette.secondary)
    .text((d) => d.value);

  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));
  chart.append("g").call(d3.axisLeft(yScale));
}

// Fonction pour créer le graphique des continents
function createContinentChart(filteredData, palette, data) {
  const continentData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.continent
  );

  const continentArray = Array.from(continentData, ([key, value]) => ({
    key,
    value,
  }));

  d3.select("#continent").selectAll("*").remove();

  const svgContinent = d3
    .select("#continent")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  const margin = { top: 40, right: 20, bottom: 40, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(continentArray.map((d) => d.key))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(continentArray, (d) => d.value)])
    .range([height, 0]);

  const chart = svgContinent
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  chart
    .selectAll("rect")
    .data(continentArray)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.key))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value))
    .attr("fill", palette.primary)
    .style("cursor", "pointer")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", d3.color(palette.primary).brighter(0.5));
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("fill", palette.primary);
    })
    .on("click", function (event, d) {
      continent = continent === d.key ? "All" : d.key;
      const activeButton = document.querySelector("#yearButtons button.bg-blue-500");
      const currentYear = activeButton ? activeButton.textContent : latestYear.toString();
      updateVisualisation(
        data,
        currentPlatform,
        colorPalettes[currentPlatform],
        currentYear,
        audience,
        continent
      );
    });

  chart
    .selectAll("text")
    .data(continentArray)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.key) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.value) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", palette.secondary)
    .text((d) => d.value);

  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));
  chart.append("g").call(d3.axisLeft(yScale));
}

// Fonction pour bloquer le filtrage par année ou non
function toggleVoirTout(data, platform, palette, year, audience, continent) {
  isYearFilterEnabled = !isYearFilterEnabled;
  const yearButtonsContainer = document.getElementById("yearButtons");
  
  if (isYearFilterEnabled) {
    yearButtonsContainer.classList.remove("disabled");
    document.getElementById("voirToutBtn").textContent = "Voir tout";
    yearButtonsContainer.querySelectorAll("button").forEach(button => {
      button.style.pointerEvents = "auto";
      button.style.opacity = "1";
    });
  } else {
    yearButtonsContainer.classList.add("disabled");
    document.getElementById("voirToutBtn").textContent = "Filtrer par année";
    yearButtonsContainer.querySelectorAll("button").forEach(button => {
      button.style.pointerEvents = "none";
      button.style.opacity = "0.5";
    });
  }
  
  updateVisualisation(data, platform, palette, year, audience, continent);
}
