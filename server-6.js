var express = require('express');
var fetch = require('node-fetch');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var GURL = 'https://script.google.com/macros/s/AKfycbwPIS6IcbMCmOHeuiVGhwAgejBf1u_5fahL-3VZdpLImWqpszYOQFjd1vpyXmBy-0WY/exec';

app.get('/getCitas', function(req, res) {
  fetch(GURL + '?action=getCitas')
    .then(function(r) { return r.json(); })
    .then(function(d) { res.json(d); })
    .catch(function(e) { res.json({ error: e.message }); });
});

app.post('/cita', function(req, res) {
  fetch(GURL, {
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
