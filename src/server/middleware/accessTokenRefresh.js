const spotifyApi = require('../scripts/spotify-api');

async function processUserTokenAccess(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken && req.url.startsWith('/host')) {
        res.redirect('/auth/login');
        return;
    } else if (refreshToken && !accessToken) {
        const authOptions = spotifyApi.getAuthOptions(null, `${req.protocol}://${req.headers.host}`, refreshToken);
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        console.log(data);

        res.cookie('accessToken', data.access_token, { maxAge: 45 * 60 * 1000 });
    }

    next();
}

module.exports = processUserTokenAccess;