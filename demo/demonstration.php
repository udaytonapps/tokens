<style>
    body {
        padding-top: 50px;
        color: red;
        font-weight: bold;
        text-align: center;
    }
</style>
<?php

use TokenApi\CommonService;
use Tsugi\UI\Theme;

$info = CommonService::info();
echo "Application has been generated.";
?>
</br>
<?php
echo 'Logged in as user: ' . $info['username'];
?>
</br>
<?php
echo 'Is instructor: ' . ($info['isInstructor'] ? 'Yes' : 'No');
?>
</br>
<?php
echo 'Context ID: ' . $info['contextId'];
?>
</br>
<?php
echo 'Link ID: ' . $info['linkId'];
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
echo 'Session ID: ' . $info['sessionId'];