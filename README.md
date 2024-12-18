# Visualiation de l'évolution et de la distribution des contenus sur les plateformes de streaming

**Membres du groupe**
- Rida ASRI
- Ismail CHAKRANE
- Aida HAOUAS
- Mohamed Massamba SENE

## Introduction
Les utilisateurs des plateformes de streaming, tels que Netflix, souhaitent explorer le contenu disponible de manière personnalisée et analytique. Cependant, il est difficile pour eux de comprendre les caractéristiques du catalogue, comme la diversité des genres, la répartition géographique, les tendances au fil du temps, ou encore les comparatifs avec d'autres plateformes. Ce manque de visibilité limite leur capacité à choisir des plateformes adaptées à leurs préférences ou à découvrir des contenus spécifiques.
Nous cherchons donc à fournir une visualisation interactive  qui permettrait aux utilisateurs d'explorer et d'analyser les catalogues de streaming.

Les données utilisées sont issues de [Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows)

## Public cible et objectifs clés
Le public principal de ce projet inclut :

- Le grand public : Les personnes curieuse qui souhaitent mieux comprendre et choisir les contenus au niveau des plateformes de streaming
- Parents : Ceux qui cherchent à filtrer les contenus en fonction des classifications d'âge pour protéger leurs enfants.
- Analystes de contenu ou curateurs : Les personnes intéressées par les tendances des plateformes pour créer des recommandations ou effectuer des études comparatives.

Les tâches clés que nous souhaitons que le projet permettent d'effectuer sont :
- Analyser la répartition géographique et générique des contenus

Ceci aide les utilisateur à à découvrir des contenus diversifiés.

Par exemple, permettre aux utilisateurs d’explorer quels pays produisent le plus de contenus dans un genre spécifique (commédie, action, ...)

- Comparer les catalogues de plusieurs plateformes en termes de genres, durée et classification d'âge

Ceci permettrait de fournir aux utilisateurs des indicateur pour choisir la plateforme qui correspond le mieux à leurs besoins et préférences.

Par exemple, afficher un graphique comparatif entre Netflix, Hulu, Disney+, et Prime Video pour identifier laquelle a le plus de contenus pour enfants ou les films les plus longs.

- Visualiser les tendances dans l’évolution du contenu au fil du temps

Ceci permettrait de révèler des priorités stratégiques des plateformes et aide à anticiper les changements.

Par exemple, montrer l'augmentation ou la diminution de certaines catégories comme les documentaires ou les émissions internationales depuis 2010.

Ces tâches sont essentielles car elles répondent directement à des besoins pratiques.

- Découverte et décision : explorer et choisir en connaissance de cause
- Personnalisation : permmettre aux parents ou spectateurs de rechercher des contenus spécifiques, adaptés à leur usage
- Analyse comparative : permettre d’avoir une vue d’ensemble sur l’industrie du streaming et ses évolutions

## Sources de données choisies

### Catalogues des plateformes de streaming (Netflix, Hulu, Disney+, Prime Video)

- **Intérêt principal**

Catalogue détaillé avec des colonnes clés (titre, genre, durée, pays, classification d’âge)
Permet des visualisation par plateforme et des comparaisons multi-plateformes sur la diversité et les tendances des contenus.

- **Limites**

Incomplétude pour certaines colonnes (réalisateurs, acteurs) et absence de données sur l’audience ou la rentabilité.

### Plan de fusion et plan de secours

- **Fusion**

Combiner les catalogues des plateformes pour comparer genres, durées, et classifications et si possible enrichir avec des données externes comme par exemple IMDb ou Rotten Tomatoes pour ajouter des métadonnées enrichies comme les notes des utilisateurs ...

- **Plan B**

En cas de problème imprévu avec les données Netflix, comme des colonnes incomplètes (*director*, *cast*) ou des incohérences (genres multiples, données ambiguës), l’analyse se concentrera sur les colonnes fiables telles que *genre*, *pays*, *durée*, et *release_year*. Les catégories seront nettoyées et standardisées pour garantir des résultats cohérents. Si certaines données sont déséquilibrées (ex. surreprésentation de certains pays), des visualisations proportionnelles seront utilisées pour éviter les biais. En cas de problème technique ou de fichier corrompu, un échantillon des données sera exploité pour maintenir la validité des analyses.

