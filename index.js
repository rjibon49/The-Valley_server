const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000

// MIddleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qzeme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();

        const database = client.db('tourServices')
        const tourServicesCollection = database.collection('services');
        const bookingCollection = database.collection('order');

        // GET ALL DATA
        app.get('/services', async (req, res) => {
            const cursor = tourServicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE DATA 
        app.get('/services/:id', async ( req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await tourServicesCollection.findOne(query);
            res.send(service);
        })

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post', service);
            const result = await tourServicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // ADD BOOKING API
        app.post('/booking', async(req, res) => {
            const order = req.body;
            console.log('Order COnfirm', order);
            const result = await bookingCollection.insertOne(order);
            console.log(result);
            res.json(result)
        })

         // GET ALL Booking DATA
         app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        //GET SINGLE BOOKING DATA 
        app.get('/booking/:id', async ( req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const booking = await bookingCollection.findOne(query);
            res.send(booking);
        })
        
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get ('/', (req, res) => {
    res.send('Assinment 11')
})

app.listen(port, (req, res) => {
    console.log('Server Running On', port);
})