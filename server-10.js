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
  // Extract date parts from string like "Sat May 02 2026 00:00:00 GMT-0500"
  var m = String(val).match(/(\w+)\s+(\d+)\s+(\d{4})/);
  if(m){
    var months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
    var mo = months[m[1]] || months[m[2]];
    if(!mo){ mo = months[m[2]]; }
    // Try "May 02 2026" pattern
    var d = new Date(val);
    if(!isNaN(d.getTime())){
      return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());
    }
  }
  return String(val);
}

function fixHora(val){
  if(!val) return '';
  var s = String(val);
  // Extract time from string like "Sat Dec 30 1899 12:00:00 GMT-0456"
  var m = s.match(/(\d{2}):(\d{2}):\d{2}\s+GMT([+-])(\d{2})(\d{2})/);
  if(m){
    var h = parseInt(m[1]);
    var min = parseInt(m[2]);
    var sign = m[3] === '+' ? 1 : -1;
    var offH = parseInt(m[4]);
    var offM = parseInt(m[5]);
    // Convert to UTC then to Colombia (UTC-5)
    var totalMin = h*60 + min - sign*(offH*60+offM) - 5*60;
    // Normalize
    totalMin = ((totalMin % (24*60)) + 24*60) % (24*60);
    h = Math.floor(totalMin/60);
    min = totalMin % 60;
    // Round to nearest 30
    if(min >= 45){ min=0; h=h+1; }
    else if(min >= 15){ min=30; }
    else{ min=0; }
    if(h >= 24) h = 23;
    return pad(h)+':'+pad(min);
  }
  return s;
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
