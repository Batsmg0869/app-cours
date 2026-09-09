let taskList = [];
let courseList = [];
let coursesList = [
  {
    "id": 1,
    "subject": "Mathématiques",
    "icon": "🔢",
    "courses": [
      {
        "id": 101,
        "title": "Théorème de Pythagore",
        "description": "Connaître et utiliser le théorème de Pythagore",
        "pdf": "Maths/connaitre-et-utiliser-le-theoreme-de-pythagore_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 102,
        "title": "Les Nombres Premiers",
        "description": "Découvrez les nombres premiers et leurs propriétés",
        "pdf": "Maths/les-nombres-premiers_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 103,
        "title": "Les Racines Carrées",
        "description": "Comprendre et calculer les racines carrées",
        "pdf": "Maths/les-racines-carrees_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 104,
        "title": "Multiplier et Diviser des Nombres Relatifs",
        "description": "Opérations avec les nombres relatifs",
        "pdf": "Maths/multiplier-et-diviser-des-nombres-relatifs_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 105,
        "title": "Pyramides et Cônes de Révolution",
        "description": "Étude des pyramides et cônes de révolution",
        "pdf": "Maths/pyramide-et-cone-de-revolution_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 106,
        "title": "Résoudre des Problèmes de Proportionnalité",
        "description": "Appliquer la proportionnalité à des problèmes",
        "pdf": "Maths/resoudre-des-problemes-de-proportionnalite_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 107,
        "title": "Se Repérer dans un Pavé Droit",
        "description": "Géométrie dans l'espace : pavés droits",
        "pdf": "Maths/se-reperer-dans-un-pave-droit-1_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 2,
    "subject": "Physique-Chimie",
    "icon": "⚛️",
    "courses": [
      {
        "id": 201,
        "title": "Atomes et Réactions Chimiques",
        "description": "Comprendre les atomes et les réactions chimiques",
        "pdf": "Physique-Chimie/atomes-et-reactions-chimiques_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 202,
        "title": "La Composition de l'Air",
        "description": "Étude de la composition de l'air",
        "pdf": "Physique-Chimie/la-composition-de-l-air_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 203,
        "title": "La Masse Volumique",
        "description": "Concept et calcul de la masse volumique",
        "pdf": "Physique-Chimie/la-masse-volumique_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 204,
        "title": "Les Changements d'État de l'Eau",
        "description": "Solide, liquide et gazeux : les changements d'état",
        "pdf": "Physique-Chimie/les-changements-d-etat-de-l-eau_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 205,
        "title": "Les États de la Matière",
        "description": "Les différents états de la matière",
        "pdf": "Physique-Chimie/les-etats-de-la-matiere_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 3,
    "subject": "Histoire",
    "icon": "📜",
    "courses": [
      {
        "id": 301,
        "title": "Les Temps Forts de la Révolution",
        "description": "La Révolution Française de 1789 à 1799",
        "pdf": "Histoire/les-temps-forts-de-la-revolution-de-1789-a-1799_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 302,
        "title": "Napoléon et l'Empire",
        "description": "De la Révolution à l'Empire (1799-1815)",
        "pdf": "Histoire/napoleon-de-la-revolution-a-l-empire-1799-1815_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 303,
        "title": "L'Europe Industrielle",
        "description": "L'Europe de la révolution industrielle",
        "pdf": "Histoire/l-europe-de-la-revolution-industrielle_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 304,
        "title": "Bourgeoisies Marchandes et Traites Négrieres",
        "description": "Bourgeoisies marchandes, négoces internationaux et traites négrieres au XVIIIe siècle",
        "pdf": "Histoire/bourgeoisies-marchandes-negoces-internationaux-et-traites-negrieres-au-xviiie-siecle_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 305,
        "title": "L'Économie de Plantation",
        "description": "Étude de l'économie de plantation",
        "pdf": "Histoire/l-economie-de-plantation_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 306,
        "title": "L'Europe des Lumières",
        "description": "L'Europe des lumières : circulation des idées et contestation de l'absolutisme",
        "pdf": "Histoire/l-europe-des-lumieres-circulation-des-idees-despotisme-eclaire-et-contestation-de-l-absolutisme_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 4,
    "subject": "Géographie",
    "icon": "🌍",
    "courses": [
      {
        "id": 401,
        "title": "Un Monde de Migrants",
        "description": "Les flux migratoires dans le monde",
        "pdf": "Geographie/un-monde-de-migrants_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 402,
        "title": "Urbanisation et Espaces",
        "description": "Espaces et paysages de l'urbanisation",
        "pdf": "Geographie/espaces-et-paysages-de-l-urbanisation-geographie-des-centres-et-des-peripheries_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 403,
        "title": "Tokyo et la Mondialisation",
        "description": "Une ville connectée aux flux de la mondialisation",
        "pdf": "Geographie/une-ville-connectee-aux-flux-de-la-mondialisation-l-exemple-de-tokyo_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 404,
        "title": "Flux Migratoire du Maghreb",
        "description": "Un exemple de flux migratoire : le cas du Maghreb",
        "pdf": "Geographie/un-exemple-de-flux-migratoire-le-cas-du-maghreb_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 405,
        "title": "Detroit et la Mondialisation",
        "description": "Une ville en marge des flux de la mondialisation : Detroit",
        "pdf": "Geographie/une-ville-en-marge-des-flux-de-la-mondialisation-l-exemple-de-detroit_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 5,
    "subject": "Français",
    "icon": "📖",
    "courses": [
      {
        "id": 501,
        "title": "La Comédie au XVIIIe Siècle",
        "description": "Étude du genre comique au 18e siècle",
        "pdf": "Francais/la-comedie-au-xviiie-siecle_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 504,
        "title": "Le Champ Lexical",
        "description": "Comprendre et identifier le champ lexical",
        "pdf": "Francais/le-champ-lexical_lecon.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 505,
        "title": "La Parure : Nouvelle Réaliste",
        "description": "Une nouvelle réaliste : La Parure de Maupassant et l'adaptation de Claude Chabrol",
        "pdf": "Francais/une-nouvelle-realiste-la-parure-de-maupassant-et-l-adaptation-eponyme-de-claude-chabrol_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 502,
        "title": "La Nouvelle du XVIIIe Siècle",
        "description": "La nouvelle : de hier à aujourd'hui",
        "pdf": "Francais/la-nouvelle-du-xviiie-siecle-a-nos-jours_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 503,
        "title": "La Poésie Amoureuse",
        "description": "La poésie amoureuse de l'antiquité à nos jours",
        "pdf": "Francais/la-poesie-amoureuse-de-l-antiquite-a-nos-jours_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 6,
    "subject": "Anglais",
    "icon": "🇬🇧",
    "courses": [
      {
        "id": 601,
        "title": "Present Simple et Be+ing",
        "description": "Maîtriser le present simple et le present be+ing",
        "pdf": "Anglais/present-simple-present-be-ing-anglais_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 602,
        "title": "Preterit Be-ing",
        "description": "Le preterit Be-ing en anglais",
        "pdf": "Anglais/preterit-be-ing-anglais_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 603,
        "title": "Superlatif en Anglais",
        "description": "Utiliser correctement le superlatif",
        "pdf": "Anglais/superlatif-anglais_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 604,
        "title": "Verbes Irréguliers",
        "description": "Apprendre les verbes irréguliers en anglais",
        "pdf": "Anglais/verbes-irreguliers-anglais_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 605,
        "title": "Voix Passive",
        "description": "La voix passive en anglais",
        "pdf": "Anglais/voix-passive-anglais_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 7,
    "subject": "Espagnol",
    "icon": "🇪🇸",
    "courses": [
      {
        "id": 701,
        "title": "Ser et Estar",
        "description": "Apprendre la différence entre Ser et Estar",
        "pdf": "Espagnol/ser-et-estar_lecon.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 704,
        "title": "Verbes à Affaiblissement",
        "description": "Les verbes à affaiblissement en espagnol",
        "pdf": "Espagnol/les-verbes-a-affaiblissement_lecion.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 705,
        "title": "Verbes à Diphtongue",
        "description": "Les verbes à diphtongue en espagnol",
        "pdf": "Espagnol/les-verbes-a-diphtongue_lecion.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 702,
        "title": "Le Présent de l'Indicatif",
        "description": "Conjugaison au présent en espagnol",
        "pdf": "Espagnol/le-present-de-l-indicatif-en-espagnol_lecon.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 703,
        "title": "L'Auxiliaire Haber",
        "description": "Utiliser correctement Haber en espagnol",
        "pdf": "Espagnol/l-auxiliaire-haber_lecon.pdf",
        "date": "2026-02-15"
      }
    ]
  },
  {
    "id": 8,
    "subject": "SVT",
    "icon": "🧬",
    "courses": [
      {
        "id": 801,
        "title": "La Tectonique des Plaques",
        "description": "Comprendre la tectonique des plaques",
        "pdf": "SVT/la-tectonique-des-plaques_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 804,
        "title": "Évolution du Climat et Risques",
        "description": "L'évolution du climat, les risques climatiques et météorologiques",
        "pdf": "SVT/l-evolution-du-climat-les-risques-climatiques-et-meteorologiques_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 805,
        "title": "Dynamique des Masses d'Air et d'Eau",
        "description": "Comprendre la dynamique des masses d'air et d'eau",
        "pdf": "SVT/la-dynamique-des-masses-d-air-et-d-eau_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 802,
        "title": "Séismes et Risques Associés",
        "description": "Étude des séismes et des risques sismiques",
        "pdf": "SVT/seismes-et-risques-associes_fiche-de-cours.pdf",
        "date": "2026-02-15"
      },
      {
        "id": 803,
        "title": "Volcanisme et Risques",
        "description": "Volcanisme et risques associés",
        "pdf": "SVT/volcanisme-et-risques-associes_fiche-de-cours.pdf",
        "date": "2026-02-15"
      }
    ]
  }
];
let editingCourseId = null;
let currentViewWeek = 'A'; // Semaine affichée par défaut
let userName = "Baptiste Lecuyot";
let appTheme = "default";
let gradesList = [];
let archiveList = [];
let customTheme = { primary: '#818cf8', accent: '#c084fc', bg: '#020617', card: '#1e293b' };

// La police Minecraft est définie directement dans style.css (base64).
// Cette fonction applique simplement la variable CSS du thème.
function loadMinecraftFont() {
  console.log("[Police] ✓ La police Minecraft est définie dans style.css, aucun chargement dynamique nécessaire.");
  // Forcer l'actualisation de la police en réappliquant la variable CSS
  document.body.style.fontFamily = 'var(--font-base)';
}

// INITIALISATION
window.addEventListener('DOMContentLoaded', async () => {
  console.log("[Initialisation] Lancement de l'application HomeworkPlanner...");
  console.log("[Initialisation] Chargement des cours et des devoirs...");

  await loadData();

  console.log("[Initialisation] Rendu initial de l'interface utilisateur...");
  renderTasks();
  renderCourses();
  renderSchedule();
  updateStats();
  setupWeekToggles();

  // Setup new UI listeners
  const btnQuickAdd = document.getElementById('btn-quick-add');
  if (btnQuickAdd) btnQuickAdd.onclick = () => document.getElementById('btn-add-task').click();

  const btnSeeAll = document.getElementById('btn-see-all-tasks');
  if (btnSeeAll) btnSeeAll.onclick = () => switchSection('page-tasks');

  const btnEmptyTask = document.getElementById('btn-add-task-empty');
  if (btnEmptyTask) btnEmptyTask.onclick = () => document.getElementById('btn-add-task').click();

  const btnEmptyGrade = document.getElementById('btn-add-grade-empty');
  if (btnEmptyGrade) btnEmptyGrade.onclick = () => document.getElementById('btn-add-grade').click();

  // Search & Filter Listeners
  const searchTasks = document.getElementById('search-tasks');
  const filterPrio = document.getElementById('filter-priority');
  if (searchTasks) searchTasks.addEventListener('input', renderTasks);
  if (filterPrio) filterPrio.addEventListener('change', renderTasks);

  const searchCourses = document.getElementById('search-courses');
  if (searchCourses) searchCourses.addEventListener('input', renderCourses);

  // Quotes
  const quotes = [
    "Le travail d'aujourd'hui, c'est le succès de demain.",
    "Chaque petit pas t'amène plus loin.",
    "La persévérance est la clé de la réussite.",
    "Crois en toi, et tout devient possible.",
    "Un objectif sans plan n'est qu'un souhait."
  ];
  const quoteEl = document.getElementById('hero-quote-text');
  if (quoteEl) quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  // Charger la police Minecraft
  await loadMinecraftFont();

  // Fermeture des modals au clic sur l'overlay sombre (en dehors du panneau)
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Fermeture des modals avec la touche Échap
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(m => {
        if (m.style.display === 'block' && !m.classList.contains('is-closing')) {
          closeModal(m);
        }
      });
    }
  });

  console.log("[Initialisation] Application prête et opérationnelle !");
});

// SPLASH SCREEN
window.addEventListener('load', () => {
  console.log("[Splash] L'application est chargée. Masquage de l'écran de démarrage dans 5 secondes...");
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('splash-hidden');
      console.log("[Splash] Écran de démarrage masqué.");
    }
  }, 5000);
});

// SAUVEGARDE / CHARGEMENT
async function loadData() {
  console.log("[Stockage] 💾 Chargement des données utilisateur sauvegardées...");
  const saved = await window.storage.load();

  if (saved) {
    console.log("[Stockage] ✓ Données trouvées dans le stockage local.");
    taskList = saved.tasks || [];
    courseList = saved.courses || [];
    userName = saved.userName || "Baptiste Lecuyot";
    appTheme = saved.appTheme || "default";
    gradesList = saved.grades || [];
    archiveList = saved.archives || [];
    if (saved.settings && saved.settings.customTheme) {
      customTheme = saved.settings.customTheme;
    }
    console.log(`[Stockage] ${taskList.length} tâche(s) et ${courseList.length} cours chargés.`);
  } else {
    console.log("[Stockage] ℹ️ Aucune donnée utilisateur existante. Chargement des valeurs par défaut.");
  }

  console.log(`[Stockage] Configuration du profil utilisateur au nom de : "${userName}"`);
  updateUserName(userName);

  console.log(`[Stockage] Application du thème visuel sauvegardé : "${appTheme}"`);
  applyTheme(appTheme);
}

async function saveData() {
  console.log("[Stockage] ⏳ Enregistrement des modifications utilisateur...");
  await window.storage.save({
    tasks: taskList,
    courses: courseList,
    coursesList: coursesList,
    userName: userName,
    appTheme: appTheme,
    grades: gradesList,
    archives: archiveList,
    settings: { customTheme: customTheme }
  });
  console.log("[Stockage] ✓ Sauvegarde réussie des tâches, cours et paramètres.");
}

// NAVIGATION - Transitions animées entre sections
const NAV_LABELS = {
  'page-home': 'Accueil',
  'page-tasks': 'Mes Devoirs',
  'page-courses': 'Cours',
  'page-schedule': 'Planning',
  'page-settings': 'Paramètres'
};

function switchSection(targetId) {
  // Mettre à jour le fil d'Ariane
  const label = NAV_LABELS[targetId] || targetId;
  const breadcrumb = document.getElementById('topbar-title');
  if (breadcrumb) breadcrumb.textContent = label;

  // Cacher toutes les sections, afficher la cible avec animation
  document.querySelectorAll('.content-section').forEach(s => {
    if (s.id === targetId) {
      s.classList.add('is-active');
      s.style.display = 'block';
    } else {
      s.classList.remove('is-active');
      s.style.display = 'none';
    }
  });

  // Rendre le contenu de la section cible
  if (targetId === 'page-courses') renderCourses();
  if (targetId === 'page-tasks') renderTasks();
  if (targetId === 'page-schedule') renderSchedule();
  if (targetId === 'page-home') updateStats();
  if (targetId === 'page-settings') renderSettings();
  if (targetId === 'page-dashboard') renderDashboard();
  if (targetId === 'page-grades') renderGrades();
  if (targetId === 'page-history') renderHistory();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const target = item.getAttribute('data-target');
    console.log(`[Navigation] 📂 Changement d'onglet actif vers : "${target}"`);
    switchSection(target);
  });
});

// GESTION SEMAINE A/B
function setupWeekToggles() {
  document.querySelectorAll('.btn-week').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.btn-week').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewWeek = btn.getAttribute('data-week');
      renderSchedule();
    };
  });
}