## Travaux importants liés au projet

- Netflix Data Visualization avec Python

Ce notebook Kaggle présente divers visualisation et des recommendations concernant les bonnes pratiques disponible sur au [lien](https://www.kaggle.com/code/joshuaswords/netflix-data-visualization).

Il propose une analyse diversifiée et pertinente des catalogues de streaming, avec des visualisations mettant en lumière des aspects clés tels que la répartition géographique, les genres dominants et les tendances temporelles. La variété des graphiques, notamment l’utilisation de cartes et l’évolution des contenus au fil des années, offre une compréhension globale et intuitive des données. Ces visualisations répondent bien aux objectifs d'exploration analytique et apportent une bonne base pour aider les utilisateurs à mieux appréhender les caractéristiques des catalogues.

Cependant, des améliorations pourraient renforcer l’impact global. L’uniformité visuelle gagnerait à être optimisée en harmonisant les palettes et styles des graphiques. De plus, certaines visualisations apparaissent trop denses ou manquent de granularité pour une analyse fine. L’ajout d’éléments interactifs, tels que des filtres dynamiques sur les genres ou les pays, améliorerait l’exploration personnalisée des données. Enfin, une simplification de certains graphiques surchargés permettrait une lecture plus fluide et accessible à un public varié.

- Tableau de bord Netflix réalisé avec Tableau

Cette visualisation est disponible au [lien](https://public.tableau.com/app/profile/gulshan.gedam/viz/NetflixProject-TableauDashboard/Netflix?publish=yes).

Elle est pertinente car elle illustre des aspects clés comme la diversité des genres, la répartition géographique des contenus, et les tendances temporelles. Ces éléments permettent aux utilisateurs d’explorer les catalogues de manière analytique, en identifiant les régions les plus productives ou les genres dominants, tout en suivant l’évolution des contenus au fil du temps.

Pour l’améliorer, une interactivité renforcée (exploration par clic, filtres croisés) et une comparaison avec d’autres plateformes comme Amazon Prime ou Disney+ seraient indispensables pour une analyse plus complète. De plus, une représentation visuelle simplifiée éviterait la surcharge d’informations, rendant l’expérience utilisateur plus intuitive et efficace.

- Tableau de bord Netflix réalisé avec PowerBI

Cette visualisation est disponible au [lien](https://buymeacoffee.com/jiejenn/e/131884).

Elle offre des atouts intéressants notamment l’utilisation de couleurs rouge et noire qui captent l’attention tout en renforçant le professionnalisme. La répartition harmonieuse des graphiques permet une navigation fluide, et l’inclusion d’une carte géographique illustre efficacement la répartition des contenus par pays, ce qui correspond à vos objectifs.  

Cependant, certains aspects peuvent être améliorés. Le texte rouge sur fond noir nuit à la lisibilité, en particulier pour les personnes ayant des déficiences visuelles. La densité d’informations pourrait être allégée pour éviter de submerger l’utilisateur, et le graphique temporel manque de détails pour analyser précisément les tendances. En ajoutant plus de granularité, de filtres interactifs et une palette de couleurs plus accessible, cette visualisation serait encore plus pertinente pour répondre aux besoins des utilisateurs des plateformes de streaming.

## Organisation
L'organisation adoptée repose sur une communication via un groupe Discord pour assurer une coordination efficace et accessible à tous. Les réunions sont planifiées de manière structurée : une session hebdomadaire de compte rendu d'une heure le dimanche pour des discussions approfondies, et une réunion rapide d’avancement de 15 minutes le mercredi pour maintenir le rythme. Ces réunions seront effectuées à 20h30.

La répartition des rôles est la suivante :
- Aida et Ismail se concentreront sur le design et le développement avec D3 
- Rida se chargera du prétraitement des données essentiel pour garantir des données fiables
- Massamba sera en soutient sur les différentes parties et assurera la supervision du suivi

## Choix techniques

- D3.js
- Tailwind CSS
- Html

## Cahier d'avancement

Un cachier d'avancement permettant le suivi du projet est disponible en suivant sur le lien suivant [voir le cahier](https://docs.google.com/document/d/1OSPjtboN29_386HHnLslqIUPYdWn3UbKAYVxVNWTt7s/edit?tab=t.0#heading=h.b7mly7b1dew9)
