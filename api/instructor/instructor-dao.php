<?php

namespace TokenApi;

/** DAO class methods/properties are not static as prefix string cannot be easily embedded */

/** Holds methods for retrieving data from the db */
class InstructorDAO
{
    protected $p;
    protected $PDOX;

    public function __construct()
    {
        global $CFG, $PDOX;

        $this->p = $CFG->dbprefix;
        $this->PDOX = $PDOX;
    }

    public function addConfiguration($userId, $contextId, $linkId, $initialTokens, $useByDate, $notificationsPref)
    {
        $query = "INSERT INTO {$this->p}tokens_configuration (user_id, context_id, link_id, initial_tokens, use_by_date, notifications_pref)
        VALUES (:userId, :contextId, :linkId, :initialTokens, :useByDate, :notificationsPref);";
        $arr = array(':userId' => $userId, ':contextId' => $contextId, ':linkId' => $linkId, ':initialTokens' => $initialTokens, ':useByDate' => $useByDate, ':notificationsPref' => (int)$notificationsPref);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function updateConfiguration($userId, $contextId, $initialTokens, $useByDate, $notificationsPref)
    {
        $query = "UPDATE {$this->p}tokens_configuration
        SET user_id = :userId, initial_tokens = :initialTokens, use_by_date = :useByDate, notifications_pref = :notificationsPref
        WHERE context_id = :contextId";
        $arr = array('userId' => $userId, ':contextId' => $contextId, ':initialTokens' => $initialTokens, ':useByDate' => $useByDate, ':notificationsPref' => (int)$notificationsPref);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function getConfiguration($contextId)
    {
        $query = "SELECT * FROM {$this->p}tokens_configuration
        WHERE context_id = :contextId;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function addNotificationOption($userId, $configurationId, $notificationsPref)
    {
        $query = "INSERT INTO {$this->p}tokens_instructor_option (user_id, configuration_id, notifications_pref)
        VALUES (:userId, :configurationId, :notificationsPref);";
        $arr = array(':userId' => $userId, ':configurationId' => $configurationId, ':notificationsPref' => (int)$notificationsPref);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function updateNotificationOption($userId, $configurationId, $notificationsPref)
    {
        $query = "UPDATE {$this->p}tokens_instructor_option
        SET notifications_pref = :notificationsPref
        WHERE user_id = :userId AND configuration_id = :configurationId";
        $arr = array('userId' => $userId, ':configurationId' => $configurationId, ':notificationsPref' => (int)$notificationsPref);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function getNotificationOption($userId, $configurationId)
    {
        $query = "SELECT * FROM {$this->p}tokens_instructor_option
        WHERE user_id = :userId AND configuration_id = :configurationId";
        $arr = array('userId' => $userId, ':configurationId' => $configurationId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function addCategory($configId, $category)
    {
        $query = "INSERT INTO {$this->p}tokens_category (configuration_id, category_name, token_cost, sort_order)
        VALUES (:configId, :categoryName, :tokenCost, :sortOrder);";
        $arr = array(':configId' => $configId, ':categoryName' => $category['category_name'], ':tokenCost' => $category['token_cost'], ':sortOrder' => $category['sort_order']);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function getCategory($categoryId)
    {
        $query = "SELECT * FROM {$this->p}tokens_category
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function updateCategory($categoryId, $newCategoryName, $newTokenCost, $newSortOrder)
    {
        $query = "UPDATE {$this->p}tokens_category
        SET category_name = :newCategoryName, token_cost = :newTokenCost, sort_order = :newSortOrder
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId, ':newCategoryName' => $newCategoryName, ':newTokenCost' => $newTokenCost, ':newSortOrder' => $newSortOrder);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function deleteCategory($categoryId)
    {
        $query = "DELETE FROM {$this->p}tokens_category
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function categoryUsage($categoryId)
    {
        $query = "SELECT * FROM {$this->p}tokens_request
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    public function getConfigCategories($configId)
    {
        $query = "SELECT * FROM {$this->p}tokens_category
        WHERE configuration_id = :configId ORDER BY sort_order ASC;";
        $arr = array(':configId' => $configId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    /** Retrieves the data from the request table, along with the associated category name and learner name */
    public function getCourseRequests($contextId)
    {
        $query = "SELECT r.*, cat.category_name, cat.token_cost, u.user_key, u.user_id, u.displayname as learner_name FROM {$this->p}tokens_request r
        INNER JOIN {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        INNER JOIN {$this->p}tokens_category cat
            ON cat.category_id = r.category_id
        INNER JOIN {$this->p}lti_user u
            ON u.user_id = r.user_id
        WHERE c.context_id = :contextId;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    public function getKnownUsage($contextId, $configurationId)
    {
        $query = "SELECT
            u.user_id,
            u.user_key,
            u.email,
            u.displayname as learner_name,
            SUM(cat.token_cost) as tokens_used,
            (SELECT SUM(award_count) FROM {$this->p}tokens_award WHERE u.email = recipient_id AND configuration_id = :configurationId) as tokens_awarded
        FROM {$this->p}tokens_request r
        INNER JOIN {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        INNER JOIN {$this->p}tokens_category cat
            ON cat.category_id = r.category_id
        INNER JOIN {$this->p}lti_user u
            ON u.user_id = r.user_id
        WHERE c.context_id = :contextId AND r.status_name != 'REJECTED'
        GROUP BY u.user_id;";
        $arr = array(':contextId' => $contextId, ':configurationId' => $configurationId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    public function getAwardCountByEmail($configurationId, $email)
    {
        $query = "SELECT SUM(award_count) as total FROM {$this->p}tokens_award WHERE recipient_id = :email AND configuration_id = :configurationId;";
        $arr = array(':email' => $email, ':configurationId' => $configurationId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function updateRequest($contextId, $requestId, $newStatus, $instructorId, $instructorComment)
    {
        $commentAssignment = isset($instructorComment) ? "r.instructor_comment = :instructorComment," : "";
        $query = "UPDATE {$this->p}tokens_request r
        JOIN  {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        SET r.status_name = :newStatus, r.instructor_id = :instructorId, {$commentAssignment} status_updated_at = CURRENT_TIMESTAMP
        WHERE r.request_id = :requestId AND c.context_id = :contextId";
        $arr = array(':contextId' => $contextId, ':requestId' => $requestId, ':newStatus' => $newStatus, ':instructorId' => $instructorId);
        if (isset($instructorComment)) {
            $arr[':instructorComment'] = $instructorComment;
        }
        return $this->PDOX->queryDie($query, $arr);
    }

    public function getRequest($requestId)
    {
        $query = "SELECT * FROM {$this->p}tokens_request
        WHERE request_id = :requestId";
        $arr = array(':requestId' => $requestId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function addAwardToken($configId, $userId, $count, $comment)
    {
        $query = "INSERT INTO {$this->p}tokens_award (configuration_id, recipient_id, award_count, comment)
        VALUES (:configId, :userId, :awardCount, :comment);";
        $arr = array(':configId' => $configId, ':userId' => $userId, ':awardCount' => $count, ':comment' => $comment);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }
}
