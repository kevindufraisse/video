(function() {
    function initPlayer() {
        const video = document.getElementById('videoElement');
        const playButton = document.getElementById('playButton');
        const progressBar = document.getElementById('progress');

        if (!video || !playButton || !progressBar) {
            // Les éléments ne sont pas encore dans le DOM, réessayer après un court délai
            setTimeout(initPlayer, 50);
            return;
        }

        let playing = false;
        const accelerationTime = 35; // Accélération sur les 35 premières secondes
        let realDuration = 0; // Durée réelle de la vidéo
        const oneThirdProgress = 33.33; // La barre atteindra 1/3 après l'accélération
        let intervalId;

        // Désactiver les contrôles natifs de la vidéo
        video.controls = false;

        // Obtenir la durée réelle de la vidéo une fois les métadonnées chargées
        video.addEventListener('loadedmetadata', function() {
            realDuration = video.duration;
        });

        // Démarrer la vidéo lorsque l'utilisateur clique sur le bouton Play
        playButton.addEventListener('click', function() {
            if (!playing) {
                video.play();
                playButton.style.display = 'none';
                startFakeProgress();
            }
        });

        // Fonction pour gérer la progression personnalisée
        function startFakeProgress() {
            playing = true;
            let isAccelerated = true;

            intervalId = setInterval(function() {
                const currentTime = video.currentTime;

                if (currentTime <= accelerationTime && isAccelerated) {
                    let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                    updateProgress(acceleratedProgress);
                } else {
                    isAccelerated = false;
                    const remainingTime = realDuration - accelerationTime;
                    let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdProgress) + oneThirdProgress;
                    updateProgress(progressFromThird);
                }

                if (currentTime >= realDuration) {
                    clearInterval(intervalId);
                    resetPlayer();
                }
            }, 100);
        }

        // Mettre à jour la barre de progression
        function updateProgress(percent) {
            progressBar.style.width = percent + '%';
        }

        // Réinitialiser le player une fois la vidéo terminée
        function resetPlayer() {
            playing = false;
            playButton.style.display = 'block';
            updateProgress(0);
        }

        // Gestion du clic sur la vidéo pour mettre en pause/reprendre
        video.addEventListener('click', function() {
            if (playing) {
                video.pause();
                clearInterval(intervalId);
                playButton.style.display = 'block';
                playing = false;
            } else {
                video.play();
                playButton.style.display = 'none';
                startFakeProgress();
                playing = true;
            }
        });
    }

    // Exécuter initPlayer immédiatement si le DOM est déjà chargé, sinon attendre l'événement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }
})();
