## Neon's Bot

Verification system for Roblox accounts in a Discord server.

- Docker is required as well as docker compose support
- Make sure ports are open for the API _(default: 6001)_
- Discord & Roblox OAuth credentials required

#### Configuration

<font color="#AA5555">_! vault.example must be renamed to vault !_</font>

`api > .env` - **Required:** Discord Credentials, Roblox Credentials.

`bot > .env` - **Required:** Discord Credentials

`bot > src > utils > config` - **Required:** Developer Info, Verification

`SSL / HTTPS` - Include cert.pem and key.pem in vault for SSL or disable in nginx.conf

---

#### Running the app

Clone the source code

`git clone https://github.com/CalSQ/neon-bot.git`

Build the image

`sudo docker-compose build`

Start the container in detached mode

`sudo docker-compose up -d`

Stop and restart the container

`sudo docker-compose <stop|restart>`

See logs (follow, ctrl + c to escape)

`sudo docker-compose logs <api|bot> -f`
