const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const url = "mongodb://127.0.0.1:27017/todolistDB";


const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("item", itemsSchema);

main().catch(err => console.log(err));

async function main() {
    
    await mongoose.connect(url);

    console.log("main ran and worked");
    mongoose.disconnect();

}

async function getItems(){
    await mongoose.connect(url);
    let items = await Item.find().select('name -_id');
    
    //mongoose.disconnect();
    return items;
    
}

async function addItemAsDoc(name) {
    await mongoose.connect(url);

    const item = new Item({
        name: name
    });

    await item.save();
    console.log("Successfully Added");

    //mongoose.disconnect();
}

async function clearList() {
    
    await mongoose.connect(url);

    Item.deleteMany({}).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}

let currentDay = date.getDate();

app.get("/", function(req, res){

    let items = [];
    databaseitems = getItems().catch(err => console.log(err));
    databaseitems.then(function(result){
        for (let i = 0; i<result.length; i++) {
            items.push(result[i].name);
        }
        console.log(items);

        res.render('list', {
            dayInput: currentDay,
            newListItem: items
        });
    });
});

app.post("/", function(req, res){
    
    if (req.body.button === "clear") {
        clearList();
        res.redirect("/");
    } else {
        addItemAsDoc(req.body.newItem).catch(err => console.log(err));
        res.redirect("/");
    }
    
});



app.get("/about", function(req, res){
    res.render("about");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");

});



/*
let items = [];
let workItems = [];

app.get("/work", function(req, res){
    res.render('list', {
        dayInput: "Work",
        newListItem: workItems
    });
});

app.post("/work", function(req, res){
    workItems.push(req.body.newItem);

    res.redirect("/work");
}); */