// Ouvrir / Fermer modal avec animation et focus automatique
function openModal(modalEl) {
  if (!modalEl) return;
  if (modalEl._closeTimeout) {
    clearTimeout(modalEl._closeTimeout);
    modalEl._closeTimeout = null;
  }

  // Fermer les autres modals pour éviter les superpositions d'overlays bloquants
  document.querySelectorAll('.modal').forEach(m => {
    if (m !== modalEl && m.style.display !== 'none') {
      m.style.display = 'none';
      m.classList.remove('is-closing');
      if (m._closeTimeout) {
        clearTimeout(m._closeTimeout);
        m._closeTimeout = null;
      }
    }
  });

  modalEl.classList.remove('is-closing');
  modalEl.style.display = 'block';

  // Désélectionner le bouton cliqué pour éviter de capturer les frappes clavier
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }

  // Donner immédiatement le focus au premier champ texte pour pouvoir taper directement
  setTimeout(() => {
    const firstInput = modalEl.querySelector('input:not([type="hidden"]):not([disabled]):not([type="color"]):not([type="checkbox"]), textarea:not([disabled]), select:not([disabled])');
    if (firstInput) {
      firstInput.focus();
      if (typeof firstInput.select === 'function' && firstInput.type === 'text') {
        firstInput.select();
      }
    }
  }, 60);
}

