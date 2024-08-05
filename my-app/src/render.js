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

const playedAmount = document.getElementById('playedAmount'); // Needs fixing
    audio.addEventListener('timeupdate', () => {
      const percentagePlayed = (audio.currentTime / audio.duration) * 100;
      playedAmount.style.width = `${percentagePlayed}%`;
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
  try {
    const files = await window.versions.getDirectoryFiles('src/songs');
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
      button.addEventListener('click', () => {
        song.src = `songs/${file}`
        audio.load();
        playingText.innerHTML = `Now playing: ${file}`
        if (icon.classList.contains('fa-pause')) {
          pauseSong();
        }
      });
      li.appendChild(button);
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

// Pauses song
function pauseSong(){
  icon.classList.remove('fa-pause');
  audio.pause();
  icon.classList.add('fa-play');
}


