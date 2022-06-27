<?php
require_once "../config.php";

use Tsugi\Core\LTIX;
use Tsugi\UI\Theme;

$LAUNCH = LTIX::requireData();

/** Ensure the theme is generated to set the dark_mode and theme_base properties */
$OUTPUT->get_theme();

/**
 * Configuration including the session ID so the frontend can interact with api.php
 * Adding more variables is possible, but should be limited as these are not available
 * during development. In local development mode, the session ID will need to be copied
 * over manually to the src/utils/constants.ts DEV_SESSION_ID variable.
 */
?>
<script>
    var appConfig = {
        sessionId: "<?php echo ($_GET["PHPSESSID"]); ?>",
        darkMode: "<?php echo Theme::$dark_mode ?>",
        baseColor: "<?php echo Theme::$theme_base ?>" || "#6B5B95"
    };
</script>
<?php

require './demo/demonstration.php';

/**
 * Index file that references the dynamic React build files
 * The import of the index (rather than specific script/css files) is necessary
 * as the script/css files are generated dynamically and renamed with each build
 * to ensure that the files to not remain unnecessarily cached by the end user's browser.
 */
// require './ui/build/index.html';

