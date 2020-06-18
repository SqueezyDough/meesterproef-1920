# Medicine scanner
In this course we will bundle all our newly acquired superpowers to create a webapp for a real client. We will create a webapp for De Voorhoede. They've asked us to create a completely new version of their Medicine scanner, using Machine Learning and Optical character Recognition.

## Table of contents
- [Collaborators](#collaborators)
- [Concept](#concept)
- [Prerequisites](#prerequisites)
- [Install notes](#install)
- [API](#api)
- [Database](#database)
- [Data lifecycle](#data-lyfecycle)
- [Flow charts](#flow-charts)
- [Other documentation](#docs)
- [Sources](#sources)

------

<a name="collaborators">

## Collaborators
- [Damian Veltkamp](https://github.com/damian1997/meesterproef-1920)
- [Leroy van Biljouw](https://github.com/SqueezyDough/meesterproef-1920)

------

## Concept
Medscan gives people the ability to retrieve crucial information about their medicine either by scanning the box or by manual searching for the medicine name or registration number. Medscan uses OCR (optical character recognition) in order to read text from an image, we then identify the usable words from the image which we can use to get a matching medicine from our dataset.

<details>
<summary>See homepage</summary>

![home](https://user-images.githubusercontent.com/33430653/84889533-4dcd3380-b099-11ea-8554-952c835b9302.gif)
</details>

<details>
<summary>See scannerpage</summary>
	
Name detection

![name-detect](https://user-images.githubusercontent.com/19706066/85021366-09619680-b172-11ea-907a-b9518ad8a5a6.gif)

Code detection

![code-detectiongif](https://user-images.githubusercontent.com/19706066/85021349-049ce280-b172-11ea-9e48-d7350969b35b.gif)
</details>


<details>
<summary>See overviewpage</summary>

![overview-gif](https://user-images.githubusercontent.com/19706066/85021374-0c5c8700-b172-11ea-89ce-87822a305428.gif)
</details>

<details>
<summary>See medicine history</summary>

![history](https://user-images.githubusercontent.com/33430653/84892649-3d6b8780-b09e-11ea-90be-f5194403ac5e.gif)
</details>

------

<a name="install">

## Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)

## Install Notes

### Clone repository

`git clone https://github.com/SqueezyDough/meesterproef-1920.git`

### Create environment file

To use our application a environment file is required with the following variables:
* DB_USER
* DB_PW
* DB_HOST
* ALGOLIA_APPLICATION_ID
* ALGOLIA_KEY

To get acces to these keys, get in touch to become a collaborator.

### Install packages

`npm run install`

### Usage

- Run dev environment: `npm run dev`
- Watch dev files: `npm run watch`

------

## API
We use the Algolia search engine API to retrieve information about medicines. De Voorhoede supplied us with their own [API](https://hva-cmd-meesterproef-ai.now.sh/medicines) provided by De Voorhoede to get all medicine data.
 but we decided to store that data at Algolia.

### API restrictions

__Records__

There is a limit of how many records you are able to store at Algolia, this amount of records can be increased when you get a payed plan.
Amount of records: 10.000

__Operations__

A operation is when a search query is fired at the Algolia search api and when records are being added to the Algolia index. The amount of operations can be increased when you get a payed plan.
Amount of operations: 50.000

------

<a name="database">
  
## Database

<details>
  <summary>View ERD</summary>
    
  ![erd](https://user-images.githubusercontent.com/33430653/84755393-e8f2da00-afc1-11ea-9d3c-8971211958a6.png)
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

### Client functions

| Name | Trigger | Function |
| ------------- |-------------| -----|
| nameDetectionHandler | When the user scans a medicine by name | Validates name, send it to the server and outputs the result |
| registrationNumberHandler | When the user scans a medicine by registration number | Validates registration number, send it to the server and outputs the result |
| appendTesseractOutput | When it receives a response from the server | Display the result that has been scanned by tesseract |
| appendMedicineCards | When it receives a response from the server | Append medicine cards
| appendLoadingState | When the OCR output is validated | Appends the loading state
| removeLoadingState | When it receives a response from the server | Removes the loading state

### Server functions
| Name | Trigger | Function |
| ------------- |-------------| -----|
| databaseSearch | When the server receives a medicine name from the client | Return the best match it finds in the database
| tesseractSearch | When the server receives a registration number from the client | finds the best match using Algolia search
| overviewSearch | When the user searched on the overview page | extract search value from the string it receives from the client and finds the best match using Algolia search
| additionalWordsFilter | When additional words are found | Improve best match by trying to find matching additional words

  
## Flow charts
In these flow charts we will show the procces of recognising either a name or a registration number and returning a medicine when scanning a medicine box.
The round cornered squares in the flow chart are refrences to the flow chart for that specific module.

<details>
<summary>Flow start</summary>

##
![flowchart-starting-point](https://user-images.githubusercontent.com/19706066/84509505-168b0b00-acc4-11ea-845d-e329c5fa652c.jpg)
</details>

<details>
<summary>Recognise medicine name flow</summary>

##
![recognise-medicin-name](https://user-images.githubusercontent.com/19706066/84509479-0d01a300-acc4-11ea-867a-c1793f124f07.jpg)

![find-matching-clusers](https://user-images.githubusercontent.com/19706066/84509492-1428b100-acc4-11ea-86d2-410d7b439ed6.jpg)
</details>

<details>
<summary>Recognise registration number flow</summary>

##
![recognize-registration-nmbr](https://user-images.githubusercontent.com/19706066/84509482-0f63fd00-acc4-11ea-9c58-63412d3bb25f.jpg)
</details>

<a name="docs">
  
## Other documentation
For more documentation about our medicine scanner visit our [Wicky](https://github.com/SqueezyDough/meesterproef-1920/wiki)!

## Sources
* [Algolia docs](https://www.algolia.com/doc/)
* [Tesseract js](https://github.com/naptha/tesseract.js#tesseractjs)
* [Stackoverflow](https://stackoverflow.com/)
* [Caniuse](https://caniuse.com/)
* [MDN](https://developer.mozilla.org/nl/)
