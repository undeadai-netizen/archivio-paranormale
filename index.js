const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey || 'MISSING' });

// Database Titoli - Settore A (Sinistra) - 12 STORIE
const titoliSettoreA = [
    { titolo: "Il Fantasma di Poveglia" }, 
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" }, 
    { titolo: "Bunker Segreto Berlino" },
    { titolo: "L'Isola delle Bambole" }, 
    { titolo: "La Torre di Londra" },
    { titolo: "Castello di Bran (Dracula)" }, 
    { titolo: "Abbazia di Thelema" },
    { titolo: "Il Manicomio di Beelitz" }, 
    { titolo: "Villa De Vecchi" },
    { titolo: "Cimitero di Highgate" }, 
    { titolo: "Il Borgo di Craco" }
];

// Database Titoli - Settore B (Destra) - 12 STORIE
const titoliSettoreB = [
    { titolo: "Foresta di Aokigahara" }, 
    { titolo: "Area 51 - Livello 4" },
    { titolo: "Centrale di Chernobyl" }, 
    { titolo: "Faro di Eilean Mor" },
    { titolo: "Hotel Stanley" }, 
    { titolo: "Base Sotterranea Dulce" },
    { titolo: "Triangolo delle Bermuda" }, 
    { titolo: "La Valle dei Re" },
    { titolo: "Il Sanatorio di Waverly Hills" }, 
    { titolo: "Isola di Pasqua" },
    { titolo: "Il Pozzo di Darvaza" }, 
    { titolo: "Alcatraz - Cella 14D" }
];

// Rotta per i titoli
app.get('/titoli', (req, res) => {
    res.json({ 
        sinistra: titoliSettoreA, 
        destra: titoliSettoreB 
    });
});

// Rotta per la generazione storia
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;

    if (!apiKey || apiKey === 'MISSING') {
        return res.json({ testo: "ERRORE: Chiave API non configurata." });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Sei un computer militare dell'intelligence paranormale. Scrivi rapporti tecnici, inquietanti e realistici. Usa un tono freddo e distaccato. Vai a capo spesso." 
                },
                { role: "user", content: `Analisi del soggetto: ${titolo}` }
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ testo: completion.choices[0].message.content });

    } catch (error) {
        console.error("Errore Groq:", error.message);
        res.json({ testo: `ERRORE DI SISTEMA: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server v12 Live sulla porta ${PORT}`);
});
