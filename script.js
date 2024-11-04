const queryInput = document.getElementById("queryInput");
const homeBtn = document.getElementById("homeBtn");
const searchBtn = document.getElementById("searchBtn");
const recentBtn = document.getElementById("recentBtn");
const resultContainer = document.getElementById("animeContainer");
const sresultContainer = document.querySelector(".container-sresult");
const animeInfoContainer = document.getElementById("animeInfoContainer");
const watchContainer = document.getElementById("qualityContainer");
const mainLoading = document.getElementById("mainLoading");
const pageTitle = document.getElementById("title");
const videoPlayer = document.getElementById("player");
const watchBtn = document.getElementById("episodeButton");

var dataTitle;
var dataEpisode;
var dataURL;

const apiEndpoint = "no-drab.vercel.app";

function updateUrl(newUrl) {
    window.history.pushState({}, '', newUrl);
}

// Check if the site is visited using android app
const urlParams = new URLSearchParams(window.location.search);
let appParam = urlParams.get('app');
if (appParam == 'true') {
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.style.display = "none";

    const footerContainer = document.getElementById("footerContainer");
    footerContainer.style.display = "none";
}

// Detect if searchBtn is clicked
searchBtn.addEventListener("click", async function () {
    animeInfoContainer.style.display = `none`;
    sresultContainer.style.display = `flex`;
    resultContainer.style.display = `grid`;
    mainLoading.style.display = "flex";
    pageTitle.innerHTML = `AniPlay`;
    recentBtn.style.display = "none";
    resultContainer.innerHTML = "";

    updateUrl(`/`);

    const query = queryInput.value;
    const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/${query}?page=1`);
    const data = await res.json();
    displayResults(data.results);
});

// Confirm search by using an ENTER button
async function getSearchByEnter(event) {
    if (event.keyCode === 13) {
        animeInfoContainer.style.display = `none`;
        sresultContainer.style.display = `flex`;
        resultContainer.style.display = `grid`;
        mainLoading.style.display = "flex";
        pageTitle.innerHTML = `AniPlay`;
        recentBtn.style.display = "none";
        resultContainer.innerHTML = "";

        updateUrl(`/`);

        const query = queryInput.value;
        const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/${query}?page=1`);
        const data = await res.json();
        displayResults(data.results);
    }
}

// Detect if homeBtn is clicked
homeBtn.addEventListener("click", function () {
    if (appParam == 'true') {
        window.location.href = "/?app=true";
    } else {
        window.location.href = "/";
    }
});

// Detect if recentBtn is clicked
recentBtn.addEventListener("click", async function () {
    sresultContainer.style.display = `flex`;
    resultContainer.style.display = `grid`;
    mainLoading.style.display = "flex";
    recentBtn.style.display = "none";

    const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/recent-episodes`);
    const data = await res.json();
    displayRecent(data.results);
});

// Display Recent Result
function displayRecent(results) {
    sresultContainer.style.display = `flex`;
    resultContainer.innerHTML = "";
    mainLoading.style.display = "none";

    results.forEach(result => {
        const resultDiv = document.createElement("a");
        subType = `<div class="subDir">SUB</div>`;
        episodeNumber = `${result.episodeNumber}`;
        if (!episodeNumber.length) {
            episodeNumber = '???';
        }

        resultDiv.innerHTML = `
            <img src="${result.image}" alt="">
            <div class="label">
                <span class="name" title="${result.title.replace("(Dub)", "")}">${result.title.replace("(Dub)", "")}</span>
                <span class="eps">Episode ${episodeNumber} (Subbed)</span>
            </div>
        `;

        resultDiv.addEventListener("click", async function () {
            mainLoading.style.display = "flex";
            resultContainer.style.display = `none`;

            updateUrl(`/?anime=${result.id}`);
            dataURL = `${result.id}`;

            const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/info/${result.id}`);
            const data = await res.json();
            displayAnimeInfo(data);
        });
        resultContainer.appendChild(resultDiv);
    });
}

