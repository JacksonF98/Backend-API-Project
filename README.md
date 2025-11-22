# Backend-API-Project - Jackson Fanelli
MVP Backend API for tick sighting data
## Project Overview
This project provides a RESTful API for navigating and analysing tick data supplied in an Excel spreadsheet. The API loads the dataset, cleans it by removing any incomplete rows and duplicates, providing the user with several endpoints to query and report.

Users can filter their sightings results using location(city), start date, and end date. The API also produces trend reports using weekly or monthly periods, defaulting to weekly in event of no period being specified. This backend is built using Node.js and Express, with API documentation automatically generated using JSDocs comments and Swagger UI.

## Features

### Core Requirements
- [x] Filter sightings by location (city)
- [x] Filter sightings by start and/or end date
- [x] Number of sightings per region
- [x] View trends over time (weekly or monthly)

### Additional Features
- [x] API status check with welcome endpoint and stats
- [x] Pagination support for handling larger datasets
- [x] Automatic data cleaning (Incomplete and duplicate rows)
- [x] RESTful API with modular routes
- [x] Auto-generated interactive API documentation (Swagger UI)

### Optional Extension Task
- [x] AI/ML Insights - Summary information

## Project Structure

```bash 

|── user-api
    ├── app.js
    ├── data/
    │   ├── Tick Sightings.xlsx
    │   └── tickData.js
    ├── routes/
    │   ├── reports.js
    │   └── sightings.js
    ├── utils/
    │   ├── filterSightings.js
    │   └── paginate.js
    ├── package-lock.json
    ├── package.json
└── README.md
└── .gitignore

```
## Running the Project

### Prerequisites 

- Node.js
- npm

### Clone the repository

``` bash
git clone https://github.com/JacksonF98/Backend-API-Project.git
cd BACKEND-API-PROJECT

```
### Install dependencies
```bash 
npm install
```

### Start the server

```bash
npm start 
```

Alternatively: 
```bash
node app.js
```
API runs by default on port 3000

### Access API
Visit: 
- API Status -> http://localhost:3000/status
- API documentation -> http://localhost:3000/docs/

Example Endpoints:
- http://localhost:3000/sightings
- http://localhost:3000/sightings?location=Manchester
- http://localhost:3000/reports/locations
- http://localhost:3000/reports/trends?period=monthly 

## Further Improvements

### Database Integration
Currently, the API loads the data directly from an Excel spreadsheet using xlsx library.
A future improvement would be integrating the data into a proper database such as:

- MySQL
- MongoDB

This would allow:
- More complex analysis
- persistance of user submitted sightings
- higher scalability for storage of larger datasets
- faster queries 

### Improved Machine learning insights
The current insights uses hard-coded logic rather than machine learing or AI models. 
A future version could include finding a suitable library capable of additional functionality such as:

- anomaly detection e.g. spike of data in particular weeks across locations
- classification of zones that are lower or higher risk
- forecasting for future tick sightings based on previous results

### Improved error handling

The API handles most normal user errors with a graceful message informing them of the mistake on request format. 
Additional improvements could be:

- More detailed error handling e.g. checking for numbers in location filter (Currently parsed as if they are strings)
- Logs of previous errors for developer analytics
- Middleware dedicated towards most error scenarios for more modular code base

### Additional endpoints
More endpoints could be made available, especially if the datasheet changes to include more column headers.
For example: 
- Most active days/weeks
- year by year comparison trends report
- Graphical displays of data using additional libraries



