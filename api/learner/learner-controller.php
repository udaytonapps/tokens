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
        global $CONTEXT, $USER;
        $res = self::$DAO->addRequest(self::$contextId, self::$user->id, $data['category_id'], $data['learner_comment']);
        // Send email to self confirming request
        $category = self::$DAO->getCategory($data['category_id']);
        $type = $category['category_name'];
        $personalMsg = "Your request to use Tokens has been submitted.\n\nCourse: " . $CONTEXT->title . "\nRequest Type: " . $type . "\nRequest Description: " . $data['learner_comment'];
        CommonService::sendEmailToActiveUser("Tokens request submitted!", $personalMsg);
        // Send email to instructor IF they have that configuration
        $config = self::$DAO->getConfiguration($CONTEXT->id);
        if ($config['notifications_pref'] == 1) {
            // Find list of instructors and send emails to all?
            $instructor = self::$commonDAO->getUserContact($config['user_id']);
            $instructorMsg = "A request to use Tokens has been submitted.\n\nCourse: " . $CONTEXT->title . "\nLearner: " . $USER->displayname . "\nRequest Type: " . $type . "\nRequest Description: " . $data['learner_comment'];
            CommonService::sendEmailFromActiveUser($instructor['displayname'], $instructor['email'], "Tokens request submitted!", $instructorMsg);
        }
        return $res;
    }
}
LearnerCtr::init();
