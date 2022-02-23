const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/todolistDB";

const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("item", itemsSchema);

module.exports.main = main;
module.exports.getItems = getItems;
module.exports.addItemAsDoc = addItemAsDoc;
module.exports.clearList = clearList;

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