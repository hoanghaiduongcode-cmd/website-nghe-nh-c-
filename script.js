const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const fileUpload = document.getElementById('file-upload');
const playlist = document.getElementById('playlist');

let songs = []; // Mảng chứa dữ liệu các bài hát được tải lên
let songIndex = 0;

// Xử lý khi người dùng chọn file MP3
fileUpload.addEventListener('change', function(e) {
    const files = e.target.files;
    
    if (files.length === 0) return;

    const isFirstUpload = songs.length === 0;

    // Quét qua các file vừa chọn và thêm vào mảng songs
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Tạo đường dẫn tạm thời (Blob URL) để trình duyệt có thể phát file từ máy tính
        const fileURL = URL.createObjectURL(file);
        
        songs.push({
            name: file.name.replace(/\.[^/.]+$/, ""), // Cắt đuôi .mp3 đi cho đẹp
            url: fileURL
        });
    }

    renderPlaylist();

    // Nếu là lần tải lên đầu tiên, tự động chọn bài số 1
    if (isFirstUpload) {
        loadSong(0);
    }
});

// Hiển thị danh sách phát ra màn hình
function renderPlaylist() {
    playlist.innerHTML = ''; // Xóa thông báo trống
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = song.name;
        
        // Đánh dấu bài hát đang phát
        if (index === songIndex) {
            li.classList.add('playing');
        }

        // Bấm vào tên bài trong danh sách để phát luôn
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });

        playlist.appendChild(li);
    });
}

// Cập nhật thông tin bài hát vào Trình phát
function loadSong(index) {
    if (songs.length === 0) return;
    
    title.innerText = songs[index].name;
    audio.src = songs[index].url;
    
    // Cập nhật lại giao diện danh sách (để tô màu xanh bài đang phát)
    renderPlaylist();
}

// Phát nhạc
function playSong() {
    if (songs.length === 0) return; // Không có nhạc thì không làm gì
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

// Bài trước đó
function prevSong() {
    if (songs.length === 0) return;
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songIndex);
    playSong();
}

// Bài tiếp theo
function nextSong() {
    if (songs.length === 0) return;
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songIndex);
    playSong();
}

// Thanh tiến trình
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
}

// Tua nhạc
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Các sự kiện click
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

// Tự động chuyển bài khi hết nhạc
audio.addEventListener('ended', nextSong);
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
