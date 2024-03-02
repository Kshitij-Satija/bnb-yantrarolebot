require('dotenv').config();
const {Client, GatewayIntentBits} = require("discord.js");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Read the roles data from the file
const rolesData = JSON.parse(fs.readFileSync("roles.json"));
const users = rolesData["Junior Core"];
client.on("messageCreate", message => {
    if (message.channel.name === "getyantrarole") {
        if (message.author.bot) return; // Ignore bot messages

        const role1 = message.guild.roles.cache.find(r => r.name === "Yantra Team");
        const role2 = message.guild.roles.cache.find(r => r.name === "Junior Core");

        // Split the message by new lines and check if the second line exists
        const messageLines = message.content.split('\n');
        if (messageLines.length < 3) {
            // If there's no second line, inform the user
            message.channel.send("Please ensure your message is formatted correctly.");
            return;
        }

        const userID = messageLines[2].trim(); // Get the second line and trim whitespace

        // Check if the trimmed second line (user ID) is in the roles.json
        if (users.includes(userID)) {
            // If a user ID is found, assign the roles
            message.member.roles.add(role1)
            message.member.roles.add(role2)
                .then(() => message.delete()) // Delete the message after assigning the role
                .catch(console.error); // Log any errors to the console
            
            // Send a confirmation message
            message.channel.send(`Junior Core and Yantra Team role assigned to ${message.member}`)
                .catch(console.error); // Catch and log any errors
        } else {
            // If no valid user ID is found in the message, inform the user
            message.channel.send("Invalid Credentials");
        }
    }
});


// Log in the client to Discord with your token
client.login(process.env.BOT_TOKEN); // Make sure to replace "YOUR_BOT_TOKEN" with your actual bot token
