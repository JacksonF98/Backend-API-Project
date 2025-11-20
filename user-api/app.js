const express = require('express');
const app = express();

// load tick data
const tickData = require('./data/tickdata');

// Import filtering utility
const filterSightings = require('./utils/filtersightings');

// swagger setup for API documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tick Sightings API',
      version: '1.0.0',
      description: 'API for exploring tick sightings data, including filtering and reports.'
    },
    tags: [
        {
            name: 'General',
            description: 'General endpoints for API status and info'
        },
        {
            name: 'Sightings',
            description: 'Endpoints for retrieving tick sightings data'
        },
        {
            name: 'Reports',
            description: 'Endpoints for generating reports on tick sightings'
        }
    ],
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./app.js'] // tells swagger-jsdoc to scan this file for docs comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use(express.json());

/**
 * @openapi
 * /status:
 *  get:
 *     tags:
 *       - General
 *     summary: Check API status
 *     responses:
 *       200:
 *         description: API is running
 */
// Test endpoint to verify the server is running
app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});


/**
 * @openapi
 * /sightings:
 *  get:
 *     tags:
 *       - Sightings
 *     summary: Get tick sightings with optional filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of matching sightings
 *       404: 
 *         description: No sightings found
 *       500: 
 *         description: Server error
 *
 *
 */

app.get('/sightings', (req, res) => {
    const { location, startDate, endDate } = req.query;

    // Call filtering function
    let filteredData = filterSightings(tickData, { location, startDate, endDate });

    res.json(filteredData);

});

/**
 * @openapi
 * /reports/locations:
 *  get:
 *     tags:
 *      - Reports
 *     summary: Get tick sightings with optional filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of matching sightings aggregated by location
 *       404: 
 *         description: No sightings found
 *       500: 
 *         description: Server error
 *
 *
 */
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


/**
 * @openapi
 * /reports/trends:
 *  get:
 *     tags:
 *      - Reports
 *     summary: Get tick sightings with optional filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of matching sightings aggregated by time period
 *       404: 
 *         description: No sightings found
 *       500: 
 *         description: Server error
 *
 *
 */
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