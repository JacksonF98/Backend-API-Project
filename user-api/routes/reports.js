const express = require('express');
const router = express.Router();

const  tickData  = require('../data/tickdata');
const filterSightings = require('../utils/filtersightings');
const paginate = require('../utils/paginate');
const { invalidDateCheck } = require('../utils/validation');
/**
 * @openapi
 * /reports/locations:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get tick sightings with optional filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: "Liverpool"
 *         description: Location to filter sightings
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         description: Start date for filtering sightings (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-12-31"
 *         description: End date for filtering sightings (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: List of matching sightings aggregated by location
 *       '404':
 *         description: No sightings found
 *       '500':
 *         description: Server error
 */
router.get('/reports/locations', (req, res) => {
    const { location, startDate, endDate } = req.query;
    //Validate date inputs
    if(invalidDateCheck(startDate) || invalidDateCheck(endDate)){
        return  res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

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


/**
 * @openapi
 * /reports/trends:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get tick sightings aggregated by time period (weekly or monthly)
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: ['weekly', 'monthly']
 *         description: "Period to aggregate by (default: weekly)"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: "Manchester"
 *         description: Location to filter sightings
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         description: Start date for filtering sightings (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-12-31"
 *         description: End date for filtering sightings (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *          example: 1
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *          type: integer
 *          example: 50
 *         description: Number of items per page (default 100)
 *     responses:
 *       '200':
 *         description: List of matching sightings aggregated by time period
 *       '404':
 *         description: No sightings found
 *       '500':
 *         description: Server error
 */
router.get('/reports/trends', (req, res) => {
    const { period = 'weekly', location, startDate, endDate } = req.query;
    //Validate date inputs
    if(invalidDateCheck(startDate) || invalidDateCheck(endDate)){
        return  res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }
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

    paginate(result)(req, res, () => {
        res.json({ period: String(period).toLowerCase(), ...res.paginatedResults });
    });

});

module.exports = router;