var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

playlist = JSON.parse(document.currentScript.getAttribute('playlist'));
autoplay = JSON.parse(document.currentScript.getAttribute('autoplay'));
shuffle = JSON.parse(document.currentScript.getAttribute('shuffle'));

var player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
  width: '0',
  height: '0',
  playerVars: {
  'playsinline': 1
},
events: {
  'onReady': onPlayerReady,
  'onStateChange': onPlayerStateChange
    }
  });
}
    // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  controller.init();
  controller.updateSong();
  setInterval(controller.updateDuration, 1000);
}

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  if (player.getPlayerState() == 0) {
    controller.nextSong(); 
    var pbutton = document.getElementById("pausebuttonimage");
    pbutton.src = "/ikir/forward.png"; 
  }
  if (player.getPlayerState() == 2 || player.getPlayerState() == -1) {
    var pbutton = document.getElementById("pausebuttonimage");
    pbutton.src = "/ikir/forward.png"; 
  } else {
  var pbutton = document.getElementById("pausebuttonimage");
    pbutton.src = "/ikir/pause.png"; 
  }
}
      
var controller = {
  
  // constants for the player
  playlist: [],
  autoplay: false,
  shuffle: false,
  
  // variables for the song
  songIndex: 0,  
}


controller.init = function() {
  
  controller.playlist = playlist;
  controller.autoplay = autoplay;
  controller.shuffle = shuffle;
  if (controller.shuffle) {
    controller.playlist = controller.shuffleArray(controller.playlist);
  }
  
  var elem = document.querySelector(".ikirwrap");
  var title = document.createElement("p");
  title.className = "songtitle";
  title.innerText = "Not Playing";
   
  var prev = document.createElement("a");https://neocities.org/site_files/text_editor?filename=ikirPlayer2.js#
  prev.id = "prevbutton";
  prev.className = "controlbutton";
  var prev_img = document.createElement("img");
  prev_img.className = "controlimage";
  prev_img.src = "/ikir/back.png";
  prev_img.alt = "Previous Song";
  prev_img.title = "Previous Song"
  //prev_img.width = 64;
  //prev_img.height = 128;
  prev.appendChild(prev_img);
  prev.onclick = function() { controller.previousSong(); };
  elem.appendChild(prev);
  
  var pause = document.createElement("a");
  pause.id = "pausebutton";
  pause.className = "controlbutton";
  var pause_img = document.createElement("img");
  pause_img.id = "pausebuttonimage";
  pause_img.className = "controlimage";
  pause_img.src = "/ikir/pause.png";
  pause_img.alt = "Pause";
  pause_img.title = "Pause"
  //pause_img.width = 64;
  //pause_img.height = 128;
  pause.appendChild(pause_img);
  pause.onclick = function() { controller.togglePlayback(); };
  elem.appendChild(pause);
  
  var next = document.createElement("a");
  next.id = "nextbutton";
  next.className = "controlbutton";
  var next_img = document.createElement("img");
  next_img.className = "controlimage";
  next_img.src = "/ikir/forward.png";
  next_img.alt = "Next Song";
  next_img.title = "Next Song"
  //next_img.width = 64;
  //next_img.height = 128;
  next.appendChild(next_img);
  next.onclick = function() { controller.nextSong(); };
  elem.appendChild(next);  
  
  var title = document.createElement("p");
  title.className = "songtitle";
  title.innerText = "Not Playing";
  elem.appendChild(title);
  
  var dura = document.createElement("p");
  dura.className = "duration";
  dura.innerText = "--:-- / --:--";
  elem.appendChild(dura);
  
  var list = document.createElement("div");
  list.className = "ikirplaylist";
  elem.appendChild(list);

  //var playlistString = controller.playliststring();
  for (var i = 0; i < controller.playlist.length; i++) {
    let line = document.createElement("a");
    line.id = "song-button-" + i;
    line.className = "songbutton"
    line.innerText = controller.playlist[i].title;
    line.onclick = function() {controller.chooseSong(line.id.replace("song-button-",""));};
    list.appendChild(line);
  }
}
controller.shuffleArray = function(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

controller.togglePlayback = function () {
  if (player.getPlayerState() == 2 || player.getPlayerState() == -1) {
    player.playVideo();
    var pbutton = document.getElementById("pausebuttonimage");
    pbutton.src = "/ikir/pause.png";
  } else {
    player.pauseVideo();
    var pbutton = document.getElementById("pausebuttonimage");
    pbutton.src = "/ikir/forward.png";
  }
}
    
controller.nextSong = function () {
  controller.songIndex++;
  if (controller.songIndex == controller.playlist.length)
  {
    controller.songIndex = 0;
  }
  
  controller.updateSong();
}
controller.previousSong = function () {
  controller.songIndex--;
  if (controller.songIndex <= -1)
  {
    controller.songIndex = controller.playlist.length - 1;
  }
  controller.updateSong();
}

controller.updateSong = function () {
  if (controller.autoplay) {
    player.loadVideoById(controller.playlist[controller.songIndex].url.replace("https://www.youtube.com/watch?v=",""));
  } else {
    player.cueVideoById(controller.playlist[controller.songIndex].url.replace("https://www.youtube.com/watch?v=",""));
  }
  var title = document.querySelector(".songtitle");
  title.innerText = controller.playlist[controller.songIndex].title;
}

controller.chooseSong = function (e) {
  console.log(e);
  controller.songIndex = e;
  if (controller.autoplay) {
    player.loadVideoById(controller.playlist[controller.songIndex].url.replace("https://www.youtube.com/watch?v=",""));
  } else {
    player.cueVideoById(controller.playlist[controller.songIndex].url.replace("https://www.youtube.com/watch?v=",""));
  }
  var title = document.querySelector(".songtitle");
  title.innerText = controller.playlist[controller.songIndex].title;
}

controller.playliststring = function () {
  let out = '';
  for (var i = 0; i < controller.playlist.length; i++) {
    out += controller.playlist[i].title + '\n';
  }
  return out;
}

controller.updateDuration = function () {
  var dura = document.querySelector(".duration");
  var time = player.getCurrentTime();
  var duration = player.getDuration();
  dura.innerText = String(Math.floor(time / 60)).padStart(2, '0')+ ":" + String(Math.floor(time % 60)).padStart(2, '0') + " / " + String(Math.floor(duration / 60)).padStart(2, '0') + ":" + String(Math.floor(duration % 60)).padStart(2, '0'); 
}
