const xlsx = require('xlsx');
const express = require('express');
const app = express();

// Load and parse the Excel file using xlsx library
function loadTickData(){
    const workbook = xlsx.readFile("./data/Tick Sightings.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

function filterSightings(data, { location, startDate, endDate }) {
    let filteredData = data;

    // Location filtering
    if(location){
        const locLower = location.toLowerCase();
        filteredData = filteredData.filter(
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
    return filteredData;
}

const tickData = loadTickData();

app.use(express.json());

// Test endpoint to verify the server is running
app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/sightings', (req, res) => {
    const { location, startDate, endDate } = req.query;

    // Call filtering function
    let filteredData = filterSightings(tickData, { location, startDate, endDate });

    res.json(filteredData);

});

app.get('/reports/locations', (req, res) => {
    const { location, startDate, endDate } = req.query;

    // Call filtering function
    let filteredData = filterSightings(tickData, { location, startDate, endDate });

    // Aggregate counts by region
    const locationCounts = {};
    filteredData.forEach((row) => {
        const loc = row.location || 'Unknown';
        locationCounts[loc] = (locationCounts[loc]||0)+1;
    });
    res.json(locationCounts);
});

app.get('/reports/trends', (req, res) => {
    const { period = 'weekly', location, startDate, endDate } = req.query;

    // Filter data first
    const filteredData = filterSightings(tickData, { location, startDate, endDate });

    // Aggregate by period key
    const buckets = {};
    filteredData.forEach(row => {
        // parse date
        const d = new Date(row.date);
        // skip invalid dates
        if (isNaN(d)) return;

        let key;
        if (String(period).toLowerCase() === 'monthly') {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            // use first day of month as key (YYYY-MM-01)
            key = `${y}-${m}-01`;
        } else {
            // weekly: Start the week from monday instead of sunday
            const dd = new Date(d);
            const day = dd.getDay() === 0 ? 7 : dd.getDay(); // Sunday=7

            dd.setDate(dd.getDate() - (day - 1)); // move to Monday
            dd.setHours(0,0,0,0);

            // ISO date string YYYY-MM-DD
            key = dd.toISOString().slice(0,10);
        }
        
        // initialize bucket if not exists

        if (!buckets[key]) buckets[key] = { period: key, count: 0 };
        buckets[key].count++; 
    });

    // Convert to sorted array
    const result = Object.values(buckets).sort((a, b) => a.period.localeCompare(b.period));

    res.json({ period: String(period).toLowerCase(), data: result });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));