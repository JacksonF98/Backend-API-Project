const xlsx = require('xlsx');
const express = require('express');
const app = express();

function loadTickData(){
    const workbook = xlsx.readFile("./data/Tick Sightings.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

const tickData = loadTickData();

app.use(express.json());

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/sightings', (req, res) => {
    const { location } = req.query;
    let filteredData = tickData;
    if(location){
        const locLower = location.toLowerCase();
        filteredData = tickData.filter(
            (row) => String(row.location).toLowerCase() === locLower
        );
    }
    res.json(filteredData);

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));