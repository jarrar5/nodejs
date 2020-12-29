const express = require('express');
const path = require('path');
const fs = require('fs');

const app =express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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