const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const database = require(__dirname + "/database.js")
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

database.main().catch(err => console.log(err));

let currentDay = date.getDate();

app.get("/", function(req, res){

    let items = [];
    databaseitems = database.getItems().catch(err => console.log(err));
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

app.get("/:customListName", function(req, res){
    const listName = req.params.customListName;
    
    const getData = async () => {
        let currentList = await database.createList(listName);
        console.log(currentList);

        let itemsList = []
        for(let i = 0; i< currentList.items.length; i++){
            itemsList.push(currentList.items[i].name);
        }
        
        res.render('list', {
            dayInput: currentList.name,
            newListItem: itemsList
        });
    }
    getData();
});

app.post("/", function(req, res){
    
    if (req.body.button === "clear") {
        database.clearList();
        res.redirect("/");
    } else if (req.body.button === currentDay){
        database.addItemAsDoc(req.body.newItem).catch(err => console.log(err));
        res.redirect("/");
    } else {
        console.log(req.body.newItem);
        console.log("Im here");
        database.addItemInList(req.body.newItem, req.body.button).catch(err => console.log(err));
        res.redirect("/" + req.body.button);
    }
});

app.post("/delete", function(req, res){
    
    let itemDelete = req.body.checkbox;
    let listName = req.body.listName;
   
    const deleteData = async() => {
        await database.deleteItemInList(itemDelete, listName);
        res.redirect("/" + req.body.listName);
    }
    
    if (listName === currentDay) {
        database.deleteItem(itemDelete);
        res.redirect("/");
    } else {
        deleteData();
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