const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

const titleDOM = document.getElementById('title');
const artistDOM = document.getElementById('artist');
const currentTimeDOM = document.getElementById('current-time');
const durationTimeDOM = document.getElementById('duration-time');
const playlistDOM = document.getElementById('playlist');
const fileUpload = document.getElementById('file-upload');
const discSection = document.querySelector('.disc-section');

let songs = [];
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Format thời gian từ giây sang phút:giây
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Xử lý File tải lên
fileUpload.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    const isFirstUpload = songs.length === 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileURL = URL.createObjectURL(file);
        
        songs.push({
            name: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist", // Do file MP3 local khó trích xuất metadata nhanh nên để mặc định
            url: fileURL
        });
    }

    renderPlaylist();
    if (isFirstUpload) loadSong(0);
});

// Hiển thị danh sách phát
function renderPlaylist() {
    playlistDOM.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="song-num">${index + 1}</span> ${song.name}`;
        
        if (index === songIndex) li.classList.add('active');

        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });
        playlistDOM.appendChild(li);
    });
}

// Tải bài hát
function loadSong(index) {
    if (songs.length === 0) return;
    
    const song = songs[index];
    titleDOM.innerText = song.name;
    artistDOM.innerText = song.artist;
    audio.src = song.url;
    
    // Reset thời gian
    currentTimeDOM.innerText = "0:00";
    
    renderPlaylist();
}

// Play / Pause
function playSong() {
    if (songs.length === 0) return;
    isPlaying = true;
    discSection.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    discSection.classList.remove('playing');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

// Next / Prev
function nextSong() {
    if (songs.length === 0) return;

    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
    }
    
    loadSong(songIndex);
    playSong();
}

function prevSong() {
    if (songs.length === 0) return;
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songIndex);
    playSong();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Shuffle & Repeat
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
});

// Tự động xử lý khi hết bài
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// Cập nhật thanh tiến trình
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const percent = (currentTime / duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeDOM.innerText = formatTime(currentTime);
        durationTimeDOM.innerText = formatTime(duration);
    }
});

// Tua nhạc
progressContainer.addEventListener('click', function(e) {
    if (songs.length === 0) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// Điều chỉnh âm lượng
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    // Đổi icon loa tùy theo âm lượng
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});
