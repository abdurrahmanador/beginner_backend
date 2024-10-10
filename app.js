const express = require("express")
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require("mongodb")

const app = express()
let db
app.use(express.json())

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("App is Listening to Port Number:3000")
        })
        db = getDb()
    }

})

//get method
app.get('/movies', (req, res) => {
    let movieList = []

    db.collection('Hollywood')
        .find()
        .sort({ title: 1 })
        .forEach(movie => {
            movieList.push(movie)
        }).then(() => {
            res.status(200).json(movieList)
        }
        ).catch(err => {
            res.status(500).json({ status: "Couldn't Fetch Data" })
        })

})

//get method
app.get('/movies/:id', (req, res) => {
    let movieId = req.params.id
    if (ObjectId.isValid(movieId)) {
        db.collection('Hollywood')
            .findOne({ _id: new ObjectId(movieId) })
            .then((doc) => {
                res.status(200).json(doc)
            }).catch(err => {
                res.status(500).json({ status: "Couldn't Fetch Data" })
            })
    }
})

//post method
app.post(('/movies'), (req, res) => {
    const movie = req.body

    db.collection('Hollywood')
        .insertOne(movie)
        .then((result) => res.status(200).json(result))
        .catch(err => {
            res.status(500).json({ err: "Couldn't Post Data" })
        })
})


//post method
app.patch(('/movies/:id'), (req, res) => {
    const updates = req.body
    const id = req.params.id

    if (ObjectId.isValid(id)) {
        db.collection('Hollywood')
        .updateOne({ _id: new ObjectId(id) }, { $set: updates })
        .then((result) => res.status(200).json(result))
        .catch(err => {
            res.status(500).json({ err: "Couldn't Update Data" })
        })
    }
})

//post method
app.delete(('/movies/:id'), (req, res) => {
    const id = req.params.id

    if (ObjectId.isValid(id)){    db.collection('Hollywood')
        .deleteOne({ _id: new ObjectId(id) })
        .then((result) => res.status(200).json(result))
        .catch(err => {
            res.status(500).json({ err: "Couldn't Update Data" })
        })}
})