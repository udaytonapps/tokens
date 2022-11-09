<?php

namespace TokenApi;

/** Holds methods for handling each route. Constructed with the request path (uri) */
class LearnerCtr
{
    /** @var LearnerDAO */
    protected static $DAO;
    /** @var CommonDAO */
    protected static $commonDAO;
    protected static $LTIX;
    protected static $user;
    protected static $contextId;
    protected static $linkId;

    public static function init()
    {
        global $USER, $CONTEXT, $LINK;
        self::$DAO = new LearnerDAO();
        self::$commonDAO = new CommonDAO();
        self::$user = $USER;
        self::$contextId = $CONTEXT->id;
        self::$linkId = $LINK->id;
    }

    /** Returns the instructor's configuration for the current context */
    static function getConfiguration()
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        if (isset($config['configuration_id'])) {
            $config['categories'] = self::$DAO->getConfigCategories($config['configuration_id']);
            // Cast data that is used for calculations, strip what isn't needed
            foreach ($config['categories'] as &$category) {
                $category = array(
                    'category_id' => $category['category_id'],
                    'category_name' => $category['category_name'],
                    'token_cost' => intval($category['token_cost']),
                    'sort_order' => intval($category['sort_order']),
                );
            }
            return array(
                'configuration_id' => $config['configuration_id'],
                'initial_tokens' => intval($config['initial_tokens']),
                'use_by_date' => $config['use_by_date'],
                'categories' => $config['categories'],
            );
        } else {
            return null;
        }
    }

    /** Get list of all requests related to the course/context */
    static function getRequests()
    {
        $rows = self::$DAO->getCourseRequests(self::$contextId, self::$user->id);
        foreach ($rows as &$row) {
            $row['token_cost'] = intval($row['token_cost']);
        }
        return $rows;
    }

    /** Create a new request */
    static function addRequest($data)
    {
        global $CONTEXT, $USER, $CFG;
        // First be sure the tokens aren't expired (in case the learner kept the form open too long)
        $config = self::$DAO->getConfiguration($CONTEXT->id);
        // Get the current server time in the CFG timezone
        $now = new \DateTime('now', new \DateTimeZone($CFG->timezone));
        // If use_by_date was stored properly, it should already have been stored in the $CFG timezone
        $expiration = new \DateTime($config['use_by_date']);

        if ($expiration > $now) {
            if (CommonService::$hasRoster) {
                // If roster, recipient id (for checking award count) is roster['person_sourcedid']
                // Checking roster against email for now - should be ok if email changes, as long as it changes in both places
                $rosterPersonKey = array_search(self::$user->email, array_column(CommonService::$rosterData, 'person_contact_email_primary'));
                if ($rosterPersonKey === false) {
                    $res = 0;
                } else {
                    $sourceId = CommonService::$rosterData[$rosterPersonKey]['person_sourcedid'];
                    $res = self::$DAO->addRequest(self::$contextId, self::$user->id, $sourceId, $config['configuration_id'], $data['category_id'], $data['learner_comment']);
                }
            } else {
                // If no roster, userId is recipientId for Token awards
                $res = self::$DAO->addRequest(self::$contextId, self::$user->id, self::$user->id, $config['configuration_id'], $data['category_id'], $data['learner_comment']);
            }
            if ($res == 0) {
                // Request row wasn't created
                http_response_code(500);
                $res = array("error" => "Request was unable to be created");
            } else {
                // Send email to self confirming request
                $category = self::$DAO->getCategory($data['category_id']);
                $type = $category['category_name'];
                $subject = "Tokens request submitted for " . $CONTEXT->title;
                $personalMsg = "Your request to use Tokens has been submitted.\n\nCourse: " . $CONTEXT->title . "\nRequest Type: " . $type . "\nRequest Description: " . $data['learner_comment'];
                CommonService::sendEmailToActiveUser($subject, $personalMsg);
                // Send email to instructor IF they have that configuration
                $instructorMsg = "A request to use Tokens has been submitted.\n\nCourse: " . $CONTEXT->title . "\nLearner: " . $USER->displayname . "\nRequest Type: " . $type . "\nRequest Description: " . $data['learner_comment'];
                if (CommonService::$hasRoster) {
                    // If there is a roster, check notifications settings for each
                    foreach (CommonService::$rosterData as $rosterPerson) {
                        if ($rosterPerson["roles"] == 'Instructor') {
                            // Check first to see if notifications are turned off.
                            $instructor = CommonService::getUserContactByRosterId($rosterPerson['user_id']);
                            // Must clear out option each time
                            $option = null;
                            if (isset($instructor['user_id'])) {
                                $option = self::$DAO->getInstructorNotificationOption($instructor['user_id'], $config['configuration_id']);
                            }
                            if (!isset($option['notifications_pref']) || $option['notifications_pref'] == true) {
                                CommonService::sendEmailFromActiveUser($rosterPerson['person_name_full'], $rosterPerson['person_contact_email_primary'], $subject, $instructorMsg);
                            }
                        }
                    }
                } else {
                    // If no roster, simply determine notification preference based on the userId on the instructor that created the settings
                    $instructor = self::$commonDAO->getUserContact($config['user_id']);
                    $option = self::$DAO->getInstructorNotificationOption($instructor['user_id'], $config['configuration_id']);
                    // Check first to see if notifications are turned off.
                    if (!isset($option['notifications_pref']) || $option['notifications_pref'] == true) {
                        CommonService::sendEmailFromActiveUser($instructor['displayname'], $instructor['email'], $subject, $instructorMsg);
                    }
                }
            }
        } else {
            http_response_code(500);
            $res = array("error" => "Tokens are expired");
        }
        return $res;
    }

    /** Get current balance */
    static function getTokenAwards()
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        if (isset($config['configuration_id'])) {
            if (CommonService::$hasRoster) {
                // If roster, recipient id (for checking award count) is roster['person_sourcedid']
                // Checking roster against email for now - should be ok if email changes, as long as it changes in both places
                $rosterPersonKey = array_search(self::$user->email, array_column(CommonService::$rosterData, 'person_contact_email_primary'));
                $sourceId = CommonService::$rosterData[$rosterPersonKey]['person_sourcedid'];
                $awards = self::$DAO->getTokenAwards($sourceId, $config['configuration_id']);
                foreach ($awards as &$award) {
                    $award['award_count'] = (int)$award['award_count'];
                }
                return $awards;
            } else {
                // If no roster, userId is recipientId for Token awards
                return  self::$DAO->getTokenAwards(self::$user->id, $config['configuration_id']);
            }
        }
    }
}
LearnerCtr::init();
