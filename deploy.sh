function create_and_provision {
  terraform apply

  cat >../ansible/terraform_inventory.tmp <<EOL
[webservers]
analyst ansible_ssh_host=$(terraform output ip) ansible_ssh_port=22 ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa

[webservers:vars]
ansible_python_interpreter=/usr/bin/python3
EOL

  cd ../ansible
  ansible-playbook -i terraform_inventory.tmp analyst.yml
  rm terraform_inventory.tmp
}

cd terraform
terraform plan
read -p "Apply terraform changes (Y/n)? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  create_and_provision
fi