function closeModal(modalEl) {
  if (!modalEl) return;
  if (modalEl._closeTimeout) {
    clearTimeout(modalEl._closeTimeout);
  }
  modalEl.classList.add('is-closing');
  // Attendre la fin de l'animation CSS avant de masquer l'élément
  const dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-normal')) || 250;
  modalEl._closeTimeout = setTimeout(() => {
    modalEl.style.display = 'none';
    modalEl.classList.remove('is-closing');
    modalEl._closeTimeout = null;
  }, dur);
}

// DEVOIRS (TASKS)
const taskForm = document.getElementById('form-task');
const taskModal = document.getElementById('modal-overlay');
// ATTACHMENTS & SUBTASKS VARIABLES
let currentSubtasks = [];
let currentAttachments = [];

// Handle subtasks
document.getElementById('btn-add-subtask').onclick = () => {
  const input = document.getElementById('in-subtask');
  if (input.value.trim()) {
    currentSubtasks.push({ title: input.value.trim(), done: false });
    input.value = '';
    renderSubtasksInput();
  }
};
function renderSubtasksInput() {
  const container = document.getElementById('subtasks-container');
  container.innerHTML = currentSubtasks.map((st, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-hover); padding: 6px 10px; margin-bottom: 6px; border-radius: 6px;">
            <span>${st.title}</span>
            <button type="button" class="btn-icon danger" style="width: 24px; height: 24px;" onclick="currentSubtasks.splice(${i}, 1); renderSubtasksInput();"><i class="ph ph-x"></i></button>
        </div>
    `).join('');
}

// Handle Drag & Drop
const dropzone = document.getElementById('attachments-dropzone');
const fileInput = document.getElementById('in-attachments');
dropzone.onclick = () => fileInput.click();
dropzone.ondragover = (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--primary)'; };
dropzone.ondragleave = () => dropzone.style.borderColor = 'var(--border-color)';
dropzone.ondrop = async (e) => {
  e.preventDefault();
  dropzone.style.borderColor = 'var(--border-color)';
  handleFiles(e.dataTransfer.files);
};
fileInput.onchange = (e) => handleFiles(e.target.files);

async function handleFiles(files) {
  for (let f of files) {
    const res = await window.storage.saveAttachment({ filePath: f.path, fileName: f.name });
    if (res.success) {
      currentAttachments.push({ name: res.fileName, path: res.path });
      renderAttachmentsInput();
    } else {
      alert("Erreur lors de l'ajout de la pièce jointe: " + res.error);
    }
  }
}
function renderAttachmentsInput() {
  const list = document.getElementById('attachments-list');
  list.innerHTML = currentAttachments.map((att, i) => `
        <li style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-hover); padding: 6px 10px; margin-top: 6px; border-radius: 6px;">
            <span style="font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📄 ${att.name}</span>
            <button type="button" class="btn-icon danger" style="width: 24px; height: 24px;" onclick="currentAttachments.splice(${i}, 1); renderAttachmentsInput();"><i class="ph ph-x"></i></button>
        </li>
    `).join('');
}

document.getElementById('btn-add-task').onclick = () => {
  currentSubtasks = [];
  currentAttachments = [];
  renderSubtasksInput();
  renderAttachmentsInput();
  taskForm.reset();
  openModal(taskModal);
};
document.getElementById('btn-close-modal').onclick = () => closeModal(taskModal);
document.getElementById('btn-close-pdf').onclick = () => closeModal(document.getElementById('modal-pdf'));

taskForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('in-title').value;
  console.log(`[Devoirs] 📝 Ajout d'un nouveau devoir : "${title}"`);
  taskList.push({
    id: Date.now(),
    title: title,
    subject: document.getElementById('in-subject-task').value,
    type: document.getElementById('in-type').value,
    priority: document.getElementById('in-priority').value,
    date: document.getElementById('in-date').value,
    time: document.getElementById('in-time').value,
    desc: document.getElementById('in-desc').value,
    subtasks: [...currentSubtasks],
    attachments: [...currentAttachments],
    completed: false
  });
  await saveData();
  renderTasks();
  updateStats();
  taskForm.reset();
  closeModal(taskModal);
  console.log(`[Devoirs] ✓ Devoir "${title}" enregistré et affiché.`);
};

