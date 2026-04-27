# Fast but not furious

Ce projet est un jeu interactif basé sur le langage JavaScript et jouable dans un navigateur.
Le joueur doit répondre le plus rapidement possible à une série de défis et accumuler des points avant la fin du temps imparti.

Deux modes différents sont disponibles :

- Le mode **Français** : il faut trouver un mot contenant la syllabe proposée, et ce peu importe sa place dans le mot.
- Le mode **Maths** : il faut résoudre des opérations mathématiques simples.

Le jeu repose donc sur la rapidité du joueur pour faire le meilleur score.

## Fonctionnalités principales

- Un chronomètre ("gameTime" réglé sur 15 secondes)
- Mode français :
    - Génération aléatoire des syllabes à partir d'un fichier json (syllabes.json)
    - Vérification de la validité des mots à partir d'un fichier txt (mots.txt)
    - Normalisation (gestion des accents pour pouvoir écrire les mots avec ou sans eux)
- Mode maths :
    - Génération aléatoire des opérations (addition, soustraction, multiplication et division)
    - Evaluation des réponses
- Système de score :
    - Score basé sur la longueur du mot ou une réponse correcte pour les maths
    - Système de "streak" augmentant les points au plus le joueur donne de réponses correctes d'affilée
- Gestion du temps :
    - Ajout de temps lors d'une réponse correcte
    - Pénalité si une réponse erronée est donnée ou si un "skip" est utilisé
- Bouton "skip" : 
    - Passe à la syllabe suivante ou à l'opération suivante lors de l'appui d'un bouton

## Instructions d'installation et d'exécution

### Important

Ce projet utilise `fetch()` pour charger des fichiers locaux (`mots.txt` et `syllabes.json`).
Cela ne fonctionne pas si l'on ouvre simplement le fichier `index.html` (protocole `file://`).

Il est nécessaire d'utiliser un **serveur local (protocole http:// ou https://)**.

### Lancer un serveur local

#### Option 1 : avec VS Code

1. Installer l’extension **Live Server**
2. Clic droit sur `index.html`
3. Cliquer sur **"Open with Live Server"**

#### Option 2 : avec MAMP, XAMPP, etc...

1. Installer un logiciel permettant de créer un serveur local sur la machine (nous avons utilisé MAMP de notre côté)
2. Aller ans l'onglet MAMP -> Preferences -> Ports
3. Choisir un port APACHE valide (8888 fonctionne)
4. Lancer le serveur
5. Placer le dossier contenant le projet au chemin suivant `C:\MAMP\htdocs\`
6. Dans un navigateur, aller à l'adresse `http://localhost:8888/`

### Pourquoi un serveur est nécessaire

Les navigateurs empêchent l’accès aux fichiers locaux via `fetch()` pour éviter des failles de sécurité.
Un serveur local permet de simuler un environnement web réel et autorise ces requêtes, grâce au protocole http / https.

## Personnes ayant participé au projet

- ABEELE Alexandre
- DUFOUR Ezéchiel
- PENOT Natys
- UNG-BOURGOIN Théo