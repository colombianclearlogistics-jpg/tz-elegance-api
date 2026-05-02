var express = require('express');
var fetch = require('node-fetch');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var URL = 'https://script.google.com/macros/s/AKfycbzgoEncuiDiynK8XIC53jJcwu6nBB90ZstXufyvDixc6PxCu19vkyuI7g0Ao0B5C_M/exec';

app.get('/getCitas', function(req, res) {
  fetch(URL + '?action=getCitas')
    .then(function(r) { return r.json(); })
    .then(function(d) { res.json(d); })
    .catch(function(e) { res.json({ error: e.message }); });
});

app.post('/cita', function(req, res) {
  fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
    redirect: 'follow'
  })
    .then(function(r) { return r.json(); })
    .then(function(d) { res.json(d); })
    .catch(function(e) { res.json({ error: e.message }); });
});

app.get('/', function(req, res) { res.send('TZ OK'); });

var PORT = process.env.PORT || 3000;
app.listen(PORT);
