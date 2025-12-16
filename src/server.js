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
app.use('/api/v1/providers', conditionalLimiter, providers);

app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to my Express API. Visit 
            <a href='https://victorsweb.site' target='_blank' rel='noopener noreferrer'>victorsweb.site</a> 
            to see my work.
        </h1>
    `)
});

app.get("/ping", (req, res) => {
    res.json({ ok: true, timestamp: new Date() });
});


const port = process.env.PORT || 3000;
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "set" : "missing");
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "set" : "missing");

/* https://victorswebsite-api.up.railway.app */

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`API running on port ${port} (${process.env.NODE_ENV})`);
    })
}

module.exports = app;
