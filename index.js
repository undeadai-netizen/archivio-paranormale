// Database Titoli - Settore A (Sinistra) - 12 STORIE
const titoliSettoreA = [
    { titolo: "Il Fantasma di Poveglia" }, { titolo: "Le Catacombe di Parigi" },
    { titolo: "Il Castello di Edimburgo" }, { titolo: "Bunker Segreto Berlino" },
    { titolo: "L'Isola delle Bambole" }, { titolo: "La Torre di Londra" },
    { titolo: "Castello di Bran (Dracula)" }, { titolo: "Abbazia di Thelema" },
    { titolo: "Il Manicomio di Beelitz" }, { titolo: "Villa De Vecchi" },
    { titolo: "Cimitero di Highgate" }, { titolo: "Il Borgo di Craco" }
];

// Database Titoli - Settore B (Destra) - 12 STORIE
const titoliSettoreB = [
    { titolo: "Foresta di Aokigahara" }, { titolo: "Area 51 - Livello 4" },
    { titolo: "Centrale di Chernobyl" }, { titolo: "Faro di Eilean Mor" },
    { titolo: "Hotel Stanley" }, { titolo: "Base Sotterranea Dulce" },
    { titolo: "Triangolo delle Bermuda" }, { titolo: "La Valle dei Re" },
    { titolo: "Il Sanatorio di Waverly Hills" }, { titolo: "Isola di Pasqua" },
    { titolo: "Il Pozzo di Darvaza" }, { titolo: "Alcatraz - Cella 14D" }
];

// Rotta per inviare i titoli (NON CAMBIARE)
app.get('/titoli', (req, res) => {
    res.json({ sinistra: titoliSettoreA, destra: titoliSettoreB });
});
