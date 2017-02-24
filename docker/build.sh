cp ../data-stream/package.json ./
cp ../data-stream/index.js ./
cp ../data-stream/settings.json ./
docker build -t example .
rm package.json
rm index.js
rm settings.json
