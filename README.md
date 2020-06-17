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

## API
We use the Algolia search engine API to retrieve information about medicines. De Voorhoede supplied us with their own API but we decided to store that data at Algolia.

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
