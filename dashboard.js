import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";
    
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

d3.csv("streaming_data.csv").then(function(data) {
  data.forEach(d => {
      d.year_added = +d.year_added;
      d.duration_num = +d.duration_num;
  });

  const years = [...new Set(data.map(d => d.year_added))].sort();
  const continents = ['All', ...new Set(data.map(d => d.continent))];
  const audiences = ['All', ...new Set(data.map(d => d.audience))];
  
  setupFilters(years, continents, audiences);
  updatePlatform("Netflix");
  updateVisualisation(data,"Netflix", colorPalettes["Netflix"], "2021", "All", "All");

  document.getElementById("platform-select").addEventListener("change", (e) => {
    const currentYear = document.getElementById("year-slider").value;
    const currentAudience = document.getElementById("audience-select-1").value;
    const currentContinent = document.getElementById("continent-select-1").value;
    updatePlatform(e.target.value);
    updateVisualisation(data, e.target.value, colorPalettes[e.target.value], currentYear, currentAudience, currentContinent);
  });
  document.getElementById("continent-select-1").addEventListener("change", (e) => {
    const currentYear = document.getElementById("year-slider").value;
    const currentAudience = document.getElementById("audience-select-1").value;
    const currentPlatform = document.getElementById("platform-select").value;
    updateVisualisation(data, currentPlatform, colorPalettes[currentPlatform], currentYear, currentAudience, e.target.value);
  });
  document.getElementById("audience-select-1").addEventListener("change", (e) => {
    const currentYear = document.getElementById("year-slider").value;
    const currentContinent = document.getElementById("continent-select-1").value;
    const currentPlatform = document.getElementById("platform-select").value;
    updateVisualisation(data, currentPlatform, colorPalettes[currentPlatform], currentYear, e.target.value, currentContinent);
  });
  document.getElementById("year-slider").addEventListener("input", (e) => {
    const currentPlatform = document.getElementById("platform-select").value;
    const currentAudience = document.getElementById("audience-select-1").value;
    const currentContinent = document.getElementById("continent-select-1").value;
    updateVisualisation(data, currentPlatform, colorPalettes[currentPlatform], e.target.value, currentAudience, currentContinent);
  });
});

function updatePlatform(platform) {
  const palette = colorPalettes[platform];

  d3.select("#visualisations").style("background", palette.background);

  d3.select("#platform").selectAll("*").remove();

  const svg = d3.select("#platform")
      .append("svg")
      .attr("width", 500)
      .attr("height", 400);

  svg.append("text")
      .text(platform.toUpperCase())
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .style("fill", palette.primary)
      .style("font-size", "80px")
      .style("font-family", "Arial Black");
}

function setupFilters(years, continents, types, palette) {
  const yearSlider = document.getElementById('year-slider');
  yearSlider.min = Math.min(...years);
  yearSlider.max = Math.max(...years);
  yearSlider.value = yearSlider.max;

  const continentSelect = document.getElementById('continent-select-1');
  continentSelect.innerHTML = continents.map(c => 
      `<option value="${c}">${c}</option>`).join('');

  const audienceSelect = document.getElementById('audience-select-1');
  audienceSelect.innerHTML = types.map(t => 
      `<option value="${t}">${t}</option>`).join('');
}

function updateVisualisation(data, platform, palette, year, audience, continent) {
  let filteredData = data.filter(d => d.platform === platform && d.year_added === parseInt(year));
  let releaseData = data.filter(d => d.platform === platform);
  const totalTitles = filteredData.length;
  const totalGenres = [...new Set(filteredData.map(d => d.genre))].length;
  const totalRatings = [...new Set(filteredData.map(d => d.rating))].length;
  const totalCountries = [...new Set(filteredData.map(d => d.country))].length;
  const yearSlider = document.getElementById('year-slider');

  if (continent !== "All") {
    filteredData = filteredData.filter(d => d.continent === continent);
    releaseData = releaseData.filter(d => d.continent === continent);
  }
  if (audience !== "All") {
    filteredData = filteredData.filter(d => d.audience === audience);
    releaseData = releaseData.filter(d => d.audience === audience);
  }

  document.getElementById('yearValue1').textContent = yearSlider.value;
  document.getElementById('yearValue1').style.color = palette.primary;

  document.getElementById('titlesValue1').textContent = totalTitles;
  document.getElementById('titlesValue1').style.color = palette.primary;

  document.getElementById('countryValue1').textContent = totalCountries;
  document.getElementById('countryValue1').style.color = palette.primary;

  document.getElementById('ratingsValue1').textContent = totalRatings;
  document.getElementById('ratingsValue1').style.color = palette.primary;

  document.getElementById('genreValue1').textContent = totalGenres;
  document.getElementById('genreValue1').style.color = palette.primary;

  createGenresChart(filteredData, palette);
  createRatingsChart(filteredData, palette);
  createDonutChart(filteredData, palette, platform, totalTitles);
  createReleaseChart(releaseData, palette);
  createMap(filteredData, platform, palette);
}

