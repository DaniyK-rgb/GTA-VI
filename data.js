// Données de la carte (fan-made). Coordonnées dans le repère SVG 1000 x 1300.
window.LEONIDA = {
  categories: {
    planque:  { label: "Planques",          color: "#ff2e88", icon: "M-4 1L0-4L4 1V5H-4Z" },
    mission:  { label: "Missions",          color: "#ffd166", icon: "M0-5L1.5-1.5L5-1.2L2.3 1.2L3.1 5L0 3L-3.1 5L-2.3 1.2L-5-1.2L-1.5-1.5Z" },
    magasin:  { label: "Magasins",          color: "#2de2e6", icon: "M-4-2H4L3 5H-3ZM-2-2V-3.5A2 2 0 0 1 2-3.5V-2" },
    activite: { label: "Activités",         color: "#a66bff", icon: "M-4 0A4 4 0 1 0 4 0A4 4 0 1 0-4 0M-1.5-1.5L2 0L-1.5 1.5Z" },
    transport:{ label: "Transports",        color: "#ff8a3d", icon: "M-5 1L5-3L2 4L0 1Z" },
    lieu:     { label: "Points d'intérêt",  color: "#5fd39a", icon: "M0-5A3.5 3.5 0 0 1 3.5-1.5C3.5 1 0 5 0 5S-3.5 1-3.5-1.5A3.5 3.5 0 0 1 0-5Z" }
  },

  regions: {
    vice: {
      name: "Vice City",
      color: "#ff2e88",
      center: [785, 790], zoom: 3,
      tagline: "Néons, plages et argent sale",
      desc: "La métropole de Leonida : gratte-ciels du centre, Ocean Drive façon carte postale, port de marchandises et soirées qui ne finissent jamais."
    },
    keys: {
      name: "Leonida Keys",
      color: "#2de2e6",
      center: [440, 1150], zoom: 2.4,
      tagline: "Ponts infinis et eaux turquoise",
      desc: "Un chapelet d'îles relié par une longue route sur la mer. Bateaux, pêche au gros, couchers de soleil et petits trafics entre deux bars de plage."
    },
    grassrivers: {
      name: "Grassrivers",
      color: "#2de2a6",
      center: [600, 900], zoom: 2.6,
      tagline: "Marais, alligators et hydroglisseurs",
      desc: "Des kilomètres de marécages au sud de l'État. Parfait pour disparaître… ou pour faire disparaître quelque chose."
    },
    gellhorn: {
      name: "Port Gellhorn",
      color: "#ff8a3d",
      center: [190, 285], zoom: 2.8,
      tagline: "Ville côtière fatiguée",
      desc: "Une ancienne station balnéaire du nord-ouest, entre motels délavés, docks industriels et pontons rouillés."
    },
    ambrosia: {
      name: "Ambrosia",
      color: "#e3b04b",
      center: [470, 270], zoom: 2.8,
      tagline: "Usines et bikers",
      desc: "Ville industrielle de l'intérieur, dominée par sa raffinerie de sucre. Les clubs de motards y font la loi."
    },
    kalaga: {
      name: "Mount Kalaga",
      color: "#3fae6e",
      center: [770, 260], zoom: 2.6,
      tagline: "Parc national sauvage",
      desc: "Forêts denses, rivières et sentiers de randonnée au nord-est. Chasse, camping et pistes de terre pour le tout-terrain."
    }
  },

  places: [
    // Vice City
    { id: "downtown",   name: "Downtown Vice City",     cat: "lieu",      region: "vice",        x: 790, y: 765, desc: "Le cœur financier : tours de verre, banques et penthouses." },
    { id: "ocean",      name: "Ocean Drive",            cat: "lieu",      region: "vice",        x: 874, y: 760, desc: "Le boulevard des façades pastel et des voitures de luxe." },
    { id: "vicebeach",  name: "Vice Beach",             cat: "activite",  region: "vice",        x: 880, y: 700, desc: "Sable blanc, beach-volley et jet-skis." },
    { id: "port",       name: "Port de Vice City",      cat: "mission",   region: "vice",        x: 800, y: 860, desc: "Conteneurs, grues et cargaisons qui disparaissent la nuit." },
    { id: "airport",    name: "Aéroport international", cat: "transport", region: "vice",        x: 735, y: 712, desc: "Vols intérieurs, hangars privés et pistes d'avions de tourisme." },
    { id: "stadium",    name: "Stade de Vice City",     cat: "activite",  region: "vice",        x: 765, y: 680, desc: "Matchs, concerts et parkings géants." },
    { id: "marina",     name: "Marina",                 cat: "transport", region: "vice",        x: 840, y: 890, desc: "Yachts, hors-bords et location de bateaux." },
    { id: "club",       name: "Club Neon",              cat: "activite",  region: "vice",        x: 815, y: 730, desc: "La boîte la plus chaude de la ville." },
    { id: "safe1",      name: "Appart' de Downtown",    cat: "planque",   region: "vice",        x: 770, y: 800, desc: "Petit appartement discret avec garage souterrain." },
    { id: "safe2",      name: "Villa de Vice Beach",    cat: "planque",   region: "vice",        x: 885, y: 840, desc: "Villa avec piscine et ponton privé." },
    { id: "mall",       name: "Centre commercial",      cat: "magasin",   region: "vice",        x: 745, y: 760, desc: "Vêtements, bijoux, coiffeur et tatoueur." },
    { id: "ammu1",      name: "Armurerie du centre",    cat: "magasin",   region: "vice",        x: 805, y: 800, desc: "Armes et munitions, sans trop de questions." },
    { id: "bank",       name: "Banque de Leonida",      cat: "mission",   region: "vice",        x: 795, y: 740, desc: "Coffres bien remplis. Trop bien remplis." },

    // Keys
    { id: "keys1",      name: "Bar de plage des Keys",  cat: "activite",  region: "keys",        x: 470, y: 1140, desc: "Cocktails, musique live et bagarres au coucher du soleil." },
    { id: "keys2",      name: "Pointe sud",             cat: "lieu",      region: "keys",        x: 285, y: 1208, desc: "Le bout de la route. Le bout de l'État." },
    { id: "keys3",      name: "Port de pêche",          cat: "transport", region: "keys",        x: 585, y: 1075, desc: "Bateaux de pêche au gros et location de hors-bords." },
    { id: "keys4",      name: "Maison sur pilotis",     cat: "planque",   region: "keys",        x: 405, y: 1170, desc: "Planque isolée avec accès direct à l'eau." },
    { id: "keys5",      name: "Livraison en mer",       cat: "mission",   region: "keys",        x: 345, y: 1192, desc: "Un colis tombé d'un avion. À récupérer avant les garde-côtes." },

    // Grassrivers
    { id: "airboat",    name: "Tours en hydroglisseur", cat: "activite",  region: "grassrivers", x: 560, y: 905, desc: "Fonce à travers les marais. Attention aux alligators." },
    { id: "shack",      name: "Cabane des contrebandiers", cat: "planque", region: "grassrivers", x: 520, y: 870, desc: "Cabane perdue dans les herbes hautes." },
    { id: "gator",      name: "Ferme à alligators",     cat: "lieu",      region: "grassrivers", x: 660, y: 950, desc: "Attraction touristique un peu douteuse." },
    { id: "strip",      name: "Piste clandestine",      cat: "mission",   region: "grassrivers", x: 620, y: 990, desc: "Une piste d'atterrissage qui n'existe sur aucun plan officiel." },
    { id: "gas1",       name: "Station-service du Trail", cat: "magasin", region: "grassrivers", x: 700, y: 862, desc: "Essence, snacks et appâts vivants." },

    // Port Gellhorn
    { id: "docks",      name: "Docks de Port Gellhorn", cat: "mission",   region: "gellhorn",    x: 110, y: 270, desc: "Docks industriels où transitent toutes sortes de marchandises." },
    { id: "motel",      name: "Motel Sunset",           cat: "planque",   region: "gellhorn",    x: 210, y: 310, desc: "Chambre 12. Ne pose pas de questions sur la moquette." },
    { id: "pier",       name: "Vieille jetée",          cat: "lieu",      region: "gellhorn",    x: 70,  y: 230, desc: "Grande roue à l'arrêt et attractions rouillées." },
    { id: "pawn",       name: "Prêteur sur gages",      cat: "magasin",   region: "gellhorn",    x: 170, y: 255, desc: "Revends ce que tu as… trouvé." },

    // Ambrosia
    { id: "refinery",   name: "Raffinerie de sucre",    cat: "lieu",      region: "ambrosia",    x: 480, y: 240, desc: "L'usine géante qui fait vivre — et tousser — la ville." },
    { id: "bikers",     name: "Bar des bikers",         cat: "mission",   region: "ambrosia",    x: 430, y: 290, desc: "QG d'un club de motards. Entre poliment." },
    { id: "garage",     name: "Garage custom",          cat: "magasin",   region: "ambrosia",    x: 520, y: 290, desc: "Personnalise ta caisse ou ta moto." },
    { id: "rail",       name: "Gare de fret",           cat: "transport", region: "ambrosia",    x: 560, y: 250, desc: "Trains de marchandises vers tout l'État." },

    // Mount Kalaga
    { id: "summit",     name: "Sommet du Kalaga",       cat: "lieu",      region: "kalaga",      x: 790, y: 205, desc: "Le point culminant de Leonida, vue sur tout l'État." },
    { id: "camp",       name: "Camping du parc",        cat: "planque",   region: "kalaga",      x: 715, y: 270, desc: "Mobile-home au milieu des pins." },
    { id: "hunt",       name: "Zone de chasse",         cat: "activite",  region: "kalaga",      x: 870, y: 250, desc: "Cerfs, sangliers et pumas." },
    { id: "offroad",    name: "Piste tout-terrain",     cat: "activite",  region: "kalaga",      x: 680, y: 210, desc: "Boue, sauts et suspensions qui souffrent." },
    { id: "ranger",     name: "Poste des rangers",      cat: "lieu",      region: "kalaga",      x: 820, y: 320, desc: "Mieux vaut éviter de s'y faire remarquer." },

    // Centre
    { id: "lake",       name: "Grand Lac",              cat: "activite",  region: null,          x: 650, y: 565, desc: "Pêche, wakeboard et maisons au bord de l'eau." },
    { id: "ranch",      name: "Ranch Leonida",          cat: "lieu",      region: null,          x: 520, y: 480, desc: "Champs de canne à sucre à perte de vue." },
    { id: "truck",      name: "Relais routier",         cat: "magasin",   region: null,          x: 600, y: 560, desc: "Diner ouvert 24h/24 au carrefour des routes." },
    { id: "speedway",   name: "Circuit de stock-car",   cat: "activite",  region: null,          x: 820, y: 520, desc: "Courses ovales le samedi soir." },
    { id: "prison",     name: "Pénitencier d'État",     cat: "mission",   region: null,          x: 360, y: 560, desc: "Là où finissent ceux qui se font prendre." }
  ]
};
