const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/todolistDB";

const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("item", itemsSchema);

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("list", listSchema);

module.exports.main = main;
module.exports.getItems = getItems;
module.exports.addItemAsDoc = addItemAsDoc;
module.exports.clearList = clearList;
module.exports.deleteItem = deleteItem;
module.exports.createList = createList;
module.exports.addItemInList = addItemInList;
module.exports.deleteItemInList = deleteItemInList;

async function createList(listName) {
    await mongoose.connect(url);
    
    let lists = await List.find();
    console.log(lists);
    
    let foundList = await List.findOne({ name: listName }).exec();
    if(foundList) {
        console.log("found list");
        return foundList;
    } else {
        const list = new List({
            name: listName,
            items: []
        });
        list.save();
        console.log("created list");
        return list;
    }
    
    
    /*
    List.findOne({name: listName}, function(err, foundList){
        if(!err){
            if(!foundList){
                console.log("does not exist yet");
                const list = new List({
                    name: listName,
                    items: []
                });
                list.save();
            } else {
                console.log("exists");
                console.log(foundList);
            }
        }
    }); */
}



async function main() {
    
    await mongoose.connect(url);
    console.log("Database Connection Successful");
    mongoose.disconnect();
}

async function getItems(){
    
    await mongoose.connect(url);
    let items = await Item.find().select('name -_id');
    return items;
}

async function addItemInList(itemName, listName){
    await mongoose.connect(url);

    const item = new Item({
        name: itemName
    });

    let foundList = await List.findOne({ name: listName }).exec();
    foundList.items.push(item);
    await foundList.save();

}

async function addItemAsDoc(name) {
    
    await mongoose.connect(url);

    const item = new Item({
        name: name
    });

    await item.save();
    console.log("Successfully Added");
}

async function clearList() {
    
    await mongoose.connect(url);

    Item.deleteMany({}).then(function(){
        console.log("Succesfully deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}

async function deleteItem(name) {
    
    await mongoose.connect(url);

    Item.deleteOne({name: name}).then(function(){
        console.log("Succesfully deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
}

async function deleteItemInList(itemName, listName) {
    await mongoose.connect(url);

    //let foundList = await List.findOne({ name: listName }).exec();

    List.findOneAndUpdate({name: listName}, {$pull: {items: {name: itemName}}}, function(err, foundList){
        
    });
}