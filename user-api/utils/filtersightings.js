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

module.exports = filterSightings