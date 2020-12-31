const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app =express();


const schema = Joi.object({
    id: Joi.number(),
  title: Joi.string(),
  author: Joi.string()
})

const rules = Joi.array().items(schema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function(){
    console.log('Server listening on port 3000. . . . .');
});

app.get('/', (req, res) => {
  res.render('index',{
    title: 'Home'
  });
})

app.get('/books', function (req, res) {
    var books = [];
    // = [
    //     {title:'ABC', author:'abc'},
    //     {title:'DEF', author:'def'},
    //     {title:'GHI', author:'ghi'}
    // ];

    fs.readFile('data/file.json', "UTF8", function (err, data) {
      if (err) { console.log('Error Reading File!') }
      books = JSON.parse(data);
      //console.log(data);
      //console.log(books);
    //   try {
    //     list = JSON.parse(data);
    //     var test = rules.validate(list)
    //     console.log(test);
    //     console.log("Done")

        process(books);
    //   }
    //   catch (e) { console.log('JSON not valid') }
    });
    function process(books) {
        console.log(books);
    res.render('books',{
        title: 'Books',
        books:books
    });
    }
});

app.get('/addbook', (req, res) => {
  res.render('addbook',{
    title: 'Add Book'
  });
})

app.get('/books', function (req, res) {
    var books = [];
    // = [
    //     {title:'ABC', author:'abc'},
    //     {title:'DEF', author:'def'},
    //     {title:'GHI', author:'ghi'}
    // ];

    fs.readFile('data/file.json', "UTF8", function (err, data) {
      if (err) { console.log('Error Reading File!') }
      books = JSON.parse(data);
      //console.log(data);
      //console.log(books);
    //   try {
    //     list = JSON.parse(data);
    //     var test = rules.validate(list)
    //     console.log(test);
    //     console.log("Done")

        process(books);
    //   }
    //   catch (e) { console.log('JSON not valid') }
    });
    function process(books) {
        console.log(books);
        res.render('books',{
        title: 'Books',
        books:books
    });
    }
});

app.post('/addbook', (req, res) => {
    var form = {title:req.body.title, author:req.body.author};
    // console.log(form.title+' '+form.author);
  var list = [];

  if (form.title != '' && form.author != '') {

    fs.readFile('data/file.json', "UTF8", function (err, data) {
      if (err) { console.log('Error Reading File!') }
      try {
        list = JSON.parse(data);
        process(list);
      }
      catch (e) { console.log('JSON not valid') }
    });

    function process(list) {
        console.log(list.length);
        var id = generateID(list);
        form.id = id;
      list.push(form);

      fs.writeFile('data/file.json', JSON.stringify(list), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      res.redirect('/')
    }
  }
  else {
    console.log('Nothing Written');
    res.redirect('/error');
  }

    //   console.log("Aao g!");
//   var form = req.body;
//   console.log(req.body.title);
//   return;



})

function generateID(list){
    return list[list.length].id+1;
}