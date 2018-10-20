const express = require('express');
const api = express();
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const service = require('./service');
const authentication = require('./authentication');
const init = require('./init');
require('dotenv').config();

// RESPONSE HEADERS
api.use(authentication.headers);
api.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT, extended: true }));
api.use(expressJwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/api/v1/auth'] }));

// AUTHENTICATION
api.post('/api/v1/auth', authentication.authenticate);

// METHODS
api.post('/api/v1/search/:collection', service.list);
api.get('/api/v1/:collection/:id', service.get);
api.post('/api/v1/:collection', service.insert);
api.delete('/api/v1/:collection/:id', service.remove);
api.put('/api/v1/:collection', service.update);

// LISTENING ON PORT
api.listen(process.env.PORT || 4000, init.init);