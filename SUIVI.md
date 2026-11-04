# Suivi du portfolio

## 4 novembre 2026 — refonte « ingénierie & création »

Sauvegarde avant refonte : tag Git `backup/pre-redesign-2026-11-04`.

Fait :
- Retiré l’univers spatial : intro à particules, scène 3D étoilée, « portails », constellation de compétences, curseur personnalisé, scintillement doré permanent. Dépendances `three` et `@react-three/fiber` supprimées.
- Accueil : identité claire (automatique, robotique & mécatronique ; étudiant en Master 1 ; photographe & designer graphique). Trois actions : projets, CV, contact. Bras robotisé SVG en cinématique inverse exacte, avec une réponse indicielle étiquetée « illustration ». Deux accès : « Ingénierie & Robotique » et « Photographie & Design ».
- Ingénierie : boucle de régulation animée, six domaines (texte, outils, projets liés), sélection de six projets, stages.
- Projets : filtres robotique / automatique / IA & vision / signal / logiciel. Statuts « terminé dans son périmètre / en développement / planifié ». Fiches structurées (contexte, objectif, contribution, méthode, résultats vérifiés, limites, liens). Pictogramme tracé par domaine.
- Compétences : carte compétence → projets, qui distingue « démontrée dans un projet » et « déclarée dans le CV ».
- Photographie : image d’ouverture, séries fiables (monuments, jardins, portrait, études libres), légendes seulement quand elles sont connues, glissement tactile.
- Studio : composition typographique, sélection photo, section « réalisations graphiques » prête mais vide (aucune fausse réalisation).
- Parcours : 3 stages datés + 1 expérience de maintenance (le compteur a été corrigé). Ligne de chronologie qui progresse au défilement.
- CV : PDF FR et EN générés depuis la page CV (3 pages chacun) et téléchargeables.
- Contact : email confirmé (amirirafikk@gmail.com), bouton « copier l’adresse », formulaire présenté honnêtement (il ouvre la messagerie).
- Animations partagées (`Reveals.tsx`) : `.reveal`, `.reveal-img`, `.draw`, `[data-progress]`, `[data-parallax]`, plus la transition de page (`template.tsx`). Le haut de page est en CSS pur, donc lisible sans attendre. `prefers-reduced-motion` est respecté.

À faire / en attente de Rafik :
- Fichiers de design graphique (visuels + contexte, objectif, rôle, outils), à ajouter via /admin → Design graphique.
- Objectif d’alternance (dates, rythme) s’il doit apparaître.
- URL LinkedIn vérifiée.
- Facultatif : dates des emplois en restauration et de Mokassiart Aya.
