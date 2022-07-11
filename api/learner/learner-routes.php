<?php

namespace TokenApi;

/** Learner Requests */
$resource = '/learner';

/** Just a simple test call */
Route::add($resource . '/check', function () {
    $res = array('Made it' => 'through!');
    return Route::sendJson($res);
}, 'get');

/** Return a given configuration for the context */
Route::add($resource . '/settings', function () {
    $res = LearnerCtr::getConfiguration();
    return Route::sendJson($res);
}, 'get');

/** Get the list of learner-generated requests */
Route::add($resource . '/requests', function () {
    $res = LearnerCtr::getRequests();
    return Route::sendJson($res);
}, 'get');

/** Submit a request */
Route::add($resource . '/requests', function () {
    $data = array();
    // Define the expected data
    $requiredData = array('category_id', 'learner_comment');
    $optionalData = array();
    // Assemble from JSON to PHP associative array
    $data = Route::assembleRouteData($requiredData, $optionalData);
    if (!isset($data)) {
        // Reject if required data is missing
        return Route::sendJson(array('error' => 'Missing parameters'));
    } else {
        $res = LearnerCtr::addRequest($data);
        return Route::sendJson($res);
    }
}, 'post');
