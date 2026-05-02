const express = require(´´express´´);
const fetch = require(´´node-fetch´´);
const cors = require(´´cors´´);

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL = ´´https://script.google.com/macros/s/AKfycbx-sU5HKodKEOxN81WdJ6cLQkiyXiv6Ni2DivvTMHG3ni3ZzdwXXZSaoML43L0-ixwF/exec´´;

app.get(´´/getCitas´´, async (req, res) => {
try {
const r = await fetch(SCRIPT_URL + ´´?action=getCitas´´);
const data = await r.json();
res.json(data);
} catch (e) {
res.json({ error: e.message });
}
});

app.post(´´/cita´´, async (req, res) => {
try {
const r = await fetch(SCRIPT_URL, {
method: ´´POST´´,
headers: { ´´Content-Type´´: ´´application/json´´ },
body: JSON.stringify(req.body),
redirect: ´´follow´´
});
const data = await r.json();
res.json(data);
} catch (e) {
res.json({ error: e.message });
}
});

app.get(´´/´´, (req, res) => res.send(´´TZ Elegance API OK´´));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(´´Servidor en puerto ´´ + PORT));
