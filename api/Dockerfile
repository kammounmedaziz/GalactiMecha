FROM node:18-slim

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Bundle app source
COPY . .

EXPOSE 8000

CMD ["npm", "start"]
