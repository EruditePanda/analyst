cd webapp
yarn build
cd ..
cp -R webapp/build/. 4news.github.io
cd 4news.github.io/static
cd css
rm *.map
cd ../js
rm *.map
cd ../..
git config user.name machine
git config user.email machine.noreply.github.com
git add *
git commit -m "commit from machine user"
git push origin master
