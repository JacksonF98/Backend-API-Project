const express = require('express');
const app = express();
// load tick data
const tickData = require('./data/tickdata');
// Import filtering utility
const filterSightings = require('./utils/filtersightings');
// Import sightings routes
const sightingsRoutes = require('./routes/sightings');
// Import reports routes
const reportsRoutes = require('./routes/reports');
// Import insights
const summaryRoutes = require('./routes/summary');

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
      description: 'API for exploring tick sightings data, including filtering and reports. Author: Jackson Fanelli'
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
        },
        {
            name: 'Insights',
            description: 'Endpoints for higher level insights found in tick sightings data'
        }
    ],
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./app.js', './routes/*.js', './insights/*.js'] // tells swagger-jsdoc to scan this file for docs comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

/**
 * @openapi
 * /welcome:
 *   get: 
 *     tags:
 *       - General
 *     summary: Welcome message for the Tick Sightings API
 *     responses:
 *       '200':
 *         description: Welcome message
 */
app.get('/welcome', (req,res) => {
    res.json({ message: 'Welcome to the Tick Sightings API! Visit /docs for API documentation.' });
})

/**
 * @openapi
 * /status:
 *   get:
 *     tags:
 *       - General
 *     summary: Check API status
 *     responses:
 *       '200':
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
 * /stats:
 *   get:
 *     tags:
 *       - General
 *     summary: Get basic statistics about the tick sightings data
 *     responses:
 *      '200': 
 *        description: Basic statistics including total sightings and API uptime
 */
app.get('/stats', (req, res) => {
    const totalSightings = tickData.length;
    const apiUptime = Math.floor(process.uptime());
    res.json({
        totalSightings,
        apiUptime: `${apiUptime} seconds`
    });
});

app.use(sightingsRoutes);

app.use(reportsRoutes);

app.use(summaryRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));