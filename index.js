const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('test server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3hnw6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        await client.connect();
        const todolist = client.db("todo").collection("todolist");

        app.post('/tododata', async (req, res) => {
            const data = req.body;
            const result = await todolist.insertOne(data);
            res.send(result);

        })
        app.get('/alltodos', async (req, res) => {
            const result = await todolist.find().toArray();
            res.send(result)

        })

        app.put('/alltodos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };

            const updateDoc = {
                $set: { complete: true },
            };
            const result = await todolist.updateOne(query, updateDoc);
            res.send(result)

        })


        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await todolist.deleteOne(query);

            res.send(result)

        })

    } finally {

    }

}

run().catch(console.dir)


app.listen(port, () => {
    console.log(`your sever is running on ${port}`);
})