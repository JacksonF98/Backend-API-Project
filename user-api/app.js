const xlsx = require('xlsx');
const express = require('express');
const app = express();

// Load and parse the Excel file using xlsx library
function loadTickData(){
    const workbook = xlsx.readFile("./data/Tick Sightings.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

const tickData = loadTickData();

app.use(express.json());

// Test endpoint to verify the server is running
app.get('/status', (req, n) => {
  n.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/sightings', (req, n) => {
    const { location, startDate, endDate } = req.query;
    let filteredData = tickData;

    // Location filtering
    if(location){
        const locLower = location.toLowerCase();
        filteredData = tickData.filter(
            (row) => String(row.location).toLowerCase() === locLower
        );
    }

    //start date filtering
    if(startDate){
        const start = new Date(startDate);
        filteredData = filteredData.filter(
            (row) => {
                const sightingDate = new Date(row.date);
                return sightingDate >= start;
            });
    }
    //end date filtering
    if(endDate){
        const end = new Date(endDate);
        filteredData = filteredData.filter(
            (row) => {
                const sightingDate = new Date(row.date);
                return sightingDate <= end;
            });
        }
    n.json(filteredData);

});

app.get('/reports/locations', (req, res) => {
    const locationCounts = {};
    tickData.forEach((row) => {
        const loc = row.location || 'Unknown';
        locationCounts[loc] = (locationCounts[loc]||0)+1;
    });
    res.json(locationCounts);
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));