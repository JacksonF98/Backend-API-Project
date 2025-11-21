const express = require('express');
const router = express.Router();

const  tickData  = require('../data/tickdata');
const filterSightings = require('../utils/filtersightings');
const paginate = require('../utils/paginate');

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

router.get('/sightings', (req, res) => {
    const { location, startDate, endDate } = req.query;

    // Call filtering function
    let filteredData = filterSightings(tickData, { location, startDate, endDate });

    // Apply pagination
    const middleware = paginate(filteredData);
    middleware(req, res, () => {
        res.json(res.paginatedResults);
    });

});

module.exports = router;