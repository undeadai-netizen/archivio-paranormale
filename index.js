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

// Database Titoli - 12 per lato
const titoliSettoreA = [
    { titolo: "Il Fantasma di Poveglia" }, { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" }, { titolo: "Bunker Segreto Berlino" },
    { titolo: "L'Isola delle Bambole" }, { titolo: "La Torre di Londra" },
    { titolo: "Castello di Bran" }, { titolo: "Abbazia di Thelema" },
    { titolo: "Il Manicomio di Beelitz" }, { titolo: "Villa De Vecchi" },
    { titolo: "Cimitero di Highgate" }, { titolo: "Il Borgo di Craco" }
];

const titoliSettoreB = [
    { titolo: "Foresta di Aokigahara" }, { titolo: "Area 51 - Livello 4" },
    { titolo: "Centrale di Chernobyl" }, { titolo: "Faro di Eilean Mor" },
    { titolo: "Hotel Stanley" }, { titolo: "Base Sotterranea Dulce" },
    { titolo: "Triangolo delle Bermuda" }, { titolo: "La Valle dei Re" },
    { titolo: "Sanatorio Waverly Hills" }, { titolo: "Isola di Pasqua" },
    { titolo: "Il Pozzo di Darvaza" }, { titolo: "Alcatraz - Cella 14D" }
];

app.get('/titoli', (req, res) => {
    res.json({ sinistra: titoliSettoreA, destra: titoliSettoreB });
});

app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    if (!apiKey || apiKey === 'MISSING') return res.json({ testo: "Errore Configurazione API." });

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `Sei un antico archivista dell'occulto. Scrivi cronache horror lunghe, dettagliate e letterarie. 
                    Usa uno stile gotico, descrittivo e prolisso (minimo 1000 parole). 
                    Dividi la storia in capitoli: L'ORIGINE, LA MALEDIZIONE, IL RITROVAMENTO, L'ORRORE FINALE. 
                    Descrivi odori, suoni e sensazioni psicologiche in modo profondo.` 
                },
                { role: "user", content: `Scrivi la cronaca completa e dettagliata su: ${titolo}` }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 4096, // Massimo consentito per storie lunghissime
            temperature: 0.7
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ testo: "L'oscurità ha interrotto la connessione." });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
