const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();

// --- CONFIGURAZIONE CORS AGGIORNATA ---
// Questo permette al tuo file locale sul PC di parlare con il server Render
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Inizializzazione Groq
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey });

const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Area 51 - Livello 4" }
];

// Rotta per i titoli
app.get('/titoli', (req, res) => {
    console.log("Invio lista titoli...");
    res.json({ sinistra: titoliPubblici });
});

// Rotta per generare la storia
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    console.log("Richiesta ricevuta per soggetto:", titolo);

    if (!apiKey) {
        return res.json({ testo: "ERRORE SERVER: Chiave GROQ_API_KEY mancante nelle impostazioni di Render." });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un archivista paranormale. Scrivi rapporti militari brevi, tecnici e inquietanti. Vai a capo spesso." },
                { role: "user", content: `Analisi reperto: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });

        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        console.error("Errore Groq:", error.message);
        res.json({ testo: "ATTENZIONE: Collegamento IA interrotto. Verificare validità della chiave su Render." });
    }
});

// Avvio Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sistema OmbreSync v6.2 attivo sulla porta ${PORT}`));
