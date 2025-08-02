const connectToMongo = require('./db');
const express = require('express')
connectToMongo(); 
const port = process.env.PORT || 5000;

const cors = require('cors');


const app = express()


app.use(cors())

app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Batchbook backend running at http://localhost:${port}`);
});