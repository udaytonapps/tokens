<?php

namespace TokenApi;

/** Default Requests */
Route::add('/', function () {
    return handleDefaultRequest();
}, 'get');

Route::add('', function () {
    return handleDefaultRequest();
}, 'get');

/** Common Requests */
Route::add('/me', function () {
    $res = CommonCtr::me();
    return Route::sendJson($res);
}, 'get');

Route::add('/info', function() {
    $res = CommonCtr::info();
    return Route::sendJson($res);
}, 'get');

/**
 * Helper Functions
 */

/** Just to be sure '/' and '' requests are handled the exact same way */
function handleDefaultRequest()
{
    $res = array("status" => "Error", "Message" => "Invalid route");
    return Route::sendJson($res);
}
