FROM node:lts-buster

# Clone bot from GitHub
RUN git clone https://github.com/MaskyOfficialTech/MASKY_MD_V2.git /root/masky-md-v2-bot

# Set working directory
WORKDIR /root/masky-md-v2-bot

# Install dependencies
RUN npm install && npm install -g pm2

# Expose port
EXPOSE 9090

# Start the bot
CMD ["npm", "start"]
