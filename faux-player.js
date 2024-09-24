document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('videoElement');
    const playButton = document.getElementById('playButton');
    const progressBar = document.getElementById('progress');

    let playing = false;
    const accelerationTime = 35; // Accélération sur les 35 premières secondes
    let realDuration = 0; // Durée réelle de la vidéo
    const oneThirdProgress = 33.33; // La barre atteindra 1/3 après l'accélération
    let intervalId;

    // Enlever les contrôles natifs de la vidéo
    video.controls = false;

    // Attendre que les métadonnées de la vidéo soient chargées pour obtenir la vraie durée
    video.addEventListener('loadedmetadata', function() {
        realDuration = video.duration; // Obtenir la vraie durée de la vidéo
    });

    // Démarrer la vidéo lorsque l'utilisateur clique sur le bouton Play
    playButton.addEventListener('click', function() {
        if (!playing) {
            video.play(); // Jouer la vidéo
            playButton.style.display = 'none'; // Cacher le bouton Play
            startFakeProgress();
        }
    });

    // Fonction pour démarrer la fausse progression
    function startFakeProgress() {
        playing = true;
        let isAccelerated = true;

        intervalId = setInterval(function() {
            const currentTime = video.currentTime; // Obtenir le temps actuel de la vidéo

            if (currentTime <= accelerationTime && isAccelerated) {
                // Calculer la progression accélérée pour atteindre 1/3 en 35 secondes
                let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                updateProgress(acceleratedProgress);
            } else {
                // Passer à la progression normale après l'accélération
                isAccelerated = false;
                const remainingTime = realDuration - accelerationTime; // Temps restant après 35s
                let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdProgress) + oneThirdProgress;
                updateProgress(progressFromThird);
            }

            // Si la vidéo est terminée, réinitialiser
            if (currentTime >= realDuration) {
                clearInterval(intervalId);
                resetPlayer();
            }
        }, 100); // Mise à jour toutes les 100ms
    }

    // Mettre à jour la barre de progression
    function updateProgress(percent) {
        progressBar.style.width = percent + '%'; // Ajuster la largeur de la barre
    }

    // Réinitialiser le player une fois la vidéo terminée ou arrêtée
    function resetPlayer() {
        playing = false;
        playButton.style.display = 'block'; // Réafficher le bouton de lecture
        updateProgress(0); // Réinitialiser la barre de progression
    }

    // Permettre de mettre la vidéo en pause en cliquant directement sur la vidéo
    video.addEventListener('click', function() {
        if (playing) {
            video.pause(); // Mettre la vidéo en pause
            clearInterval(intervalId); // Arrêter la progression
            playButton.style.display = 'block'; // Réafficher le bouton Play
            playing = false;
        } else {
            video.play(); // Reprendre la vidéo si elle était en pause
            playButton.style.display = 'none'; // Cacher le bouton Play
            startFakeProgress();
            playing = true;
        }
    });
});
