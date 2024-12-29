const authPage = document.getElementById('authPage');
const mainApp = document.getElementById('mainApp');
const authForm = document.getElementById('authForm');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const videoList = document.getElementById('videoList');

// API Key
const API_KEY = 'AIzaSyAHmyhuoJ0b3rs5ylPzDPKBqRndLG_o6fc';

// Show loading screen and hide it after 2 seconds
document.addEventListener('DOMContentLoaded', () => {
    const loadingPage = document.getElementById('loadingPage');
    const appContent = document.getElementById('appContent');

    setTimeout(() => {
        loadingPage.style.display = 'none';
        appContent.style.display = 'block';
    }, 2000); // Simulates a 2-second load time
});

// Navigation
document.getElementById('homeBtn').addEventListener('click', fetchTrendingVideos);
document.getElementById('watchlistBtn').addEventListener('click', showWatchlist);

// Authenticate User
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    authPage.style.display = 'none';
    mainApp.style.display = 'block';
    fetchTrendingVideos(); // Load default anime videos on login
});

// Search Videos
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (!query) return;

    fetchVideos(query);
});

// Fetch Default Anime Videos
function fetchTrendingVideos() {
    fetchVideos('anime');
}

// Fetch Videos
function fetchVideos(query) {
    const searchQuery = `${query} anime`;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=10&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => displayVideos(data.items))
        .catch(error => console.error('Error fetching data:', error));
}

// Display Videos
function displayVideos(videos) {
    videoList.innerHTML = '';
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <h3>${video.snippet.title}</h3>
            <button class="watchlist-btn">Add to Watchlist</button>
        `;
        videoCard.querySelector('.watchlist-btn').addEventListener('click', () => saveToWatchlist(video));
        videoCard.addEventListener('click', () => playVideo(video.id.videoId));
        videoList.appendChild(videoCard);
    });
}

// Play Video
function playVideo(videoId) {
    const backButton = document.createElement('button');
    backButton.textContent = "Back to List";
    backButton.addEventListener('click', fetchTrendingVideos);

    const player = document.createElement('iframe');
    player.src = `https://www.youtube.com/embed/${videoId}`;
    player.width = '100%';
    player.height = '400px';

    videoList.innerHTML = ''; 
    videoList.appendChild(backButton);
    videoList.appendChild(player);
}

// Watchlist
function saveToWatchlist(video) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(video);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function showWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (watchlist.length === 0) {
        videoList.innerHTML = '<p>No items in Watchlist.</p>';
        return;
    }
    displayVideos(watchlist);
}
