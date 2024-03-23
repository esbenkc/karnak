<?php

require_once('../_helpers/strip.php');

// first, get a variable name based on the user input
$variable = strlen($_GET['variable']) > 0 ? $_GET['variable'] : 'empty';
$empty = 'No variable given';

eval('echo $' . $variable . ';');