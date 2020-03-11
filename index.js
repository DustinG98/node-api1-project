// implement your API here
const express = require('express')

const database = require('./data/db')

const server = express();

server.use(express.json())


//ADD NEW USER
server.post('/api/users', (req, res) => {
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        return;
    }
    database.insert({ name: req.body.name, bio: req.body.bio })
        .then(userId => {
            database.findById(userId.id)
                .then(user => {
                    res.status(201).json(user)
                })
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        })
})

//GET ALL USERS
server.get('/api/users', (req, res) => {
    database.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
        })
})

//GET USER BY ID
server.get('/api/users/:id', (req, res) => {
    database.findById(req.params.id) 
        .then(user => {
            if(!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
                return;
            }
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." })
        })
})

//DELETE USER
server.delete('/api/users/:id', (req, res) => {
    database.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
                return;
            }
            database.remove(req.params.id)
                .then(() => res.status(200).json({ message: "User Deleted" }))
                .catch(() => res.status(500).json({ errorMessage: "The user could not be removed" }))
        })        
})


//UPDATE USERS INFORMATION
server.put('/api/users/:id', (req, res) => {
    database.findById(req.params.id) 
        .then(user => {
            if(!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
                return;
            }
            if(!req.body.bio || !req.body.name) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
                return;
            }
            database.update(req.params.id, req.body)
                .then(count => {
                    if(count === 1) {
                        database.findById(req.params.id)
                            .then((user) => res.status(200).json(user))
                            return;
                    }
                    res.status(500).json({ errorMessage: "The user information could not be modified." })
                })

        })
})


server.listen(5000, () => console.log('Server running on port 5000'))