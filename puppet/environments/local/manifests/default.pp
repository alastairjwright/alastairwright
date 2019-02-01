Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin'],
}

class { '::php':
}

class { 'apache':
  user => 'vagrant',
  group => 'vagrant',
  mpm_module => 'prefork',
}
apache::vhost { 'alastairwright.test':
  port => '80',
  docroot => '/vagrant/html/',
  directories => [
    {
      path => '/vagrant/html/',
      options => ['Indexes', 'FollowSymLinks'],
      allow_override => ['All'],
    },
  ],
}
include apache::mod::php
include apache::mod::rewrite
