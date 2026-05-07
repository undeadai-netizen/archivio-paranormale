const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();

// CONFIGURAZIONE CORS TOTALE
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Inizializzazione sicura della chiave
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey || 'MISSING' });

const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Area 51 - Livello 4" }
];

// Rotta test per verificare se il server risponde
app.get('/titoli', (req, res) => {
    res.json({ sinistra: titoliPubblici });
});

// Rotta principale con Diagnostica Errori
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;

    if (!apiKey || apiKey === '') {
        return res.json({ testo: "ERRORE CRITICO: La variabile GROQ_API_KEY non è stata impostata su Render. Vai in Dashboard -> Environment e aggiungila." });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un computer dell'intelligence. Scrivi rapporti paranormali brevi e inquietanti." },
                { role: "user", content: `Analisi: ${titolo}` }
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ testo: completion.choices[0].message.content });

    } catch (error) {
        // Questo ti dirà l'errore esatto fornito da Groq
        console.error("Dettaglio Errore:", error.message);
        
        let messaggioUser = `ERRORE RILEVATO DAL SERVER:\n\n"${error.message}"\n\n`;
        
        if (error.message.includes("401")) {
            messaggioUser += "Suggerimento: La chiave API è invalida. GitHub potrebbe averla disattivata. Generane una NUOVA su Groq e aggiorna Render.";
        } else if (error.message.includes("429")) {
            messaggioUser += "Suggerimento: Troppe richieste. Aspetta un minuto.";
        } else {
            messaggioUser += "Suggerimento: Controlla che la chiave su Render sia copiata senza spazi bianchi.";
        }

        res.json({ testo: messaggioUser });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server v6.3 Live sulla porta ${PORT}`);
});
