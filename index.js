const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

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
        
        // GET Api 
        app.get('/offerings', async (req, res) => {
            const cursor = offering.find({});
            const offerings = await cursor.limit(6).toArray();
            res.json(offerings);
        });

        app.get('/services', async(req, res) =>{
            const curson = service.find({});
            const services = await curson.toArray();
            res.json(services);
        });
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