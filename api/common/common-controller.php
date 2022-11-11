<?php

namespace TokenApi;

/** Holds methods for handling each route. Constructed with the request path (uri) */
class CommonCtr
{
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
    }

    static function getTsugiUsers()
    {
        return self::$DAO->getContextUsers(self::$contextId);
    }
}
CommonCtr::init();
