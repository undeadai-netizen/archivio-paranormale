const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Gestione Chiave API: Usa quella di Render o quella manuale
const apiKey = process.env.GROQ_API_KEY || "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";
const groq = new Groq({ apiKey: apiKey });

const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Area 51 - Livello 4" }
];

// Rotte
app.get('/titoli', (req, res) => res.json({ sinistra: titoliPubblici }));

app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    console.log("Richiesta ricevuta per:", titolo);

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un computer militare degli anni '80. Scrivi rapporti paranormali inquietanti, tecnici e dettagliati. Vai a capo spesso e usa un linguaggio crudo." },
                { role: "user", content: `Analisi reperto: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        console.error("ERRORE GROQ:", error.message);
        // Piano B: Testo di emergenza se l'IA fallisce
        res.json({ testo: "ATTENZIONE: Collegamento satellitare interrotto.\n\nCaricamento file locale...\n\nRilevate tracce ectoplasmiche residue nel settore. Il sito è stato isolato per contenimento bio-organico. Non procedere senza protezione termica di Livello 5." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Operativo sulla porta ${PORT}`));
