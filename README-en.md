# StreamViz - Visualization of the Evolution and Distribution of Content on Streaming Platforms

![Demo](images/demo.gif)

**Team Members**  
- Rida ASRI  
- Ismail CHAKRANE  
- Aida HAOUAS  
- Mohamed Massamba SENE  

## Introduction  
Users of streaming platforms like Netflix often wish to explore available content in a personalized and analytical way. However, understanding catalog characteristics—such as genre diversity, geographical distribution, trends over time, or comparisons with other platforms—is challenging. This lack of insight limits their ability to select platforms that align with their preferences or discover specific content.  
Our goal is to provide an interactive visualization tool that enables users to explore and analyze streaming catalogs.  

The data used is sourced from [Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows).  

## Target Audience and Key Objectives  

The primary audience for this project includes:  

- **The General Public**: People curious to better understand and select content across streaming platforms.  
- **Parents**: Individuals seeking to filter content by age rating to protect their children.  
- **Content Analysts or Curators**: Professionals interested in platform trends to create recommendations or conduct comparative studies.  

### Key Tasks  

The project aims to allow users to perform the following tasks:  

1. **Analyze the Geographic and Genre Distribution of Content**  
   - Helps users discover diverse content.  
   - For example, users can explore which countries produce the most content in a specific genre (e.g., comedy, action).  

2. **Compare Catalogs Across Platforms in Terms of Genre, Duration, and Age Rating**  
   - Provides users with indicators to choose the platform that best suits their needs and preferences.  
   - For instance, a comparative chart of Netflix, Hulu, Disney+, and Prime Video to identify which platform has the most child-friendly content or the longest films.  

3. **Visualize Content Trends Over Time**  
   - Reveals platform strategies and helps anticipate changes.  
   - For example, displaying the growth or decline of categories like documentaries or international shows since 2010.  

These tasks address practical needs:  

- **Discovery and Decision-Making**: Empowering users to explore and choose content confidently.  
- **Personalization**: Allowing parents or viewers to search for specific, tailored content.  
- **Comparative Analysis**: Offering an overview of the streaming industry and its evolution.  

## Selected Data Sources  

### Streaming Platform Catalogs (Netflix, Hulu, Disney+, Prime Video)  

- **Key Benefits**  
  - Detailed catalogs with essential columns (title, genre, duration, country, age rating).  
  - Enable platform-specific visualizations and cross-platform comparisons of content diversity and trends.  

- **Limitations**  
  - Incomplete data for certain columns (e.g., directors, actors).  
  - Absence of audience or profitability metrics.  

### Integration Plan and Backup Strategy  

- **Integration**  
  - Combine platform catalogs to compare genres, durations, and age ratings.  
  - Enhance with external data sources like IMDb or Rotten Tomatoes for enriched metadata such as user ratings.  

- **Backup Plan**  
  - If issues arise with Netflix data, such as incomplete columns (*director*, *cast*) or inconsistencies (multiple genres, ambiguous data), the analysis will focus on reliable columns like *genre*, *country*, *duration*, and *release_year*.  
  - Categories will be cleaned and standardized to ensure consistent results.  
  - If data is imbalanced (e.g., certain countries overrepresented), proportional visualizations will mitigate bias.  
  - In case of technical issues or corrupted files, a data sample will be used to maintain analysis validity.  

## Related Work  

1. **Netflix Data Visualization with Python**  
   - Available on Kaggle: [Link](https://www.kaggle.com/code/joshuaswords/netflix-data-visualization)  
   - Highlights key catalog aspects such as geographic distribution, dominant genres, and temporal trends.  
   - Recommendations for improvement include:
     - Consistent visual styles and palettes.  
     - More granular, less dense visualizations.  
     - Adding interactive elements like dynamic filters for genres or countries.  

2. **Netflix Dashboard with Tableau**  
   - Available here: [Link](https://public.tableau.com/app/profile/gulshan.gedam/viz/NetflixProject-TableauDashboard/Netflix?publish=yes)  
   - Effectively illustrates genre diversity, geographical content distribution, and temporal trends.  
   - Suggestions for enhancement:
     - Add interactivity (click-based exploration, cross-filters).  
     - Include comparisons with platforms like Amazon Prime or Disney+.  
     - Simplify visuals for better usability.  

3. **Netflix Dashboard with PowerBI**  
   - Available here: [Link](https://buymeacoffee.com/jiejenn/e/131884)  
   - Strengths:
     - Attention-grabbing use of red and black for a professional appearance.  
     - Well-balanced graphs for smooth navigation.  
     - A geographical map for country-based content distribution.  
   - Recommendations:
     - Improve text readability (e.g., avoid red on black for visually impaired users).  
     - Reduce information density for clarity.  
     - Add granular details to temporal graphs and incorporate interactive filters for enhanced exploration.  

## Organization  

Our team uses a Discord group for efficient coordination. Meetings are structured as follows:  
- Weekly review session on Sundays (1 hour) for detailed discussions.  
- Quick progress check on Wednesdays (15 minutes) to stay on track.  
- Meetings occur at 8:30 PM.  

### Role Distribution  
- **Aida & Ismail**: Design and development with D3.js.  
- **Rida**: Data preprocessing to ensure reliability.  
- **Massamba**: Support across tasks and project supervision.  

**Note**: While five contributors are listed, Ismail CHAKRANE uses two GitHub accounts (Ismailchakrane and Ichakran), but they represent the same individual making commits.  

## Technical Choices  

- **HTML / CSS**  
- **D3.js** ([Official Website](https://d3js.org/))  
- **Tailwind CSS** ([Official Website](https://tailwindcss.com/))  

## Progress Tracker  

A project progress tracker is available here: [View Tracker](https://docs.google.com/document/d/1OSPjtboN29_386HHnLslqIUPYdWn3UbKAYVxVNWTt7s/edit?tab=t.0#heading=h.b7mly7b1dew9).
