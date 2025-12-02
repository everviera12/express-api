const express = require('express');
const app = express()

// routes
const providers = require('./routes/provider.route');

// middlewares
const { conditionalLimiter } = require('./middleware/ratelimit');

app.use(express.json());
app.set('trust proxy', 1);

/** API base route
 *  Applies rate limiting ONLY when running in production.
 *  @next - skip limiter when in development
 *  @providers - route to show all provider data
*/
app.use('/api/v1/', conditionalLimiter, providers);


const port = 3000
app.listen(port, () => {
    console.log(`API running on port ${port} (${process.env.NODE_ENV})`);
})