function renderTasks() {
  const container = document.getElementById('tasks-container');
  const emptyState = document.getElementById('empty-tasks');
  if (!container) return;
  container.innerHTML = '';

  const searchTerm = (document.getElementById('search-tasks')?.value || '').toLowerCase();
  const filterPrio = document.getElementById('filter-priority')?.value || '';

  let filteredTasks = taskList.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm) || t.subject.toLowerCase().includes(searchTerm);
    const matchPrio = filterPrio ? t.priority === filterPrio : true;
    return matchSearch && matchPrio;
  });

  if (filteredTasks.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    container.style.display = 'none';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
  }

  // Sort tasks: Incomplete first, then priority, then date
  const priorityOrder = { 'Haute': 0, 'Normale': 1, 'Basse': 2 };

  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    const pA = priorityOrder[a.priority || 'Normale'];
    const pB = priorityOrder[b.priority || 'Normale'];
    if (pA !== pB) return pA - pB;

    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  })
    .forEach(t => {
      const typeStr = t.type || 'Exercice';
      const typeClass = typeStr.toLowerCase().replace('é', 'e');
      const priorityStr = t.priority || 'Normale';
      const priorityClass = priorityStr.toLowerCase();

      const div = document.createElement('div');
      div.className = `task-card ${t.completed ? 'completed' : ''} priority-${priorityClass}`;
      div.innerHTML = `
            <div class="task-header">
                <div class="task-badges">
                    <span class="task-badge">${t.subject}</span>
                    <span class="badge-type ${typeClass}">${typeStr}</span>
                </div>
                <div class="task-actions">
                    <input type="checkbox" class="custom-checkbox" ${t.completed ? 'checked' : ''} title="Marquer comme terminé">
                    <button class="btn-icon danger btn-del" title="Supprimer"><i class="ph ph-trash"></i></button>
                </div>
            </div>
            <div class="task-title">${t.title}</div>
            <div class="task-desc">${t.desc || 'Aucune description...'}</div>
            
            ${t.subtasks && t.subtasks.length > 0 ? `
                <div class="task-subtasks" style="margin-bottom: 12px;">
                    ${t.subtasks.map((st, i) => `
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; color: ${st.done ? 'var(--text-muted)' : 'var(--text-main)'}; text-decoration: ${st.done ? 'line-through' : 'none'};">
                            <input type="checkbox" ${st.done ? 'checked' : ''} onchange="toggleSubtask(${t.id}, ${i})"> ${st.title}
                        </label>
                    `).join('')}
                    <div style="width: 100%; height: 4px; background: var(--bg-hover); margin-top: 6px; border-radius: 2px;">
                        <div style="height: 100%; background: var(--primary); border-radius: 2px; width: ${Math.round((t.subtasks.filter(s => s.done).length / t.subtasks.length) * 100)}%;"></div>
                    </div>
                </div>
            ` : ''}

            ${t.attachments && t.attachments.length > 0 ? `
                <div class="task-attachments" style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px;" data-task-id="${t.id}">
                    ${t.attachments.map((att, attIdx) => `
                        <button class="btn btn-secondary btn-attachment" style="padding: 4px 8px; font-size: 0.8rem; height: auto;" data-att-index="${attIdx}" data-task-id="${t.id}">
                            <i class="ph ph-paperclip"></i> ${att.name}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="task-footer">
                <div class="task-date"><i class="ph ph-calendar-blank"></i> ${t.date} à ${t.time}</div>
            </div>`;
      div.querySelector('input').onchange = async () => {
        t.completed = !t.completed;

        if (t.completed && appTheme === 'minecraft') {
          try {
            const audio = new Audio('assets/minecraft_xp.mp3');
            audio.volume = 0.5;
            audio.play();
          } catch (e) { }
        }

        if (t.completed) {
          div.classList.add('is-removing');
          setTimeout(async () => {
            taskList = taskList.filter(x => x.id !== t.id);
            t.status = 'archived';
            t.archivedAt = new Date().toISOString();
            archiveList.push(t);
            await saveData();
            renderTasks();
            updateStats();
            if (typeof renderHistory === 'function') renderHistory();
          }, 800);
        } else {
          await saveData();
          updateStats();
          renderTasks();
        }
      };
      // Suppression animée : on joue d'abord cardExit, PUIS on retire du DOM
      div.querySelector('.btn-del').onclick = async () => {
        div.classList.add('is-removing');
        const dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-normal')) || 250;
        await new Promise(r => setTimeout(r, dur));
        taskList = taskList.filter(x => x.id !== t.id);
        await saveData();
        renderTasks();
        updateStats();
      };
      // Pièces jointes : assignation programmatique (sécurité, évite les injections)
      div.querySelectorAll('.btn-attachment').forEach(btn => {
        btn.onclick = () => {
          const attIdx = parseInt(btn.getAttribute('data-att-index'));
          if (t.attachments && t.attachments[attIdx]) {
            window.storage.openAttachment(t.attachments[attIdx].path);
          }
        };
      });
      container.appendChild(div);
    });
}

window.toggleSubtask = async (taskId, subtaskIndex) => {
  const t = taskList.find(x => x.id === taskId);
  if (t && t.subtasks && t.subtasks[subtaskIndex]) {
    t.subtasks[subtaskIndex].done = !t.subtasks[subtaskIndex].done;
    await saveData();
    renderTasks();
  }
};

// COURS (COURSES) - La version complète avec ouverture PDF se trouve plus bas (ligne ~1140)

function openPDF(pdfPath) {
  const pdfModal = document.getElementById('modal-pdf');
  const pdfViewer = document.getElementById('pdf-viewer');
  const pdfTitle = document.getElementById('pdf-title');

  const folderPath = 'Cours/' + pdfPath;
  const fileName = pdfPath.split('/').pop();

  console.log('Ouverture du PDF :', folderPath);

  // Récupérer le PDF via IPC
  window.storage.loadPDF(folderPath).then(base64Data => {
    if (!base64Data) {
      alert('Impossible d\'ouvrir le fichier PDF. Vérifiez que le fichier existe.');
      return;
    }

    pdfTitle.textContent = fileName;
    pdfViewer.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:20px;">📄 Chargement du PDF...</div>';

    // Convertir base64 en Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Utiliser pdfjs-dist pour afficher le PDF
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.getDocument(bytes).promise.then(async pdf => {
      console.log('PDF chargé, pages:', pdf.numPages);

      pdfViewer.innerHTML = ''; // Effacer le message de chargement

      const numPages = pdf.numPages;
      const scale = 1.3;

      // Charger les pages progressivement (optimisation)
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        // Créer un conteneur pour chaque page
        const pageContainer = document.createElement('div');
        pageContainer.className = 'pdf-page-container';
        pageContainer.style.marginBottom = '20px';
        pageContainer.style.textAlign = 'center';
        pageContainer.style.position = 'relative';

        // Numéro de page (cliquable pour zoom)
        const pageLabel = document.createElement('div');
        pageLabel.style.color = 'var(--text-dim)';
        pageLabel.style.fontSize = '0.9rem';
        pageLabel.style.marginBottom = '10px';
        pageLabel.style.cursor = 'pointer';
        pageLabel.style.transition = 'color 0.3s';
        pageLabel.textContent = `📄 Page ${pageNum} / ${numPages} - Cliquez pour zoomer`;
        pageLabel.onmouseover = () => pageLabel.style.color = 'var(--primary)';
        pageLabel.onmouseout = () => pageLabel.style.color = 'var(--text-dim)';
        pageContainer.appendChild(pageLabel);

        pdfViewer.appendChild(pageContainer);

        // Charger la page de manière asynchrone
        try {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.border = '1px solid rgba(99, 102, 241, 0.2)';
          canvas.style.borderRadius = '8px';
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.cursor = 'zoom-in';
          canvas.style.transition = 'transform 0.3s';

          // Effet hover
          canvas.onmouseover = () => canvas.style.transform = 'scale(1.02)';
          canvas.onmouseout = () => canvas.style.transform = 'scale(1)';

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Ajouter l'événement de zoom au clic
          canvas.onclick = () => zoomPage(canvas, pageNum, numPages);
          pageLabel.onclick = () => zoomPage(canvas, pageNum, numPages);

          pageContainer.appendChild(canvas);
        } catch (err) {
          console.error('Erreur au chargement de la page', pageNum, ':', err);
          pageContainer.innerHTML += '<p style="color:var(--urgent)">❌ Erreur de chargement</p>';
        }
      }
    }).catch(err => {
      console.error('Erreur au chargement du PDF:', err);
      pdfViewer.innerHTML = '<p style="color:var(--urgent); text-align:center; padding:20px;">❌ Erreur lors du chargement du PDF</p>';
    });

    pdfModal.style.display = 'block';
  }).catch(err => {
    console.error('Erreur:', err);
    alert('Erreur lors de l\'ouverture du PDF');
  });
}

