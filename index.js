const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to todolist" });
const item2 = new Item({ name: "Hit + button to add items" });
const item3 = new Item({ name: "<-- Click on this to delete the item" });
let defaultItems = [item1, item2, item3 ];

function getDate() {
    let today = new Date();
    let options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    let curr = today.toLocaleDateString("en-US", options);

    return curr;
  }


app.get("/", function (req, res) {
  let currentDay = getDate();
  Item.find({}, function (err, foundItems) {
    if (foundItems.length==0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("home", { listTitle: currentDay, newListItems: foundItems });
    }
  });
});

app.post("/", function(req, res){

    const itemName = req.body.newItem;
    // const listName = req.body.list;
  
    const item = new Item({
      name: itemName
    });
      item.save();
      res.redirect("/");
  });

  app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    // const listName = req.body.listName;
  let currDay = getDate();
    Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
    }
    });
  });  
  

app.listen(3000, () => {
  console.log("listening to port 3000");
});
