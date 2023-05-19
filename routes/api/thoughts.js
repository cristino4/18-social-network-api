const router = require('express').Router();
const {Thoughts,Users} = require('../../models');
const dayjs = require('dayjs');
      
//GET all thoughts
router.get('/', async (req,res) => {
    try {
        const data = await Thoughts.find({});
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
//GET single thought by id
router.get('/:id', async (req,res) => {
    try {
        const data = await Thoughts.findOne({_id: req.params.id});
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
//POST create new thought. add thought to user
router.post('/', async (req,res) => {
    try {
        const date = dayjs();
        const username = req.body.username;
        const data =  await Thoughts.create({
            thoughtText: req.body.thoughtText,
            createdAt: date,
            username: username
        });
        const newId = data._id;
        const dataUser =  await Users.findOne(
            {username: username},
        );
        dataUser.thoughts.push(newId)
        const newThoughts = dataUser.thoughts;
        const userData = await Users.updateOne(
            {username: username},
            {thoughts: newThoughts},
            {new: true}
        );
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
//PUT update thought by id
router.put('/:id', async (req,res) => {
    try {
        const data = await Thoughts.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true});
            res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});
//DELETE remove thought by id
router.delete('/:id', async (req,res) => {
    try {
        const data = await Thoughts.findOneAndDelete({_id: req.params.id});
        const user =  await Users.findOne({username: data.username});
        const index =  user.thoughts.indexOf(req.params.id);
        if(index !== -1){
            user.thoughts.splice(index,1);
            const newThoughts = data.thoughts;
            const update = await Users.updateOne(
                {username: data.username},
                {thoughts: newThoughts},
                {new: true}
            );
            res.json(update);
        } else {
            res.json({message: "thought deleted"})
        };
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});

//POST create reaction in a thought
router.post('/:thoughtId/reactions', async (req,res) => {
    try {
        const data = await Thoughts.findById(req.params.thoughtId);
        const newReaction = {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
        };
        data.reactions.push(newReaction);
        const newReactions =  data.reactions;
        const result = await Thoughts.updateOne(
            {_id: req.params.thoughtId},
            {reactions: newReactions},
            {new: true}
            );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});

//DELETE remove a reaction from a though through its reactionId
 router.delete('/:thoughtId/reactions/:reactionId', async (req,res) => {
    try {
        const data = await Thoughts.findById(req.params.thoughtId);
        const arr = data.reactions;
        console.log(arr[0].reactionId.toString());
        console.log(req.params.reactionId)
        const index = arr.findIndex(rea => rea.reactionId.toString() === req.params.reactionId); 
        if(index !== -1){
            data.reactions.splice(index,1);
            const newReactions = data.reactions;
            const update = await Thoughts.updateOne(
                {username: data.username},
                {reactions: newReactions}
                            );
            res.json(update);
        } else {
            res.json({message: "reaction doesn't exist for this thought"});
        };
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});
module.exports = router;