// Fonction pour zoomer sur une page
function zoomPage(canvas, pageNum, totalPages) {
  // Créer l'overlay de zoom
  const zoomOverlay = document.createElement('div');
  zoomOverlay.id = 'zoom-overlay';
  zoomOverlay.style.position = 'fixed';
  zoomOverlay.style.top = '0';
  zoomOverlay.style.left = '0';
  zoomOverlay.style.width = '100%';
  zoomOverlay.style.height = '100%';
  zoomOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
  zoomOverlay.style.zIndex = '10000';
  zoomOverlay.style.display = 'flex';
  zoomOverlay.style.flexDirection = 'column';
  zoomOverlay.style.alignItems = 'center';
  zoomOverlay.style.justifyContent = 'center';
  zoomOverlay.style.padding = '20px';
  zoomOverlay.style.animation = 'fadeIn 0.3s ease';

  // Header avec titre et bouton fermer
  const header = document.createElement('div');
  header.style.position = 'absolute';
  header.style.top = '20px';
  header.style.left = '0';
  header.style.right = '0';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.padding = '0 40px';
  header.style.color = 'var(--text-main)';

  const pageInfo = document.createElement('div');
  pageInfo.style.fontSize = '1.2rem';
  pageInfo.style.fontWeight = '600';
  pageInfo.textContent = `Page ${pageNum} / ${totalPages}`;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.background = 'var(--urgent)';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.width = '50px';
  closeBtn.style.height = '50px';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.transition = 'transform 0.2s, background 0.2s';
  closeBtn.onmouseover = () => {
    closeBtn.style.transform = 'scale(1.1)';
    closeBtn.style.background = '#dc2626';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.transform = 'scale(1)';
    closeBtn.style.background = 'var(--urgent)';
  };
  // Le bouton de fermeture sera connecté via closeZoom() défini plus bas
  header.appendChild(pageInfo);
  header.appendChild(closeBtn);

  // Canvas zoomé - COPIER le contenu au lieu de cloner
  const zoomedCanvas = document.createElement('canvas');
  zoomedCanvas.width = canvas.width;
  zoomedCanvas.height = canvas.height;

  // Copier le contenu du canvas original
  const ctx = zoomedCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0);

  // Styles pour le canvas zoomé
  zoomedCanvas.style.maxWidth = '90%';
  zoomedCanvas.style.maxHeight = '80vh';
  zoomedCanvas.style.width = 'auto';
  zoomedCanvas.style.height = 'auto';
  zoomedCanvas.style.border = '2px solid var(--primary)';
  zoomedCanvas.style.borderRadius = '12px';
  zoomedCanvas.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5)';
  zoomedCanvas.style.cursor = 'default';
  zoomedCanvas.style.animation = 'zoomIn 0.3s ease';

  zoomOverlay.appendChild(header);
  zoomOverlay.appendChild(zoomedCanvas);

  // Fonction centralisée de fermeture pour éviter la fuite mémoire
  function closeZoom() {
    if (document.body.contains(zoomOverlay)) {
      document.body.removeChild(zoomOverlay);
    }
    document.removeEventListener('keydown', escapeHandler);
  }

  // Fermer avec la touche Échap
  const escapeHandler = (e) => {
    if (e.key === 'Escape') closeZoom();
  };
  document.addEventListener('keydown', escapeHandler);

  // Mettre à jour les autres boutons de fermeture pour utiliser closeZoom
  closeBtn.onclick = () => closeZoom();
  zoomOverlay.onclick = (e) => { if (e.target === zoomOverlay) closeZoom(); };

  document.body.appendChild(zoomOverlay);
}

// PLANNING (COURS)
const courseForm = document.getElementById('form-course');
const courseModal = document.getElementById('modal-course');

document.getElementById('btn-add-course').onclick = () => {
  editingCourseId = null;
  courseForm.reset();
  document.getElementById('c-week').value = currentViewWeek;
  courseModal.querySelector('h3').innerText = "Nouveau cours";
  openModal(courseModal);
};

document.getElementById('btn-close-course').onclick = () => closeModal(courseModal);

courseForm.onsubmit = async (e) => {
  e.preventDefault();
  const data = {
    subject: document.getElementById('c-subject').value,
    day: parseInt(document.getElementById('c-day').value),
    week: document.getElementById('c-week').value, // On récupère la semaine
    start: document.getElementById('c-start').value,
    end: document.getElementById('c-end').value,
    color: document.getElementById('c-color').value,
    room: document.getElementById('c-room').value,
    prof: document.getElementById('c-prof').value
  };

  if (editingCourseId) {
    const idx = courseList.findIndex(c => c.id === editingCourseId);
    courseList[idx] = { ...courseList[idx], ...data };
  } else {
    courseList.push({ id: Date.now(), ...data });
  }

  await saveData();
  renderSchedule();
  closeModal(courseModal);
};

function renderSchedule() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  days.forEach((day, i) => {
    const col = document.createElement('div');
    col.className = 'day-column';
    col.innerHTML = `<h4>${day}</h4>`;

    // Filtrer par jour ET par semaine (A, B ou les deux)
    courseList.filter(c => c.day === i && (c.week === currentViewWeek || c.week === 'both')).forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.style.borderLeftColor = c.color;
      card.innerHTML = `
                <div class="course-actions">
                    <button class="edit-course-btn"><i class="ph ph-pencil-simple"></i></button>
                    <button class="delete-course-btn danger"><i class="ph ph-trash"></i></button>
                </div>
                <span class="course-subject">${c.subject}</span>
                <span class="course-time"><i class="ph ph-clock"></i> ${c.start} - ${c.end}</span>
                ${c.room ? `<span class="course-room"><i class="ph ph-door"></i> ${c.room}</span>` : ''}`;

      card.querySelector('.delete-course-btn').onclick = async () => {
        if (confirm("Supprimer ce cours ?")) { courseList = courseList.filter(x => x.id !== c.id); await saveData(); renderSchedule(); }
      };
      card.querySelector('.edit-course-btn').onclick = () => {
        editingCourseId = c.id;
        document.getElementById('c-subject').value = c.subject;
        document.getElementById('c-day').value = c.day;
        document.getElementById('c-week').value = c.week;
        document.getElementById('c-start').value = c.start;
        document.getElementById('c-end').value = c.end;
        document.getElementById('c-color').value = c.color;
        document.getElementById('c-room').value = c.room || '';
        document.getElementById('c-prof').value = c.prof || '';
        courseModal.querySelector('h3').innerText = "Modifier le cours";
        courseModal.style.display = 'block';
      };
      col.appendChild(card);
    });
    grid.appendChild(col);
  });
}

function updateStats() {
  const activeTasks = taskList.filter(t => !t.completed);
  const pending = activeTasks.length;
  const done = archiveList.length;
  const urgentCount = activeTasks.filter(t => t.priority === 'Haute').length;
  const total = pending + done;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  if (document.getElementById('count-total')) document.getElementById('count-total').innerText = pending;
  if (document.getElementById('count-urgent')) document.getElementById('count-urgent').innerText = urgentCount;
  if (document.getElementById('count-done')) document.getElementById('count-done').innerText = done;
  if (document.getElementById('count-progress')) document.getElementById('count-progress').innerText = percent + "%";
  if (document.getElementById('stat-progress-bar')) document.getElementById('stat-progress-bar').style.width = percent + "%";

  // Render home preview tasks
  const previewContainer = document.getElementById('home-tasks-preview');
  if (previewContainer) {
    const upcoming = [...activeTasks]
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 3);

    if (upcoming.length === 0) {
      previewContainer.innerHTML = '<div class="home-empty-msg">Aucun devoir à venir. Repose-toi bien !</div>';
    } else {
      previewContainer.innerHTML = upcoming.map(t => {
        const pClass = (t.priority || 'Normale').toLowerCase();
        const isOverdue = new Date(`${t.date}T${t.time}`) < new Date();
        return `
                  <div class="home-task-row" onclick="switchSection('page-tasks');">
                      <div class="home-task-priority-dot ${pClass}"></div>
                      <div class="home-task-info">
                          <span class="home-task-title">${t.title}</span>
                          <span class="home-task-subject">${t.subject}</span>
                      </div>
                      <div class="home-task-date ${isOverdue ? 'overdue' : ''}">
                          <i class="ph ph-clock"></i> ${t.date}
                      </div>
                  </div>
              `;
      }).join('');
    }
  }

  updateSidebarBadges();
  if (typeof renderDashboard === 'function') renderDashboard();
}

const btnSave = document.getElementById('btn-save');
if (btnSave) {
  btnSave.onclick = async (e) => {
    if (e && e.currentTarget && typeof e.currentTarget.blur === 'function') {
      e.currentTarget.blur();
    }
    await saveData();
    showToast("Données sauvegardées avec succès !", "success");
  };
}

// --- NOUVELLES FONCTIONS UI ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'warning-circle';
  if (type === 'warning') icon = 'warning';

  toast.innerHTML = `
        <i class="ph ph-${icon} toast-icon"></i>
        <span class="toast-msg">${message}</span>
    `;

  toast.onclick = () => {
    toast.classList.add('is-hiding');
    setTimeout(() => toast.remove(), 300);
  };

  container.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add('is-hiding');
      setTimeout(() => toast.remove(), 300);
    }
  }, type === 'error' ? 4000 : 3000);
}

