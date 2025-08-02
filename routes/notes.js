const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//route 1 : get all the notes

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {


        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})


//route 2 : Add new note using post

router.post('/noteadd', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be 5 char').isLength({ min: 5 }),],
    async (req, res) => {

        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()
            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    })

//route 3 : Update an existing note  /api/updatenote

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {

        //create a newNote Obj
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("note found/////  Develop by Namra Patel")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed By Namra Patel");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})

//route 4 :delet existing note  /api/deletenote

router.delete('/deletenote/:id', fetchuser, async (req, res) => {


    try {
        // Find the note to be updated and dalete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("note found/////  Develop by Namra Patel")
        }

        //allow deletion
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed By Namra Patel");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Succes": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})
module.exports = router;