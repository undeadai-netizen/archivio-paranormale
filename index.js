const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const app = express();

// Configura il CORS per accettare chiamate dal tuo futuro sito Netlify
app.use(cors()); 
app.use(express.json());

// CONFIGURAZIONE GROQ (Usa le variabili d'ambiente)
const groq = new Groq({
    // Non scriviamo la chiave qui, la inseriremo nel pannello di Render
    apiKey: process.env.GROQ_API_KEY, 
});

const databaseOmbre = {
    sinistra: [
        { titolo: "Il Fantasma di Poveglia" },
        { titolo: "Le Catacombe di Parigi" },
        { titolo: "Il Castello di Edimburgo" },
        { titolo: "La Torre di Londra" },
        { titolo: "Il Mistero di Stonehenge" },
        { titolo: "L'Anomalia del Monte Nero" }
    ],
    destra: [
        { titolo: "Area 51 - Livello 4" },
        { titolo: "Il Triangolo delle Bermuda" },
        { titolo: "Foresta di Aokigahara" },
        { titolo: "Incidente del Passo Dyatlov" },
        { titolo: "Le Linee di Nazca" },
        { titolo: "Rovine di Mohenjo-daro" }
    ],
    premium: [
        { titolo: "PROGETTO ABYSS" },
        { titolo: "SOGGETTO 001" },
        { titolo: "IL CODICE OMEGA" },
        { titolo: "REPERTO X-32" },
        { titolo: "ULTIMATUM TERRA" },
        { titolo: "ORIGINE OSCURA" }
    ]
};

app.get('/titoli', (req, res) => res.json({ sinistra: databaseOmbre.sinistra, destra: databaseOmbre.destra }));
app.get('/titoli-premium', (req, res) => res.json(databaseOmbre.premium));

app.post('/genera-storia', async (req, res) => {
    const { titolo, isPremium } = req.body;
    try {
        const prompt = `Agisci come un archivista segreto. Scrivi un racconto horror/paranormale profondo sullo stile di un libro noir per il caso: ${titolo}. Lunghezza 400 parole.`;
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ testo: "Errore di connessione con l'abisso..." });
    }
});

// Porta dinamica: importante per Render/Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});