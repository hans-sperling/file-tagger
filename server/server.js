var mysql = require('mysql');
var fs    = require('fs');
var path  = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'file-tagger',
    password : '123456',
    database : 'file-tagger'
});

function run() {
    //connection.connect();
    //uninstall();
    //install();
    //getAllFileLocations();
    //getTagsByFileLocation('img/1.jpg');
    //getFileLocationsByTagNames(['essen','Stuhl','Design','Tier']);
    //connection.end();



    //walkParallel('client/data/', function(err, results) {
    getFileLocationsAsync('client/data', function(err, locations) {
        var amount, i, location;
        if (err) {
            throw err;
        }
        else {
            amount = locations.length;

            for (i = 0; i < amount; i++) {
                location = locations[i];

                dosth(location);
            }

            function dosth(location) {
                console.log(location);
            }
        }
    });
}

// -------------------------------------------------------------------------------------------------- Get file locations

/**
 * @link http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 * @param dir
 * @param callback
 */
function getFileLocationsAsync(dir, callback) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) { return callback(err); }

        var pending = list.length;

        if (!pending)  { return callback(null, results); }

        list.forEach(function(file) {
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    getFileLocationsAsync(file, function(err, res) {
                        results = results.concat(res);

                        if (!--pending)  {
                            callback(null, results);
                        }
                    });
                }
                else {
                    results.push(file);
                    if (!--pending) {
                        callback(null, results);
                    }
                }
            });
        });
    });
}


function getFileLocationsSync(dir, callback) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) { return callback(err); }

        var i = 0;

        (function next() {
            var file = list[i++];

            if (!file) { return callback(null, results); }

            file = dir + '/' + file;

            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    getFileLocationsSync(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                }
                else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
}

// --------------------------------------------------------------------------------------------------------------- Query

function getTagsByFileLocation(location) {
    connection.query('SELECT tags.alias FROM `files` JOIN files_tags ON files_tags.files_id = files.id JOIN tags ON tags.id = files_tags.tags_id AND files.location = "' + location + '"', function(err, rows, fields) {
        if (!err) {
            console.log('Result of tags from file \'' + location + '\'');
            console.log(rows);
            return rows;
        }
        else {
            console.log('Error while getting tags from database.', err);
            return false;
        }
    });
}


function getAllFileLocations() {
    connection.query('SELECT files.location FROM `files`', function(err, rows, fields) {
        if (!err) {
            console.log('Result of all files locations');
            console.log(rows);
            return rows;
        }
        else {
            console.log('Error while getting all file locations from database.', err);
            return false;
        }
    });
}


function getFileLocationsByTagNames(tagList) {
    var loweredList = [], i;
    for (i = 0; i < tagList.length; i++) {
        loweredList.push(tagList[i].toLowerCase().replace(' ', ''));
    }


    connection.query('SELECT COUNT(files.location) as amount, files.location FROM `files` JOIN files_tags ON files_tags.files_id = files.id JOIN tags ON tags.id = files_tags.tags_id AND tags.name IN ("' + loweredList.join('","') + '") GROUP BY files.location ORDER BY amount DESC', function(err, rows, fields) {
        if (!err) {
            console.log('Result of file locations by tags \'' + loweredList.join(',') + '\'');
            console.log(rows);
            return rows;
        }
        else {
            console.log('Error while getting file locations from database.', err);
            return false;
        }
    });
}

// ------------------------------------------------------------------------------------------------------------- Install

function install() {
    createTable_Files();
    addRow_Files('img/1.jpg');
    addRow_Files('img/2.jpg');
    addRow_Files('img/3.jpg');

    createTable_Tags();
    addRow_Tags('Stuhl');   // 1
    addRow_Tags('Design');  // 2
    addRow_Tags('Heizung'); // 3
    addRow_Tags('sitzen');  // 4
    addRow_Tags('essen');   // 5
    addRow_Tags('fish');    // 6
    addRow_Tags('chips');   // 7
    addRow_Tags('Tier');    // 8
    addRow_Tags('Party');   // 9
    addRow_Tags('Kelle');   // 10

    createTable_Files_Tags();
    addRow_Files_Tags(1,1);  // Stuhl
    addRow_Files_Tags(1,2);  // Design
    addRow_Files_Tags(1,3);  // Heizung
    addRow_Files_Tags(1,4);  // sitzen
    addRow_Files_Tags(2,5);  // essen
    addRow_Files_Tags(2,6);  // sish
    addRow_Files_Tags(2,7);  // chips
    addRow_Files_Tags(2,8);  // Tier
    addRow_Files_Tags(2,9);  // Party
    addRow_Files_Tags(3,2);  // Design
    addRow_Files_Tags(3,5);  // essen
    addRow_Files_Tags(3,8);  // Tier
    addRow_Files_Tags(3,10); // Kelle
}

// --------------------------------------------------------------------------------------------------------- Add row

function addRow_Files(location) {
    connection.query('INSERT INTO `files` (`location`) VALUES (\'' + location + '\')', function(err, rows, fields) {
        if (!err) {
            console.log('Location added to <files> table.');
            return true;
        }
        else {
            console.log('Error while adding a file in <files> table.', err);
            return false;
        }
    });
}


function addRow_Tags(name) {
    connection.query('INSERT INTO `tags` (`name`, `alias`) VALUES (\'' + name.toLowerCase().replace(' ', '') + '\', \'' + name + '\')', function(err, rows, fields) {
        if (!err) {
            console.log('Name added to <tags> table.');
            return true;
        }
        else {
            console.log('Error while adding a name in <tags> table.', err);

        }
    });
}


function addRow_Files_Tags(fileId, tagId) {
    connection.query('INSERT INTO `files_tags` (`files_id`, `tags_id`) VALUES (' + fileId + ',' + tagId + ')', function(err, rows, fields) {
        if (!err) {
            console.log('Ids added to <files_tags> table.');
            return true;
        }
        else {
            console.log('Error while adding ids in <files_tags> table.', err);
            return false;
        }
    });
}

// --------------------------------------------------------------------------------------------------- Create tables

function createTable_Files() {
   connection.query('CREATE TABLE `file-tagger`.`files` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `location` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        function(err, rows, fields) {
            if (!err) {
                console.log('Table <files> created.');
                return true;
            }
            else {
                console.log('Error while creating <files> table.', err);
                return false;
            }
        }
    );
}


