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

        $newConfigId = self::$DAO->addConfiguration(self::$user->id, self::$contextId, self::$linkId, $data['initial_tokens'], $date, $data['notifications_pref'], isset($data['general_note']) ? $data['general_note'] : null);
        // assign categories to that configuration
        $categories = $data['categories'];
        foreach ($categories as $category) {
            self::$DAO->addCategory($newConfigId, $category);
        }
        self::$DAO->addNotificationOption(self::$user->id, $newConfigId, $data['notifications_pref']);
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
            $option = true;
            $existingOptions = self::$DAO->getNotificationOption(self::$user->id, $config['configuration_id']);
            if (isset($existingOptions['option_id'])) {
                $option = (bool)$existingOptions['notifications_pref'];
            }
            return array(
                'configuration_id' => $config['configuration_id'],
                'initial_tokens' => intval($config['initial_tokens']),
                'use_by_date' => $config['use_by_date'],
                'notifications_pref' => $option,
                'categories' => $config['categories'],
                'general_note' => $config['general_note']
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
        self::$DAO->updateConfiguration(self::$user->id, self::$contextId, $data['initial_tokens'], $date, $data['notifications_pref'], isset($data['general_note']) ? $data['general_note'] : null);

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

    /** Get list of all requests related to the course/context */
    static function getRequests()
    {
        $requests = self::$DAO->getCourseRequests(self::$contextId);

        // Check for roster
        if (CommonService::$hasRoster) {
            // If there is a roster, learner list will be populated from it (such as when launched from LMS)
            foreach (CommonService::$rosterData as $learner) {
                foreach ($requests as $key => $request) {
                    if ($learner["role"] == 'Learner' && isset($request['user_key']) && $learner['user_id'] == $request['user_key']) {
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
        $config = self::$DAO->getConfiguration(self::$contextId);
        $calculatedUsage = self::$DAO->getKnownUsage(self::$contextId, $config['configuration_id']);
        $recipientAwardCounts = self::$DAO->getAwardCounts($config['configuration_id']);

        // For assembling results
        $res = array();

        // Check for roster
        if (CommonService::$hasRoster) {
            // If there is a roster, learner list will be populated from it (such as when launched from LMS)
            foreach (CommonService::$rosterData as $learner) {
                if ($learner["role"] == 'Learner') {
                    $learnerName = $learner["person_name_family"] . ', ' . $learner["person_name_given"];
                    // If roster exists, recipient_id is roster person_sourcedid
                    $awardInfoKey = array_search($learner['person_sourcedid'], array_column($recipientAwardCounts, 'recipient_id'));
                    // Check for balance info for the roster user
                    $balanceInfoKey = array_search($learner['user_id'], array_column($calculatedUsage, 'user_key'));
                    $recipientKey = $learner['person_sourcedid'];

                    $learnerBalanceData = self::assembleBalanceInfo($recipientKey, $learnerName, $recipientAwardCounts, $awardInfoKey, $calculatedUsage, $balanceInfoKey);
                    array_push($res, $learnerBalanceData);
                }
            }
        } else {
            // No roster, just use the Tsugi db info, don't need to compare to the roster
            foreach ($calculatedUsage as $usageInfo) {
                $learnerName = $usageInfo['learner_name'];
                // If no roster, recipient_id is user_id since Tsugi users will be known
                $awardInfoKey = array_search($usageInfo['user_id'], array_column($recipientAwardCounts, 'recipient_id'));
                // Check for balance info for the roster user
                $balanceInfoKey = array_search($usageInfo['user_id'], array_column($calculatedUsage, 'user_id'));
                $recipientKey = $usageInfo['user_id'];

                $learnerBalanceData = self::assembleBalanceInfo($recipientKey, $learnerName, $recipientAwardCounts, $awardInfoKey, $calculatedUsage, $balanceInfoKey);
                array_push($res, $learnerBalanceData);
            }
        }
        return $res;
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

    static function addAwardTokens($data)
    {
        global $CONTEXT;
        $config = self::$DAO->getConfiguration(self::$contextId);
        if (isset($config['configuration_id'])) {

            if (CommonService::$hasRoster) {
                // If roster, recipient id (for checking award count) is roster['person_sourcedid']
                // Checking roster against email for now - should be ok if email changes, as long as it changes in both places
                // $res = self::$DAO->addRequest(self::$contextId, self::$user->id, $sourceId, $config['configuration_id'], $data['category_id'], $data['learner_comment']);
                foreach ($data['recipientIds'] as $rosterKey) {
                    self::$DAO->addAwardToken($config['configuration_id'], $rosterKey, $data['count'], $data['comment']);
                    // Get user contact info
                    $rosterPersonKey = array_search($rosterKey, array_column(CommonService::$rosterData, 'person_sourcedid'));
                    $rosterName = CommonService::$rosterData[$rosterPersonKey]['person_name_full'];
                    $rosterEmail = CommonService::$rosterData[$rosterPersonKey]['person_contact_email_primary'];
                    // Prepare email
                    $tokenText = $data['count'] > 1 ? "{$data['count']} Tokens" : 'a Token';
                    $subject = "You've been granted {$tokenText} for " . $CONTEXT->title;
                    $reasonString = isset($data['comment']) ? "Instructor Comment: {$data['comment']}\n\n" : "";
                    $instructorMsg = "You have been granted {$tokenText}.\n\n{$reasonString}Course: {$CONTEXT->title}";
                    CommonService::sendEmailFromActiveUser($rosterName, $rosterEmail, $subject, $instructorMsg);
                }
            } else {
                // If no roster, userId is recipientId for Token awards
                foreach ($data['recipientIds'] as $userId) {
                    self::$DAO->addAwardToken($config['configuration_id'], $userId, $data['count'], $data['comment']);

                    // Get user contact info
                    $userInfo = self::$commonDAO->getUserContact($userId);
                    // Prepare email
                    $tokenText = $data['count'] > 1 ? "{$data['count']} Tokens" : 'a Token';
                    $subject = "You've been granted {$tokenText} for " . $CONTEXT->title;
                    $reasonString = isset($data['comment']) ? "Instructor Comment: {$data['comment']}\n\n" : "";
                    $instructorMsg = "You have been granted {$tokenText}.\n\n{$reasonString}Course: {$CONTEXT->title}";
                    CommonService::sendEmailFromActiveUser($userInfo['displayname'], $userInfo['email'], $subject, $instructorMsg);
                }
            }
        }
    }

    private static function assembleBalanceInfo($recipientKey, $learnerName, $awardInfo, $awardInfoKey, $balanceInfo, $balanceInfoKey)
    {
        $user_id = null;
        // In either case, assign or default the values
        if ($awardInfoKey === false || !isset($awardInfo[$awardInfoKey]['tokens_awarded'])) {
            // No matching award info retrieved for this roster user
            $awardCount = 0;
        } else {
            // Otherwise, assign count based on results
            $awardCount = $awardInfo[$awardInfoKey]['tokens_awarded'];
        }
        if ($balanceInfoKey === false || !isset($balanceInfo[$balanceInfoKey]['tokens_used'])) {
            // No matching award info retrieved for this roster user
            $tokens_used = 0;
        } else {
            // Otherwise, assign count based on results
            $tokens_used = $balanceInfo[$balanceInfoKey]['tokens_used'];
            if (isset($balanceInfo[$balanceInfoKey]['user_id'])) {
                $user_id = $balanceInfo[$balanceInfoKey]['user_id'];
            }
        }
        return array(
            'recipient_key' => $recipientKey,
            'learner_name' => $learnerName,
            'tokens_awarded' => (int)$awardCount,
            'tokens_used' => (int)$tokens_used,
            'user_id' => $user_id
        );
    }
}
InstructorCtr::init();
