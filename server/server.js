require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const app = express();
const { errorHandler } = require('./middleware/errorMiddleware')

connectDb();

app.use(express.static('public'))

       //route        //return
app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello AWSCC'});
})

//Post routes:
const postRouter = require('./routers/postRouter')
app.use('/posts', postRouter)

// Use Error Middleware
app.use(errorHandler)

app.listen(8080, () => {
    console.log('Server is running in port 8080');
})