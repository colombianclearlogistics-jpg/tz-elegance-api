var express = require('express');
var fetch = require('node-fetch');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var URL = 'https://script.google.com/macros/s/AKfycbx-sU5HKodKEOxN81WdJ6cLQkiyXiv6Ni2DivvTMHG3ni3ZzdwXXZSaoML43L0-ixwF/exec';

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
