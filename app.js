const express = require('express');
const path = require('path');

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
  console.log('books.html!');
  res.render('books',{
    title: 'Books'
  });
});