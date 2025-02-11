/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, it calls the next middleware function.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
module.exports = function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login'); 
    }
}