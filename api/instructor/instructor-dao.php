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
        $arr = array(':userId' => $userId, ':contextId' => $contextId, ':linkId' => $linkId, ':initialTokens' => $initialTokens, ':useByDate' => $useByDate, ':notificationsPref' => $notificationsPref);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function updateConfiguration($userId, $contextId, $initialTokens, $useByDate, $notificationsPref)
    {
        $query = "UPDATE {$this->p}tokens_configuration
        SET user_id = :userId, initial_tokens = :initialTokens, use_by_date = :useByDate, notifications_pref = :notificationsPref
        WHERE context_id = :contextId";
        $arr = array('userId' => $userId, ':contextId' => $contextId, ':initialTokens' => $initialTokens, ':useByDate' => $useByDate, ':notificationsPref' => $notificationsPref === false ? 0 : $notificationsPref);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function getConfiguration($contextId)
    {
        $query = "SELECT * FROM {$this->p}tokens_configuration
        WHERE context_id = :contextId;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function addCategory($configId, $category)
    {
        $query = "INSERT INTO {$this->p}tokens_category (configuration_id, category_name, token_cost)
        VALUES (:configId, :categoryName, :tokenCost);";
        $arr = array(':configId' => $configId, ':categoryName' => $category['category_name'], ':tokenCost' => $category['token_cost']);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function updateCategory($categoryId, $newCategoryName, $newTokenCost)
    {
        $query = "UPDATE {$this->p}tokens_category
        SET category_name = :newCategoryName, token_cost = :newTokenCost
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId, ':newCategoryName' => $newCategoryName, ':newTokenCost' => $newTokenCost);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function deleteCategory($categoryId)
    {
        $query = "DELETE FROM {$this->p}tokens_category
        WHERE category_id = :categoryId";
        $arr = array(':categoryId' => $categoryId);
        return $this->PDOX->queryDie($query, $arr);
    }

    public function getConfigCategories($configId)
    {
        $query = "SELECT * FROM {$this->p}tokens_category
        WHERE configuration_id = :configId;";
        $arr = array(':configId' => $configId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    /** Retrveves the data from the request table, along with the associated category name and learner name */
    public function getCourseRequests($contextId)
    {
        $query = "SELECT r.*, cat.category_name, u.displayname as learner_name FROM {$this->p}tokens_request r
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

    public function getKnownUsage($contextId)
    {
        $query = "SELECT u.user_id, u.displayname as learner_name, SUM(cat.token_cost) as tokens_used FROM {$this->p}tokens_request r
        INNER JOIN {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        INNER JOIN {$this->p}tokens_category cat
            ON cat.category_id = r.category_id
        INNER JOIN {$this->p}lti_user u
            ON u.user_id = r.user_id
        WHERE c.context_id = :contextId
        GROUP BY u.user_id;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    public function updateRequest($contextId, $requestId, $newStatus, $instructorId, $instructorComment)
    {
        $query = "UPDATE {$this->p}tokens_request r
        JOIN  {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        SET r.status_name = :newStatus, r.instructor_id = :instructorId, r.instructor_comment = :instructorComment
        WHERE r.request_id = :requestId AND c.context_id = :contextId";
        $arr = array(':contextId' => $contextId, ':requestId' => $requestId, ':newStatus' => $newStatus, ':instructorId' => $instructorId, ':instructorComment' => $instructorComment);
        return $this->PDOX->queryDie($query, $arr);
    }
}