function createTable_Tags() {
    connection.query('CREATE TABLE `file-tagger`.`tags` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `name` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, `alias` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        function(err, rows, fields) {
            if (!err) {
                console.log('Table <tags> created.');
                return true;
            }
            else {
                console.log('Error while creating <tags> table.', err);
                return false;
            }
        }
    );
}


function createTable_Files_Tags() {
   connection.query('CREATE TABLE `file-tagger`.`files_tags` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `files_id` INT UNSIGNED NOT NULL , `tags_id` INT UNSIGNED NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        function(err, rows, fields) {
            if (!err) {
                console.log('Table <files> created.');
                return true;
            }
            else {
                console.log('Error while creating <files> table.', err);
                return false;
            }
        }
    );
}

// ----------------------------------------------------------------------------------------------------------- Uninstall

function uninstall() {
    deleteTable_Files();
    deleteTable_Tags();
    deleteTable_Files_Tags();
}


function deleteTable_Files() {
    connection.query('DROP TABLE files', function(err, rows, fields) {
        if (!err) {
            console.log('Table <files> has been deleted.');
        }
        else {
            console.log('Error while deleting <files> table.', err);
        }
    });
}


function deleteTable_Tags() {
    connection.query('DROP TABLE tags', function(err, rows, fields) {
        if (!err) {
            console.log('Table <tags> has been deleted.');
        }
        else {
            console.log('Error while deleting <tags> table.', err);
        }
    });
}


function deleteTable_Files_Tags() {
    connection.query('DROP TABLE files_tags', function(err, rows, fields) {
        if (!err) {
            console.log('Table <files_tags> has been deleted.');
        }
        else {
            console.log('Error while deleting <files_tags> table.', err);
        }
    });
}

// ----------------------------------------------------------------------------------------------------------------- Run

run();