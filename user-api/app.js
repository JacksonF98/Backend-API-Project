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
  apis: ['./app.js', './routes/*.js'] // tells swagger-jsdoc to scan this file for docs comments
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

app.use(sightingsRoutes);

app.use(reportsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));