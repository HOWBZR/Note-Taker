const express = require("express");
const path = require("path");
const fs = require('fs')

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;


// Basic route that sends the users to index and notes pages
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});



app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});


let notes = []

app.get("/api/notes", function (req, res) {
    fs.readFile('/Develop/db/db.json', function (err, data) {

        notes = JSON.parse(data)
        console.log(notes)
        return res.json(notes)
    })
});

//pushes notes to new array in api/notes and adds unique id
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    let id = 1
    // newNote.routeName = newNote.id.replace(" ").toLowerCase();
    console.log(newNote);

    if (notes.length !== 0) {
        id = notes[notes.length].id + 1
    }
    newNote = { id, ...newNote }
    notes.push(newNote);


    fs.writeFile('/Develop/db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log('Your file was written')
        res.json(newNote)
    })
});
// Deletes notes
app.delete('/api/notes/:id', function (req, res) {
    let id = parseInt(req.params.id)
    console.log('delete id:', id)
    let temp = notes.filter(elem => elem.id !== id)
    notes = temp

    fs.writeFile('/Develop/db/db.json', JSON.stringify(notes), (err) => {
        console.log('Youre file has been written!')

        res.json(notes)
    })
});

app.put('/api/notes/:id', function (req, res) {
    let id = parseInt(req.params.id)
    let temp = notes.map(elem => {
        if (elem.id === id) {
            elem.title = req.body.title;
            elem.text = req.body.text
        }
        return elem
    })

    notes = temp
    fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), (err) => {
        res.json(notes)
    })
})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});