function updateSidebarBadges() {
  const pendingTasks = taskList.filter(t => !t.completed).length;
  const badgeTasks = document.getElementById('badge-tasks');
  if (badgeTasks) {
    badgeTasks.style.display = pendingTasks > 0 ? 'inline-block' : 'none';
    badgeTasks.textContent = pendingTasks;
  }

  const recentGrades = gradesList.length > 0 ? gradesList.filter(g => {
    if (!g.date) return false;
    const diffTime = Math.abs(new Date() - new Date(g.date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
  }).length : 0;

  const badgeGrades = document.getElementById('badge-grades');
  if (badgeGrades) {
    badgeGrades.style.display = recentGrades > 0 ? 'inline-block' : 'none';
    badgeGrades.textContent = recentGrades;
  }
}

// COURS (COURSES)
function renderCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  console.log('renderCourses appelé, coursesList:', coursesList);
  container.innerHTML = '';

  const searchTerm = (document.getElementById('search-courses')?.value || '').toLowerCase();

  if (!coursesList || coursesList.length === 0) {
    container.innerHTML = '<p style="color: var(--text-dim);">Aucun cours disponible</p>';
    return;
  }

  // Filtrer les cours par recherche
  const filteredCoursesList = coursesList.map(subject => ({
    ...subject,
    courses: subject.courses.filter(c =>
      c.title.toLowerCase().includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm) ||
      subject.subject.toLowerCase().includes(searchTerm)
    )
  })).filter(subject => subject.courses.length > 0);

  if (filteredCoursesList.length === 0) {
    container.innerHTML = '<p style="color: var(--text-dim); padding: 40px; text-align: center;">Aucun cours trouvé pour cette recherche.</p>';
    return;
  }

  filteredCoursesList.forEach(subject => {
    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subject-section';
    subjectDiv.innerHTML = `<h3>${subject.icon} ${subject.subject}</h3>`;

    const coursesGrid = document.createElement('div');
    coursesGrid.className = 'courses-grid';

    subject.courses.forEach(course => {
      const courseCard = document.createElement('div');
      courseCard.className = 'course-item-card';
      courseCard.innerHTML = `
                <div class="course-card-header">
                    <h4>${course.title}</h4>
                </div>
                <div class="course-card-body">
                    <p>${course.description}</p>
                    <small><i class="ph ph-calendar-blank"></i> ${course.date}</small>
                </div>
                <div class="course-card-footer">
                    <a href="#" class="btn btn-primary btn-small btn-open-pdf" data-pdf="${course.pdf}">
                        <i class="ph ph-file-pdf"></i> Ouvrir PDF
                    </a>
                    <a href="#" class="btn btn-secondary btn-small" onclick="downloadPDFFile('Cours/${course.pdf}'); return false;">
                        <i class="ph ph-download-simple"></i>
                    </a>
                </div>
            `;
      coursesGrid.appendChild(courseCard);
    });

    subjectDiv.appendChild(coursesGrid);
    container.appendChild(subjectDiv);
  });

  // Ajouter les événements pour les boutons "Ouvrir PDF"
  document.querySelectorAll('.btn-open-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfPath = btn.getAttribute('data-pdf');
      handlePDFClick(pdfPath);
    });
  });
}

// Fonction pour gérer le clic sur "Ouvrir PDF" avec choix
function handlePDFClick(pdfPath) {
  // Créer une boîte de dialogue personnalisée
  const choice = confirm(
    "Comment voulez-vous ouvrir ce PDF ?\n\n" +
    "✅ OK = Ouvrir dans la visionneuse intégrée\n" +
    "❌ Annuler = Ouvrir avec l'application par défaut"
  );

  if (choice) {
    // Ouvrir dans la visionneuse intégrée
    openPDF(pdfPath);
  } else {
    // Ouvrir avec l'application externe
    openExternalPDF('Cours/' + pdfPath);
  }
}

// Ouvre le PDF avec l'application par défaut et gère l'erreur
function openExternalPDF(pdfPath) {
  window.storage.openPDF(pdfPath).then(result => {
    if (!result) {
      // Si l'ouverture échoue, proposer le téléchargement
      const response = confirm("Impossible d'ouvrir le PDF. Voulez-vous le télécharger dans votre dossier 'Téléchargements' ?");
      if (response) {
        downloadPDFFile(pdfPath);
      }
    }
  }).catch(err => {
    console.error('Erreur openExternalPDF:', err);
    alert("Erreur lors de l'ouverture du PDF.");
  });
}

// Télécharge le PDF dans le dossier Téléchargements
function downloadPDFFile(pdfPath) {
  window.storage.downloadPDF(pdfPath).then(result => {
    if (result.success) {
      alert("✓ PDF téléchargé avec succès !\n" + result.message);
    } else {
      alert("✗ Erreur : " + result.message);
    }
  }).catch(err => {
    console.error('Erreur downloadPDF:', err);
    alert("Erreur lors du téléchargement du PDF.");
  });
}

// PARAMÈTRES (SETTINGS) & IMPORT/EXPORT
function renderSettings() {
  document.getElementById('setting-username').value = userName;
  document.getElementById('setting-theme').value = appTheme;
}

document.getElementById('setting-username').addEventListener('input', (e) => {
  userName = e.target.value;
  updateUserName(userName);
  saveData();
});

document.getElementById('setting-theme').addEventListener('change', (e) => {
  appTheme = e.target.value;
  applyTheme(appTheme);
  saveData();
});

function applyTheme(theme) {
  console.log(`[Thème] 🎨 Tentative d'application du thème visuel : "${theme}"...`);
  document.body.removeAttribute('data-theme');
  const customBuilder = document.getElementById('custom-theme-builder');
  if (customBuilder) customBuilder.style.display = theme === 'custom' ? 'block' : 'none';

  if (theme === 'minecraft') {
    document.body.setAttribute('data-theme', 'minecraft');
    console.log("[Thème] 🧱 Thème Minecraft activé ! Chargement de la police d'écriture pixelisée...");
    loadMinecraftFont();
  } else if (theme === 'apple') {
    document.body.setAttribute('data-theme', 'apple');
    console.log("[Thème] 🍎 Thème Apple Glassmorphic activé ! Application des transparences iOS 26.");
  } else if (theme === 'custom') {
    document.documentElement.style.setProperty('--primary', customTheme.primary);
    document.documentElement.style.setProperty('--accent', customTheme.accent);
    document.documentElement.style.setProperty('--bg-main', customTheme.bg);
    document.documentElement.style.setProperty('--bg-card', customTheme.card);
  } else {
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--bg-main');
    document.documentElement.style.removeProperty('--bg-card');
    console.log("[Thème] ✨ Thème par défaut activé.");
  }

  // Loguer la police finale en cours d'utilisation
  const computedFont = window.getComputedStyle(document.body).fontFamily;
  console.log(`[Thème] ℹ️ Police d'écriture active sur l'application : ${computedFont}`);
}

['primary', 'accent', 'bg', 'card'].forEach(key => {
  const el = document.getElementById(`theme-color-${key}`);
  if (el) {
    el.value = customTheme[key] || '#000000';
    el.addEventListener('input', (e) => {
      customTheme[key] = e.target.value;
      if (appTheme === 'custom') {
        applyTheme('custom');
      }
      saveData();
    });
  }
});

function updateUserName(name) {
  const displayElement = document.getElementById('display-name');
  if (displayElement) displayElement.textContent = name;

  const footerElement = document.getElementById('footer-name');
  if (footerElement) footerElement.textContent = name;
}

document.getElementById('btn-export-data').addEventListener('click', async () => {
  const result = await window.storage.exportData();
  if (result && result.success) {
    alert('Données exportées avec succès vers : ' + result.path);
  } else if (result && result.error) {
    alert("Erreur lors de l'export : " + result.error);
  }
});

document.getElementById('btn-import-data').addEventListener('click', async () => {
  const result = await window.storage.importData();
  if (result && result.success) {
    alert("Données importées avec succès. L'application va se mettre à jour.");
    await loadData();
    renderTasks();
    renderCourses();
    renderSchedule();
    if (typeof updateStats === 'function') updateStats();
    renderSettings();
  } else if (result && result.error) {
    alert("Erreur lors de l'import : " + result.error);
  }
});

