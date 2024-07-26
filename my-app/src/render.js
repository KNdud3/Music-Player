// Buttons
const playButton = document.getElementById("pausePlay");
const forwardButton = document.getElementById("forward");
const backButton = document.getElementById("backward");
const fileButton = document.getElementById("files")


const icon = document.getElementById("play"); // Inside of play button

var audio = document.getElementById('music');

playButton.onclick = e => {
  if (icon.classList.contains('fa-play')) {
    icon.classList.remove('fa-play');
    audio.play().catch(function(error) {
      console.log('Error playing audio:', error);
    });
    icon.classList.add('fa-pause');
  } 
  else {
    icon.classList.remove('fa-pause');
    audio.pause();
    icon.classList.add('fa-play');
  }
};


