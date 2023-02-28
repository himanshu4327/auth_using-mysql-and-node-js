const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const route = require('./route/route')



app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());

app.use('/', route)

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
app.use(function(req,res){
    return res.status(400).send("invalid url")
})

app.get('/', (req, res) => {
    res.json({ "message": "log in system" });
});

app.listen(4000, () => {
    console.log("app is running on port 4000");
});