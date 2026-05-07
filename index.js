const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Inserisci qui la tua chiave Groq
const groq = new Groq({ apiKey: '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' });

const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Area 51 - Livello 4" }
];

app.get('/titoli', (req, res) => res.json({ sinistra: titoliPubblici }));

app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Scrivi un rapporto militare segreto e inquietante sul caso: ${titolo}. Sii molto dettagliato e usa un linguaggio tecnico.` }],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        res.json({ testo: "ERRORE CRITICO: Impossibile contattare l'IA. Riprovare." });
    }
});

app.listen(process.env.PORT || 3000);
