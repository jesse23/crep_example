const express = require('express');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch'); 
const fs = require('fs');
const app = express();
// const port = 3100;
const port = 443;

// Load your SSL certificate and key
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

// Middleware to set COOP and COEP headers only for specific routes
app.use('/wasm', (req, res, next) => {
    // this is needed in mac but not needed in windows...not sure why
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
	next();
});

app.get( '/wasm', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/frame', (req, res, next) => {
    /*
    Option 2: force 3rd party to provide this header
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    */
	next();
});


app.get( '/frame', (req, res) => {
	res.sendFile(path.join(__dirname, 'frame.html'));
});

// Serve the HTML file
app.get('/', async (req, res) => {
	  try {
        // Make a fetch request to localhost:3100

        const response = await fetch('https://localhost/wasm');

        // Main corp to get SharedArrayBuffer work
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

       
        // Check if the response is ok
        if (response.ok) {
            const data = await response.text(); // Assuming it's a text response
            res.send(`Response from localhost:3100: ${data}`);
        } else {
            res.status(response.status).send(`Error from localhost:3100: ${response.statusText}`);
        }
    } catch (error) {
        res.status(500).send(`Failed to fetch from localhost:3100: ${error.message}`);
    }
});

// Serve the worker script under the `/wasm` route
app.get('/wasm/worker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'worker1.js'));
});

// Serve other static files if needed
//app.use(express.static(path.join(__dirname, 'public')));

// Start the server
https.createServer(options, app).listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
