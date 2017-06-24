cd webapp
yarn build
cd build/static/css
rm *.map
cd ../js
rm *.map
cd ../../../../ansible
ansible-playbook -i production analyst.yml --tags=webapp
