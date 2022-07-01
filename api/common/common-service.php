<?php


namespace TokenApi;

require_once __DIR__ . '/common-dao.php';

use Tsugi\Core\LTIX;
use Tsugi\UI\Theme;
$LAUNCH = LTIX::requireData();
/** Ensure the theme is generated to set the dark_mode and theme_base properties */
$OUTPUT->get_theme();

/** Holds methods for handling each route. Constructed with the request path (uri) */
class CommonService
{
    /** @var CommonDAO */
    protected static $DAO;
    protected static $LTIX;
    protected static $user;
    protected static $contextId;
    protected static $linkId;

    public static function init()
    {
        global $USER, $CONTEXT, $LINK;
        self::$DAO = new CommonDAO();
        self::$user = $USER;
        self::$contextId = $CONTEXT->id;
        self::$linkId = $LINK->id;
    }

    static function me()
    {
        if (is_null(self::$user)) {
            return 'No user';
        } else {
            return array('username' => self::$user->displayname);
        }
    }

    static function info()
    {
        return array(
            'username' => self::$user->displayname,
            'isInstructor' => self::$user->instructor,
            'contextId' => self::$contextId,
            'linkId' => self::$linkId,
            'sessionId' => $_GET["PHPSESSID"],
            'darkMode' => Theme::$dark_mode,
            'baseColor' => Theme::$theme_base ? Theme::$theme_base : "#6B5B95"
        );
    }

    /** Comparator for student last name used for sorting roster */
    static function compareStudentsLastName($a, $b)
    {
        return strcmp($a["person_name_family"], $b["person_name_family"]);
    }
}
CommonService::init();
