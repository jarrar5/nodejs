const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();

const schema = Joi.object({
    id: Joi.number(),
    title: Joi.string(),
    author: Joi.string()
})

const rules = Joi.array().items(schema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
    console.log('Server listening on port 3000. . . . .');
});

app.get('/', (req, res) => {
    console.log('URL: / Type: GET');
    res.render('index', {
        title: 'Home'
    });
})

app.get('/books', function (req, res) {
    console.log('URL: /books Type: GET');
    var books = [];

    fs.readFile('data/file.json', "UTF8", function (err, data) {
        if (err) {
            console.log('Error Reading File!')
        }
        try {
            books = JSON.parse(data);
        }
        catch (e) {
            console.log('Error Alert: ' + e);
        }
        process(books);
    });
    function process(books) {
        res.render('books', {
            title: 'Books',
            books: books
        });
    }
});

app.get('/addbook', (req, res) => {
    console.log('URL: /addbook Type: GET');
    res.render('addbook', {
        title: 'Add Book'
    });
})

app.post('/addbook', (req, res) => {
    console.log('URL: /books Type: POST');
    var form = { title: req.body.title, author: req.body.author };
    var list = [];

    if (form.title != '' && form.author != '') {
        readFileData(pushNew, form);

        res.redirect('/books');
    }
    else {
        console.log('Nothing Written');
        res.redirect('/error');
    }
})

function readFileData(pushNew, form) {
    fs.readFile('data/file.json', "UTF8", function (err, data) {
        if (err) { console.log('Error Reading File!') }
        try {
            list = JSON.parse(data);
        }
        catch (e) {
            list = [];
            console.log(e)
        }
        finally {
            pushNew(list, form);
        }
    });
}

function pushNew(list, form) {
    console.log('Length: ' + list.length);
    var id = generateID(list);
    form.id = id;
    list.push(form);

    fs.writeFile('data/file.json', JSON.stringify(list), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function generateID(list) {
    if (list.length != 0) {
        return list[list.length - 1].id + 1;
    }
    else {
        return 1;
    }
}

app.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
    var id = req.params.id;

    readFileData(deleteData, id);

    res.redirect('/books');

    function readFileData(deleteData, id) {
        fs.readFile('data/file.json', "UTF8", function (err, data) {
            if (err) { console.log('Error Reading File!') }
            try {
                list = JSON.parse(data);
                deleteData(list, id, writeData);
            }
            catch (e) {
                console.log(e)
            }
        });
    }

    function deleteData(list, id, writeData) {
        // console.log('Index: '+list.indexOf());
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
                console.log('Spliced');
            }
        }
        writeData(list);
    }

    function writeData(list) {
        fs.writeFile('data/file.json', JSON.stringify(list), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
})

// app.get('/books', function (req, res) {
//     console.log('URL: /books Type: GET');

//     var books = [];

//     fs.readFile('data/file.json', "UTF8", function (err, data) {
//         if (err) { console.log('Error Reading File!') }
//         books = JSON.parse(data);

//         process(books);
//     });
//     function process(books) {
//         console.log(books);
//         res.render('books', {
//             title: 'Books',
//             books: books
//         });
//     }
// });