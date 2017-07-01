cd webapp
yarn build
cd build/static/css
rm *.map
cd ../js
rm *.map
cd ../../../../ansible
ansible-playbook -i production all.yml --tags=webapp
