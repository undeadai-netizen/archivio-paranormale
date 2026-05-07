const express = require('express');
const cors = require('cors');
const app = express();

// Configurazione Middleware
app.use(cors()); // Sblocca la comunicazione con Netlify
app.use(express.json());

// 1. ROTTA DI TEST (Risolve l'errore "Cannot GET /")
app.get('/', (req, res) => {
    res.send("SISTEMA OMBRESYNC ONLINE - DATABASE PRONTO");
});

// 2. DATABASE TITOLI PUBBLICI
const titoliPubblici = [
    { titolo: "Il Fantasma di Poveglia" },
    { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" },
    { titolo: "La Torre di Londra" },
    { titolo: "Il Mistero di Stonehenge" },
    { titolo: "L'Anomalia del Monte Nero" },
    { titolo: "Area 51 - Livello 4" },
    { titolo: "Il Triangolo delle Bermuda" },
    { titolo: "Foresta di Aokigahara" },
    { titolo: "Incidente del Passo Dyatlov" },
    { titolo: "Le Linee di Nazca" },
    { titolo: "Rovine di Mohenjo-Daro" }
];

// 3. DATABASE TITOLI PREMIUM
const titoliPremium = [
    { titolo: "Progetto Abyss" },
    { titolo: "Soggetto 001" },
    { titolo: "Il Codice Omega" },
    { titolo: "Reperto X-32" },
    { titolo: "Ultimatum Terra" },
    { titolo: "Origine Oscura" }
];

// 4. ROTTE PER IL FRONTEND
app.get('/titoli', (req, res) => {
    res.json({ sinistra: titoliPubblici });
});

app.get('/titoli-premium', (req, res) => {
    res.json(titoliPremium);
});

// 5. GENERAZIONE STORIA (IA)
app.post('/genera-storia', async (req, res) => {
    const { titolo } = req.body;
    
    // Qui puoi inserire la tua logica Groq. 
    // Per ora ti do una risposta di test sicura:
    const testoIA = `ANALISI SATELLITARE COMPLETATA: ${titolo}. 
    I sensori rilevano anomalie termiche e fluttuazioni elettromagnetiche costanti. 
    L'area è stata dichiarata zona rossa. Non tentare l'accesso fisico. 
    Documentazione recuperata dai server criptati conferma la presenza di entità di Classe 4.`;

    res.json({ testo: testoIA });
});

// Avvio Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
