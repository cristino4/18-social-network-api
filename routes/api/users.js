const router = require('express').Router();
const {Thoughts,Users} = require('../../models');
const dayjs = require('dayjs');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await Users.find({})
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
  });
//GET user by id
router.get('/:id', async (req,res) => {
    try {
        const data = await Users.findOne({_id:req.params.id})
        .populate({path: 'friends'})
        .populate({path: 'thoughts'})
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);    
    };
});
//Create user
router.post('/', async (req,res) => {
   try {
        const data =  await Users.create({
            username: req.body.username,
            email: req.body.email,
        });
        res.json(data);
   } catch (error) {
        console.error(error);
        res.status(500).json(error); 
   };
});
//PUT update user by id 
router.put('/:id', async (req,res) => {
    try {
        const data = await Users.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true});
            res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});
//DELETE user by its id 
router.delete('/:id', async (req,res) => {
    try {
        const data = await Users.findOneAndDelete({_id: req.params.id});
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});
//POST add new friend to user's frined list 
router.post('/:userId/friends/:friendId', async (req,res) => {
    try {
        const data =  await Users.findOne(
            {_id: req.params.userId},
        );
        data.friends.push(req.params.friendId)
        const newFriends = data.friends;
        const userData = await Users.updateOne(
            {_id: req.params.userId},
            {friends: newFriends},
            {new: true}
        );
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});
// DELETE remove friend from friends list
router.delete('/:userId/friends/:friendId', async (req,res) => {
    try {
        const data =  await Users.findOne({_id: req.params.userId});
        const index =  data.friends.indexOf(req.params.friendId);
        if(index !== -1){
            data.friends.splice(index,1);
            const newFriends = data.friends;
            const userData = await Users.updateOne(
                {_id: req.params.userId},
                {friends: newFriends},
                {new: true}
            );
            res.json(userData);
        } else {
            res.json({message: "User does not exist in friends list"})
        };

    } catch (error) {
        console.error(error);
        res.status(500).json(error); 
    };
});


module.exports = router;