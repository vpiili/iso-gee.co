FROM node:14.8.0-alpine
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY package.json ./
COPY index.js ./

RUN npm install --silent

EXPOSE 80
CMD ["node", "index.js"]