// Buttons
const playButton = document.getElementById("pausePlay");
const forwardButton = document.getElementById("forward");
const backButton = document.getElementById("backward");
const fileButton = document.getElementById("files")

const song = document.getElementById("song") // has songs/ before the file name

var audio = document.getElementById('music');

// Add Song button config
document.getElementById('addSong').addEventListener('click', async () => {
  const result = await window.versions.selectAndCopyFiles();
  if (result.canceled) {
    console.log('File selection was canceled.');
  } else if (result.error) {
    alert(`Error: ${result.error}`);
  } else {
    console.log('Files added:', result.filePaths);
    alert('Files added successfully');
  }
});

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
        alert(`${file} is now playing`);
        song.src = file
        console.log(song.src)
        audio.load();
      });
      li.appendChild(button);
      fileList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};


const icon = document.getElementById("play"); // Inside of play button

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
    icon.classList.remove('fa-pause');
    audio.pause();
    icon.classList.add('fa-play');
  }
};


