const express = require('express')
// const { MongoClient } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3xzol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error', err);
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("serviceData");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orderData");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("adminData");

    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedId)
            )
    })
    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedId))
    })
    app.post('/addAdmin', (req, res) => {
        adminCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedId))
    })

    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                // console.log(items)
                res.send(items)
            })
    })
    app.get('/orders ', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                if (items.length) {
                    orderCollection.find({})
                        .toArray((err, items) => {
                            console.log(items)
                            res.send(items)
                        })
                } else {
                    orderCollection.find({ email: req.query.email })
                    .toArray((err, items) =>  {
                        console.log(items)
                        res.send(items)
                    })
                }
                // items ?
                // orderCollection.find({})
                //     .toArray((err, items) => res.send(items))
                //     :
                //      orderCollection.find({ email: req.query.email })
                //         .toArray((err, items) => res.send(items))
            })
        // orderCollection.find({})
        //     .toArray((err, items) => {
        //         // console.log(items)
        //         res.send(items)
        //     })
    })
    app.get('/adminCheck', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(!!items.length)
                // console.log(!!items.length)
            })
    })

    app.delete("/deleteService/:id", (req, res) => {
        const id = ObjectId(req.params.id)
        console.log("delete this", id);
        serviceCollection.deleteOne({ _id: id })
            .then(result => {
                console.log(result);
                res.send(!!result.deletedCount)
            })
    })


    app.patch("/update/:id", (req, res) => {
        serviceCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: req.body
            })
            .then(result => {
                console.log(!!result.modifiedCount)
                res.send(!!result.modifiedCount)
            })
    })


});
app.get('/', (req, res) => {
    res.send("hello world")
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
