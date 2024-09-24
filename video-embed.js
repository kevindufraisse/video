document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('videoForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const videoFileInput = document.getElementById('videoFile');
    const embedCodeTextarea = document.getElementById('embedCode');
    const videoPreview = document.getElementById('videoPreview');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission du formulaire
        
        let videoSource = '';

        // Si un lien est fourni, l'utiliser
        if (videoUrlInput.value) {
            videoSource = videoUrlInput.value;
        }
        // Sinon, si un fichier est uploadé, créer une URL temporaire pour ce fichier
        else if (videoFileInput.files.length > 0) {
            const file = videoFileInput.files[0];
            videoSource = URL.createObjectURL(file); // Créer un lien temporaire pour le fichier
        }

        // Si une source vidéo est disponible, générer le player
        if (videoSource) {
            generatePlayer(videoSource);
        } else {
            alert('Veuillez fournir un lien ou uploader un fichier MP4.');
        }
    });

    // Fonction pour générer le player et le code d'embed
    function generatePlayer(videoSource) {
        const playerHTML = `
            <div id="fauxPlayer" style="width: 600px; height: 350px; position: relative; background-color: #000;">
                <video id="videoElement" preload="auto" style="width: 100%; height: 100%;" controls>
                    <source src="${videoSource}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div id="progressBar" style="width: 100%; height: 5px; background-color: #ccc; position: absolute; bottom: 0; left: 0;">
                    <div id="progress" style="width: 0; height: 100%; background-color: #ff0000;"></div>
                </div>
                <div id="playButton" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; background-color: #fff; cursor: pointer; border-radius: 5px;">Play</div>
            </div>
            <script src="faux-player.js"></script>
        `;

        // Afficher le player dans la zone de prévisualisation
        videoPreview.innerHTML = playerHTML;

        // Générer le code d'embed
        const embedCode = `<div>${playerHTML}</div>`;
        embedCodeTextarea.value = embedCode;
    }
});
