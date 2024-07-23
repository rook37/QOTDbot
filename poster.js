
const fs = require('node:fs');
const { DateTime } = require('luxon');

let test = 1

module.exports = {
    postIt
}

function postIt(servNo, client) {
    let jsonName = servNo + 'cfg.json'
    let adminChannel
    let targetChannel
    let rolePing
    let postTime
    let posting
    time = (new Date()).toLocaleString()
    try {
        var file = fs.readFileSync(jsonName);
        serverConfig = JSON.parse(file)
        console.log(serverConfig)
        adminChannel = serverConfig.admChannel
        targetChannel = serverConfig.targChannel
        postTime = new DateTime(serverConfig.postTime)
        posting = serverConfig.posting
        if (serverConfig.rolePing) { rolePing = serverConfig.rolePing }
    } catch (er) {
        console.log(er);
    }
    if (!posting) {
        return;
    }
    try {
        file = fs.readFileSync(servNo + '.json')
        commands = JSON.parse(file);
    } catch (er) {
        console.log(er);
    }


    const embed = {
        "color": 16312092,
        "description": `Got an idea for question of the day? \nWe'd love to hear it 😃 \n[*Drop off the suggestion here!*](${process.env.SUGGESTION_LINK})`
    };

    if (0 < Object.keys(commands).length) {
        if (!!commands["0"]) {
            var question = commands["0"];
            //deleteQ(servNo, "0",Object.keys(commands).length, commands, jsonName);
        }

        qContent = (rolePing) ? `<@&${rolePing}>` + question : question;

        //posting question if there is one
        try {
            client.channels.cache.get(targetChannel).send({ content: qContent, embeds: [embed] });
        } catch (er) {
            console.log(er)
            try {
                client.channels.cache.get(adminChannel).send("Error sending question! Stopping timer, please check permissions and then use /startq to resume!");
                file = fs.readFileSync(jservNo + 'cfg.json');
                serverConfig = JSON.parse(file)
                serverConfig.posting = 0;
                fs.writeFileSync(servNo + 'cfg.json', JSON.stringify({ serverConfig }))
            } catch (er) {
                console.log(er)

            }
        }
    } else { //no question loaded, will try to send admin channel heads up.
        try {
            client.channels.cache.get(adminChannel).send("No Q loaded! Stopping timer, please use /startq to resume! ")
        } catch (er) {
            console.log(er)
            file = fs.readFileSync(jservNo + 'cfg.json');
            serverConfig = JSON.parse(file)
            serverConfig.posting = 0;
            fs.writeFileSync(servNo + 'cfg.json', JSON.stringify({ serverConfig }))
        }
    }

    
    if (serverConfig.posting == 1) {
        let curr = DateTime.now();
        postTime.set({ year: curr.get('year'), month: curr.get('month'), day: curr.get('day') })
        postTime = ((postTime.diffNow() > 0) ? postTime : postTime.plus({ days: 1 }))
        setTimeout(() => { postIt(servNo, client) }, (test) ? 3000 : postTime.diffNow().get('milliseconds'))
    }
}