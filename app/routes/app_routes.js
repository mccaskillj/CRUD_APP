let data = {
    '1234567890': {Name: 'Test1', PhoneNumber: '(123) 456-7890'},
    '0987654321': {Name: 'Test2', PhoneNumber: '(098) 765-4321'}
};

let additions = 0;
let deletions = 0;

let path = require('path');

module.exports = function (app, db) {
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../WebPage/webpage.html'));
    });

    app.get('/test', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../tests/test_webpage.html'));
    });

    app.get('/statistics', function (req, res) {
        let entries = [];
        for (let key in data){
            entries.push({ID: key, Name: data[key]['Name']});
        }
        res.send({
            "Additions": additions,
            "Deletions": deletions,
            "Time": process.uptime() / 60,
            "Records": entries
        })
    });

    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        if (!(id in data)) {
            res.send({'Error': 'ID not found'});
        }
        else {
            delete data[id];
            deletions = deletions + 1;
            console.log(data);
            res.send({'id': id});
        }
    });

    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        if (!(id in data)) {
            res.send({'Error': 'ID not found'});
        }
        else {
            res.send(data[id]);
        }
    });

    app.post('/notes', (req, res) => {
        let id = Math.floor(1000000000 + Math.random() * 9000000000);
        while (id in data) {
            id = Math.floor(1000000000 + Math.random() * 9000000000);
        }
        data[id] = req.body;
        additions = additions + 1;
        res.send({'id': id});
        console.log(data);
    });
};