function createGenresChart(filteredData, palette) {
  const genresData = d3.rollup(
    filteredData,
    v => v.length,
    d => d.genre
  );

  const genresArray = Array.from(genresData, ([key, value]) => ({ key, value }));

  d3.select("#genres").selectAll("*").remove();
  const svgGenres = d3.select("#genres")
      .append("svg")
      .attr("width", 600)
      .attr("height", 400)
      .attr("viewBox", "0 0 500 400")
      .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = {top: 40, right: 20, bottom: 40, left: 100};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScaleGenres = d3.scaleLinear()
      .domain([0, d3.max(genresArray, d => d.value)])
      .range([0, width]);

  const yScaleGenres = d3.scaleBand()
      .domain(genresArray.map(d => d.key))
      .range([0, height])
      .padding(0.1);

  const chart = svgGenres.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  chart.selectAll("rect")
      .data(genresArray)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => yScaleGenres(d.key))
      .attr("width", d => xScaleGenres(d.value))
      .attr("height", yScaleGenres.bandwidth())
      .attr("fill", palette.primary);

  chart.selectAll("text")
      .data(genresArray)
      .enter()
      .append("text")
      .attr("x", d => xScaleGenres(d.value) + 5)
      .attr("y", d => yScaleGenres(d.key) + yScaleGenres.bandwidth() / 2)
      .attr("dy", ".35em")
      .text(d => d.value)
      .style("font-size", "8px")
      .attr("fill", palette.secondary);

  chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScaleGenres).ticks(5));

  chart.append("g")
      .call(d3.axisLeft(yScaleGenres));
}

function createRatingsChart(filteredData, palette) {

  const ratingsData = d3.rollup(
    filteredData,
    v => v.length,
    d => d.rating
  );

  const ratingsArray = Array.from(ratingsData, ([key, value]) => ({ key, value }));

  d3.select("#ratings").selectAll("*").remove();
  const svgRatings = d3.select("#ratings")
      .append("svg")
      .attr("width", 600)
      .attr("height", 400)
      .attr("viewBox", "0 0 500 400")
      .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = {top: 40, right: 20, bottom: 40, left: 100};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScaleRatings = d3.scaleLinear()
      .domain([0, d3.max(ratingsArray, d => d.value)])
      .range([0, width]);

  const yScaleRatings = d3.scaleBand()
      .domain(ratingsArray.map(d => d.key))
      .range([0, height])
      .padding(0.1);

  const chart = svgRatings.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  chart.selectAll("rect")
      .data(ratingsArray)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => yScaleRatings(d.key))
      .attr("width", d => xScaleRatings(d.value))
      .attr("height", yScaleRatings.bandwidth())
      .attr("fill", palette.primary);

  chart.selectAll("text")
      .data(ratingsArray)
      .enter()
      .append("text")
      .attr("x", d => xScaleRatings(d.value) + 5)
      .attr("y", d => yScaleRatings(d.key) + yScaleRatings.bandwidth() / 2)
      .attr("dy", ".35em")
      .text(d => d.value)
      .style("font-size", "8px")
      .attr("fill", palette.secondary);

  chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScaleRatings).ticks(5));

  chart.append("g")
      .call(d3.axisLeft(yScaleRatings));
}


