# Medicine scanner
In this course we will bundle all our newly acquired superpowers to create a webapp for a real client. We will create a webapp for De Voorhoede. They've asked us to create a completely new version of their Medicine scanner, using Machine Learning and Optical character Recognition.

## Table of contents
- [Collaborators](#collaborators)
- [API](#api)
- [Install notes](#install)
- [Database](#database)
- [Machine learning](#machine-learning)
- [Other documentation](#docs)

------

<a name="collaborators">

## Collaborators
- [Damian Veltkamp](https://github.com/damian1997/meesterproef-1920)
- [Leroy van Biljouw](https://github.com/SqueezyDough/meesterproef-1920)

------

## Rubric
### WAFFS 
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| De code bevat geen syntaxfouten en is netjes opgemaakt | Duidlijke namen voor functies en variabelen. Ondescheid in camelcase en snakecase voor functies en constante variabelen. | Standaard eis voor een professionele app |
| Code is correct gescoped en opgedeeld in modules die overeen komen met het actor diagram.| Gebruik gemaakt van modules. App is gestructureerd met een MVC pattern. | Standaard eis voor een professionele app  |
| JSON data kan met een asynchrone request worden opgehaald uit een API | We gebruiken hiervoor de API die de klant heeft opgeleverd. We slaand e data op een andere manier op om de performance te optimaliseren | Optimalisatie vd data is belangrijk voor de schaalbaarheid en performance van de data. |
| Routing & states kunnen, al dan niet met een micro library, worden gemanaged | Express routing | ik gebruik routing, zodat de gebruiker niet meteen gevraagd wordt om de camera aan te zetten zonder eerst interactie te hebben gehad met de app.

### CSS
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| You can show that you can use the cascade, inheritance and specificity in your project | CSS is opgebouwd in componenten en wordt je pre-processed. Ik heb componenten gemaakt voor de basis-styling / classes en zo nodig gebruik ik die later weer. Ik gebruik BEM als CSS convention | Goeie modulaire CSS is belangrijk om je CSS overzichtelijk te houden en makkelijk kan uitbouwen / onderhouden |

### Browser tech
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| Student kan de core functionaliteit van een use case doorgronden | Na de debrief heb ik een technische opzet gemaakt en ben ik bezig geweest om de scanner functioneel te krijgen | De core functionaliteit is belangrijk om eerst te maken zodat je die later uit kan bouwen. |
| Student laat zien hoe Progressive Enhancement toe te passen in Web Development | Eerste taak was om de app functioneel werkend te krijgen, vervolgens heb ik er de opmaak verbeterd. B  | De app moet voor iedereen te gebruiken zijn, ook wanneer JS het niet doet of de gebruiker geen toegang wil of kan verlenen aan de camera. |
| Student laat zien hoe Feature Detection kan worden toegepast in Web Development | ij het ontwerp heb ik al meteen nagedacht over fallbacks. deze heb ik bijv. voor het activeren vd camera geschreven. | Zie bovenstaande punt |

### Progressive web apps
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| Je snapt het verschil tussen client side en server side renderen en kan server side rendering toepassen voor het tonen van data uit een API | Op de client lezen we via OCR de image uit. Op de server verwerk ik de data om het juiste medicijn terug te krijgen | Op de server willen we geen zware taken uitvoeren, anders kan deze overbelast raken, wanneer veel mensen tegelijkertijd een medicijn proberen te scannen |
| Je begrijpt hoe een Service Worker werkt en kan deze in jouw applicatie op een nuttige wijze implementeren. | Ik heb een sw gemaakt die de html pagina's opslaat | Ik heb een sw gebruikt zodat de app offline/met slecht internet kan werken   |
	
### Real Time
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| De app staat online. Uit de documentatie kan worden afgeleid wat het project inhoudt. De data life cycle, real-time events, en externe databron zijn beschreven. | De app wordt gehost op Heroku. Ik heb een DLC gemaakt waar ook de externe databronnen zijn beschreven | Voor complexe applicaties is goeie documentatie heel erg belangrijk, ook voor de communicatie naar de klant. |
| Er is voldoende real-time functionaliteit om begrip te toetsen. Een groot deel van de functionaliteit is zelf geschreven. Student is in staat online voorbeelden naar zijn/haar hand te zetten. De server houdt een datamodel bij en elke client wordt de juiste data doorgestuurd	 | De scanner kan real-time informatie ophalen van een medicijn. Ik verdeel de data onder buckets die de medicijnen ranked op populariteit. De medijnen staan in clusters omdat veel medicijnen onder dezelfde naam vallen, bijv paraceatmol, maar deze staan versnipperd in de API. Via clusters kan ik de medicijnen groeperen waardoor het zoeken makkelijker wordt. De clusters kijken ook hope erg ze op elkaar lijken. Clusters die meer dan 60% op elkaar lijken refereren naar elkaar. Dit maakt het makkelijker om er clusters bij te zoeken die ook als valide resultaat kunnen gelden.  | de cluster namen kunnen heel erg op elkaar lijken. Aangezien de input vd OCS niet 100% tye vertrouwen is moet je er rekening mee houden dat het eerste resultaat niet het juiste resultaat is. Daarom zoek ik er ook nog clusters bij die op elkaar lijken. De buckets zijn bedoeld om de performance verder te verbeteren. Als er een resultaat wordt gevonden in de eerste bucket en het heeft geen clusters die er op lijken kan ik deze meteen teruggeven aand e gebruiker zonder er nog andere clusters bij te zoeken. |
| Single source of truth | De database is altijd de single source of truth. De server kan wel proberen de outkomst van het gescande medicijn te optimaliseren, maar veranderd nooit de waardes van een medicijn. | Een Single source of truth zorgt ervoor dat de bron data asltijd betrouwbaar is. Mutaties op de data kunnen ervoor zorgen dat de data niet meer klopt. Via de client kan geen data aangepast worden |

### Web design
| Wat        | Hoe           | Waarom  |
| ------------- |-------------| -----|
| Er is een user scenario geschreven dat aansluit bij de identiteit van de test persoon. | Staat in de wiki | Was handig om beter te begrijpen wie onze gebruiker precies is. |


<a name="api">

## API
We use the [Medicines API](https://hva-cmd-meesterproef-ai.now.sh/medicines) provided by De Voorhoede to get all medicine data.

------

<a name="install">

## Install Notes
### Clone repository
`git clone https://github.com/SqueezyDough/meesterproef-1920.git`

### Install packages
`npm run install`

### Install tesseract
`brew install tesseract`

### Usage
`npm run dev`

------

<a name="database">
  
## Database

<details>
  <summary>View ERD</summary>
    
  ![meds_erd](https://user-images.githubusercontent.com/33430653/83125649-1beb3180-a0d8-11ea-9709-19201a9f9137.png)
</details>

### Buckets
Buckets are a collection of clusters. Each bucket has a tier number. The tier number decides which bucket will be searched in first. Bucket tier 1 will be looked at first. When no matching cluster is found, it will search in the second bucket tier, etc.

### Clusters
Clusters are a collection of medicines that correspond with the cluster identifier. For example, Someone is looking for Strepsils, Lemon and honey. Strepsils here is the cluster identifier and contains all medicines with the name Strepsils. 

### Medicines
Medicines contain information about a specific medicine.

<a name="ml">
	
## Data lifecycle
<details>
  <summary>See diagram</summary	
	  
  ![meds_dlc](https://user-images.githubusercontent.com/33430653/84509290-c57b1700-acc3-11ea-8bc8-447721836c55.png)
</details>

  
## Machine learning
For this project we make use of machine learning to recognize characters on medicine boxes. The package we use is [Tesseract](https://www.npmjs.com/package/node-tesseract-ocr).
In order to make this project a little bit more challenging we decided to implement a ranking system for recognition of medicine names, we do this by calculating positive findings confirmed by the user
and comparing these with future searches.

<details>
<summary>Flow chart medicine recognition</summary>
Recognition flow start

![flowchart-starting-point](https://user-images.githubusercontent.com/19706066/84509505-168b0b00-acc4-11ea-845d-e329c5fa652c.jpg)

------

Recognizing medicine name flow

![recognise-medicin-name](https://user-images.githubusercontent.com/19706066/84509479-0d01a300-acc4-11ea-867a-c1793f124f07.jpg)

------

Recognizing RVG code flow

![recognize-registration-nmbr](https://user-images.githubusercontent.com/19706066/84509482-0f63fd00-acc4-11ea-9c58-63412d3bb25f.jpg)

------

Find matching clusters flow

![find-matching-clusers](https://user-images.githubusercontent.com/19706066/84509492-1428b100-acc4-11ea-86d2-410d7b439ed6.jpg)
</details>

<a name="docs">
  
## Other documentation
For more documentation about our medicine scanner visit our [Wicky](https://github.com/SqueezyDough/meesterproef-1920/wiki)!
