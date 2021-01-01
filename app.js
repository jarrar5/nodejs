const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();

const schema = Joi.object({
    id: Joi.number(),
    title: Joi.string(),
    author: Joi.string(),

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
            var test = rules.validate(books)
            console.log('Error: ' + test.error);
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
    var test = schema.validate(form);
    console.log('Error: ' + test.error);
    var list = [];

    if (form.title != '' && form.author != '') {
        readFileData(pushNew, form);

        res.redirect('/books');
    }
    else {
        console.log('Nothing Written');
        res.redirect('/error');
    }


    function readFileData(pushNew, form) {
        fs.readFile('data/file.json', "UTF8", function (err, data) {
            if (err) { console.log('Error Reading File!') }
            try {
                list = JSON.parse(data);
                var test = rules.validate(list)
                console.log('Error: ' + test.error);
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

})

app.get('/delete/:id', (req, res) => {
    console.log(req.params.id);
    var id = req.params.id;

    readFileData(deleteData, id);

    res.redirect('/books');

    function readFileData(deleteData, id) {
        fs.readFile('data/file.json', "UTF8", function (err, data) {
            if (err) { console.log('Error Reading File!') }
            try {
                list = JSON.parse(data);
                var test = rules.validate(list)
                console.log('Error: ' + test.error);
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

app.get('/edit/:id', (req, res) => {
    console.log('URL: /edit Type: GET');

    console.log(req.params.id);
    var id = req.params.id;

    var book = {};

    readFileData(getData, id);

    function readFileData(getData, id) {
        fs.readFile('data/file.json', "UTF8", function (err, data) {
            if (err) { console.log('Error Reading File!') }
            try {
                list = JSON.parse(data);
                var test = rules.validate(list)
                console.log('Error: ' + test.error);
                getData(list, id, changeView);
            }
            catch (e) {
                console.log(e)
            }
        });
    }

    function getData(list, id, changeView) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                book = { id: list[i].id, title: list[i].title, author: list[i].author };
                break;
            }
        }
        var test = schema.validate(book)
        console.log('Error: ' + test.error);
        changeView(res);
    }

    function changeView(res) {
        res.render('editbook', {
            title: 'Edit Book',
            book: book
        });
    }
})

app.post('/edit/:id', (req, res) => {
    console.log('URL: /edit Type: POST');

    var form = { id: req.params.id, title: req.body.title, author: req.body.author };
    var list = [];

    var test = schema.validate(form)
    console.log('Error: ' + test.error);

    console.log(req.params.id);

    if (form.title != '' && form.author != '') {
        readFileData(editData, form);

        res.redirect('/books');
    }
    else {
        console.log('Nothing Written');
        res.redirect('/error');
    }

    function readFileData(editData, id) {
        fs.readFile('data/file.json', "UTF8", function (err, data) {
            if (err) { console.log('Error Reading File!') }
            try {
                list = JSON.parse(data);
                var test = rules.validate(list)
                console.log('Error: ' + test.error);
                editData(list, id, writeData);
            }
            catch (e) {
                console.log(e)
            }
        });
    }

    function editData(list, id, writeData) {
        // console.log('Index: '+list.indexOf());
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == form.id) {
                list[i].title = form.title;
                list[i].author = form.author;
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