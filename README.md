# Backend-API-Project
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
- [x] API status check
- [x] Pagination support for handling larger datasets
- [x] Automatic data cleaning (Incomplete and duplicate rows)
- [x] RESTful API with modular routes
- [x] Auto-generated interactive API documentation (Swagger UI)

### Optional Extension Task
- [ ] AI/ML Insights

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

