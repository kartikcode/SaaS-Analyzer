# SaaS-Analyzer - SEC Filing Analyzer for SaaS Companies
## Requirements
SaaS-Analyzer is built on React JS, Bootstrap 4, Reacstrap and the backend is built on Flask. Node JS is required to run the app.

## Installation
To get the project up and running, and view it in the browser, complete the following steps:

1. Download and install Node: <https://nodejs.org/>
2. Clone this repo.
3. Install project dependancies: `npm install`
4. Start the development environment: `npm start`
5. Open your browser and visit <http://localhost:3000>

## Development
When developing components, you may want assets automatically compiled and the browser to refresh automatically. To do this, run the following task:

* `npm run dev`

## Creating a static build
To create a static instance of this project, run the following task:

* `npm run build`

This will create a folder called `www`, into which the required files will be created.

## Deployment
To make this project publicly accessible, you can deploy a static instance by running the following task:

* `npm run publish`

This will publish the contents of `public` to your `gh-pages` branch.

## Glimpse of portal
The App consists of various sections. The most basic view starts from the Smart Search bar, which lets the user search for companies. 

The examples below showcase the famous company _Asana Inc._, publicly traded as `ASAN`.

The portal shows 4 sections, namely:
- Overview
- Deep Dive
- Highlights
- Filings Explorer

![](src/assets/pics/Screenshot%20(95).png)
![](src/assets/pics/Screenshot%20(88).png)
![](src/assets/pics/Screenshot%20(89).png)
![](src/assets/pics/Screenshot%20(90).png)
![](src/assets/pics/Screenshot%20(91).png)
![](src/assets/pics/Screenshot%20(92).png)
![](src/assets/pics/Screenshot%20(94).png)
