# Visualiation de l'évolution et de la distribution des contenus sur les plateformes de streaming

**Membres du groupe**
- Rida ASRI
- Ismail Chakrane
- Aida HAOUAS
- Mohamed Massamba SENE

## Introduction
Les utilisateurs des plateformes de streaming, tels que Netflix, souhaitent explorer le contenu disponible de manière personnalisée et analytique. Cependant, il est difficile pour eux de comprendre les caractéristiques du catalogue, comme la diversité des genres, la répartition géographique, les tendances au fil du temps, ou encore les comparatifs avec d'autres plateformes. Ce manque de visibilité limite leur capacité à choisir des plateformes adaptées à leurs préférences ou à découvrir des contenus spécifiques.
Nous cherchons donc à fournir une visualisation interactive  qui permettrait aux utilisateurs d'explorer et d'analyser les catalogues de streaming.

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

## Organisation

## Cahier d'avancement

Un cachier d'avancement permettant le suivi du projet est disponible en suivant sur le lien suivant [voir le cahier](https://docs.google.com/document/d/1OSPjtboN29_386HHnLslqIUPYdWn3UbKAYVxVNWTt7s/edit?tab=t.0#heading=h.b7mly7b1dew9)