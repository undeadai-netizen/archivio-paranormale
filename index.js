const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Chiave API: la legge da Render o usa quella manuale
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
                { role: "system", content: "Sei un archivista paranormale. Scrivi rapporti tecnici e inquietanti. Usa i paragrafi." },
                { role: "user", content: `Analisi caso: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        res.json({ testo: "ATTENZIONE: Collegamento satellitare interrotto.\n\nRilevate tracce ectoplasmiche nel settore. Il sito è isolato." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Operativo"));
