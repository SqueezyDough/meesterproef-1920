# Medicine scanner
In this course we will bundle all our newly acquired superpowers to create a webapp for a real client. We will create a webapp for De Voorhoede. They've asked us to create a completely new version of their Medicine scanner, using Machine Learning and Optical character Recognition.

## Table of contents
- [Collaborators](#collaborators)
- [API](#api)
- [Install notes](#install)
- [Machine learning](#database)
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

<a name="database">
  
## Database

<details>
  <summary>View ERD</summary>
    
  ![meds_erd](https://user-images.githubusercontent.com/33430653/83024678-053cd000-a02f-11ea-89ee-f4d7ad417dc3.png)
</details>

### Buckets
Buckets are a collection of clusters. Each bucket has a tier number. The tier number decides which bucket will be searched in first. Bucket tier 1 will be lokked at first. When no matching cluster is found, it will look at cluster 2 etc.

### Clusters
Clusters are a collection of medicines that correspond with the cluster identifier. For example, Someone is looking for Strepsils, Lemon and honey. Strepsils here is the cluster identifier and contains all medicines with the name Strepsils. 

### Medicines
Medicines contain information about a specific medicine.

<a name="ml">
  
## Machine learning
For this project we make use of machine learning to recognize characters on medicine boxes. The package we use is [Tesseract](https://www.npmjs.com/package/node-tesseract-ocr).
In order to make this project a little bit more challenging we decided to implement a ranking system for recognition of medicine names, we do this by calculating positive findings confirmed by the user
and comparing these with future searches.

<details>
<summary>Flow chart medicine recognition</summary>
Recognition flow start

![flow-chart-v1-flow-start](https://user-images.githubusercontent.com/19706066/83023546-54820100-a02d-11ea-81b4-aa99712fc7b8.jpg)

------

Recognizing medicine name flow

![flow-chart-v1-recognise-name-flow](https://user-images.githubusercontent.com/19706066/83023571-5cda3c00-a02d-11ea-9568-828ea07fc889.jpg)

------

Recognizing RVG code flow

![flow-chart-v1-recognise-rvg-flow](https://user-images.githubusercontent.com/19706066/83023595-64014a00-a02d-11ea-841e-e854756ca2ce.jpg)
</details>

<a name="docs">
## Other documentation
For more documentation about our medicine scanner visit our [Wicky](https://github.com/SqueezyDough/meesterproef-1920/wiki)!
