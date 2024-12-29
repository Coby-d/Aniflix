const API_KEY = 'AIzaSyAHmyhuoJ0b3rs5ylPzDPKBqRndLG_o6fc'; // Replace with your API key
const authPage = document.getElementById('authPage');
const mainApp = document.getElementById('mainApp');
const authForm = document.getElementById('authForm');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const videoList = document.getElementById('videoList');

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
    const searchQuery = `${query} anime`; // Append "anime" to every query
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=10&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => filterAnimeVideos(data.items))
        .catch(error => console.error('Error fetching data:', error));
}

// Filter Results for Strict Anime Matches
function filterAnimeVideos(videos) {
    const animeVideos = videos.filter(video => 
        video.snippet.title.toLowerCase().includes('anime') || 
        video.snippet.description.toLowerCase().includes('anime')
    );

    if (animeVideos.length === 0) {
        videoList.innerHTML = `<p style="text-align: center;">No anime found. Try a different search.</p>`;
    } else {
        displayVideos(animeVideos);
    }
}

// Display Videos
function displayVideos(videos) {
    videoList.innerHTML = '';
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <h3>${video.snippet.title}</h3>
        `;
        videoCard.addEventListener('click', () => playVideo(video.id.videoId));
        videoList.appendChild(videoCard);
    });
}

// Play Video
function playVideo(videoId) {
    const player = document.createElement('iframe');
    player.src = `https://www.youtube.com/embed/${videoId}`;
    player.width = '100%';
    player.height = '400px';
    player.frameBorder = '0';
    player.allowFullscreen = true;

    videoList.innerHTML = ''; // Clear the list to focus on the player
    videoList.appendChild(player);
}