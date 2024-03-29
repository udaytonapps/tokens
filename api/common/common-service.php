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
    public static $hasRoster;
    public static $rosterData;
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
        self::$hasRoster = \Tsugi\Core\LTIX::populateRoster(false);
        if (self::$hasRoster) {
            self::$rosterData = $GLOBALS['ROSTER']->data;
        }
        // For mocking the instructor emails from the roster...
        // self::$hasRoster = true;
        // self::$rosterData = array(
        //     array("person_sourcedid" => "123", "user_id" => "292832126", "person_name_given" => "Jane", "person_name_family" => "Instructor", "person_contact_email_primary" => "inst@ischool.edu", "person_name_full" => "Jane Instructor", "role"=> "Instructor", "roles" => "Instructor", "groups" => array(array("title" => "Group1"))),
        //     array("person_sourcedid" => "234", "user_id" => "121212341", "person_name_given" => "Bev", "person_name_family" => "Person", "person_contact_email_primary" => "bev@ischool.edu", "person_name_full" => "Bev Person", "role"=> "Learner", "roles" => "Learner", "groups" => array(array("title" => "Group1"))),
        //     array("person_sourcedid" => "345", "user_id" => "998928898", "person_name_given" => "Sue", "person_name_family" => "Student", "person_contact_email_primary" => "student@ischool.edu", "person_name_full" => "Sue Student", "role"=> "Learner", "roles" => "Learner", "groups" => array(array("title" => "Group1"))),
        //     array("person_sourcedid" => "456", "user_id" => "000000000", "person_name_given" => "Une", "person_name_family" => "Cooperative", "person_contact_email_primary" => "never@loggedin.edu", "person_name_full" => "Une Cooperative", "role"=> "Learner", "roles" => "Learner", "groups" => array(array("title" => "Group1"))),
        //     array("person_sourcedid" => "567", "user_id" => "121212331", "person_name_given" => "Ed", "person_name_family" => "Student", "person_contact_email_primary" => "ed@ischool.edu", "person_name_full" => "Ed Student", "role"=> "Learner", "roles" => "Learner", "groups" => array(array("title" => "Group1"))),
        // );
    }

    static function me()
    {
        if (is_null(self::$user)) {
            return 'No user';
        } else {
            return array('username' => self::$user->displayname);
        }
    }

    static function roster()
    {
        if (isset(self::$hasRoster) && isset(self::$rosterData)) {
            return self::$rosterData;
        } else {
            return array();
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

    static function getUserContactByRosterId($userKey)
    {
        return self::$DAO->getUserContactByRosterId($userKey);
    }

    /** Comparator for student last name used for sorting roster */
    static function compareStudentsLastName($a, $b)
    {
        return strcmp($a["person_name_family"], $b["person_name_family"]);
    }

    static function setDateStringToConfigTZEndOfDay($dateString)
    {
        global $CFG;
        $date = new \DateTime($dateString, new \DateTimeZone($CFG->timezone));
        return date_time_set($date, 23, 59, 59)->format('Y-m-d H:i:s');
    }

    /** Often a notification or confirmation of the user's own activity */
    static function sendEmailToActiveUser($subject, $body)
    {
        global $USER;
        $msg = "Hi " . $USER->displayname . ",\n\n" . $body . "\n\nHave a great day!";
        // use wordwrap() if lines are longer than 120 characters
        $msg = wordwrap($msg, 120);

        $headers = "From: " . self::getReplyToName() . " <" . self::getReplyToEmail() . ">\n";
        $headers = $headers . "Reply-to: " . self::getReplyToName() . " <" . self::getReplyToEmail() . ">\n";

        mail($USER->email, $subject, $msg, $headers);
    }

    /** Often notification or communication from an instructor to a student, or vice versa */
    static function sendEmailFromActiveUser($recipientName, $recipientEmail, $subject, $body)
    {
        global $USER;
        if (isset($recipientName) && strlen($recipientName) > 0) {
            $salutation = "Hi " . $recipientName . ",\n\n";
        } else {
            $salutation = "Hi,\n\n";
        }
        $msg = $salutation . $body . "\n\nHave a great day!";

        // use wordwrap() if lines are longer than 120 characters
        $msg = wordwrap($msg, 120);

        $headers = "From: " . self::getReplyToName() . " <" . self::getReplyToEmail() . ">\n";
        $headers = $headers . "Reply-to: " . $USER->displayname . " <" . $USER->email . ">\n";

        mail($recipientEmail, $subject, $msg, $headers);
    }

    private static function getReplyToName()
    {
        global $CFG;
        $replyToName = 'No Reply';
        if (isset($CFG->owneremailsender)) {
            $replyToName = $CFG->owneremailsender;
        }
        return $replyToName;
    }

    private static function getReplyToEmail()
    {
        global $CFG;
        $replyToEmail = 'noreply@example.com';
        if (isset($CFG->ownernoreplyemail)) {
            $replyToEmail = $CFG->ownernoreplyemail;
        }
        return $replyToEmail;
    }
}
CommonService::init();
