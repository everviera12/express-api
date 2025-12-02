const rateLimit = require('express-rate-limit');

/** Rate limit middleware
* Restricts the number of incoming requests per IP to prevent abuse, scraping, or brute-force attacks.
* In this configuration, each IP is allowed up to 30 requests per minute.
*
* -- Oficial docs ⬇
* @docs https://express-rate-limit.mintlify.app/reference/configuration
*/

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    message: {
        message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
})

module.exports = {
    limiter
}