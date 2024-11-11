const fetch = require('node-fetch');

// Discord Bot token (you need to create a bot and get this token from the Discord Developer Portal)
const BOT_TOKEN = 'MTMwNTQwMTU1NDQ4ODEzNTY5MQ.G3ijq7.qwRNdLI6el4H4xCm5K8Ztx-nINhQj53CeVw_88';

module.exports = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                'Authorization': `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            return res.status(404).json({ error: 'User not found' });
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
        return res.status(500).json({ error: 'Error fetching user data' });
    }
};
