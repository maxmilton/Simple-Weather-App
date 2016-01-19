var express = require('express');
var app = express();

app.use(express.static('app'));
app.use(compression());

app.get('/', function (req, res) {
  // res.send('Hello World!');
  res.redirect('app/index.html');
});

app.listen(3000, 'localhost', function () {
  console.log('Example app listening on port 3000!');
  console.log("... port %d in %s mode", app.address().port, app.settings.env);
});
