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

## 2026-11-04 — Ouverture cinématographique + « Travaillons ensemble »
- Intro (~7,5 s, une fois par session, accueil seulement) : trait doré → bras robotisé (IK exacte) → trajectoire violette qui se referme en cadre photo → 3 photos (2 sur mobile) + marques graphiques → le cadre s’ouvre sur RAFIK AMIRI / RAIDEN → le nom glisse dans le vrai titre (FLIP). Passer : bouton, Échap/Entrée/Espace, molette, toucher, navigation. Bouton « Revoir l’intro ». Rien avec reduced-motion ; failsafe 12 s.
- Premier écran plein écran : nom, statut Master 1, signature, 3 actions, 2 accès, bras animé + photo.
- Contact = « Travaillons ensemble » : formulaire d’opportunité, API `/api/opportunity` (Resend, Reply-To visiteur, validation serveur, honeypot, délai mini, limite 5/10 min). Bouton « Me proposer une opportunité » dans la nav et le pied de page ; liens présélectionnés sur CV, photo, studio, projets, ingénierie.
- À faire par Rafik : créer un compte Resend gratuit avec amirirafikk@gmail.com, ajouter `RESEND_API_KEY` sur Vercel, redéployer. D’ici là le formulaire ouvre un email pré-rempli (pas de faux succès).

## 2026-11-15 — Parcours complet (branche parcours-complet, non publiée)
- Emplois précisés (lieux et intitulés fournis par Rafik) : Balthazar Gonesse, Taksim Stalingrad, Le 130 Boulogne, La Rambla Boumerdès, tabac Isser, Carrefour City Center, noix Boumerdès, missions auto-entrepreneur. Doublons « commerce » et « production » remplacés.
- Studio : « Vidéo & communication digitale ».
- Bloqué : CV non fournis, LinkedIn non connecté, attestations hackathon absentes, aucun email HackEPS trouvé, EF SET reçu en transfert depuis une autre adresse.
- 15/11 (suite) : CV restauration intégré (intitulés et missions exacts, livreur et ouvrier de production séparés, e-commerce cosmétiques/produits digitaux), langues sans niveau, « Recherche une alternance pour l’année prochaine », section Hackathons (HackEPS : candidature acceptée, participation à confirmer), email public → amirirafik8@gmail.com (à valider), CV PDF régénérés (3 pages). Non publié.
