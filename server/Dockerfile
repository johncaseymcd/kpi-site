FROM node:gallium
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm test
CMD ["npm", "run", "start"]