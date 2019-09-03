const express = require('express')
const db = require('./data/db.js')

const router = express.Router();

router.post('/', (req, res) => {
    const postInformation = req.body

    if(postInformation.title && postInformation.contents) {
        db.insert(postInformation)
        .then(response => {
            res.status(201).json(postInformation)
        })
        .catch(error => {
            res.status(500).json({ error: 'There was an error while saving the post to the database.'})
        })
    }
    else {
        res.status(400).json({ error: 'Please provide title and contents for the post.'})
    }
})

router.post('/:id/comments', (req, res) => {
    if(!db.findById(req.params.id))
    {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    else if(!req.body.text)
    {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    else
    {
        db.insertComment({text: req.body.text, post_id: req.params.id})
            .then(response =>
                {
                    db.findCommentById(response.id)
                    .then(response =>
                        {
                            res.status(201).json(response)

                        })
                })
            .catch(error =>
                {
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                })
    }
})

router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({ error: 'The posts information could not be retrieved.'})
    })
})

router.get('/:id', (req, res) => {
    const postId = req.params.id
    db.findById(postId)
    .then(post => {
        if(post && post.length > 0) {
            res.status(200).json(post)
        }
        else {
            res.status(404).json({error: 'The post with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        res.status(500).json({error: 'The post information could not be retrieved.'})
    })
})

router.get('/:id/comments', (req, res) => {
    const postId = req.params.id
    db.findPostComments(postId)
    .then(post => {
        if(post && post.length > 0) {
            res.status(200).json(post)
        }
        else {
            res.status(404).json({error: 'The post with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        res.status(500).json({error: 'The comments information could not be retrieved.'})
    })
})

router.delete('/:id', (req, res) => {
    const postId = req.params.id
    db.findById(postId)
    .then(post => {
        if(post && post.length > 0) {
            db.remove(postId)
            .then(removedPost => {
                if(removedPost) {
                    res.status(200).json(post)
                }
                else {
                    res.status(404).json({error: 'The post with the specified ID does not exist.'})
                }
            })
            .catch(error => {
                res.status(500).json({error: 'The post could not be removed'})
            })
        }
        else {
            res.status(404).json({error: 'The post with the specified ID does not exist.'})
        }
    })
})

router.put('/:id', (req, res) => {
    const postId = req.params.id
    const postInformation = req.body

    if(postInformation.title && postInformation.contents) {
        db.update(postId, postInformation)
        .then(user => {
            if(user) {
                res.status(200).json(postInformation)
            }
            else {
                res.status(404).json({error: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            res.status(500).json({error: 'The post information could not be modified.'})
        })
    } else {
        res.status(400).json({ error: 'Please provide title and contents for the post.'})
    }
})

module.exports = router;