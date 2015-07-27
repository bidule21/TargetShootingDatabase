/**
 * Created by vl0w on 27/07/15.
 */

process.env.NODE_ENV = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "TSDB_TEST";

/**
 * Executes a test which is being exec
 * @param setup {Function}
 * @param verifications {Function}
 */
function invokeDatabaseTest(setup, verifications) {
    var mongoose = require("mongoose");
    var connect = require("../api/helpers/db.js");

    var connectionObj = {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };

    function throwErr(err) {
        throw new Error(err);
    }

    function onConnect() {
        setup();
        verifications();
        clearDatabase();
    }

    function clearDatabase() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function () {
            });
        }
    }

    connect(connectionObj, throwErr, onConnect);
}

module.exports = invokeDatabaseTest;