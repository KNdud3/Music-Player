const button = document.getElementById("test");
const icon = document.getElementById("play");

button.onclick = e => {
  if (icon.classList.contains('fa-play')) {
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  } else {
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
};
