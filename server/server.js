const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
dotenv.config();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(bodyParser.json());

// Connect to database
connectDb();

// Mount routes - ONLY ONCE
app.use("/api", userRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Debug route to list all registered routes
app.get('/debug-routes', (req, res) => {
    const routes = [];
    
    function extractRoutes(stack, basePath = '') {
        stack.forEach((layer) => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods);
                routes.push({
                    path: basePath + layer.route.path,
                    methods: methods
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                extractRoutes(layer.handle.stack, basePath + (layer.regexp.source.replace(/\\/g, '').replace(/\^/g, '').replace(/\?/g, '').replace(/\$/g, '')));
            }
        });
    }
    
    extractRoutes(app._router.stack);
    res.json(routes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Listening on http://localhost:${PORT}`);
    console.log(` Debug routes: http://localhost:${PORT}/debug-routes`);
});