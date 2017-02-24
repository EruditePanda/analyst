FROM node:7.6.0

COPY package.json /

RUN npm install

COPY index.js /
COPY settings.json /

CMD ["node index.js"]
