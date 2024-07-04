const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ActionRowBuilder, ComponentType, createMessageComponentCollector, BaseInteraction } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configuration options'),

  async execute(interaction, parseQ, fs) {

    let serverConfig = {};
    let defAdm = '';
    let defTarg = '';
    let defRole = '';
    let file;
    let jsonName = interaction.guildId + 'cfg.json';
    if (fs.existsSync(jsonName)) {
      file = fs.readFileSync(jsonName);
      serverConfig = JSON.parse(file)
      console.log(serverConfig)
      defAdm = serverConfig.admChannel
      defTarg = serverConfig.targChannel
      if (serverConfig.rolePing) { defRole = serverConfig.rolePing }

    }

    const admSelect = new ChannelSelectMenuBuilder()
      .setCustomId('admChannel')
      .setChannelTypes(0)
    const targSelect = new ChannelSelectMenuBuilder().setCustomId('targChannel')//.setPlaceholder(defTarg)
    var roleSelect = new RoleSelectMenuBuilder().setCustomId('roleSelect').setMinValues(0)

    if (defAdm != '') { admSelect.addDefaultChannels(defAdm) }
    if (defTarg != '') { targSelect.addDefaultChannels(defTarg) }
    if (defRole != '') { roleSelect.addDefaultRoles(defRole) }

    const confirm = new ButtonBuilder()
      .setCustomId('confirmSetup')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancelSetup')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const clear = new ButtonBuilder()
      .setCustomId('roleClear')
      .setLabel('Clear Role')
      .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder().addComponents(admSelect)
    const row2 = new ActionRowBuilder().addComponents(targSelect)
    var row3 = new ActionRowBuilder().addComponents(roleSelect)
    const row4 = new ActionRowBuilder().addComponents(confirm, cancel, clear)

    await interaction.reply({
      content:
        '**\nSet your channels!** \n- The first option will be set as the admin channel, where you can load questions. \n- The second option will set the channel where the questions will be posted!\n- The third option sets a role to be tagged when questions are asked. **Leave it blank for no role tag.**',
      components: [row1, row2, row3, row4]
    })

    const reply = await interaction.fetchReply()

    const collector = reply.createMessageComponentCollector({
      time: 120_000
    })

    var admResponse = ''
    var targResponse = ''
    var roleResponse = '';

    collector.on('collect', interactionSubmit => {
      console.log(interactionSubmit.customId)
      if (interactionSubmit.customId === 'confirmSetup') {

        try {
          admResponse = collector.collected.find(obj => obj.customId === 'admChannel')
          targResponse = collector.collected.find(obj => obj.customId === 'targChannel')
          roleResponse = collector.collected.find(obj => obj.customId === 'roleSelect')


          admResponse = (admResponse) ? admResponse.channels.firstKey() : defAdm
          targResponse = (targResponse) ? targResponse.channels.firstKey() : defTarg
          roleResponse = (roleResponse) ? roleResponse.channels.firstKey() : defRole

          let roleBool = (roleResponse) ? 1 : 0;


          writeFile(fs, admResponse, targResponse, roleResponse, interactionSubmit)
          let content = `Channels set! I'll load questions in <#${admResponse}> and ask them in <#${targResponse}>!`

          if (roleBool) { content = content + ` <@&${roleResponse}> will be pinged.` }
          interaction.editReply({
            content:
              content, components: []
          })
        }
        catch (error) {
          console.log(error)
          interaction.editReply({ content: 'Error setting channels. Please make sure both channels are set!', components: [] })
        }

      } else if (interactionSubmit.customId === 'roleClear') {
        roleSelect = new RoleSelectMenuBuilder().setCustomId('roleSelect').setMinValues(0)
        row3 = new ActionRowBuilder().addComponents(roleSelect)
        interaction.editReply({ components: [row1, row2, row3, row4] })
        interactionSubmit.deferUpdate()
      } else {
        interactionSubmit.deferUpdate()
      }


    })

    function writeFile(fs, admResponse, targResponse, roleResponse, interaction) {
      const jsonName = interaction.guildId + 'cfg.json'
      if (fs.existsSync(jsonName)) {
      }
      const serverConfig = {
        server: interaction.guildId,
        admChannel: admResponse,
        targChannel: targResponse,
        rolePing: roleResponse
      }
      fs.writeFileSync(
        String(interaction.guildId + 'cfg.json'),
        JSON.stringify(serverConfig)
      )
    }
  }
}
