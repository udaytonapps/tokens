<?php

namespace TokenApi;

/** DAO class methods/properties are not static as prefix string cannot be easily embedded */

/** Holds methods for retrieving data from the db */
class LearnerDAO
{
    protected $p;
    protected $PDOX;

    public function __construct()
    {
        global $CFG, $PDOX;

        $this->p = $CFG->dbprefix;
        $this->PDOX = $PDOX;
    }

    public function getConfiguration($contextId)
    {
        $query = "SELECT * FROM {$this->p}tokens_configuration
        WHERE context_id = :contextId;";
        $arr = array(':contextId' => $contextId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function getConfigCategories($configId)
    {
        $query = "SELECT * FROM {$this->p}tokens_category
        WHERE configuration_id = :configId ORDER BY sort_order ASC;";
        $arr = array(':configId' => $configId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    public function getCategory($categoryId)
    {
        $query = "SELECT * FROM {$this->p}tokens_category
        WHERE category_id = :categoryId;";
        $arr = array(':categoryId' => $categoryId);
        return $this->PDOX->rowDie($query, $arr);
    }

    public function getInstructorNotificationOption($instructorId, $configurationId)
    {
        $query = "SELECT * FROM {$this->p}tokens_instructor_option
        WHERE user_id = :userId AND configuration_id = :configurationId";
        $arr = array('userId' => $instructorId, ':configurationId' => $configurationId);
        return $this->PDOX->rowDie($query, $arr);
    }

    /** Retrieves the data from the request table, along with the associated category name and learner name */
    public function getCourseRequests($contextId, $userId)
    {
        $query = "SELECT r.*, cat.category_name, cat.token_cost, u.displayname as learner_name FROM {$this->p}tokens_request r
        INNER JOIN {$this->p}tokens_configuration c
            ON c.configuration_id = r.configuration_id
        INNER JOIN {$this->p}tokens_category cat
            ON cat.category_id = r.category_id
        INNER JOIN {$this->p}lti_user u
            ON u.user_id = r.user_id
        WHERE c.context_id = :contextId AND r.user_id = :userId;";
        $arr = array(':contextId' => $contextId, ':userId' => $userId);
        return $this->PDOX->allRowsDie($query, $arr);
    }

    /** Attempts to add a new request, first checking that the request type isn't more expensive than the sum of tokens already used */
    public function addRequest($contextId, $learnerId, $recipient_id, $configId, $categoryId, $learnerComment)
    {
        /**
         * SELECT 1 -> Selects from dual (in memory table as a placeholder to allow the WHERE condition below)
         * SELECT 2 -> Retrieves the count of awards received
         * SELECT 3 -> Determine the amount of initial tokens for the configuration
         * SELECT 4 -> Determine the amount of tokens already in use (request exists that isn't REJECTED)
         * SELECT 5 -> Determine the token cost of the existing request
         * WHERE condition hinges on initial_tokens - (used tokens) >= token_cost
         * If that condition is not met, the insert doesn't happen, and id 0 is returned
         */
        $query = "INSERT INTO {$this->p}tokens_request (user_id, configuration_id, category_id, learner_comment, status_name)
        SELECT
            :learnerId,
            :configurationId,
            :categoryId,
            :learnerComment,
            'SUBMITTED'
        FROM dual
        WHERE
            (SELECT initial_tokens from {$this->p}tokens_configuration WHERE context_id = :contextId)
            +
            (SELECT SUM(award_count) FROM {$this->p}tokens_award WHERE recipient_id = :recipient_id AND configuration_id = :configurationId)
            -
            (SELECT COALESCE(SUM(c.token_cost), 0) FROM {$this->p}tokens_category c
                INNER JOIN {$this->p}tokens_request r
                    ON c.category_id = r.category_id
                INNER JOIN {$this->p}tokens_configuration con
                    ON c.configuration_id = con.configuration_id
                WHERE r.user_id = :learnerId AND con.context_id = :contextId AND r.status_name <> 'REJECTED')
            >=
            (SELECT token_cost from {$this->p}tokens_category WHERE category_id = :categoryId LIMIT 1);";
        $arr = array(':learnerId' => $learnerId, ':recipient_id' => $recipient_id, ':contextId' => $contextId, ':categoryId' => $categoryId, ':learnerComment' => $learnerComment, ':configurationId' => $configId);
        $this->PDOX->queryDie($query, $arr);
        return $this->PDOX->lastInsertId();
    }

    public function getTokenAwards($userId, $configurationId)
    {
        $query = "SELECT * FROM {$this->p}tokens_award
        WHERE recipient_id = :userId AND configuration_id = :configurationId";
        $arr = array(':userId' => $userId, ':configurationId' => $configurationId);
        return $this->PDOX->allRowsDie($query, $arr);
    }
}
