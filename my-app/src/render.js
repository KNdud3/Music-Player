// Buttons
const playButton = document.getElementById("pausePlay");
const forwardButton = document.getElementById("forward");
const backButton = document.getElementById("backward");
const fileButton = document.getElementById("files");
const addSongButton = document.getElementById('addSong');

const icon = document.getElementById("play"); // Inside of play button

const song = document.getElementById("song") // Has songs/ before the file name

const playingText = document.getElementById("playing")

var audio = document.getElementById('music'); // Audio tag as a whole

const playedAmount = document.getElementById('playedAmount');
const timeText = document.getElementById('time')

// Used to change the displays for the progress bar and the time the song has run for
audio.addEventListener('timeupdate', () => {
  var currentSeconds  = Math.trunc(audio.currentTime%60);
  if (isNaN(audio.duration)) {
    timeText.innerHTML = `--/--`
  }
  else {
    if (currentSeconds < 10) {
      var currentText = `${Math.trunc(audio.currentTime/60)}:0${currentSeconds}`;
    }
    else {
      var currentText = `${Math.trunc(audio.currentTime/60)}:${currentSeconds}`;
    }
    var totSeconds = Math.trunc(audio.duration%60);
    if (totSeconds < 10) {
      var totText = `${Math.trunc(audio.duration/60)}:0${totSeconds}`
    }
    else {
      var totText = `${Math.trunc(audio.duration/60)}:${totSeconds}`
    }
    timeText.innerHTML = `${currentText} / ${totText}`
  }
  playedAmount.style.width = `${(audio.currentTime/audio.duration) * 100}%`; // Makes the secondary bar the percentage of the song played
});



// Add Song button config
 addSongButton.onclick = async () => {
  const result = await window.versions.selectAndCopyFiles();
  if (result.canceled) {
    pass
  } 
  else if (result.error) {
    alert(`Error: ${result.error}`);
  } 
  else {
    alert('Files added successfully');
  }
};

// Load Files
fileButton.onclick = async () => {
  try { // Try catch used mostly for testing
    const files = await window.versions.getDirectoryFiles();
    if (files.error) {
      alert(`Error: ${files.error}`);
      return;
    }

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    files.forEach(file => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = file;
      button.addEventListener('click', () => { // Make buttons for each file that change the song
        song.src = `songs/${file}`
        audio.load();
        playingText.innerHTML = `Now playing: ${file}`
        if (icon.classList.contains('fa-pause')) {
          pauseSong();
        }
        playedAmount.style.width = 0;
      });
      li.appendChild(button); // Each list node will be a button corresponding to a song
      fileList.appendChild(li);
    });
  } 
  catch (error) {
    console.error('Error fetching files:', error);
  }
};

// Play Button
playButton.onclick = () => {
  if (icon.classList.contains('fa-play')) {
    icon.classList.remove('fa-play');
    audio.play().catch(function(error) {
      console.log('Error playing audio:', error);
    });
    icon.classList.add('fa-pause');
  } 
  else {   
    pauseSong();
  }
};

// Forward and back buttons
forwardButton.onclick = () => {
  audio.currentTime = audio.duration;
}

backButton.onclick = () => {
  audio.currentTime = 0;
}

// Pauses song and switches pause icon to play
function pauseSong(){
  icon.classList.remove('fa-pause');
  audio.pause();
  icon.classList.add('fa-play');
}


