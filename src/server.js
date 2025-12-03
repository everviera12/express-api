const express = require('express');
const app = express()

// routes
const providers = require('./routes/provider.route');

// middlewares
const { conditionalLimiter } = require('./middleware/ratelimit');

app.use(express.json());

/** Proxy config
* Enable trust proxy to correctly read client IPs when behind a reverse proxy.
*/
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", true);
}

/** API base route
 *  Applies rate limiting ONLY when running in production.
 *  @conditionalLimiter - function to handle many request
 *  @providers - route to show all provider data
*/
app.use('/api/v1/providers', providers);

app.get("/ping", (req, res) => {
    res.json({ ok: true, timestamp: new Date() });
});


/* https://express-api-v1.up.railway.app */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API running on port ${port} (${process.env.NODE_ENV})`);
})