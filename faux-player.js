document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('videoForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const videoPlayer = document.getElementById('videoPlayer');
    const embedCodeTextarea = document.getElementById('embedCode');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

        const videoSource = videoUrlInput.value.trim();

        if (videoSource) {
            // Générer le lecteur avec l'URL fournie
            generatePlayer(videoSource);
        } else {
            alert('Veuillez fournir une URL de vidéo MP4 valide.');
        }
    });

    function generatePlayer(videoSource) {
        // Code HTML du lecteur avec une icône de lecture
        const playerHTML = `
            <div id="fauxPlayer" style="position: relative;">
                <video id="videoElement" preload="auto" src="${videoSource}" style="width: 100%;"></video>
                <div id="playOverlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5); cursor: pointer;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/OOjs_UI_icon_play-ltr-progressive.svg/240px-OOjs_UI_icon_play-ltr-progressive.svg.png" alt="Play Icon" style="width: 50px; height: 50px;">
                    <p style="color: white; font-size: 18px;">Cliquez pour activer le son</p>
                </div>
                <div id="controls" style="display: none;">
                    <button id="playPauseBtn">⏯</button>
                    <div id="progressBar">
                        <div id="progress"></div>
                    </div>
                    <button id="volumeBtn">🔊</button>
                    <button id="settingsBtn">⚙ Accélérer</button>
                </div>
            </div>
        `;

        // Afficher le lecteur dans la zone de prévisualisation
        videoPlayer.innerHTML = playerHTML;

        // Initialiser les interactions du player
        initPlayer();
    }

    function initPlayer() {
        const video = document.getElementById('videoElement');
        const playOverlay = document.getElementById('playOverlay');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const progress = document.getElementById('progress');
        const volumeBtn = document.getElementById('volumeBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const controls = document.getElementById('controls');

        let isPlaying = false;
        let isMuted = false;
        let accelerationEnabled = false; // Par défaut, l'accélération est désactivée
        const accelerationTime = 35; // Temps d'accélération (en secondes)
        const oneThirdProgress = 33.33; // 1/3 de la barre atteint après accélération
        let realDuration = 0; // Durée réelle de la vidéo
        let intervalId;
        let progressIntervalId;
        let isAccelerated = true;

        // Cacher la vignette et démarrer la vidéo avec le son activé
        playOverlay.addEventListener('click', function() {
            playOverlay.style.display = 'none';
            controls.style.display = 'flex';
            video.muted = false;
            video.play();
            isPlaying = true;
            updatePlayPauseBtn();
            startFakeProgress();
        });

        // Play/Pause
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                video.pause();
                clearInterval(progressIntervalId); // Arrêter l'intervalle de progression pendant la pause
            } else {
                video.play();
                startFakeProgress(); // Reprendre la progression lors de la reprise de la lecture
            }
            isPlaying = !isPlaying;
            updatePlayPauseBtn();
        });

        // Update play/pause button
        function updatePlayPauseBtn() {
            playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
        }

        // Fonction pour démarrer la fausse progression
        function startFakeProgress() {
            progressIntervalId = setInterval(function() {
                const currentTime = video.currentTime; // Temps actuel de la vidéo

                if (realDuration === 0) {
                    realDuration = video.duration; // Obtenir la vraie durée une fois la vidéo démarrée
                }

                if (currentTime <= accelerationTime && isAccelerated) {
                    // Calculer la progression accélérée pour atteindre 1/3 en 35 secondes
                    let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                    updateProgress(acceleratedProgress);
                } else {
                    // Passer à la progression normale après l'accélération
                    if (isAccelerated) {
                        isAccelerated = false;
                    }
                    let remainingTime = realDuration - accelerationTime; // Temps restant après 35s
                    let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdProgress) + oneThirdProgress;
                    updateProgress(progressFromThird);
                }

                // Si la vidéo est terminée, réinitialiser
                if (currentTime >= realDuration) {
                    clearInterval(progressIntervalId);
                    resetPlayer();
                }
            }, 100); // Mise à jour toutes les 100ms
        }

        // Update progress bar
        function updateProgress(percent) {
            progress.style.width = percent + '%'; // Ajuster la largeur de la barre
        }

        // Volume control
        volumeBtn.addEventListener('click', function() {
            if (isMuted) {
                video.muted = false;
                volumeBtn.textContent = '🔊';
            } else {
                video.muted = true;
                volumeBtn.textContent = '🔇';
            }
            isMuted = !isMuted;
        });

        // Settings button to toggle video speed (Acceleration)
        settingsBtn.addEventListener('click', function() {
            if (!accelerationEnabled) {
                video.playbackRate = 1.5; // Accélérer la vidéo
                settingsBtn.textContent = '⚙ Normal';
            } else {
                video.playbackRate = 1; // Revenir à la vitesse normale
                settingsBtn.textContent = '⚙ Accélérer';
            }
            accelerationEnabled = !accelerationEnabled; // Basculer l'état de l'accélération
        });

        // Réinitialiser le lecteur une fois la vidéo terminée
        function resetPlayer() {
            isPlaying = false;
            playOverlay.style.display = 'flex'; // Réafficher l'overlay de lecture
            updateProgress(0);
        }

        // Gérer les erreurs lors du chargement de la vidéo
        video.addEventListener('error', function() {
            alert('Erreur lors du chargement de la vidéo. Veuillez vérifier l\'URL et réessayer.');
            resetPlayer();
        });
    }
});
