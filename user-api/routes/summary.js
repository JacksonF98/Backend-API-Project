const express = require('express');
const router = express.Router();

const tickData  = require('../data/tickdata');

function getSummaryInsights(data) {

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
    res.json({ message: 'Summary insights endpoint currently incomplete' });
});

module.exports = router;