function createDonutChart(filteredData, palette, platform, totalTitles) {
  d3.select("#donut").selectAll("*").remove();
  
  const svgDonut = d3.select("#donut")
      .append("svg")
      .attr("width", 500)
      .attr("height", 400)
      .attr("viewBox", "0 0 500 400")
      .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = {top: 20, right: 10, bottom: 20, left: 10};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const typesData = d3.rollup(
      filteredData,
      v => v.length,
      d => d.type
  );
  const typesArray = Array.from(typesData, ([key, value]) => ({ key, value }));

  const radius = Math.min(width, height) / 2;

  const g = svgDonut.append("g")
      .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

  const color = d3.scaleOrdinal()
      .domain(typesArray.map(d => d.key))
      .range([palette.primary, palette.secondary]);

  const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

  const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);

  const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  // Create tooltip div
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("font-size", "12px");

  const arc = g.selectAll(".arc")
      .data(pie(typesArray))
      .enter()
      .append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", d => color(d.data.key))
      .on("mouseover", (event, d) => {
          tooltip.style("visibility", "visible")
              .html(`<strong>${d.data.key}</strong><br>Count: ${d.data.value}<br>Percentage: ${Math.round((d.data.value / totalTitles) * 100)}%`);
      })
      .on("mousemove", (event) => {
          tooltip.style("top", (event.pageY + 10) + "px")
              .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
      });

  arc.append("text")
    .attr("transform", d => `translate(${label.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .html(d => `${d.data.key} <tspan x="0" dy="1em"> ${d.data.value}<tspan x="0" dy="1em">${Math.round((d.data.value / totalTitles) * 100)}%</tspan>`)
    .style("font-size", "12px")
    .style("fill", palette.background);
}


function createReleaseChart(data, palette) {
  d3.select("#release").selectAll("*").remove();
  const svg = d3.select("#release")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  const margin = { top: 20, right: 30, bottom: 50, left: 60 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const years = [...new Set(data.map(d => d.year_added))].sort();

  const movieCounts = years.map(year => data.filter(d => d.type === 'Movie' && d.year_added === year).length);
  const tvCounts = years.map(year => data.filter(d => d.type === 'TV Show' && d.year_added === year).length);

  const x = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max([...movieCounts, ...tvCounts])])
    .range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  g.append("g")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x((d, i) => x(years[i]))
    .y(d => y(d));

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

  const dotsMovies = g.selectAll(".dotMovie")
    .data(movieCounts)
    .enter().append("g")
    .attr("class", "dotMovie");

  dotsMovies.append("circle")
    .attr("fill", palette.primary)
    .attr("cx", (d, i) => x(years[i]))
    .attr("cy", d => y(d))
    .attr("r", 5)
    .on("mouseenter", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 8);
      d3.select(this.parentNode).append("text")
        .attr("x", d3.select(this).attr("cx"))
        .attr("y", d3.select(this).attr("cy") - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d);
    })
    .on("mouseleave", function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 5);
      d3.select(this.parentNode).select("text").remove();
    });

  const dotsTV = g.selectAll(".dotTV")
    .data(tvCounts)
    .enter().append("g")
    .attr("class", "dotTV");

  dotsTV.append("circle")
    .attr("fill", palette.secondary)
    .attr("cx", (d, i) => x(years[i]))
    .attr("cy", d => y(d))
    .attr("r", 5)
    .on("mouseenter", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 8);
      d3.select(this.parentNode).append("text")
        .attr("x", d3.select(this).attr("cx"))
        .attr("y", d3.select(this).attr("cy") - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d);
    })
    .on("mouseleave", function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 5);
      d3.select(this.parentNode).select("text").remove();
    });

  svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2}, 20)`)
    .selectAll("text")
    .data(["Movies", "TV Shows"])
    .enter().append("text")
    .attr("x", -10)
    .attr("y", (d, i) => i * 20)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(d => d)
    .attr("fill", (d, i) => i === 0 ? palette.primary : palette.secondary);
}

function createMap(data, platform, palette) {
  d3.select("#map svg").remove();

  const width = d3.select("#map").node().getBoundingClientRect().width;
  const height = d3.select("#map").node().getBoundingClientRect().height;

  const themes = {
    'Amazon': ['#FFE0B2', '#FFB74D', '#FB8C00', '#F57C00', '#E65100'],
    'Disney': ['#0288D1', '#1976D2', '#64B5F6', '#0D47A1', '#01579B'],
    'Hulu': ['#81C784', '#66BB6A', '#388E3C', '#2E7D32', '#1B5E20'],
    'Netflix': ['#E50914', '#F44336', '#D32F2F', '#C2185B', '#B71C1C']
  };

  const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator()
    .scale(140)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip hidden")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #000")
    .style("padding", "5px")
    .style("pointer-events", "none");

  const colors = themes[platform];

  const countryCounts = new Map();
  data.forEach(d => {
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

  const colorScale = d3.scaleSequential()
    .domain([0, d3.max(countryData, d => d.shows)])
    .interpolator(d3.interpolateRgbBasis(colors));

  d3.json("custom.geo.json").then(worldData => {
    svg.selectAll("path")
      .data(worldData.features)
      .enter().append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("fill", d => {
        const country = countryData.find(c => c.country === d.properties.name);
        return country ? colorScale(country.shows) : palette.background;
      })
      .on("mouseover", function(event, d) {
        const country = countryData.find(c => c.country === d.properties.name);
        if (country) {
          tooltip
            .html(`<strong>${country.country}</strong><br><strong>Total Shows:</strong> ${country.shows}<br><strong>TV Shows:</strong> ${country.tvShows}<br><strong>Movies:</strong> ${country.movies}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .classed("hidden", false);
        }
      })
      .on("mouseout", () => tooltip.classed("hidden", true));

    d3.selectAll('path.border').style('display', 'none');

  });
}
