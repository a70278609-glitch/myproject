/* ===========================================================================
   TypeRush — script.js
   Application de test de vitesse de frappe en JavaScript Vanilla (ES6+).
   Organisation : données > état > utilitaires > moteur de frappe > UI > init.
   =========================================================================== */

   'use strict';

   /* ---------------------------------------------------------------------------
      1. BANQUE DE TEXTES
      Au moins 5 textes par niveau, entre 30 et 120 mots chacun.
   --------------------------------------------------------------------------- */
   const TEXT_BANK = {
     facile: [
        "You cannot change what you refuse to confront.",

        "Don't think of cost. Think of value.",
        
        "Sometimes you need to distance yourself to see things clearly.",
        
        "Saying someone is ugly doesn't make you any prettier.",
        
        "The only normal people you know are the ones you don't know very well.",
        
        "It's better to be alone than to be in bad company.",
        
        "Falling in love is not a choice. To stay in love is.",
        
        "Never do something permanently foolish just because you are temporarily upset.",
        
        "In life, if you don't risk anything, you risk everything.",
        
        "Trying to be someone else is a waste of the person you are.",
        
        "Don't listen to what people say, watch what they do.",
        
        "Being alone does not mean you are lonely, and being lonely does not mean you are alone.",
        
        "Learn to love yourself first, instead of loving the idea of other people loving you.",
        
        "Someone else doesn't have to be wrong for you to be right.",
        
        "The smallest act of kindness is worth more than the grandest intention.",
        
        "Many people are so poor because the only thing they have is money.",
        
        "You don't drown by falling in the water. You drown by staying there.",
        
        "It's better to know and be disappointed than to never know and always wonder.",
        
        "You become what you focus on and like the people you spend time with.",
        
        "When values are clear, decisions are easy.",
        
        "Hope is NOT a strategy.",
        
        "To be interesting, be interested.",
        
        "Remember: everyone you meet is fighting a mighty battle. Be kind. Be understanding."
     ],
     moyen: [
        "Sometimes good things fall apart so better things can fall together.",

        "No matter how many mistakes you make or how slow you progress, you are still way ahead of everyone who isn't trying.",
        
        "If you really want to do something, you'll find a way. If you don't, you'll find an excuse.",
        
        "Don't choose the one who is beautiful to the world; choose the one who makes your world beautiful.",
        
        "True love isn't about being inseparable; it's about two people being true to each other even when they are separated.",
        
        "When you stop chasing the wrong things you give the right things a chance to catch you.",
        
        "Every single thing that has ever happened in your life is preparing you for a moment that is yet to come.",
        
        "Sometimes people don't notice the things others do for them until they stop doing them.",
        
        "Love and appreciate your parents. We are often so busy growing up that we forget they are also growing old.",
        
        "When someone tells you, 'You've changed,' it might simply be because you've stopped living your life their way.",
        
        "Be happy. Be yourself. If others don't like it, then let them be. Happiness is a choice.",
        
        "Don't look for someone who will solve all your problems; look for someone who will face them with you.",
        
        "No matter how good or bad you have it, wake up each day thankful for your life.",
        
        "Learn to appreciate the things you have before time forces you to appreciate the things you once had.",
        
        "What you do every day matters more than what you do every once in a while.",
        
        "You can't start the next chapter of your life if you keep re-reading your last one.",
        
        "If you don't like something, change it. If you can't change it, change the way you think about it.",
        
        "People do what seems easy and convenient, not what is best for them.",
        
        "Build your house on the rock of learning; no one can take your education away from you.",
        
        "Successful people willingly do what unsuccessful people are unwilling to do."
    ],
     difficile: [
        "If a person wants to be a part of your life, they will make an obvious effort to do so. Think twice before reserving a space in your heart for people who do not make an effort to stay.",

        "Making a hundred friends is not a miracle. The miracle is to make a single friend who will stand by your side even when hundreds are against you.",
        
        "Don't say you don't have enough time. You have exactly the same number of hours per day that were given to Helen Keller, Pasteur, Michelangelo, Mother Teresa, Leonardo da Vinci, Thomas Jefferson, and Albert Einstein.",
        
        "While you're busy looking for the perfect person, you'll probably miss the imperfect person who could make you perfectly happy.",
        
        "Love is not about sex, going on fancy dates, or showing off. It's about being with a person who makes you happy in a way nobody else can.",
        
        "Anyone can come into your life and say how much they love you. It takes someone really special to stay in your life and show how much they love you.",
        
        "If you expect the world to be fair with you because you are fair, you're fooling yourself. That's like expecting the lion not to eat you because you didn't eat him.",
        
        "Happiness is not determined by what's happening around you, but rather what's happening inside you. Most people depend on others to gain happiness, but the truth is, it always comes from within.",
        
        "There are things that we don't want to happen but have to accept, things we don't want to know but have to learn, and people we can't live"
            
    ],
   };
   
   /* ---------------------------------------------------------------------------
      2. ÉTAT GLOBAL DE L'APPLICATION
   --------------------------------------------------------------------------- */
   const state = {
     currentLevel: 'facile',
     currentText: '',
     charSpans: [],          // références DOM vers chaque <span class="char">
     typedCount: 0,          // nombre total de caractères tapés (y compris erreurs corrigées)
     correctCount: 0,        // nombre de caractères actuellement corrects dans la saisie
     errorCount: 0,          // nombre d'erreurs actives (caractères mal tapés en ce moment)
     startTime: null,        // timestamp du démarrage du chrono
     timerId: null,          // id de l'intervalle du chrono
     isRunning: false,       // le test est-il en cours ?
     isFinished: false,      // le test est-il terminé ?
   };
   
   /* ---------------------------------------------------------------------------
      3. RÉFÉRENCES DOM
   --------------------------------------------------------------------------- */
   const dom = {
     textDisplay: document.getElementById('textDisplay'),
     typingInput: document.getElementById('typingInput'),
     restartBtn: document.getElementById('restartBtn'),
     progressFill: document.getElementById('progressFill'),
     currentLevelPill: document.getElementById('currentLevelPill'),
     bestScoreDisplay: document.getElementById('bestScoreDisplay'),
   
     liveWpm: document.getElementById('liveWpm'),
     liveTime: document.getElementById('liveTime'),
     liveAccuracy: document.getElementById('liveAccuracy'),
     liveErrors: document.getElementById('liveErrors'),
   
     gaugeFill: document.getElementById('gaugeFill'),
     gaugeNeedle: document.getElementById('gaugeNeedle'),
   
     levelButtons: document.querySelectorAll('.level-btn'),
   
     scoreFacile: document.getElementById('scoreFacile'),
     scoreMoyen: document.getElementById('scoreMoyen'),
     scoreDifficile: document.getElementById('scoreDifficile'),
   
     resultsOverlay: document.getElementById('resultsOverlay'),
     resultsMessage: document.getElementById('resultsMessage'),
     resultTime: document.getElementById('resultTime'),
     resultWpm: document.getElementById('resultWpm'),
     resultAccuracy: document.getElementById('resultAccuracy'),
     resultLevel: document.getElementById('resultLevel'),
     resultsBestValue: document.getElementById('resultsBestValue'),
     resultsRestartBtn: document.getElementById('resultsRestartBtn'),
   };
   
   /* ---------------------------------------------------------------------------
      4. UTILITAIRES — localStorage, formatage, sélection aléatoire
   --------------------------------------------------------------------------- */
   
   const STORAGE_KEY = 'typerush_best_scores';
   
   /**
    * Récupère l'objet des meilleurs scores depuis localStorage.
    * Structure : { facile: number|null, moyen: number|null, difficile: number|null }
    */
   function getBestScores() {
     try {
       const raw = localStorage.getItem(STORAGE_KEY);
       if (!raw) return { facile: null, moyen: null, difficile: null };
       return JSON.parse(raw);
     } catch (err) {
       console.warn('Lecture localStorage impossible, valeurs par défaut utilisées.', err);
       return { facile: null, moyen: null, difficile: null };
     }
   }
   
   /**
    * Sauvegarde l'objet des meilleurs scores dans localStorage.
    */
   function setBestScores(scores) {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
     } catch (err) {
       console.warn('Écriture localStorage impossible.', err);
     }
   }
   
   /**
    * Met à jour le meilleur score d'un niveau si le nouveau WPM est supérieur.
    * Retourne true si un nouveau record a été établi.
    */
   function updateBestScoreIfNeeded(level, wpm) {
     const scores = getBestScores();
     const current = scores[level];
     if (current === null || current === undefined || wpm > current) {
       scores[level] = wpm;
       setBestScores(scores);
       return true;
     }
     return false;
   }
   
   /**
    * Choisit un texte aléatoire dans le niveau donné, sans jamais reprendre
    * le texte qui vient juste d'être utilisé (si plusieurs textes existent).
    */
   function pickRandomText(level, previousText) {
     const pool = TEXT_BANK[level];
     if (pool.length === 1) return pool[0];
   
     let candidate;
     do {
       candidate = pool[Math.floor(Math.random() * pool.length)];
     } while (candidate === previousText);
   
     return candidate;
   }
   
   /**
    * Formate un nombre de secondes en chaîne lisible avec une décimale.
    */
   function formatTime(seconds) {
     return `${seconds.toFixed(1)}s`;
   }
   
   /**
    * Renvoie un message de performance en fonction du WPM atteint.
    */
   function getPerformanceMessage(wpm) {
     if (wpm >= 70) return 'Excellent !';
     if (wpm >= 45) return 'Très bien !';
     if (wpm >= 25) return 'Continue à t\'entraîner !';
     return 'Débutant';
   }
   
   /* ---------------------------------------------------------------------------
      5. RENDU DU TEXTE & GESTION DES NIVEAUX
   --------------------------------------------------------------------------- */
   
   /**
    * Découpe le texte courant en <span> individuels (un par caractère)
    * et les insère dans la zone d'affichage. Conserve les références DOM
    * dans state.charSpans pour des mises à jour rapides plus tard.
    */
   function renderText(text) {
     dom.textDisplay.innerHTML = '';
     state.charSpans = [];
   
     const fragment = document.createDocumentFragment();
   
     for (const char of text) {
       const span = document.createElement('span');
       span.className = 'char';
       // Affiche une espace visible même pour les espaces (insécable pour le rendu)
       span.textContent = char;
       fragment.appendChild(span);
       state.charSpans.push(span);
     }
   
     dom.textDisplay.appendChild(fragment);
   
     // Marque le premier caractère comme "curseur actuel"
     if (state.charSpans.length > 0) {
       state.charSpans[0].classList.add('char-current');
     }
   }
   
   /**
    * Change le niveau actif : met à jour les boutons, le texte affiché,
    * le badge de niveau et le meilleur score affiché.
    */
   function setLevel(level) {
     state.currentLevel = level;
   
     dom.levelButtons.forEach((btn) => {
       const isActive = btn.dataset.level === level;
       btn.classList.toggle('active', isActive);
       btn.setAttribute('aria-pressed', String(isActive));
     });
   
     const labels = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };
     dom.currentLevelPill.textContent = labels[level];
   
     updateBestScoreBadge();
     startNewTest();
   }
   
   /**
    * Met à jour le badge "Record" affiché au-dessus du texte à taper,
    * pour le niveau actuellement sélectionné.
    */
   function updateBestScoreBadge() {
     const scores = getBestScores();
     const best = scores[state.currentLevel];
     dom.bestScoreDisplay.textContent = best ? `Record : ${best} WPM` : 'Record : —';
   }
   
   /**
    * Rafraîchit l'affichage permanent des trois meilleurs scores
    * (panneau "scoreboard" en bas de page).
    */
   function refreshScoreboard() {
     const scores = getBestScores();
     dom.scoreFacile.textContent = scores.facile ? `${scores.facile} WPM` : '—';
     dom.scoreMoyen.textContent = scores.moyen ? `${scores.moyen} WPM` : '—';
     dom.scoreDifficile.textContent = scores.difficile ? `${scores.difficile} WPM` : '—';
   }
   
   /**
    * Joue une courte animation de mise en avant sur la carte de score
    * correspondant au niveau qui vient de battre un record.
    */
   function flashScoreCard(level) {
     const card = document.querySelector(`[data-level-card="${level}"]`);
     if (!card) return;
     card.classList.remove('new-record'); // reset pour permettre de rejouer l'anim
     // eslint-disable-next-line no-unused-expressions
     void card.offsetWidth; // force un reflow pour relancer l'animation CSS
     card.classList.add('new-record');
   }
   
   /* ---------------------------------------------------------------------------
      6. CHRONOMÈTRE
   --------------------------------------------------------------------------- */
   
   /**
    * Démarre le chronomètre : enregistre l'heure de départ et lance
    * une mise à jour de l'affichage chaque 100ms pour un rendu fluide.
    */
   function startTimer() {
     if (state.isRunning) return;
     state.isRunning = true;
     state.startTime = Date.now();
   
     state.timerId = setInterval(() => {
       const elapsedSeconds = (Date.now() - state.startTime) / 1000;
       dom.liveTime.textContent = formatTime(elapsedSeconds);
       updateLiveWpm(elapsedSeconds);
     }, 100);
   }
   
   /**
    * Stoppe le chronomètre et renvoie le temps total écoulé en secondes.
    */
   function stopTimer() {
     clearInterval(state.timerId);
     state.isRunning = false;
     return (Date.now() - state.startTime) / 1000;
   }
   
   /* ---------------------------------------------------------------------------
      7. CALCULS WPM & PRÉCISION
   --------------------------------------------------------------------------- */
   
   /**
    * Calcule le WPM courant : WPM = (caractères corrects / 5) / minutes écoulées.
    * Protège contre une division par zéro en début de test.
    */
   function calculateWpm(correctChars, elapsedSeconds) {
     if (elapsedSeconds <= 0) return 0;
     const minutes = elapsedSeconds / 60;
     return Math.round((correctChars / 5) / minutes);
   }
   
   /**
    * Calcule la précision en pourcentage, avec deux décimales.
    * Précision = (caractères corrects / caractères tapés) × 100.
    */
   function calculateAccuracy(correctChars, typedChars) {
     if (typedChars <= 0) return 100;
     return ((correctChars / typedChars) * 100).toFixed(2);
   }
   
   /**
    * Met à jour l'affichage live du WPM ainsi que la jauge graphique.
    */
   function updateLiveWpm(elapsedSeconds) {
     const wpm = calculateWpm(state.correctCount, elapsedSeconds);
     dom.liveWpm.textContent = wpm;
     updateGauge(wpm);
   }
   
   /**
    * Anime la jauge façon "compteur de vitesse" : remplit l'arc et
    * fait pivoter l'aiguille en fonction du WPM (plafonné à 150 pour l'échelle).
    */
   function updateGauge(wpm) {
     const MAX_WPM_SCALE = 150;
     const ratio = Math.min(wpm / MAX_WPM_SCALE, 1);
   
     // L'arc fait environ 251.2 unités de longueur (demi-cercle approx.)
     const arcLength = 251.2;
     dom.gaugeFill.style.strokeDashoffset = String(arcLength * (1 - ratio));
   
     // L'aiguille pivote de -90deg (gauche) à +90deg (droite)
     const angle = -90 + ratio * 180;
     dom.gaugeNeedle.style.transform = `rotate(${angle}deg)`;
   }
   
   /* ---------------------------------------------------------------------------
      8. MOTEUR DE FRAPPE — cœur de la logique
   --------------------------------------------------------------------------- */
   
   /**
    * Gère chaque frappe de l'utilisateur : compare la saisie au texte cible,
    * colore les caractères, met à jour les statistiques en temps réel,
    * et détecte la fin du test.
    */
   function handleInput(event) {
     const typedValue = event.target.value;
   
     // Démarre le chrono à la toute première frappe
     if (!state.isRunning && !state.isFinished && typedValue.length > 0) {
       startTimer();
     }
   
     if (state.isFinished) return;
   
     const targetText = state.currentText;
     const typedLength = typedValue.length;
   
     let correct = 0;
     let errors = 0;
   
     // Parcourt chaque caractère saisi et met à jour sa couleur
     for (let i = 0; i < state.charSpans.length; i++) {
       const span = state.charSpans[i];
       span.classList.remove('char-correct', 'char-incorrect', 'char-current');
   
       if (i < typedLength) {
         if (typedValue[i] === targetText[i]) {
           span.classList.add('char-correct');
           correct++;
         } else {
           span.classList.add('char-incorrect');
           errors++;
         }
       } else if (i === typedLength) {
         // Caractère actuel = position du curseur
         span.classList.add('char-current');
       }
     }
   
     state.typedCount = typedLength;
     state.correctCount = correct;
     state.errorCount = errors;
   
     updateLiveStats();
     updateProgressBar(typedLength, targetText.length);
   
     // Empêche de dépasser la longueur du texte cible
     if (typedLength >= targetText.length) {
       event.target.value = typedValue.slice(0, targetText.length);
       finishTest();
     }
   }
   
   /**
    * Rafraîchit les indicateurs de précision et d'erreurs affichés en direct.
    */
   function updateLiveStats() {
     const accuracy = calculateAccuracy(state.correctCount, state.typedCount);
     dom.liveAccuracy.textContent = `${accuracy}%`;
     dom.liveErrors.textContent = state.errorCount;
   }
   
   /**
    * Met à jour la barre de progression visuelle sous la zone de frappe.
    */
   function updateProgressBar(typed, total) {
     const percent = total > 0 ? Math.min((typed / total) * 100, 100) : 0;
     dom.progressFill.style.width = `${percent}%`;
   }
   
   /**
    * Appelée lorsque l'utilisateur a tapé l'intégralité du texte cible.
    * Stoppe le chrono, calcule les statistiques finales, met à jour le
    * meilleur score si nécessaire, puis affiche l'écran de résultats.
    */
   function finishTest() {
     state.isFinished = true;
     const elapsedSeconds = stopTimer();
   
     const finalWpm = calculateWpm(state.correctCount, elapsedSeconds);
     const finalAccuracy = calculateAccuracy(state.correctCount, state.typedCount);
   
     dom.typingInput.blur();
   
     const isNewRecord = updateBestScoreIfNeeded(state.currentLevel, finalWpm);
     refreshScoreboard();
     updateBestScoreBadge();
     if (isNewRecord) flashScoreCard(state.currentLevel);
   
     showResults({
       time: elapsedSeconds,
       wpm: finalWpm,
       accuracy: finalAccuracy,
       isNewRecord,
     });
   }
   
   /* ---------------------------------------------------------------------------
      9. ÉCRAN DE RÉSULTATS
   --------------------------------------------------------------------------- */
   
   /**
    * Remplit et affiche la carte de résultats avec toutes les statistiques
    * finales du test, ainsi qu'un message adapté à la performance.
    */
   function showResults({ time, wpm, accuracy, isNewRecord }) {
     const labels = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };
     const scores = getBestScores();
     const best = scores[state.currentLevel];
   
     dom.resultsMessage.textContent = getPerformanceMessage(wpm);
     dom.resultTime.textContent = formatTime(time);
     dom.resultWpm.textContent = wpm;
     dom.resultAccuracy.textContent = `${accuracy}%`;
     dom.resultLevel.textContent = labels[state.currentLevel];
   
     dom.resultsBestValue.textContent = best ? `${best} WPM` : `${wpm} WPM`;
     if (isNewRecord) {
       dom.resultsBestValue.textContent += ' 🏆 Nouveau record !';
     }
   
     dom.resultsOverlay.classList.add('visible');
   }
   
   /**
    * Masque l'écran de résultats.
    */
   function hideResults() {
     dom.resultsOverlay.classList.remove('visible');
   }
   
   /* ---------------------------------------------------------------------------
      10. RÉINITIALISATION / NOUVEAU TEST
   --------------------------------------------------------------------------- */
   
   /**
    * Réinitialise entièrement l'état du test courant : nouveau texte aléatoire,
    * chrono à zéro, WPM à zéro, précision à zéro, champ de saisie vidé,
    * couleurs du texte réinitialisées. Ne recharge jamais la page.
    */
   function startNewTest() {
     // Stoppe un éventuel chrono en cours
     clearInterval(state.timerId);
   
     const newText = pickRandomText(state.currentLevel, state.currentText);
     state.currentText = newText;
     state.typedCount = 0;
     state.correctCount = 0;
     state.errorCount = 0;
     state.startTime = null;
     state.isRunning = false;
     state.isFinished = false;
   
     renderText(newText);
   
     dom.typingInput.value = '';
     dom.liveWpm.textContent = '0';
     dom.liveTime.textContent = '0.0s';
     dom.liveAccuracy.textContent = '100%';
     dom.liveErrors.textContent = '0';
     dom.progressFill.style.width = '0%';
     updateGauge(0);
   
     hideResults();
   
     // Replace le focus sur la zone de saisie pour reprendre immédiatement
     dom.typingInput.focus();
   }
   
   /* ---------------------------------------------------------------------------
      11. ÉCOUTEURS D'ÉVÉNEMENTS
   --------------------------------------------------------------------------- */
   
   function attachEventListeners() {
     dom.typingInput.addEventListener('input', handleInput);
   
     dom.restartBtn.addEventListener('click', startNewTest);
     dom.resultsRestartBtn.addEventListener('click', startNewTest);
   
     dom.levelButtons.forEach((btn) => {
       btn.addEventListener('click', () => setLevel(btn.dataset.level));
     });
   
     // Permet de refocaliser le champ de saisie en cliquant n'importe où
     // sur la carte de texte (meilleure expérience utilisateur).
     dom.textDisplay.addEventListener('click', () => {
       if (!state.isFinished) dom.typingInput.focus();
     });
   
     // Ferme l'écran de résultats si l'utilisateur clique en dehors de la carte
     dom.resultsOverlay.addEventListener('click', (event) => {
       if (event.target === dom.resultsOverlay) {
         startNewTest();
       }
     });
   }
   
   /* ---------------------------------------------------------------------------
      12. INITIALISATION DE L'APPLICATION
   --------------------------------------------------------------------------- */
   
   function init() {
     attachEventListeners();
     refreshScoreboard();
     setLevel('facile'); // niveau par défaut au chargement
   }
   
   document.addEventListener('DOMContentLoaded', init);