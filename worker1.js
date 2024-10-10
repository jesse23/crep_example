onmessage = function(event) {
    // Get the SharedArrayBuffer from the main thread
    let sharedBuffer = event.data;
    let sharedArray = new Uint8Array(sharedBuffer); // Create a typed array view

    // Modify the shared buffer
    sharedArray[0] += 1;

    // Send a message back to the main thread
    postMessage('Buffer updated in worker');
};
