// Dependency
const express = require('express');
const app = express();

// Middleware
app.use(express.static('public'));

// Listener

const port = process.env.PORT || 1955;
app.listen(port, ()=>{
  console.log('July 17,', port);
})
