const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 7000;

// ----------- Middlewere --------------
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrtgczb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const studentCollection = client.db("allStudent").collection("student");

        app.get("/student", async (req, res) => {
            const query = {};
            const cursor = studentCollection.find(query);
            const students = await cursor.toArray();
            res.send(students);
        });

        app.get('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await studentCollection.findOne(query);
            res.send(service);
        });

        // ------------------- Add New-----------------
        app.post('/student', async (req, res) => {
            const newStudent = req.body;
            const result = await studentCollection.insertOne(newStudent);
            res.send(result);
        })

        // ----------------- Update ---------------------
        app.put("/student/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            };
            const result = await studentCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // -------------------- Delate ------------------
        app.delete('/student/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await studentCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('david hello')
})

app.listen(port, () => {
    console.log("Alhamdullilah Your server is Start");
});