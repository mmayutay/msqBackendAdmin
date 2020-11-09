const express = require('express');
const generateToken = require("./Helper/registrationAndLoginJWT.js")
const port = process.env.PORT || 8080
const mongoose = require("mongoose")
const ObjectId = require('mongodb').ObjectID;
const cors = require("cors")
const app = express();
const uri = "mongodb+srv://raymondjay:iamlegendary11@cluster0.h2o1d.mongodb.net/dbCollection?retryWrites=true&w=majority";
var currentUser = ""
var mongoCollection = "";
var score = "";
var Account = "";

app.use(cors())
app.use(express.json())

mongoose.connect(uri, (err, db) => {
    if (err) {
        throw err
    } else {
        console.log("Successfully Connected to Database!")
        mongoCollection = db.collection("studentsnames")
        score = db.collection("sample")
        Account = db.collection("Account")
    }
})

app.get('/currentUser', (req, res) => {
    res.send({name: currentUser})
})

app.get('/', (req, res) => {
    res.send("Connected to Database!")
})

app.get("/allData", (req, res) => {
    mongoCollection.find({}).toArray((err, result) => {
        res.send(result)
    })
})

app.get("/getScore", (req, res) => {
    score.find({}).toArray((err, result) => {
        res.send(result)
    })
})
app.post("/addAnswers", (req, res) => {
    mongoCollection.insertOne(req.body, (err, result) => {
        res.send(true)
    })
})

app.post("/AddScore", (req, res) => {
    score.insertOne(req.body, (err, result) => {
        res.send(true)
    })
})
app.delete("/deleteScore", (req, res) => {
    console.log(req.body.dataid)
    const dels = { "dataid": req.body.dataid };
    score.deleteOne(dels).then((result) => 
        console.log(`Deleted Score:${result.deletedCount} item.`)).catch(err => console.error(`Delete failed with error: ${err}`))
        res.send(true)
})

app.delete("/deleteAnswer/:id", (req, res) => {
    console.log(req.params.id)
    const del = { _id: ObjectId(req.params.id) };
    mongoCollection.deleteOne(del).then(result => 
        console.log(`Deleted Person ${result.deletedCount} item.`)).catch(err => console.error(`Delete failed with error: ${err}`))
        res.send(true)
})

app.post("/updateScore", (req, res) => {
    const query = { "dataid": req.body.dataid };

    const update = {
        "$set": {
            "dataid": req.body.dataid,
            "name": req.body.name,
            "score": req.body.score,
            "mistake": req.body.mistake
        }
    };
    const options = { "upsert": false };
    score.updateOne(query, update, options)
        .then(result => {
            const { matchedCount, modifiedCount } = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully updated the item.`)
                res.send(true)
            }
        })
        .catch(err => console.error(`Failed to update the item: ${err}`))
})

app.post("/register", (req, res) => {
    const query = { "username": req.body.username };
    return Account.findOne(query)
        .then(result => {
            if (result) {
                res.jsonp({ success: false })
            } else {
                Account.insertOne(req.body)
                res.jsonp({ success: true })
            }
        })
        .catch(err => console.error(`Failed to find document: ${err}`));
})

app.post("/login", (req, res) => {
    currentUser = req.body.username
    var token = ""
    const query = { "username": req.body.username, "password": req.body.password };
    //const projection = {"username": req.body.username};
    return Account.findOne(query)
        .then(result => {
            token = generateToken.generateJWT(result)
            res.send({success: true ,token: token})
        })
        .catch(err => {
            console.error(`Failed to find document:${err}`)
            res.send({success: false})
        });
})

app.get("/allUsers", (req, res) => {
    Account.find({}).toArray((err, result) => {
        res.send(result);
    })
})

app.listen(port, () => { console.log("Listening to port " + port) })

