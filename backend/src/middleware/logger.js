const logger = (req, res, next) => {
    const start = Date.now(); 
  
    // Log request details
    console.log(`Incoming request: ${req.method} ${req.path}`);
    if (Object.keys(req.query).length) {
      console.log(`Query Params: ${JSON.stringify(req.query)}`);
    }
    if (Object.keys(req.body).length) {
      console.log(`Request Body: ${JSON.stringify(req.body)}`);
    }
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
  
    // Capture the original send function
    const originalSend = res.send;
  
    // Override the send method to log the status code after response is sent
    res.send = function (body) {
      const duration = Date.now() - start;  // Calculate request duration
      console.log(`Response Status: ${res.statusCode} - Duration: ${duration}ms`);
      originalSend.call(this, body); // Send the response
    };
  
    next();  // Proceed to the next middleware
  };
  
  module.exports = logger;
  