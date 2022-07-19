<?php

namespace TokenApi;

/** Instructor Requests */
$resource = '/instructor';

/** Just a simple test call */
Route::add($resource . '/check', restrict(function () {
    $res = array('Made it' => 'through!');
    return Route::sendJson($res);
}), 'get');

/** Return a given configuration for the context */
Route::add($resource . '/settings', restrict(function () {
    $res = InstructorCtr::getConfiguration();
    return Route::sendJson($res);
}), 'get');

/** Add a configuration for the context */
Route::add($resource . '/settings', restrict(function () {
    // Define the expected data
    $requiredData = array('initial_tokens', 'categories', 'notifications_pref', 'use_by_date');
    $optionalData = array();
    // Assemble from JSON to PHP associative array
    $data = Route::assembleRouteData($requiredData, $optionalData);
    if (
        !isset($data) ||
        gettype($data['initial_tokens']) !== 'integer' ||
        !(bool)strtotime($data['use_by_date']) ||
        count($data['categories']) === 0
    ) {
        // Reject if required data is missing
        return Route::sendJson(array('error' => 'Missing parameters'));
    } else {
        // Process the request
        $res = InstructorCtr::addConfiguration($data);
        return Route::sendJson($res);
    }
}), 'post');

// Could be used, but may not be needed
// /** Update a category */
// Route::add($resource . '/categories', restrict(function () {
//     // Define the expected data
//     $requiredData = array('category_id', 'category_name', 'token_cost');
//     $optionalData = array();
//     // Assemble from JSON to PHP associative array
//     $data = Route::assembleRouteData($requiredData, $optionalData);
//     if (!isset($data)) {
//         // Reject if required data is missing
//         return Route::sendJson(array('error' => 'Missing parameters'));
//     } else {
//         // Process the request
//         $res = InstructorCtr::updateCategory($data);
//         return Route::sendJson($res);
//     }
// }), 'put');

/** Update a configuration for the context */
Route::add($resource . '/settings', restrict(function () {
    // Define the expected data
    $requiredData = array('configuration_id', 'initial_tokens', 'categories', 'notifications_pref', 'use_by_date');
    $optionalData = array();
    // Assemble from JSON to PHP associative array
    $data = Route::assembleRouteData($requiredData, $optionalData);
    if (!isset($data)) {
        // Reject if required data is missing
        return Route::sendJson(array('error' => 'Missing parameters'));
    } else {
        $res = InstructorCtr::updateConfiguration($data);
        return Route::sendJson($res);
    }
}), 'put');

/** Get the list of learner-generated requests */
Route::add($resource . '/requests', restrict(function () {
    $res = InstructorCtr::getRequests();
    return Route::sendJson($res);
}), 'get');

/** Update the request (accept or reject) */
Route::add($resource . '/requests', restrict(function () {
    $data = array();
    // Define the expected data
    $requiredData = array('request_id', 'status_name');
    $optionalData = array('instructor_comment');
    // Assemble from JSON to PHP associative array
    $data = Route::assembleRouteData($requiredData, $optionalData);
    if (!isset($data)) {
        // Reject if required data is missing
        return Route::sendJson(array('error' => 'Missing parameters'));
    } else {
        $res = InstructorCtr::updateRequest($data);
        return Route::sendJson($res);
    }
}), 'put');

/** Get the list of learners and balance of tokens used */
Route::add($resource . '/balances', restrict(function () {
    $res = InstructorCtr::getBalances();
    return Route::sendJson($res);
}), 'get');

/**
 * Helper Functions
 */

/** 
 * Restriction middleware that only allows the routing if the user is an instructor.
 * Call this before any route callback that should be restricted to instructor use.
 */
function restrict($next)
{
    global $USER;
    if ($USER->instructor) {
        return $next;
    } else {
        return function () {
            http_response_code(401);
            return Route::sendJson(array('error' => 'Unauthorized'));
        };
    }
};