// Display Search Result
function displayResults(results) {
    resultContainer.innerHTML = "";
    sresultContainer.style.display = `flex`;
    mainLoading.style.display = "none";

    results.forEach(result => {
        const resultDiv = document.createElement("a");
        subType = `<div class="${result.subOrDub.toLowerCase()}Dir">${result.subOrDub}</div>`;
        releaseDate = `${result.releaseDate.replace("Released: ", "")}`;
        if (!releaseDate.length) {
            releaseDate = '???';
        }
        resultDiv.innerHTML = `
            <img src="${result.image}" alt="">
            <div class="label">
                <span class="name" title="${result.title.replace("(Dub)", "")}">${result.title.replace("(Dub)", "")}</span>
                <span class="eps">Year ${releaseDate} (${result.subOrDub.charAt(0).toUpperCase() + result.subOrDub.slice(1)}bed)</span>
            </div>
        `;

        resultDiv.addEventListener("click", async function () {
            mainLoading.style.display = "flex";
            resultContainer.style.display = `none`;

            updateUrl(`/?anime=${result.id}`);
            dataURL = `${result.id}`;

            const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/info/${result.id}`);
            const data = await res.json();
            displayAnimeInfo(data);
        });
        resultContainer.appendChild(resultDiv);
    });
}
//Check if there's Anime Parameters
let animeParam = urlParams.get('anime');
fetchAnimeInfo()
async function fetchAnimeInfo() {
    if (typeof animeParam !== 'undefined' && animeParam !== null) {
        recentBtn.style.display = "none";
        mainLoading.style.display = "flex";

        dataURL = `${animeParam}`

        const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/info/${animeParam}`);
        const data = await res.json();
        displayAnimeInfo(data);
    }
}

// Display Anime Info
function displayAnimeInfo(data) {
    animeInfoContainer.style.display = `block`;
    resultContainer.style.display = `none`;
    sresultContainer.style.display = `none`;
    watchContainer.style.display = "none";
    mainLoading.style.display = "none";

    const title = document.getElementById("videoTitle");
    title.innerHTML = `${data.title}`;
    dataTitle = `${data.title}`;
    pageTitle.innerHTML = `${data.title.toLowerCase()} - AniPlay`

    const status = document.getElementById("status");
    status.innerHTML = `${data.status}`;

    const subordub = document.getElementById("subordub");
    subordub.innerHTML = `${data.subOrDub}`;

    const type = document.getElementById("type");
    type.innerHTML = `${data.type}`;

    const description = document.getElementById("videoDescription");
    description.innerHTML = `${data.description.replace("\n", "<br><br>")}`;

    const episodeSelect = document.getElementById("selectElement");
    episodeSelect.innerHTML = "";

    data.episodes.sort((a, b) => b.number - a.number);
    data.episodes.forEach((episode) => {
        const option = document.createElement("option");
        option.value = episode.id;
        option.innerHTML = `Episode ${episode.number}`;
        episodeSelect.appendChild(option);
    });

    watchBtn.addEventListener("click", async function () {
        const serverSelect = document.getElementById("serverSelect");
        serverSelect.innerHTML = "";
        watchContainer.style.display = "none";
        mainLoading.style.display = "flex";

        var selectElement = document.getElementById("selectElement");
        var selectedOption = selectElement.options[selectElement.selectedIndex];
        dataEpisode = selectedOption.innerText;
        addHistory();

        const episodeId = document.getElementById("selectElement").value;
        const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/watch/${episodeId}`);
        const episodeData = await res.json();
        displayWatchInfo(episodeData);
    });
}

// Display Episode List
// Function to display watch info and show the video player
function displayWatchInfo(episodeData) {
    const watchContainer = document.getElementById("qualityContainer");
    const videoContainer = document.querySelector(".video-container");
    const videoPlayer = document.getElementById("player");
    const serverSelect = document.getElementById("serverSelect");

    // Show the quality selection container
    watchContainer.style.display = "block";
    videoContainer.classList.add("show"); // Show video container
    mainLoading.style.display = "none";
    serverSelect.innerHTML = ""; // Clear previous quality options

    // Populate streaming quality buttons
    episodeData.sources.forEach((stream) => {
        const optionButton = document.createElement("button");
        optionButton.className = "pill-button";
        optionButton.innerHTML = stream.quality.replace("default", "auto");
        optionButton.value = stream.url;

        // Add event listener to load video in iframe and highlight the selected button
        optionButton.addEventListener("click", () => {
            handleVideoPlayback(stream.url);

            // Remove "active" class from all quality buttons
            document.querySelectorAll(".pill-button").forEach(btn => btn.classList.remove("active"));
            // Add "active" class to the clicked button
            optionButton.classList.add("active");
        });

        serverSelect.appendChild(optionButton);
    });
}

// Function to handle video playback in iframe
function handleVideoPlayback(url) {
    const videoPlayer = document.getElementById('player');
    videoPlayer.src = url; // Set the iframe source to the selected quality
    videoPlayer.allow = "fullscreen; autoplay; encrypted-media";
    videoPlayer.setAttribute("allowfullscreen", "true");
    videoPlayer.setAttribute("disablePictureInPicture", "true");
}


// Format unicode date to a readable one (** hours ago)
function getTimeDifference(date) {
    const currentDate = new Date();
    const timestamp = new Date(date);
    const difference = currentDate - timestamp;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let output;
    if (seconds < 60) {
        output = `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
        output = `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
        output = `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 7) {
        output = `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (weeks < 4) {
        output = `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (months < 12) {
        output = `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
        output = `${years} year${years === 1 ? '' : 's'} ago`;
    }

    return output;
}

// Eps Button Navigation
const epsSelect = document.getElementById('selectElement');
function firstEps() {
    epsSelect.selectedIndex = epsSelect.options.length - 1;
}
function prevEps() {
    if (epsSelect.selectedIndex < epsSelect.options.length - 1) {
        epsSelect.selectedIndex++;
    }
}
function nextEps() {
    if (epsSelect.selectedIndex > 0) {
        epsSelect.selectedIndex--;
    }
}
function lastEps() {
    epsSelect.selectedIndex = 0;
}

// Hiding the Dim
function showHistory() {
    document.getElementById("dim").style.display = "flex"; // Display as flex for centering
}

function closeHistory() {
    document.getElementById("dim").style.display = "none"; // Hide the popup
}

// Adding a History
function addHistory() {
    let newDate = new Date();

    const notes = {
        date: newDate,
        title: dataTitle + ' ' + dataEpisode,
        url: dataURL
    }

    let local = JSON.parse(localStorage.getItem('history'));

    if (local == null) {
        const arr = [];
        arr.push(notes);
        localStorage.setItem('history', JSON.stringify(arr))
    } else {
        // Check if the number of items in the array is already 50
        if (local.length >= 10) {
            // Remove the oldest item from the array
            local.shift();
        }
        local.push(notes);
        localStorage.setItem('history', JSON.stringify(local))
    }
}

// Reloading the history data
const historyLists = document.getElementById('historyList');
var timedifference;
function historyReload() {
    let array = JSON.parse(localStorage.getItem('history'));

    if (array != null) {
        historyLists.innerHTML = "";
        for (let i = array.length - 1; i >= 0; i--) {
            timedifference = getTimeDifference(array[i].date)
            historyLists.innerHTML += `
            <li>
                <a href="/?anime=${array[i].url}">${array[i].title}</a> 
                <span class="date">- ${timedifference}</span>
            </li>`
        }
    } else {
        historyLists.innerHTML = "History empty"
    }
}

historyReload();

// Clear History
function clearHistory() {
    localStorage.removeItem('history');
    historyReload();
}

// Function to handle video playback
function handleVideoPlayback(url) {
    if (appParam === 'true') {
        updateUrl(`?playInApp=${url}`);
    } else {
        const player = document.getElementById('player');
        player.src = `/player/?url=${url}`;
        player.style.display = 'block';
    }
}

// Function to load episode
async function loadEpisode(episodeId) {
    try {
        mainLoading.style.display = "flex";
        const response = await fetch(`https://${apiEndpoint}/anime/gogoanime/watch/${episodeId}`);
        if (!response.ok) throw new Error('Failed to load episode');
        
        const data = await response.json();
        displayWatchInfo(data);
    } catch (error) {
        console.error("Episode load error:", error);
        alert("Failed to load episode. Please try again.");
    } finally {
        mainLoading.style.display = "none";
    }
}

// Function to handle episode selection
function handleEpisodeSelection() {
    const episodeSelect = document.getElementById("selectElement");
    const selectedEpisodeId = episodeSelect.value;
    if (selectedEpisodeId) {
        loadEpisode(selectedEpisodeId);
    }
}
// Remove episode playback trigger from episode selection
function handleEpisodeSelection() {
    const episodeSelect = document.getElementById("selectElement");
    const selectedEpisodeId = episodeSelect.value;

    if (selectedEpisodeId) {
        // Enable the Watch button only if an episode is selected
        watchBtn.disabled = false;
    }
}

// Add event listener for episode selection to enable Watch button only
document.getElementById("selectElement").addEventListener("change", handleEpisodeSelection);

// Modify the Watch button event listener to play the episode only when pressed
watchBtn.addEventListener("click", async function () {
    const episodeSelect = document.getElementById("selectElement");
    const selectedEpisodeId = episodeSelect.value;

    if (selectedEpisodeId) {
        mainLoading.style.display = "flex";
        watchContainer.style.display = "none";
        
        try {
            // Fetch and load the selected episode data
            const res = await fetch(`https://${apiEndpoint}/anime/gogoanime/watch/${selectedEpisodeId}`);
            const episodeData = await res.json();
            displayWatchInfo(episodeData); // Function to display video and quality options

            // Update history with selected episode
            const selectedOption = episodeSelect.options[episodeSelect.selectedIndex];
            dataEpisode = selectedOption.innerText;
            addHistory(); // Function to save the current episode to watch history

        } catch (error) {
            console.error("Episode load error:", error);
            alert("Failed to load episode. Please try again.");
        } finally {
            mainLoading.style.display = "none";
        }
    }
});

// Event listener for episode selection
document.getElementById("selectElement").addEventListener("change", handleEpisodeSelection);

// Function to toggle fullscreen
function toggleFullscreen() {
    const player = document.getElementById('player');
    if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) { // Firefox
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) { // Chrome, Safari and Opera
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) { // IE/Edge
            player.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}

// Event listener for fullscreen button
document.getElementById("fullscreenButton").addEventListener("click", toggleFullscreen);

// Function to handle search input
function handleSearchInput() {
    const query = queryInput.value.trim();
    if (query.length > 2) {
        performSearch(query);
    }
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search function
const debouncedSearch = debounce(handleSearchInput, 300);

// Event listener for search input
queryInput.addEventListener("input", debouncedSearch);

// Function to handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    if (event.target.tagName === 'INPUT') return; // Ignore if focus is on an input field

    switch(event.key) {
        case 'f':
            toggleFullscreen();
            break;
        case 'ArrowLeft':
            prevEps();
            break;
        case 'ArrowRight':
            nextEps();
            break;
        case ' ':
            if (videoPlayer.paused) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
            event.preventDefault();
            break;
    }
}

// Event listener for keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

// Function to update player settings
function updatePlayerSettings() {
    const settings = JSON.parse(localStorage.getItem('playerSettings')) || {};
    if (settings.volume) videoPlayer.volume = settings.volume;
    if (settings.playbackRate) videoPlayer.playbackRate = settings.playbackRate;
}

// Function to save player settings
function savePlayerSettings() {
    const settings = {
        volume: videoPlayer.volume,
        playbackRate: videoPlayer.playbackRate
    };
    localStorage.setItem('playerSettings', JSON.stringify(settings));
}

// Event listeners for player settings
videoPlayer.addEventListener('volumechange', savePlayerSettings);
videoPlayer.addEventListener('ratechange', savePlayerSettings);

// Initialize player settings
updatePlayerSettings();

// Event listener for theme switch buttons
document.querySelectorAll('.theme-switch').forEach(button => {
    button.addEventListener('click', () => switchTheme(button.dataset.theme));
});

// Initialize the app
function initApp() {
    historyReload();
    if (animeParam) {
        fetchAnimeInfo();
    }
}

// Run the app
initApp();

