const express = require('express');
const app = express()

// routes
const providers = require('./routes/provider.route');

// middlewares
const { limiter } = require('./middleware/ratelimit');

// rate limit
if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
}

app.use(express.json());

/** API base route
 *  Applies rate limiting ONLY when running in production.
 *  @next - skip limiter when in development
 *  @providers - route to show all provider data
*/
app.use('/api/v1/', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return limiter(req, res, next);
    }
    next();
}, providers);


const port = 3000
app.listen(port, () => {
    console.log(`API running on port ${port} (${process.env.NODE_ENV})`);
})