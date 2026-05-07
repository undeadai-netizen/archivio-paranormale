const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Legge la chiave SOLO dalle impostazioni di Render (Environment Variables)
// Così GitHub non ti darà mai più errori di sicurezza!
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/titoli', (req, res) => {
    res.json({ sinistra: [
        { titolo: "Il Fantasma di Poveglia" },
        { titolo: "Le Catacombe di Parigi" },
        { titolo: "Il Castello di Edimburgo" },
        { titolo: "Foresta di Aokigahara" },
        { titolo: "Area 51 - Livello 4" }
    ]});
});

app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Sei un archivista paranormale. Scrivi rapporti tecnici e inquietanti." },
                { role: "user", content: `Analisi caso: ${titolo}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ testo: completion.choices[0].message.content });
    } catch (e) {
        res.json({ testo: "SISTEMA ONLINE - IA IN ATTESA DI CHIAVE VALIDA SU RENDER." });
    }
});

app.listen(process.env.PORT || 3000);
