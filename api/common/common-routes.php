<?php

namespace TokenApi;

/** Default Requests */
Route::add('/', function () {
    return Route::handleDefaultRequest();
}, 'get');

Route::add('', function () {
    return Route::handleDefaultRequest();
}, 'get');

/** Common Requests */
Route::add('/me', function () {
    $res = CommonService::me();
    return Route::sendJson($res);
}, 'get');

Route::add('/info', function () {
    $res = CommonService::info();
    return Route::sendJson($res);
}, 'get');

Route::add('/roster', function () {
    $res = CommonService::roster();
    return Route::sendJson($res);
}, 'get');

Route::add('/tsugi-users', function () {
    $res = CommonCtr::getTsugiUsers();
    return Route::sendJson($res);
}, 'get');

/**
 * Helper Functions
 */

// Nothing yet...