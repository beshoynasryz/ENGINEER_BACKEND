function localizationMiddleware(req, res, next) {
    req.locale = req.headers['accept-language'] || 'ar'; // Default to 'en' if no language is provided
    next();
}

module.exports = localizationMiddleware;
