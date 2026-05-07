const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();

// CONFIGURAZIONE CORS AGGIORNATA
app.use(cors({
    origin: '*', // Permette chiamate da qualsiasi origine (anche il tuo file locale)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/titoli', (req, res) => {
    res.json({ sinistra: [
        { titolo: "Il Fantasma di Poveglia" },
        { titolo: "Le Catacombe di Parigi" },
        { titolo: "Il Castello di Edimburgo" },
        { titolo: "Foresta di Aokigahara" },
        { titolo: "Area 51 - Livello 4" }
    ]});
});

app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un archivista. Scrivi rapporti dettagliati." },
                { role: "user", content: `Analisi: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ testo: "ERRORE IA: Controlla la chiave su Render." });
    }
});

app.listen(process.env.PORT || 3000);
