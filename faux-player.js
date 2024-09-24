document.addEventListener('DOMContentLoaded', function() {
    const loadVideoButton = document.getElementById('loadVideoButton');
    const videoUrlInput = document.getElementById('videoUrl');
    const videoContainer = document.getElementById('videoContainer');

    loadVideoButton.addEventListener('click', function() {
        const videoSource = videoUrlInput.value.trim();

        if (videoSource) {
            // Créer le lecteur avec l'URL fournie
            generatePlayer(videoSource);
        } else {
            alert('Veuillez fournir une URL de vidéo MP4 valide.');
        }
    });

    function generatePlayer(videoSource) {
        // Effacer le contenu existant dans le conteneur
        videoContainer.innerHTML = '';

        // Code HTML du lecteur
        const playerHTML = `
            <div id="fauxPlayer" style="width: 600px; height: 350px; position: relative; background-color: #000;">
                <video id="videoElement" preload="auto" style="width: 100%; height: 100%;">
                    <source src="${videoSource}" type="video/mp4">
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>
                <div id="progressBar" style="width: 100%; height: 5px; background-color: #ccc; position: absolute; bottom: 0; left: 0;">
                    <div id="progress" style="width: 0%; height: 100%; background-color: #ff0000;"></div>
                </div>
                <div id="playButton" style="
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    padding: 10px 20px; background-color: #fff; cursor: pointer; border-radius: 5px;">
                    Play
                </div>
            </div>
        `;

        // Injecter le lecteur dans le conteneur
        videoContainer.innerHTML = playerHTML;

        // Initialiser les contrôles du lecteur
        initPlayer();
    }

    function initPlayer() {
        const video = document.getElementById('videoElement');
        const playButton = document.getElementById('playButton');
        const progressBar = document.getElementById('progress');

        if (!video || !playButton || !progressBar) {
            console.error('Les éléments du lecteur vidéo ne sont pas trouvés.');
            return;
        }

        let playing = false;
        const accelerationTime = 35; // Accélération sur les 35 premières secondes
        let realDuration = 0; // Durée réelle de la vidéo
        const oneThirdProgress = 33.33; // La barre atteindra 1/3 après l'accélération
        let intervalId;

        // Désactiver les contrôles natifs de la vidéo
        video.controls = false;

        // Attendre que les métadonnées de la vidéo soient chargées pour obtenir la durée réelle
        video.addEventListener('loadedmetadata', function() {
            realDuration = video.duration; // Obtenir la durée réelle de la vidéo
        });

        // Démarrer la vidéo lorsque l'utilisateur clique sur le bouton Play
        playButton.addEventListener('click', function() {
            if (!playing) {
                video.play(); // Jouer la vidéo
                playButton.style.display = 'none'; // Cacher le bouton Play
                startFakeProgress();
            }
        });

        // Fonction pour démarrer la progression personnalisée
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

        // Réinitialiser le lecteur une fois la vidéo terminée ou arrêtée
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

        // Gérer les erreurs lors du chargement de la vidéo
        video.addEventListener('error', function() {
            alert('Erreur lors du chargement de la vidéo. Veuillez vérifier l\'URL et réessayer.');
            resetPlayer();
        });
    }
});
