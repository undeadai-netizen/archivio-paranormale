const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();

// Configurazione CORS per permettere la connessione dal tuo PC
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Inizializzazione Groq con la variabile d'ambiente di Render
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey || 'MISSING' });

// Database Titoli - Settore A (Sinistra)
const titoliSettoreA = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Bunker Segreto Berlino" },
    { titolo: "L'Isola delle Bambole" },
    { titolo: "La Torre di Londra" }
];

// Database Titoli - Settore B (Destra)
const titoliSettoreB = [
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Area 51 - Livello 4" },
    { titolo: "Centrale di Chernobyl" },
    { titolo: "Faro di Eilean Mor" },
    { titolo: "Hotel Stanley" },
    { titolo: "Base Sotterranea Dulce" }
];

// Rotta per inviare entrambi i settori al sito
app.get('/titoli', (req, res) => {
    res.json({ 
        sinistra: titoliSettoreA, 
        destra: titoliSettoreB 
    });
});

// Rotta per generare la storia con il modello aggiornato
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;

    if (!apiKey || apiKey === 'MISSING') {
        return res.json({ testo: "ERRORE: Chiave API mancante su Render." });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Sei un computer militare dell'intelligence paranormale. Scrivi rapporti tecnici, inquietanti e realistici. Usa un tono freddo. Vai a capo dopo ogni paragrafo per leggibilità." 
                },
                { role: "user", content: `Analisi del soggetto: ${titolo}` }
            ],
            model: "llama-3.3-70b-versatile", // Modello aggiornato e funzionante
        });

        res.json({ testo: completion.choices[0].message.content });

    } catch (error) {
        console.error("Errore:", error.message);
        res.json({ 
            testo: `ERRORE DI SISTEMA: ${error.message}. Verifica la chiave su Render.` 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Archivio Ombre v8.0 attivo sulla porta ${PORT}`);
});
