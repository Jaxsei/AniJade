const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const switchMusicBtn = document.getElementById("musicBtn");
let currentMusic = 0, videos = { music_videos: [] };

// Event listener for the search button
const fetchAnimeData = async (query) => {
  try {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = encodeURIComponent(`https://api.jikan.moe/v4/anime?q=${query}`);
    const response = await fetch(proxyUrl + targetUrl);
    const data = await response.json();
    const animeData = JSON.parse(data.contents);
    console.log(animeData);

    if (animeData.data && animeData.data.length > 0) {
      const firstAnime = animeData.data[0];
      animeVisual(firstAnime);
      animeDetails(firstAnime);
      truncateText('sypnosis', 540);

      // Fetch related videos using the getAnimeVideos endpoint
      const videoApiUrl = `https://api.jikan.moe/v4/anime/${firstAnime.mal_id}/videos`;
      const videoResponse = await fetch(proxyUrl + encodeURIComponent(videoApiUrl));
      const videoData = await videoResponse.json();
      videos = JSON.parse(videoData.contents);

      console.log(videos); // Handle the videos data here
    } else {
      console.error('No anime found for the query.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

searchBtn.addEventListener("click", () => {
  const query = searchBox.value.trim();
  if (query) {
    fetchAnimeData(query);
  } else {
    window.alert("Please enter an anime title");
  }
});

switchMusicBtn.addEventListener("click", () => {
  if (videos.data.music_videos.length === 0) {
    window.prompt('No music videos available');
    return;
  }

  currentMusic++;

  if (currentMusic >= videos.data.music_videos.length) {
    currentMusic = 0;
  }

  document.getElementById('animeTrailer').src = videos.data.music_videos[currentMusic].video.embed_url;
});
// Update the visual elements
function animeVisual(anime) {
  document.getElementById('animeCover').src = anime.images.jpg.large_image_url;
  document.getElementById('animeTrailer').src = anime.trailer.embed_url;
}

// Update the details elements
function animeDetails(anime) {
  const { year, rank, popularity, members, favorites, genres, themes, type, episodes, status, aired, season, producers, broadcast, licensors, studios, source, duration, synopsis } = anime;

  // Limit producers to the first 3 (you can change this number)
  const maxProducers = 2;
  const limitedProducers = producers.slice(0, maxProducers).map(p => p.name).join(', ');
  const remainingProducers = producers.length > maxProducers ? `, and ${producers.length - maxProducers} more` : '';

  // Display anime details
  document.getElementById('animeName').textContent = anime.title_english || anime.title;
  document.getElementById('animeYear').textContent = `${season} ${year}`;
  document.getElementById('rank').textContent = `Rank #${rank.toLocaleString()}`;
  document.getElementById('popular').textContent = `Popularity #${popularity.toLocaleString()}`;
  document.getElementById('members').textContent = `Members ${members.toLocaleString()}`;
  document.getElementById('favourite').textContent = `Favourites ${favorites.toLocaleString()}`;

  // Display additional anime info
  document.getElementById('typeTv').textContent = `Type: ${type}`;
  document.getElementById('typeEpi').textContent = `Episodes: ${episodes}`;
  document.getElementById('typeStatus').textContent = `Status: ${status}`;
  document.getElementById('typeAired').textContent = `Airing: ${aired.string}`;
  document.getElementById('typePremier').textContent = `Premiered: ${season} ${year}`;
  document.getElementById('typeProducers').textContent = `Producers: ${limitedProducers}${remainingProducers}`;
  document.getElementById('typeBroadcast').textContent = `Broadcast: ${broadcast.string}`;
  document.getElementById('typeLicense').textContent = `License: ${licensors.map(l => l.name).join(', ')}`;
  document.getElementById('typeStudio').textContent = `Studio: ${studios.map(s => s.name).join(', ')}`;
  document.getElementById('typeSource').textContent = `Source: ${source}`;
  document.getElementById('typeGenre').textContent = `Genre: ${genres.slice(0, 2).map(g => g.name).join(', ')}`;
  document.getElementById('typeTheme').textContent = `Themes: ${themes.slice(0, 2).map(t => t.name).join(', ')}`;
  document.getElementById('typeDuration').textContent = `Duration: ${duration}`;
  document.getElementById('sypnosis').textContent = synopsis;
}

// Function to truncate the synopsis text
function truncateText(selector, maxLength) {
  const element = document.getElementById(selector);
  const text = element.textContent;
  if (text.length > maxLength) {
    element.textContent = text.slice(0, maxLength) + '...';
  }
}
