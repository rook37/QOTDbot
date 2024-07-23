const { SlashCommandBuilder, ModalBuilder,TextInputBuilder,ActionRowBuilder,TextInputStyle } = require('discord.js');

const { DateTime } = require('luxon');

const { postIt } = require('../../poster')

let test = 1;

const zones = {'gmt':'Etc/GMT',
                'utc':'Etc/GMT',
                'pt':'America/Los_Angeles',
                'pst':'America/Los_Angeles',
                'pdt':'America/Los_Angeles',
                'pacific':'America/Los_Angeles',
                'pacific time':'America/Los_Angeles',
                'mt':'America/Denver',
                'mdt':'America/Denver',
                'mst':'America/Denver',
                'mountain':'America/Denver',
                'mountain time':'America/Denver',
                'central':'America/Chicago',
                'ct':'America/Chicago',
                'cdt':'America/Chicago',
                'cst':'America/Chicago',
                'central time':'America/Chicago',
                'et':'America/New_York',
                'est':'America/New_York',
                'edt':'America/New_York',
                'eastern':'America/New_York',
                'eastern time':'America/New_York',
                'cet':'Europe/Stockholm',
                'cest':'Europe/Stockholm',
                'central european':'Europe/Stockholm',
                'eet':'Africa/Cairo',
                'eest':'Africa/Cairo',
                'aest':'Antarctica/Macquarie',
                'aedt':'Antarctica/Macquarie'
}





module.exports = {
	data: new SlashCommandBuilder()
		.setName('qstart')
		.setDescription('Start the daily question timer'),
        
	
    
    async execute(interaction, parseQ,fs,client,servList) {

        if(!noConfig(fs,interaction)){
            interaction.reply('ERROR: Sorry, please run /setup to configure channels before kicking off the questions!')
            return;
        }
        

        const modal = new ModalBuilder()
			.setCustomId('startqMod')
			.setTitle('What time should questions be posted?');
            
        const timeInput = new TextInputBuilder()
			.setCustomId('timeInput')
			.setLabel("Please enter in a 24hr format (eg 3PM = 1500)")
			.setStyle(TextInputStyle.Short)
            .setValue('0800');
        const tzInput = new TextInputBuilder()
			.setCustomId('tzInput')
			.setLabel("What is your timezone?")
			.setStyle(TextInputStyle.Short)
            .setValue('UTC-5');
        const row1 = new ActionRowBuilder().addComponents(timeInput);
        const row2 = new ActionRowBuilder().addComponents(tzInput);
        modal.addComponents(row1,row2);
        interaction.showModal(modal)
        const filter = (interaction) => interaction.customId === 'startqMod';
        var timeRes = 0;
        var tzRes = 'EST';
            
        await interaction.awaitModalSubmit({ filter, time: 60_000 })
            .then(interaction => {
                timeRes = interaction.fields.getTextInputValue('timeInput');
                tzRes = interaction.fields.getTextInputValue('tzInput');
         
                var postTime = findDifference(timeRes,tzRes);
                console.log(postTime)
                if(!postTime.isValid){
                    interaction.reply(
                        `ERROR: Sorry, I can't understand that entry. \nIf you're getting errors, try ensuring time is in a HHMM or HH:MM format (h = hours, m = minutes) and using a UTC formatted time!`)
                }
                else {
                writeTime(fs,interaction.guildId+'cfg.json',postTime);
                interaction.reply(
                    `Thank you! I'll ask the first question in ${postTime.diffNow().toFormat(`hh'h'mm'm'`)}`);
                
                if(test){postIt(interaction.guildId,client)}else{
                setTimeout ( () => {postIt(interaction.guildId,client)},postTime.diffNow().get('milliseconds'));
                }
            }})  

            .catch(console.error);
        console.log(timeRes+' and tz is stilll '+tzRes)
        
	},

};

function findDifference(timeRes,tzRes){
    const utcpattern = /^[Uu][Tt][Cc][+-]\d+/
    const gmtpattern = /^[Gg][Mm][Tt][+-]\d+/
    tzRes = String(tzRes).toLowerCase();

    //if its already UTC, that's good. If not, we want it in utc or our preset timezones. 
    if(gmtpattern.test(tzRes)){
        tzRes = tzRes.replaceAll('gmt','utc')
    }
    else if(!utcpattern.test(tzRes)){ 
        tzRes = zones[tzRes.toLowerCase()]}    

    timeRes = Number(String(timeRes).replaceAll(':','').replaceAll(' ',''));
    tHour = Math.floor(timeRes / 100)
    tMin = timeRes % 100; 

    let curr = DateTime.now();
    let postTime = DateTime.local(curr.get('year'),curr.get('month'),curr.get('day'),tHour,tMin,{zone:tzRes})
    
    // the above is current day, we want to make sure we have a future time set.
    return ((postTime.diffNow() > 0) ? postTime :  postTime.plus({days:1})) 
}

function noConfig(fs,interaction){
    if(fs.existsSync(interaction.guildId+'cfg.json')){
		var file = fs.readFileSync(interaction.guildId+'cfg.json');
		let serverConfig = JSON.parse(file)
        console.log((serverConfig.admChannel))
        console.log(serverConfig.targChannel)
		return (serverConfig.admChannel && serverConfig.targChannel)
    }
    else{return false}
}


function writeTime(fs,jsonName, postTime){
    try{
        file = fs.readFileSync(jsonName);
        serverConfig = JSON.parse(file)
        serverConfig.postTime = postTime;
        serverConfig.posting = 1
        fs.writeFileSync(
            String(jsonName),
            JSON.stringify(serverConfig))
        
    } catch (er){
        console.log(er)
    }
}