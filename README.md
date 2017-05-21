# Small experimental repo (with simple app & devops)

## Prerequistes
To be able deploy the app you need to install the following tools:
  - Ansible
  - Terraform

## Deploy
I use Terraform and ScaleWay provider to create server and provision all the software.
You need to add to .zshrc (or similar) file the following:
```
SCALEWAY_ORGANIZATION=access_key (from web UI, yes, it's strange, maybe they will fix it)
SCALEWAY_ACCESS_KEY=token (from web UI)
```
then use
```
./deploy.sh
```
it will run `terraform plan`, ask you for confirmation, then run `terraform apply` and then run `ansible-playbook`, which will install all the software, configure and run it.
You can destroy your server with
```
terraform destroy
```
