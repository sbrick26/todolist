
module.exports.getDate = getDate;

function getDate() {
    let today = new Date();
    let options = {
        weekday: "long"
    };

    let currentDay = today.toLocaleDateString("en-US", options);
    return currentDay;
}

