# QOTDbot

A simple discord bot that stores questions locally in a .json file, posting one each day to a specified server and channel

Runs with Node.js. To run locally, install the discord.js and dotenv node packages with npm.

**Requires a .env file with the following values:**

BOT_TOKEN=          your discord bot's login token

SERVER_ID=          the ID of the server (or guild) it will be running on

ADMIN_ROLE=         the role ID of the users allowed to add questions to the queue

ADMIN_CHANNEL=      the ID for the channel where questions can be added, the queue status can be posted, and where the bot will update a daily total of remaining questions after posting

TARG_CHANNEL=       the ID for the channel where questions will be posted

SUGGESTION_LINK=    a link to a suggestion box for users to submit their own suggestions for Questions of th day

