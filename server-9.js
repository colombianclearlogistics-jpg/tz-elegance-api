var express = require('express');
var fetch = require('node-fetch');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var GURL = 'https://script.google.com/macros/s/AKfycbzT55TYFd1SQyiXSFlRZNaAah_9KQTQdXdx7YrdmiSmPF82ZIjiTtJIre63qUWgYmrs/exec';

function pad(n){ return String(n).padStart(2,'0'); }

function fixFecha(val){
  if(!val) return '';
  var d = new Date(val);
  if(isNaN(d.getTime())) return String(val);
  // Use UTC to avoid timezone shift on date
  return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());
}

function fixHora(val){
  if(!val) return '';
  var d = new Date(val);
  if(isNaN(d.getTime())) return String(val);
  // Use UTC hours since Sheets stores time as UTC
  var h = d.getUTCHours(), m = d.getUTCMinutes();
  if(m >= 45){ m = 0; h = h+1; }
  else if(m >= 15){ m = 30; }
  else { m = 0; }
  if(h >= 24) h = 23;
  return pad(h)+':'+pad(m);
}

app.get('/getCitas', function(req, res) {
  fetch(GURL + '?action=getCitas')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data.citas){
        data.citas = data.citas.map(function(c){
          c.fecha = fixFecha(c.fecha);
          c.hora = fixHora(c.hora);
          return c;
        });
      }
      res.json(data);
    })
    .catch(function(e){ res.json({ error: e.message }); });
});

app.post('/cita', function(req, res) {
  fetch(GURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
    redirect: 'follow'
  })
    .then(function(r){ return r.json(); })
    .then(function(d){ res.json(d); })
    .catch(function(e){ res.json({ error: e.message }); });
});

app.get('/', function(req, res){ res.send('TZ OK'); });

var PORT = process.env.PORT || 3000;
app.listen(PORT);