document.getElementById('btn-export-ics').addEventListener('click', async () => {
  const events = [];
  taskList.forEach(t => {
    if (!t.date || !t.time) return;
    const [year, month, day] = t.date.split('-').map(Number);
    const [hour, minute] = t.time.split(':').map(Number);
    events.push({
      title: `[Devoir] ${t.title}`,
      description: t.desc || '',
      start: [year, month, day, hour, minute],
      duration: { hours: 1 }
    });
  });

  if (events.length === 0) {
    alert("Aucun devoir avec date et heure valide n'a été trouvé.");
    return;
  }

  const result = await window.storage.exportICS(events);
  if (result && result.success) {
    alert('Calendrier exporté avec succès vers : ' + result.path);
  } else if (result && result.error) {
    alert("Erreur lors de l'export ICS : " + result.error);
  }
});

document.getElementById('btn-import-ics').addEventListener('click', () => {
  document.getElementById('in-import-ics-file').click();
});

document.getElementById('in-import-ics-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const text = event.target.result;

    // ----------------------------------------------------------------
    // Parse du format ICS (unfold les longues lignes ICS d'abord)
    // ----------------------------------------------------------------
    const rawLines = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
    const events = [];
    let current = null;

    for (const line of rawLines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        current = {};
      } else if (line.startsWith('END:VEVENT') && current) {
        events.push(current);
        current = null;
      } else if (current) {
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) continue;
        const key = line.substring(0, colonIdx).toUpperCase();
        const val = line.substring(colonIdx + 1).trim();
        // Clés avec paramètres (ex: DTSTART;TZID=Europe/Paris:...)
        const baseKey = key.split(';')[0];
        current[baseKey] = val;
      }
    }

    // ----------------------------------------------------------------
    // Mots-clés à ignorer (non-cours)
    // ----------------------------------------------------------------
    const IGNORED_KEYWORDS = ['ETUDE', 'REPAS', 'DEVOIRS', 'PERMANENCE', 'VIE DE CLASSE', 'PAUSE'];

    // ----------------------------------------------------------------
    // Convertir une date ICS en objet Date JavaScript (UTC si Z, local sinon)
    // ----------------------------------------------------------------
    function parseICSDate(str) {
      if (!str) return null;
      const m = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
      if (!m) return null;
      if (m[7] === 'Z') {
        return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
      } else {
        return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
      }
    }

    // ----------------------------------------------------------------
    // Convertir Date → HH:mm en heure de Paris
    // ----------------------------------------------------------------
    function toParisTime(d) {
      return d.toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }

    // ----------------------------------------------------------------
    // Jour de la semaine en heure de Paris (0=Lundi … 6=Dimanche)
    // ----------------------------------------------------------------
    function toParisDayIndex(d) {
      const weekday = d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short' });
      const map = { 'lun.': 0, 'mar.': 1, 'mer.': 2, 'jeu.': 3, 'ven.': 4, 'sam.': 5, 'dim.': 6 };
      return map[weekday] ?? 7;
    }

    // ----------------------------------------------------------------
    // Numéro de semaine ISO (commence lundi)
    // ----------------------------------------------------------------
    function isoWeek(d) {
      const localStr = d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' });
      const [day2, month2, year2] = localStr.split('/').map(Number);
      const target = new Date(year2, month2 - 1, day2);
      const dayOfWeek = (target.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayOfWeek + 3);
      const firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000);
    }

    // ----------------------------------------------------------------
    // Palette de couleurs automatique par matière
    // ----------------------------------------------------------------
    const COLOR_PALETTE = [
      '#818cf8', '#c084fc', '#34d399', '#fb7185', '#60a5fa',
      '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4',
      '#84cc16', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ];
    const subjectColors = {};
    let colorIdx = 0;
    function getColorForSubject(subj) {
      if (!subjectColors[subj]) {
        subjectColors[subj] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
        colorIdx++;
      }
      return subjectColors[subj];
    }

    // ----------------------------------------------------------------
    // Regroupement des événements en créneaux hebdomadaires uniques
    // ----------------------------------------------------------------
    const slotMap = new Map();

    for (const ev of events) {
      const summary = (ev['SUMMARY'] || '').trim();
      if (!summary) continue;

      // Ignorer les événements parasites
      if (IGNORED_KEYWORDS.some(kw => summary.toUpperCase().includes(kw))) continue;

      const startD = parseICSDate(ev['DTSTART']);
      const endD = parseICSDate(ev['DTEND']);
      if (!startD || !endD) continue;

      const dayIdx = toParisDayIndex(startD);
      if (dayIdx > 4) continue; // Ignorer samedi et dimanche

      const startTime = toParisTime(startD);
      const endTime = toParisTime(endD);

      // Ignorer les plages journalières (00:01 – 23:59)
      if (startTime === '00:01' || endTime === '23:59' || startTime === '00:00') continue;

      const room = (ev['LOCATION'] || '').trim();
      // Extraire le prof depuis DESCRIPTION (format "NOM P. - CLASSE")
      const descRaw = (ev['DESCRIPTION'] || '').trim();
      const prof = descRaw.replace(/\s*-\s*\d?[A-Z]{1,4}\d+[A-Z]*\s*$/, '').trim();

      const week = isoWeek(startD);
      const key = `${dayIdx}|${startTime}-${endTime}|${summary}`;

      if (!slotMap.has(key)) {
        slotMap.set(key, { day: dayIdx, start: startTime, end: endTime, subject: summary, room, prof, oddCount: 0, evenCount: 0 });
      }
      const slot = slotMap.get(key);
      if (week % 2 !== 0) slot.oddCount++; else slot.evenCount++;
    }

    if (slotMap.size === 0) {
      showToast("Aucun cours valide trouvé dans l'ICS.", 'error');
      e.target.value = '';
      return;
    }

    // ----------------------------------------------------------------
    // Détection semaine A / B / les deux
    // Convention : semaine A = semaine ISO impaire
    // ----------------------------------------------------------------
    let importedCount = 0;
    for (const slot of slotMap.values()) {
      let weekType = 'both';
      if (slot.oddCount > 0 && slot.evenCount === 0) weekType = 'A';
      else if (slot.evenCount > 0 && slot.oddCount === 0) weekType = 'B';

      courseList.push({
        id: Date.now() + Math.random(),
        subject: slot.subject,
        day: slot.day,
        week: weekType,
        start: slot.start,
        end: slot.end,
        room: slot.room || '',
        prof: slot.prof || '',
        color: getColorForSubject(slot.subject)
      });
      importedCount++;
    }

    if (importedCount > 0) {
      await saveData();
      renderSchedule();
      showToast(`✅ ${importedCount} créneaux importés (${events.length} occurrences regroupées)`, 'success');
    } else {
      showToast("Aucun cours valide trouvé dans l'ICS.", 'error');
    }

    // Reset l'input pour pouvoir réimporter le même fichier
    e.target.value = '';
  };
  reader.readAsText(file);
});

let chartSubjectsInstance = null;
let chartCompletionInstance = null;

