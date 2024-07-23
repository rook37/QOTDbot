const fs = require('node:fs');

/*

HELPER FUNCTIONS 

*/

module.exports = {createQs , parseQ}

//Check guilds and create a file to store questions 
function createQs(value, key, map){
    let jsonName = value.id + '.json';
    var file
    if (!fs.existsSync(jsonName)) {
        console.log("File: " + jsonName + " not found. Creating!")
        file = fs.writeFileSync(jsonName, JSON.stringify({}))
    }
}

//reads the JSON for the current loaded questions and returns it as a list
function parseQ(id){
    let jsonName = id + '.json';
    var file
    if (!fs.existsSync(jsonName)) {
        console.log("File: " + jsonName + " not found. Creating!")
        file = fs.writeFileSync(jsonName, JSON.stringify({}))
    }
    file = fs.readFileSync(jsonName)
    return JSON.parse(file)
} 

function writeFile(jsonNAme, obj) {
    fs.writeFileSync(
      String(jsonName),
      JSON.stringify(serverConfig)
    )
  }