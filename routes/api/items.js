const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//item mode
const Item = require("../../models/Items");

//@route GET api/items
//@desc Get All Items
//@access Public
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ msg: "Unable to load items" });
  }
});



//@route POST api/items
//@desc Create a item
//@access Public
router.post("/",auth,(req, res) => {
  const newItem=new Item({
    name: req.body.name
  });
  newItem.save().then(item=> res.json(item));
});
//@route delete api/items/:id
//@desc Delete a item
//@access Public
router.delete("/:id",auth,(req, res) => {
    Item.findById(req.params.id)
    .then(item =>item.remove().then(()=> res.json({success: true})))
    .catch(err => res.status(404).json({success:false}))

});

module.exports= router;
