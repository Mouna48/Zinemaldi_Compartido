// translate.js
const translations = {
    en: {
        "nav-noticias": "News",
        "nav-emisiones": "Broadcasts",
        "nav-galeria": "Gallery",
        "nav-contacto": "Contact",
        "titulo-principal": "Latest News — San Sebastián Festival (73rd edition)",
        "subtitulo-principal": "Recent news, awards, and highlighted events",
        "noticia1-titulo": "«Los domingos» wins the Golden Shell",
        "noticia1-texto": "The feature film <em>Los domingos / Sundays</em>, directed by Alauda Ruiz de Azúa, won the Golden Shell at the 73rd San Sebastián Festival.",
        "noticia1-fecha": "📅 Published: September 27, 2025",
        "noticia2-titulo": "Acting Awards: Silver Shell (ex aequo)",
        "noticia2-texto": "The jury awarded the Silver Shell for best lead performance ex aequo to José Ramón Soroiz for <em>Maspalomas</em> and Zhao Xiaohong for <em>Her Heart Beats in Its Cage</em>.",
        "noticia2-fecha": "📅 Published: September 27, 2025",
        "noticia3-titulo": "Featured Guests: International figures at the festival",
        "noticia3-texto": "The 73rd edition included international figures and screenings of highly anticipated titles, including sessions with top guests.",
        "noticia3-fecha": "📅 Published: September 2025"
    },
    eu: {
        "nav-noticias": "Albisteak",
        "nav-emisiones": "Emititzak",
        "nav-galeria": "Galeria",
        "nav-contacto": "Harremana",
        "titulo-principal": "Azken Albisteak — Donostiako Jaialdia (73. edizioa)",
        "subtitulo-principal": "Albiste berriak, sariak eta ekitaldi nabarmenduak",
        "noticia1-titulo": "«Los domingos» Irabazi du Urrezko Maskorra",
        "noticia1-texto": "<em>Los domingos / Sundays</em> film luzea, Alauda Ruiz de Azúaren zuzendaritzapean, Urrezko Maskorra irabazi du 73. edizioan.",
        "noticia1-fecha": "📅 Argitaratua: 2025eko irailaren 27a",
        "noticia2-titulo": "Interpretazio Sariak: Zilarrezko Maskorra (ex aequo)",
        "noticia2-texto": "Epaimahaiak Zilarrezko Maskorra eman zuen protagonista onenari ex aequo, José Ramón Soroiz-i <em>Maspalomas</em> eta Zhao Xiaohong-i <em>Her Heart Beats in Its Cage</em> filmetarako.",
        "noticia2-fecha": "📅 Argitaratua: 2025eko irailaren 27a",
        "noticia3-titulo": "Gonbidatu Nabarmenduak: Jaialdiko nazioarteko pertsonaiak",
        "noticia3-texto": "73. edizioak nazioarteko pertsonaien presentzia izan zuen eta oso itxarondako filmetako proiekzioak, lehen mailako gonbidatuekin.",
        "noticia3-fecha": "📅 Argitaratua: 2025eko iraila"
    }
};

function translate(lang) {
    for (let id in translations[lang]) {
        const el = document.getElementById(id);
        if(el) el.innerHTML = translations[lang][id];
    }
}

// Ejemplo: Cambiar idioma al inglés
// translate('en');
