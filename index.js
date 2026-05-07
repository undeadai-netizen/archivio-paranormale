const express = require('express');
const cors = require('cors'); // <--- Fondamentale
const app = express();

// Abilita la comunicazione tra siti diversi
app.use(cors()); 
app.use(express.json());

// Database dei titoli (Archivio Pubblico)
const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "Foresta di Aokigahara" }
];

// Database dei titoli (Archivio Premium)
const titoliPremium = [
    { titolo: "Progetto Abyss" },
    { titolo: "Soggetto 001" },
    { titolo: "Il Codice Omega" }
];

// Rotta per i titoli pubblici
app.get('/titoli', (req, res) => {
    res.json({ sinistra: titoliPubblici });
});

// Rotta per i titoli premium
app.get('/titoli-premium', (req, res) => {
    res.json(titoliPremium);
});

// Rotta per generare la storia (IA)
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    
    // Qui simulo la risposta dell'IA per testare se il ponte funziona
    // Tu puoi rimettere la tua logica di Groq qui sotto
    const storiaFinta = `ANALISI DEL CASO: ${titolo}. 
    Rilevamenti paranormali confermati. Le frequenze indicano una presenza non umana 
    stabile nell'area. Procedere con estrema cautela.`;

    res.json({ testo: storiaFinta });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server OMBRESYNC pronto sulla porta ${PORT}`);
});
