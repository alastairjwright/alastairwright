# bbh-summer-party

## Requirements
- [Librarian-puppet](https://github.com/voxpupuli/librarian-puppet)
- [Node.js](https://nodejs.org/en/)
- [Puppet](https://puppet.com/)
- [Sass](http://sass-lang.com/)
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/)

## Getting Started
```sh
npm install
npm run build
(cd puppet/ && librarian-puppet install)
vagrant plugin install vagrant-hostsupdater vagrant-puppet-install vagrant-vbguest
vagrant up
```

## Build
- `npm run lint` to lint source files
- `npm test` to run tests
- `npm run build` to build source files
- `npm run watch` to watch source files


##Use Mic
- `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --unsafely-treat-insecure-origin-as-secure="http://alastairwright.test" --incognito http://alastairwright.test`