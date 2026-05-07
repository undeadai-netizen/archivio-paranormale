const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Se Groq fallisce o la chiave non è impostata, useremo un piano B nel codice
const apiKey = process.env.GROQ_API_KEY || "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";
const groq = new Groq({ apiKey: apiKey });

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
            messages: [
                { role: "system", content: "Sei un archivista paranormale degli anni 80. Scrivi rapporti tecnici e spaventosi." },
                { role: "user", content: `Analisi reperto: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        // PIANO B: Se Groq non va, il server risponde comunque con questo!
        res.json({ testo: "ATTENZIONE: Collegamento satellitare Groq interrotto.\n\nAnalisi preliminare del sensore: Rilevate fluttuazioni ectoplasmiche di Classe 4. Il sito è stato isolato per contenimento bio-organico." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sistema Live"));
