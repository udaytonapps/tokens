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

    // public function addRequest($contextId, $requestId, $newStatus, $instructorId, $instructorComment)
    // {
    //     $query = "UPDATE {$this->p}tokens_request r
    //     JOIN  {$this->p}tokens_configuration c
    //         ON c.configuration_id = r.configuration_id
    //     SET r.status_name = :newStatus, r.instructor_id = :instructorId, r.instructor_comment = :instructorComment
    //     WHERE r.request_id = :requestId AND c.context_id = :contextId";
    //     $arr = array(':contextId' => $contextId, ':requestId' => $requestId, ':newStatus' => $newStatus, ':instructorId' => $instructorId, ':instructorComment' => $instructorComment);
    //     return $this->PDOX->queryDie($query, $arr);
    // }
}
