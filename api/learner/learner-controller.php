<?php

namespace TokenApi;

/** Holds methods for handling each route. Constructed with the request path (uri) */
class LearnerCtr
{
    /** @var LearnerDAO */
    protected static $DAO;
    protected static $LTIX;
    protected static $user;
    protected static $contextId;
    protected static $linkId;

    public static function init()
    {
        global $USER, $CONTEXT, $LINK;
        self::$DAO = new LearnerDAO();
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
}
LearnerCtr::init();
