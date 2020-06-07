const fs = require('fs');
class Includes {
    read(file, callback) {
        fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {
                callback(data)
                //  console.log('received data: ' + data);
                console.log('Reading: '+file);
            } else {
                console.log(err);
            }
        })
    }

    write(file, content) {
        fs.writeFile(file, content, function (err) {
            if (err) throw err;
            console.log('Saved: ' + file);
        });
    }

    append(file, content) {
        fs.appendFile(file, content, function (err) {
            if (err) throw err;
            console.log('Updated: ' + file);
        });
    }
}

module.exports = Includes;