<?php

namespace TokenApi;

/** Holds methods for handling each route. Constructed with the request path (uri) */
class InstructorCtr
{
    /** @var InstructorDAO */
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
        self::$DAO = new InstructorDAO();
        self::$commonDAO = new CommonDAO();
        self::$user = $USER;
        self::$contextId = $CONTEXT->id;
        self::$linkId = $LINK->id;
    }

    /** Creates a new configuration (along with associated categories) */
    static function addConfiguration($data)
    {
        // Change the date to midnight of that day in the CFG timezone
        $date = CommonService::setDateStringToConfigTZEndOfDay(($data['use_by_date']));

        $newConfigId = self::$DAO->addConfiguration(self::$user->id, self::$contextId, self::$linkId, $data['initial_tokens'], $date, $data['notifications_pref']);
        // assign categories to that configuration
        $categories = $data['categories'];
        foreach ($categories as $category) {
            self::$DAO->addCategory($newConfigId, $category);
        }
        $notificationsPref = $data['notifications_pref'];
        self::$DAO->addNotificationOption(self::$user->id, $newConfigId, $notificationsPref);
        return $newConfigId;
    }

    /** Returns the instructor's configuration for the current context */
    static function getConfiguration()
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        if (isset($config['configuration_id'])) {
            $config['categories'] = self::$DAO->getConfigCategories($config['configuration_id']);
            // Cast data that is used for calculations, strip what isn't needed
            foreach ($config['categories'] as &$category) {
                $categoryUsage = self::$DAO->categoryUsage($category['category_id']);
                $category = array(
                    'category_id' => $category['category_id'],
                    'category_name' => $category['category_name'],
                    'token_cost' => intval($category['token_cost']),
                    'sort_order' => intval($category['sort_order']),
                    'is_used' => count($categoryUsage) > 0,
                );
            }
            $option = self::$DAO->getNotificationOption(self::$user->id, $config['configuration_id']);
            return array(
                'configuration_id' => $config['configuration_id'],
                'initial_tokens' => intval($config['initial_tokens']),
                'use_by_date' => $config['use_by_date'],
                'notifications_pref' => $option['notifications_pref'] ? true : false,
                'categories' => $config['categories'],
            );
        } else {
            return null;
        }
    }

    static function updateCategory($data)
    {
        self::$DAO->updateCategory($data['category_id'], $data['category_name'], $data['token_cost'], $data['sort_order']);
    }

    /** Update the configuration and its associated categories */
    static function updateConfiguration($data)
    {
        // Change the date to midnight of that day in the CFG timezone
        $date = CommonService::setDateStringToConfigTZEndOfDay(($data['use_by_date']));

        // Update the configuration
        self::$DAO->updateConfiguration(self::$user->id, self::$contextId, $data['initial_tokens'], $date, $data['notifications_pref']);

        // Update the create/update/delete the categories
        foreach ($data['categories'] as $category) {
            // Only act if an action is specified as some may not be changing
            if (isset($category['dbAction'])) {
                $dbAction = $category['dbAction'];
                // Can remove the dbAction before sending to DAO
                unset($category['dbAction']);
                if ($dbAction === 'ADD') {
                    self::$DAO->addCategory($data['configuration_id'], $category);
                } else if ($dbAction === 'UPDATE') {
                    self::$DAO->updateCategory($category['category_id'], $category['category_name'], $category['token_cost'], $category['sort_order']);
                } else if ($dbAction === 'DELETE') {
                    // Only delete a category if no learners have used it
                    $categoryUsage = self::$DAO->categoryUsage($category['category_id']);
                    if (count($categoryUsage) === 0) {
                        self::$DAO->deleteCategory($category['category_id']);
                    }
                }
            }
        }
        $notificationsPref = $data['notifications_pref'];
        $existingOptions = self::$DAO->getNotificationOption(self::$user->id, $data['configuration_id']);
        if (isset($existingOptions['option_id'])) {
            self::$DAO->updateNotificationOption(self::$user->id, $data['configuration_id'], $notificationsPref);
        } else {
            self::$DAO->addNotificationOption(self::$user->id, $data['configuration_id'], $notificationsPref);
        }
    }

    static function addNotificationOption($data)
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        self::$DAO->addNotificationOption(self::$user->id, $config['configuration_id'], $data['notifications_pref']);
    }

    static function updateNotificationOption($data)
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        self::$DAO->updateNotificationOption(self::$user->id, $config['configuration_id'], $data['notifications_pref']);
    }

    static function getNotificationOption()
    {
        $config = self::$DAO->getConfiguration(self::$contextId);
        self::$DAO->getNotificationOption(self::$user->id, $config['configuration_id']);
    }

    /** Get list of all requests related to the course/context */
    static function getRequests()
    {
        $requests = self::$DAO->getCourseRequests(self::$contextId);

        // Check for roster
        if (CommonService::$hasRoster) {
            // If there is a roster, learner list will be populated from it (such as when launched from LMS)
            foreach (CommonService::$rosterData as $learner) {
                foreach ($requests as $key => $request) {
                    if ($learner["role"] == 'Learner' && $learner['user_id'] == $request['user_id']) {
                        $requests[$key]['learner_name'] = $learner["person_name_family"] . ', ' . $learner["person_name_given"];
                    }
                }
            }
        }
        return $requests;
    }

    /** Calculate the balances of all learners, whether or not there is a roster */
    static function getBalances()
    {
        $calculatedUsage = self::$DAO->getKnownUsage(self::$contextId);

        // Check for roster
        if (CommonService::$hasRoster) {
            // If there is a roster, learner list will be populated from it (such as when launched from LMS)
            foreach (CommonService::$rosterData as $learner) {
                foreach ($calculatedUsage as $key => $usage) {
                    if ($learner["role"] == 'Learner' && $learner['user_id'] == $usage['user_id']) {
                        $calculatedUsage[$key]['learner_name'] = $learner["person_name_family"] . ', ' . $learner["person_name_given"];
                    }
                }
                if ($learner["role"] == 'Learner') {
                    $exists = array_search($learner['user_id'], array_column($calculatedUsage, 'user_id'));
                    if ($exists === false) {
                        // If learner ID is not in the list...
                        // Push the learner ID and name and tokens_used = 0 to the array
                        $calculatedRecord = array(
                            'user_id' => $learner['user_id'],
                            'learner_name' => $learner["person_name_family"] . ', ' . $learner["person_name_given"],
                            'tokens_used' => 0
                        );
                        array_push($calculatedUsage, $calculatedRecord);
                    }
                }
            }
        }
        return $calculatedUsage;
    }

    static function updateRequest($data)
    {
        global $CONTEXT;
        // Comment is optional (it is not currently included when request is ACCEPTED)
        $comment = isset($data['instructor_comment']) ? $data['instructor_comment'] : null;
        $res = self::$DAO->updateRequest(self::$contextId, $data['request_id'], $data['status_name'], self::$user->id, $comment);
        if ($res->rowCount() !== 0) {
            // Row was updated, send confirmation email to learner
            $updatedRequest = self::$DAO->getRequest($data['request_id']);
            $learner = self::$commonDAO->getUserContact($updatedRequest['user_id']);
            $action = strtolower($updatedRequest['status_name']);
            $subject = "Tokens request $action for " . $CONTEXT->title;
            $category = self::$DAO->getCategory($updatedRequest['category_id']);
            $reasonString = isset($updatedRequest['instructor_comment']) ? "Instructor Comment: {$updatedRequest['instructor_comment']}\n\n" : "";
            $instructorMsg = "Your Tokens request has been {$action}.\n\n{$reasonString}Course: {$CONTEXT->title}\nRequest Type: {$category['category_name']}\nRequest Description: {$updatedRequest['learner_comment']}";
            CommonService::sendEmailFromActiveUser($learner['displayname'], $learner['email'], $subject, $instructorMsg);
        } else {
            // Row was not updated
            http_response_code(500);
            $res = array("error" => "Unable to update request");
        }
        return $res;
    }
}
InstructorCtr::init();
