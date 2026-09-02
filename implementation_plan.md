# Mode Hors Ligne Complet (Offline Mode)

Ce plan décrit les étapes nécessaires pour rendre l'application 100% autonome et fonctionnelle hors-ligne en éliminant toutes les dépendances aux CDNs (Content Delivery Networks) externes pour les styles et les scripts.

## Proposed Changes

### Assets & Fontes Locales

#### [NEW] [inter.css](file:///c:/Users/Batsmg0869/OneDrive/app%20pc/App%20cours/mon-app-cours/assets/fonts/Inter/inter.css)
- Contient les règles `@font-face` pointant vers les fichiers de police locaux.

#### [NEW] Police de caractères Inter (.ttf)
Télécharger les variantes de la police Inter depuis Google Fonts directement dans `assets/fonts/Inter/` :
- `Inter-Regular.ttf` (poids 400)
- `Inter-Medium.ttf` (poids 500)
- `Inter-SemiBold.ttf` (poids 600)
- `Inter-Bold.ttf` (poids 700)
- `Inter-ExtraBold.ttf` (poids 800)

### Librairies JavaScript Locales

#### [NEW] [chart.umd.js](file:///c:/Users/Batsmg0869/OneDrive/app%20pc/App%20cours/mon-app-cours/assets/js/chart.umd.js)
- Copie locale de Chart.js depuis `node_modules/chart.js/dist/chart.umd.js`.

#### [NEW] [pdf.min.js](file:///c:/Users/Batsmg0869/OneDrive/app%20pc/App%20cours/mon-app-cours/assets/js/pdf.min.js)
- Copie locale de PDF.js téléchargée depuis CDNJS (v3.11.174) pour la prévisualisation locale de fichiers PDF.

#### [NEW] [pdf.worker.min.js](file:///c:/Users/Batsmg0869/OneDrive/app%20pc/App%20cours/mon-app-cours/assets/js/pdf.worker.min.js)
- Le script worker pour PDF.js (v3.11.174).

---

### Interface Utilisateur (HTML/CSS)

#### [MODIFY] [index.html](file:///c:/Users/Batsmg0869/OneDrive/app%20pc/App%20cours/mon-app-cours/index.html)
- Remplacer les balises `<link>` et `<script>` pointant vers les URL externes (Google Fonts, cdnjs) par des chemins relatifs locaux pointant vers le dossier `assets/`.
- Mettre à jour l'initialisation du worker PDF :
  ```javascript
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/js/pdf.worker.min.js';
  ```

---

## Verification Plan

### Manual Verification
1. Lancer l'application avec la connexion internet active.
2. Couper complètement la connexion internet de la machine (ou désactiver la carte réseau).
3. Ouvrir l'application et naviguer vers l'onglet **Dashboard** : vérifier que les graphiques se chargent et s'animent parfaitement.
4. Aller dans l'onglet **Mes Devoirs**, ouvrir ou ajouter un devoir avec une pièce jointe PDF, puis l'ouvrir : s'assurer que le visualiseur PDF s'affiche correctement sans erreur.
5. Vérifier visuellement que la police premium `Inter` reste appliquée à toute l'interface sans se rabattre sur Times New Roman ou une police générique.
