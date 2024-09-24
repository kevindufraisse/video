(function() {
    function initPlayer() {
        const videoContainer = document.querySelector('#videoContainer');
        if (!videoContainer) {
            console.error('Conteneur vidéo non trouvé');
            return;
        }

        const videoUrl = videoContainer.getAttribute('data-video-url');
        if (!videoUrl) {
            console.error('URL vidéo manquante');
            return;
        }

        const videoElement = document.createElement('video');
        videoElement.id = 'videoElement';
        videoElement.src = videoUrl;
        videoElement.preload = 'auto';
        videoElement.style.width = '100%';
        videoContainer.appendChild(videoElement);

        const controlsHTML = `
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
        `;

        videoContainer.insertAdjacentHTML('beforeend', controlsHTML);

        const playOverlay = document.getElementById('playOverlay');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const progress = document.getElementById('progress');
        const volumeBtn = document.getElementById('volumeBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const controls = document.getElementById('controls');

        let isPlaying = false;
        let isMuted = false;
        let accelerationEnabled = false;
        const accelerationTime = 35;
        const oneThirdProgress = 33.33;
        let realDuration = 0;
        let progressIntervalId;
        let isAccelerated = true;

        // Cacher la vignette et démarrer la vidéo avec le son activé
        playOverlay.addEventListener('click', function() {
            playOverlay.style.display = 'none';
            controls.style.display = 'flex';
            videoElement.muted = false;
            videoElement.play();
            isPlaying = true;
            updatePlayPauseBtn();
            startFakeProgress();
        });

        // Play/Pause
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                videoElement.pause();
                clearInterval(progressIntervalId);
            } else {
                videoElement.play();
                startFakeProgress();
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
                const currentTime = videoElement.currentTime;

                if (realDuration === 0) {
                    realDuration = videoElement.duration;
                }

                if (currentTime <= accelerationTime && isAccelerated) {
                    let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                    updateProgress(acceleratedProgress);
                } else {
                    if (isAccelerated) {
                        isAccelerated = false;
                    }
                    let remainingTime = realDuration - accelerationTime;
                    let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdProgress) + oneThirdProgress;
                    updateProgress(progressFromThird);
                }

                if (currentTime >= realDuration) {
                    clearInterval(progressIntervalId);
                    resetPlayer();
                }
            }, 100);
        }

        // Update progress bar
        function updateProgress(percent) {
            progress.style.width = percent + '%';
        }

        // Volume control
        volumeBtn.addEventListener('click', function() {
            if (isMuted) {
                videoElement.muted = false;
                volumeBtn.textContent = '🔊';
            } else {
                videoElement.muted = true;
                volumeBtn.textContent = '🔇';
            }
            isMuted = !isMuted;
        });

        // Acceleration settings
        settingsBtn.addEventListener('click', function() {
            if (!accelerationEnabled) {
                videoElement.playbackRate = 1.5;
                settingsBtn.textContent = '⚙ Normal';
            } else {
                videoElement.playbackRate = 1;
                settingsBtn.textContent = '⚙ Accélérer';
            }
            accelerationEnabled = !accelerationEnabled;
        });

        // Reset player at the end
        function resetPlayer() {
            isPlaying = false;
            playOverlay.style.display = 'flex';
            updateProgress(0);
        }

        // Gérer les erreurs lors du chargement de la vidéo
        videoElement.addEventListener('error', function() {
            alert('Erreur lors du chargement de la vidéo. Veuillez vérifier l\'URL et réessayer.');
            resetPlayer();
        });
    }

    document.addEventListener('DOMContentLoaded', initPlayer);
})();
