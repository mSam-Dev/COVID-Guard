const express = require('express');
const path = require('path');
const cors = require('cors');
// Routes
const registeredGeneralPublicAuthRoutes = require('./routes/api/registeredgeneralpublic/auth');
const businessOwnerAuthRoutes = require('./routes/api/businessowner/auth');
const healthProfessionalAuthRoutes = require('./routes/api/healthprofessional/auth');
const generalPublicRoutes = require('./routes/api/generalpublic/routes');
const registeredGeneralPublicRoutes = require('./routes/api/registeredgeneralpublic/routes');
const healthProfessionalRoutes = require('./routes/api/healthprofessional/routes');
const businessOwnerRoutes = require('./routes/api/businessowner/routes');
const ROUTES = require('./_constants/routes');

const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./db");
const errorHandler = require('./middleware/errorHandler');

db.connect();

// CORS Middleware
app.use(cors());

// parse json body content
app.use(express.json());

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build')));

// Answer API requests.
app.use(ROUTES.REGISTERED_GENERAL_PUBLIC_AUTH, registeredGeneralPublicAuthRoutes);
app.use(ROUTES.BUSINESS_OWNER_AUTH, businessOwnerAuthRoutes);
app.use(ROUTES.HEALTH_PROFESSIONAL_AUTH, healthProfessionalAuthRoutes);
app.use(ROUTES.REGISTERED_GENERAL_PUBLIC, registeredGeneralPublicRoutes);
app.use(ROUTES.GENERAL_PUBLIC, generalPublicRoutes);
app.use(ROUTES.BUSINESS_OWNER, businessOwnerRoutes);
app.use(ROUTES.HEALTH_PROFESSIONAL, healthProfessionalRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', 'client', 'covid19-app', 'build', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

module.exports = app;
