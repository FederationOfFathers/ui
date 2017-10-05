<?php
header( 'Content-Type: text/plain' );
chdir( dirname( __FILE__ ) . "/../");
system( 'git pull' );
