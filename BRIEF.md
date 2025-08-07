# **Brief client : Le Mixologue Augmenté**

*Evaluation MNS - CD2IA - Module Django/Flask*

## Problématique métier
 
<center><img src="docs/image.png" style="float: left; margin-right: 20px; border-radius: 20px;" width="100" /></center>

*Je gère un bar à cocktails très fréquenté à Metz. Beaucoup de mes clients veulent essayer des cocktails personnalisés selon leurs goûts, mais mes barmans n'ont pas toujours le temps de conseiller chaque client. J'aimerais proposer une solution ludique, accessible sur tablette ou sur mobile, qui leur suggère un cocktail en fonction de leurs envies. Je souhaite aussi pouvoir inventer de nouveaux cocktails en m'aidant de l'IA pour créer des recettes originales.*

**Client :** Arnaud Dumas, Gérant

<span style="clear: both;"></span>

## Objectifs du projet

Vous devez concevoir une application web simple, propulsée par l'IA qui sera utilisée par le gérant du bar pour proposer des cocktails selon l'envie des clients : 

* Interface dédiée pour **générer des fiches cocktails originales** à partir d'une idée ou d'un contexte (ex : "cocktail signature pour un enterrement de vie de garçon"), ou de l'envie d'un client (ex : "Mon client veut un cocktail saveur bacon avec des framboises, sans alcool").

* La fiche générée par l'IA doit inclure :
  * Le nom du cocktail (inventé, l'IA doit être créative)
  * La liste des ingrédients
  * Une courte histoire/description du cocktail
  * Une ambiance musicale qui va bien pour écouter avec le cocktail
  * *(facultatif)* un prompt image pour MidJourney ou SDXL pour générer une image de présentation du cocktail
 
* Les fiches générées doivent être historisées. En tant que gérant, je souhaite pouvoir consulter une fiche précedemment générée. 

## Contraintes techniques à respecter

* **Framework :** Django ou Flask (choix à expliciter, voir ci-dessous)
* **Interface Web :** au choix, utilisez un moteur de template ou une architecture découplée (React + Python). 
* **Déploiement :** L'app doit être déployable en utilisant Docker sur un serveur

## Exemples d'entrées utilisateurs

* J'ai envie de quelque chose de fruité mais avec du gin, et pas trop sucré
* Un cocktail sans alcool pour une après-midi en terrasse
* Une création originale à base de whisky et citron vert
* Je suis de bonne humeur et il fait beau aujourd'hui, tu me conseilles de boire quoi ?

## Livrables attendus

* Le code source fonctionnel soumis sur le repository Github Classroom
* Un README présentant :
	* Les choix technologiques (pourquoi avoir utilisé tel ou tel framework ?)
	* Les étapes d'installation précises pour onboarder un nouvel intervenant sur le projet
	* La documentation des variables configurables

## Conseils utiles

Même si le but de cette évaluation n'est pas de vous juger sur vos compétences en développement Frontend, la qualité générale de l'app finale sera analysée. N'hésitez pas à vous baser sur des kits UI existants pour ne pas perdre trop de temps sur l'interface. Voici quelques kits que vous pouvez utiliser (vous pouvez bien entendu faire vous-même le CSS) :

* **TailwindCSS** : [https://tailwindcss.com/]() (React, CSS)
* **ShadCN** : [https://ui.shadcn.com/]() (React)
* **Bootstrap** : [https://getbootstrap.com/]() (CSS)
* **UIKit** : [https://getuikit.com/]() (CSS)
* **Material** : [https://mui.com/material-ui/getting-started/]() (React)

## Grille d'évaluation

| Critère   | Points  |
| --------- | ------- |
| Mise en place du framework, intégration IA, pertinence du/des modèles | 5 |
| Respect du cahier des charges (projet répondant à la demande métier) | 5 |
| Structure du code | 4 |
| Mise en place de la dockerisation | 3 |
| Documentation et explication des choix | 3 |
| **Total** | **20** |


