# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "private_network", ip: "192.168.31.148"
  config.vm.hostname = "alastairwright.test"
  # config.hostsupdater.aliases = []
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    # vb.cpus = 2
  end
  config.puppet_install.puppet_version = "5.5.1"
  config.vm.provision "puppet" do |puppet|
    puppet.environment_path = "puppet/environments"
    puppet.environment = "local"
    puppet.module_path = "puppet/modules"
    puppet.options = "--verbose --debug"
  end
end