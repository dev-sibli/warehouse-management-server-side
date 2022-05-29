const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlpyb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const tvCollection = client.db('tv_star_management').collection('tvs');

        //Get all products
        app.get('/tv', async (req, res) => {
            const query = {};
            const cursor = tvCollection.find(query)
            const tvStar = await cursor.toArray();
            res.send(tvStar);
        })


        app.get('/tv/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tvCollection.findOne(query);
            res.send(result);
        });

        // Post Products: Add a new product
        app.post('/tv', async (req, res) => {
            const tv = req.body;
            const result = await tvCollection.insertOne(tv);
            res.send(result);
        });

        // update Products
        app.put('/tv/:id', async (req, res) => {
            const id = req.params.id
            const updateTv = req.body;
            console.log(updateTv.quantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: parseInt(updateTv.quantity),
                }
            };
            const result = await tvCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/tv/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await tvCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tv star Server running')
})

app.listen(port, () => {
    console.log('Listening to Port', 5000);
})