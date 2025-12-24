const cors = require('cors');
const express = require('express');
const app = express()

// routes
const providers = require('./routes/provider.route');
const loginAuth = require('./routes/auth.route');

// middlewares
const { conditionalLimiter } = require('./middleware/ratelimit');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

/** Proxy config
* Enable trust proxy to correctly read client IPs when behind a reverse proxy.
*/
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", true);
}

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const origin = req.headers.origin || "No origin";
        const referer = req.headers.referer || "No referer";
        const host = req.headers.host;
        const userAgent = req.headers['user-agent'];
        const localDate = new Date().toLocaleString("en-EN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        console.log(
            `---------------- \n` +
            `---------------- \n` +
            `Fecha: ${localDate} \n` +
            `Origen: ${origin} \n` +
            `Referer: ${referer} \n` +
            `Agent: ${userAgent} \n` +
            `Host Destino: ${host} \n` +
            `IP Cliente: ${req.ip} \n` +
            `Método/Ruta: ${req.method} ${req.originalUrl} \n` +
            `Status: ${res.statusCode} - ${duration}ms \n` +
            `-----------------------` +
            `---------------- \n`
        );
    });

    next();
});


/** API base route
 *  Applies rate limiting ONLY when running in production.
 *  @conditionalLimiter - function to handle many request
 *  @providers - route to show all provider data
*/
app.use('/api/v1/providers', conditionalLimiter, providers);
app.use('/api/v1', conditionalLimiter, loginAuth);

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
