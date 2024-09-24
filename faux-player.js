document.addEventListener('DOMContentLoaded', function() {
    const loadVideoButton = document.getElementById('loadVideoButton');
    const videoUrlInput = document.getElementById('videoUrl');
    const videoContainer = document.getElementById('videoContainer');

    loadVideoButton.addEventListener('click', function() {
        const videoSource = videoUrlInput.value.trim();

        if (videoSource) {
            // Create the player with the provided URL
            generatePlayer(videoSource);
        } else {
            alert('Veuillez fournir une URL de vidéo MP4 valide.');
        }
    });

    function generatePlayer(videoSource) {
        // Clear existing content in the container
        videoContainer.innerHTML = '';

        // HTML code of the player
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

        // Inject the player into the container
        videoContainer.innerHTML = playerHTML;

        // Initialize the player after the DOM has been updated
        requestAnimationFrame(initPlayer);
    }

    function initPlayer() {
        const video = document.getElementById('videoElement');
        const playButton = document.getElementById('playButton');
        const progressBar = document.getElementById('progress');

        if (!video || !playButton || !progressBar) {
            console.error('Les éléments du lecteur vidéo ne sont pas trouvés. Retrying...');
            // Retry initialization after a short delay
            setTimeout(initPlayer, 50);
            return;
        }

        let playing = false;
        const accelerationTime = 35; // Accelerate over the first 35 seconds
        let realDuration = 0; // Real duration of the video
        const oneThirdProgress = 33.33; // The bar will reach 1/3 after acceleration
        let intervalId;

        // Disable native video controls
        video.controls = false;

        // Wait for the video metadata to load to get the real duration
        video.addEventListener('loadedmetadata', function() {
            realDuration = video.duration; // Get the real duration of the video
        });

        // Start the video when the user clicks the Play button
        playButton.addEventListener('click', function() {
            if (!playing) {
                video.play(); // Play the video
                playButton.style.display = 'none'; // Hide the Play button
                startFakeProgress();
            }
        });

        // Function to start the custom progress
        function startFakeProgress() {
            playing = true;
            let isAccelerated = true;

            intervalId = setInterval(function() {
                const currentTime = video.currentTime; // Get the current time of the video

                if (currentTime <= accelerationTime && isAccelerated) {
                    // Calculate accelerated progress to reach 1/3 in 35 seconds
                    let acceleratedProgress = (currentTime / accelerationTime) * oneThirdProgress;
                    updateProgress(acceleratedProgress);
                } else {
                    // Switch to normal progress after acceleration
                    isAccelerated = false;
                    const remainingTime = realDuration - accelerationTime; // Remaining time after 35s
                    let progressFromThird = ((currentTime - accelerationTime) / remainingTime) * (100 - oneThirdProgress) + oneThirdProgress;
                    updateProgress(progressFromThird);
                }

                // If the video is over, reset the player
                if (currentTime >= realDuration) {
                    clearInterval(intervalId);
                    resetPlayer();
                }
            }, 100); // Update every 100ms
        }

        // Update the progress bar
        function updateProgress(percent) {
            progressBar.style.width = percent + '%'; // Adjust the width of the bar
        }

        // Reset the player once the video is over or stopped
        function resetPlayer() {
            playing = false;
            playButton.style.display = 'block'; // Show the Play button again
            updateProgress(0); // Reset the progress bar
        }

        // Allow pausing the video by clicking directly on it
        video.addEventListener('click', function() {
            if (playing) {
                video.pause(); // Pause the video
                clearInterval(intervalId); // Stop the progress
                playButton.style.display = 'block'; // Show the Play button again
                playing = false;
            } else {
                video.play(); // Resume the video if it was paused
                playButton.style.display = 'none'; // Hide the Play button
                startFakeProgress();
                playing = true;
            }
        });

        // Handle errors when loading the video
        video.addEventListener('error', function() {
            alert('Erreur lors du chargement de la vidéo. Veuillez vérifier l\'URL et réessayer.');
            resetPlayer();
        });
    }
});
