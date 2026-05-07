const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Usa la variabile d'ambiente di Render (scelta consigliata)
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
    console.log("Richiesta ricevuta per:", titolo);

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un computer militare degli anni '80. Scrivi rapporti paranormali inquietanti, tecnici e dettagliati. Usa paragrafi e vai a capo spesso." },
                { role: "user", content: `Analisi reperto: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        console.error("ERRORE GROQ:", error.message);
        res.json({ testo: "ATTENZIONE: Collegamento satellitare interrotto. Caricamento file locale...\n\nRilevate tracce ectoplasmiche residue. Il sito è stato isolato. Non procedere senza protezione termica." });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server Operativo"));
