// Encapsuler le code pour éviter les conflits avec d'autres scripts
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        // Sélection des éléments par classe pour gérer plusieurs instances
        const players = document.querySelectorAll('.videoContainer');

        players.forEach(function(player) {
            const video = player.querySelector('.videoElement');
            const playButton = player.querySelector('.playButton');
            const progressBar = player.querySelector('.progress');

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
                        let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdP
