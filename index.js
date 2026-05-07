const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Questo pezzo legge la chiave sia da Render che dal codice
const CHIAVE = process.env.GROQ_API_KEY || "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";
const groq = new Groq({ apiKey: CHIAVE });

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
                { role: "system", content: "Sei un computer militare. Scrivi rapporti paranormali inquietanti e dettagliati. Vai a capo dopo ogni paragrafo." },
                { role: "user", content: `Analisi: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        console.error(e);
        res.json({ testo: "ERRORE DI AUTENTICAZIONE IA.\n\nControlla la chiave GSK nelle impostazioni di Render." });
    }
});

app.listen(process.env.PORT || 3000);
