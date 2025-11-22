const express = require('express');
const router = express.Router();

const tickData  = require('../data/tickdata');

function getSummaryInsights(data) {
    let earliestDate = null;
    let latestDate = null;
    const locationCounts = {};

    data.forEach((row) => {
        const sightingDate = new Date(row.date);
        // Track earliest and latest dates
        if (!earliestDate || sightingDate < earliestDate) {
            earliestDate = sightingDate;
        }
        if (!latestDate || sightingDate > latestDate) {
            latestDate = sightingDate;
        }
    });


    // Most common location

    return {
        totalSightings: data.length,
        earliestSighting: earliestDate ? earliestDate.toISOString().split('T')[0] : null,
        latestSighting: latestDate ? latestDate.toISOString().split('T')[0] : null,
    };
}

/**
 * @openapi
 * /insights/summary:
 *   get:
 *     tags:
 *       - Insights
 *     summary: Get summary insights from tick sightings data
 *     responses:
 *      '200':
 *        description: Summary insights about tick sightings
 *     
 */
router.get('/insights/summary', (req, res) => {
    const summary = getSummaryInsights(tickData);
    res.json(summary);
});

module.exports = router;