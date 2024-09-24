document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('videoForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const embedCodeTextarea = document.getElementById('embedCode');
    const videoPreview = document.getElementById('videoPreview');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission du formulaire

        const videoSource = videoUrlInput.value;

        if (videoSource) {
            generatePlayer(videoSource);
        } else {
            alert('Veuillez fournir un lien MP4 valide.');
        }
    });

    // Fonction pour générer le player et le code d'embed
    function generatePlayer(videoSource) {
        // Code HTML du player avec le fichier faux-player.js
        const playerHTML = `
            <div id="fauxPlayer" style="width: 600px; height: 350px; position: relative; background-color: #000;">
                <video id="videoElement" preload="auto" style="width: 100%; height: 100%; pointer-events: none;">
                    <source src="${videoSource}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div id="progressBar" style="width: 100%; height: 5px; background-color: #ccc; position: absolute; bottom: 0; left: 0;">
                    <div id="progress" style="width: 0; height: 100%; background-color: #ff0000;"></div>
                </div>
                <div id="playButton" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; background-color: #fff; cursor: pointer; border-radius: 5px;">Play</div>
            </div>
        `;

        // Afficher le player dans la zone de prévisualisation
        videoPreview.innerHTML = playerHTML;

        // Charger le script faux-player.js après que le player ait été ajouté au DOM
        setTimeout(attachPlayerEvents, 100); // Retarder l'attachement des événements
    }

    // Fonction pour attacher les événements au player
    function attachPlayerEvents() {
        const video = document.getElementById('videoElement');
        const playButton = document.getElementById('playButton');
        const progressBar = document.getElementById('progress');

        let playing = false;
        const accelerationTime = 35; // Accélération sur les 35 premières secondes
        let realDuration = 0; // Durée réelle de la vidéo
        const oneThirdProgress = 33.33; // La barre atteindra 1/3 après l'accélération
        let intervalId;

        // Assurez-vous que le fichier vidéo est bien chargé
        video.addEventListener('loadedmetadata', function() {
            realDuration = video.duration;
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
            let currentTime = 0;
            let isAccelerated = true;

            intervalId = setInterval(function() {
                currentTime = video.currentTime; // Obtenir le temps actuel de la vidéo

                if (currentTime <= accelerationTime && isAccelerated) {
                    // Calculer la progression accélérée pour atteindre 1/3 en 35 secondes
                    let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                    updateProgress(acceleratedProgress);
                } else {
                    // Passer à la progression normale après l'accélération
                    isAccelerated = false;
                    let remainingTime = realDuration - accelerationTime; // Temps restant après 35s
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
    }
});