function renderDashboard() {
  if (typeof Chart === 'undefined') return;

  const subjects = {};
  taskList.forEach(t => {
    subjects[t.subject] = (subjects[t.subject] || 0) + 1;
  });

  const ctxSub = document.getElementById('chart-subjects').getContext('2d');
  if (chartSubjectsInstance) chartSubjectsInstance.destroy();
  chartSubjectsInstance = new Chart(ctxSub, {
    type: 'pie',
    data: {
      labels: Object.keys(subjects),
      datasets: [{
        data: Object.values(subjects),
        backgroundColor: ['#818cf8', '#c084fc', '#34d399', '#fb7185', '#60a5fa']
      }]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
  });

  const completed = archiveList.length;
  const pending = taskList.length;

  const ctxComp = document.getElementById('chart-completion').getContext('2d');
  if (chartCompletionInstance) chartCompletionInstance.destroy();
  chartCompletionInstance = new Chart(ctxComp, {
    type: 'doughnut',
    data: {
      labels: ['Terminé (Archivé)', 'À faire'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#34d399', '#fb7185']
      }]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
  });
}


// ==========================================
// CARNET DE NOTES
// ==========================================
const gradeModal = document.getElementById('modal-grade');
const gradeForm = document.getElementById('form-grade');
let editingGradeId = null;
let chartGradesInstance = null;

// Ouvrir le modal d'ajout
document.getElementById('btn-add-grade').onclick = () => {
  editingGradeId = null;
  gradeForm.reset();
  document.getElementById('grade-coef').value = '1';
  document.getElementById('grade-modal-title').textContent = 'Ajouter une note';
  openModal(gradeModal);
};

// Fermer le modal
document.getElementById('btn-close-grade-modal').onclick = () => closeModal(gradeModal);

// Soumission du formulaire
gradeForm.onsubmit = async (e) => {
  e.preventDefault();

  const subject = document.getElementById('grade-subject').value.trim();
  const grade = parseFloat(document.getElementById('grade-value').value);
  const coef = parseFloat(document.getElementById('grade-coef').value) || 1;
  const type = document.getElementById('grade-type').value;
  const date = document.getElementById('grade-date').value;
  const comment = document.getElementById('grade-comment').value.trim();

  if (isNaN(grade) || grade < 0 || grade > 20) {
    alert('Note invalide. Elle doit être comprise entre 0 et 20.');
    return;
  }

  if (editingGradeId) {
    const idx = gradesList.findIndex(g => g.id === editingGradeId);
    if (idx !== -1) {
      gradesList[idx] = { ...gradesList[idx], subject, grade, coef, type, date, comment };
    }
  } else {
    gradesList.push({ id: Date.now(), subject, grade, coef, type, date, comment });
  }

  await saveData();
  closeModal(gradeModal);
  renderGrades();
};

// Écouter les changements sur l'objectif
document.getElementById('target-average').addEventListener('input', () => renderGrades());

function renderGrades() {
  const container = document.getElementById('grades-container');
  if (!container) return;
  container.innerHTML = '';

  // --- Calcul des stats globales ---
  let totalGrade = 0;
  let totalCoef = 0;
  gradesList.forEach(g => {
    totalGrade += g.grade * g.coef;
    totalCoef += g.coef;
  });

  const average = totalCoef > 0 ? (totalGrade / totalCoef) : null;
  const target = parseFloat(document.getElementById('target-average').value) || 14;

  // Afficher la moyenne générale
  const avgEl = document.getElementById('overall-average');
  if (avgEl) {
    avgEl.textContent = average !== null ? average.toFixed(2) + '/20' : '--/20';
    avgEl.style.color = average !== null
      ? (average >= target ? 'var(--success)' : 'var(--urgent)')
      : 'var(--text-main)';
  }

  // Meilleures et pires matières (par moyenne)
  const bySubject = {};
  gradesList.forEach(g => {
    if (!bySubject[g.subject]) bySubject[g.subject] = { total: 0, coef: 0 };
    bySubject[g.subject].total += g.grade * g.coef;
    bySubject[g.subject].coef += g.coef;
  });
  const subjectAverages = Object.entries(bySubject).map(([name, v]) => ({
    name, avg: v.coef > 0 ? v.total / v.coef : 0
  }));
  subjectAverages.sort((a, b) => b.avg - a.avg);

  const bestEl = document.getElementById('grades-best');
  const worstEl = document.getElementById('grades-worst');
  if (bestEl) bestEl.textContent = subjectAverages.length > 0 ? `${subjectAverages[0].name} (${subjectAverages[0].avg.toFixed(1)})` : '--';
  if (worstEl) worstEl.textContent = subjectAverages.length > 0 ? `${subjectAverages[subjectAverages.length - 1].name} (${subjectAverages[subjectAverages.length - 1].avg.toFixed(1)})` : '--';

  // --- Graphique barres par matière ---
  const ctxGrades = document.getElementById('chart-grades');
  if (ctxGrades && typeof Chart !== 'undefined') {
    if (chartGradesInstance) chartGradesInstance.destroy();
    const colors = subjectAverages.map(s =>
      s.avg >= target ? 'rgba(52, 211, 153, 0.8)' : 'rgba(251, 113, 133, 0.8)'
    );
    chartGradesInstance = new Chart(ctxGrades.getContext('2d'), {
      type: 'bar',
      data: {
        labels: subjectAverages.map(s => s.name),
        datasets: [{
          label: 'Moyenne /20',
          data: subjectAverages.map(s => parseFloat(s.avg.toFixed(2))),
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.8', '1')),
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0, max: 20,
            ticks: { color: 'rgba(255,255,255,0.6)' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          x: {
            ticks: { color: 'rgba(255,255,255,0.6)' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y}/20`
            }
          },
          // Ligne d'objectif
          annotation: undefined
        }
      }
    });
  }

  // --- Affichage des cartes de notes ---
  const emptyState = document.getElementById('empty-grades');
  if (gradesList.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    container.style.display = 'none';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
  }

  // Trier par date décroissante, puis par matière
  const sorted = [...gradesList].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    return 0;
  });

  sorted.forEach(g => {
    const noteColor = g.grade >= target ? 'var(--success)' : g.grade >= target * 0.7 ? 'var(--primary)' : 'var(--urgent)';
    const card = document.createElement('div');
    card.className = 'grade-card';
    card.innerHTML = `
            <div class="grade-card-score" style="color: ${noteColor};">
                <span class="grade-value">${g.grade}</span>
                <span class="grade-max">/20</span>
            </div>
            <div class="grade-card-info">
                <div class="grade-subject">${g.subject}</div>
                <div class="grade-meta">
                    ${g.type ? `<span class="badge-type" style="font-size:0.75rem;">${g.type}</span>` : ''}
                    ${g.date ? `<span style="color:var(--text-muted);font-size:0.8rem;"><i class="ph ph-calendar-blank"></i> ${new Date(g.date).toLocaleDateString('fr-FR')}</span>` : ''}
                    <span style="color:var(--text-muted);font-size:0.8rem;">Coef: ${g.coef}</span>
                </div>
                ${g.comment ? `<div class="grade-comment"><i class="ph ph-note"></i> ${g.comment}</div>` : ''}
            </div>
            <div class="grade-card-actions">
                <button class="btn-icon btn-edit-grade" title="Modifier"><i class="ph ph-pencil-simple"></i></button>
                <button class="btn-icon danger btn-delete-grade" title="Supprimer"><i class="ph ph-trash"></i></button>
            </div>
        `;

    // Bouton modifier
    card.querySelector('.btn-edit-grade').onclick = () => {
      editingGradeId = g.id;
      document.getElementById('grade-subject').value = g.subject;
      document.getElementById('grade-value').value = g.grade;
      document.getElementById('grade-coef').value = g.coef;
      document.getElementById('grade-type').value = g.type || 'Contrôle';
      document.getElementById('grade-date').value = g.date || '';
      document.getElementById('grade-comment').value = g.comment || '';
      document.getElementById('grade-modal-title').textContent = 'Modifier la note';
      openModal(gradeModal);
    };

    // Bouton supprimer
    card.querySelector('.btn-delete-grade').onclick = async () => {
      card.style.animation = 'cardExit 0.25s ease forwards';
      setTimeout(async () => {
        gradesList = gradesList.filter(x => x.id !== g.id);
        await saveData();
        renderGrades();
      }, 250);
    };

    container.appendChild(card);
  });
}

function renderHistory() {
  const container = document.getElementById('history-container');
  if (!container) return;
  container.innerHTML = '';

  const emptyState = document.getElementById('empty-history');
  if (archiveList.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    container.style.display = 'none';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
  }

  archiveList.sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt)).forEach(t => {
    const div = document.createElement('div');
    div.className = 'task-card completed';
    div.innerHTML = `
            <div class="task-header">
                <div class="task-badges">
                    <span class="task-badge">${t.subject}</span>
                    <span class="badge-type">${t.type || 'Devoir'}</span>
                </div>
            </div>
            <div class="task-title" style="text-decoration: line-through;">${t.title}</div>
            <div class="task-desc">Terminé et archivé le: ${new Date(t.archivedAt).toLocaleString('fr-FR')}</div>
        `;
    container.appendChild(div);
  });
}