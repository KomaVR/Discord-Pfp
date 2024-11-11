const fetch = require('node-fetch');

// Use your provided Pastebin raw link for the bot token
const PASTEBIN_URL = 'https://pastebin.com/raw/6T4qLBPX';

module.exports = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Fetch the bot token from Pastebin
        const tokenResponse = await fetch(PASTEBIN_URL);
        if (!tokenResponse.ok) {
            return res.status(500).json({ error: 'Failed to retrieve bot token' });
        }
        const botToken = await tokenResponse.text();

        // Use the bot token to make the Discord API call
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                'Authorization': `Bot ${botToken.trim()}`,
            },
        });

        if (!response.ok) {
            // Log the response text to understand what went wrong
            const errorText = await response.text();
            console.error('Discord API Error:', errorText);
            return res.status(response.status).json({ error: 'User not found or API error', details: errorText });
        }

        const userData = await response.json();
        const avatarHash = userData.avatar;

        if (avatarHash) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=1024`;
            return res.json({ avatarUrl });
        } else {
            return res.status(404).json({ error: 'No avatar found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Error fetching user data', details: error.message });
    }
};
