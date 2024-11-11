const express = require('express');
const axios = require('axios');
const path = require('path'); // Required for serving static files
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get user data
app.get('/getProfilePic', async (req, res) => {
    const { botToken, userID } = req.query;

    if (!botToken || !userID) {
        return res.status(400).send('Bot token and user ID are required');
    }

    try {
        // Fetch user data from Discord API
        const response = await axios.get(`https://discord.com/api/v10/users/${userID}`, {
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        const avatarHash = response.data.avatar;
        if (avatarHash) {
            const profilePicUrl = `https://cdn.discordapp.com/avatars/${userID}/${avatarHash}.png`;
            res.json({ profilePicUrl });
        } else {
            res.status(404).send('No avatar found for this user');
        }
    } catch (error) {
        res.status(500).send('Error fetching data: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
