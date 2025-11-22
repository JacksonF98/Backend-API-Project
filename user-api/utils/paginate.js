function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;

    if(limit > 500 || isNaN(limit)){
        return res.status(400).json({ message: 'Limit must be a number in the range of 1 to 500' });
    }
    if(page < 1 || isNaN(page)){
        return res.status(400).json({ message: 'Page number must be 1 or greater.' });
    }

    // Ensure page & limit are always safe
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 500)); // Add safety cap

    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = safePage * safeLimit;

    // Prepare pagination result object
    const results = {
      page: safePage,
      limit: safeLimit,
      total: model.length,
      totalPages: Math.ceil(model.length / safeLimit)
    };

    // Next page info
    if (endIndex < model.length) {
      results.next = {
        page: safePage + 1,
        limit: safeLimit
      };
    }
    // Previous page info
    if (startIndex > 0) {
      results.previous = {
        page: safePage - 1,
        limit: safeLimit
      };
    }
    // Slice the data for the current page
    results.data = model.slice(startIndex, endIndex);

    res.paginatedResults = results;
    next();
  };
}

module.exports = paginatedResults;
