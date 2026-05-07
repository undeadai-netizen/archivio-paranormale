const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Incolla qui la tua chiave gsk_... se non la usi nelle variabili di Render
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
                { role: "system", content: "Sei un archivista paranormale. Scrivi rapporti tecnici e inquietanti con molti dettagli. Usa paragrafi." },
                { role: "user", content: `Rapporto su: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        // Se Groq fallisce, il sito non si rompe ma mostra questo:
        res.json({ testo: "ATTENZIONE: Connessione satellitare instabile.\n\nAnalisi preliminare: Rilevate fluttuazioni energetiche nel settore. Il sito è isolato. Non procedere senza autorizzazione." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sistema OmbreSync Attivo"));
