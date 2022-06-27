<style>
    body {
        padding-top: 50px;
        color: red;
        font-weight: bold;
        text-align: center;
    }
</style>
<?php

require_once __DIR__ . '/../api/index.php';

use TokenApi\CommonCtr;
use Tsugi\UI\Theme;

$user = CommonCtr::me();
echo "Application has been generated.";
?>
</br>
<?php
echo 'Logged in as user: ' . $user['username'];
?>
</br>
<?php
$mode = Theme::$dark_mode ? 'Dark' : 'Light';
echo 'Mode: ' . $mode;
?>
</br>
<?php
echo 'Theme color: ' . Theme::$theme_base;
?>
</br>
<?php
echo 'Session ID: ' . $_GET["PHPSESSID"];