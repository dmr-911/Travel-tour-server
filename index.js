const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

// Middleware
app.use(cors());
app.use(express.json());

// Mongodb uri and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jycgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travelTour");
        const offering = database.collection("offerings");
        const service = database.collection("services");
        const destination = database.collection("destinations");
        const addOffer = database.collection("addedOffers");

        // GET Api 
        app.get('/offerings', async (req, res) => {
            const cursor = offering.find({});
            const offerings = await cursor.limit(6).toArray();
            res.json(offerings);
        });

        app.get('/services', async(req, res) =>{
            const cursor = service.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        app.get('/destinations', async(req, res) => {
            const cursor = destination.find({});
            const destinations = await cursor.toArray();
            res.json(destinations);
        });
        app.get('/addOffer', async (req, res) => {
            const cursor = addOffer.find({});
            const addedOffers = await cursor.toArray();
            res.json(addedOffers);
        });

        // POST Api
        app.post('/addOffer', async (req, res) => {
            const offer = req.body;
            const result = await addOffer.insertOne(offer);

            res.json(result);
        });

        // DELETE Api
        app.delete('/addOffer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addOffer.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is Travel Tour Server');
});

app.listen(port, () => {
    console.log('Travel Tour server Running at port ', port);
});