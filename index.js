const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t6q9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const tvCollection = client.db('tvStar').collection('tv');

        //TV API
        app.get('/tv', async (req, res) => {
            const query = {};
            const cursor = tvCollection.find(query)
            const tvStar = await cursor.toArray();
            res.send(tvStar);
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