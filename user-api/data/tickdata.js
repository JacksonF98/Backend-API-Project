const xlsx = require('xlsx');

function rowContainsNecData(row){
    return row.id && row.date && row.location;
}

// Load and parse the Excel file using xlsx library
function loadTickData(){
    const workbook = xlsx.readFile("./data/Tick Sightings.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Remove rows that are missing date or location
    const cleaned = rows.filter(rowContainsNecData);

    // Log the number of rows removed due to missing data
    const removedCount = rows.length - cleaned.length;
    if(removedCount > 0){
        console.log(`Removed ${removedCount} rows with missing date or location`);
    } else {
        console.log(`All rows loaded.`);
    }
    // Deduplicate based on 'id' field
    const seen = new Set();
    const deduped = [];

    cleaned.forEach(row => {
        const key = row.id;
        // IF ID is missing, log and move on
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(row);
        } else {
            console.log(`Removed duplicate row with id: ${key}`);
        }
    });
    console.log(`Total rows after deduplication: ${deduped.length}`);

    // return data that is cleaned and deduped
    return deduped;
}

// Load tick data once at startup
const tickData = loadTickData();

module.exports = tickData;