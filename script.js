const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

// Danh sách các bài hát
// Cập nhật tên bài hát ở đây (tương ứng với tên file trong thư mục music)
const songs = ['bai-hat-1', 'bai-hat-2', 'bai-hat-3'];

// Theo dõi bài hát hiện tại
let songIndex = 0;

// Tải bài hát đầu tiên vào DOM
loadSong(songs[songIndex]);

// Cập nhật chi tiết bài hát
function loadSong(song) {
    title.innerText = song.replace(/-/g, ' ').toUpperCase();
    
    // Đảm bảo bạn có file .mp3 trong thư mục music/
    // Ví dụ: music/bai-hat-1.mp3
    // audio.src = `music/${song}.mp3`; 
    
    // Tạm thời dùng link nhạc bản quyền mở (để test code hoạt động)
    audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`; 
    
    // Đảm bảo bạn có file ảnh trong thư mục images/
    // cover.src = `images/${song}.jpg`;
}

// Phát nhạc
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

// Tạm dừng nhạc
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

// Chuyển bài trước đó
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Chuyển bài tiếp theo
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Cập nhật thanh tiến trình
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

// Tua nhạc khi click vào thanh tiến trình
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Lắng nghe các sự kiện (Event Listeners)
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
