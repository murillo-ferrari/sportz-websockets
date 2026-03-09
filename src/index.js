import express from 'express';
import {matchesRouter} from "./routes/matches.js";
import http from 'http';
import {attachWebSocketServer} from "./ws/server.js";
import {securityMiddleware} from "./arcjet.js";


const app = express();
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});


app.use(securityMiddleware());

app.use('/matches', matchesRouter);

const { broadcastMatchCreated} = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseURL = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

    console.log(`Server is running on ${baseURL}`);
    console.log(`WebSocket server is running on ${baseURL.replace('http', 'ws')}/ws`);
});
