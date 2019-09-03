const express = require('express')

const postRoutes = require('./postRoutes')

const server = express();

server.use(express.json());
server.use('/api/posts', postRoutes)
server.use('/', (req, res) => res.send('API is running!'))
server.listen(8000, () => console.log('API running on port 8000'))