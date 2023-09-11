require('dotenv').config();

// Your API key for The Movie Database (TMDb)
const apiKey = process.env.movie_api;

console.log("API Key:", apiKey);

// Base URL for movie poster images
const imgApi = "https://image.tmdb.org/t/p/w1280";

// URL for searching movies using TMDb API
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// Get references to HTML elements
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

// Variables to keep track of the current page and search state
let page = 1;
let isSearching = false;

// Function to fetch JSON data from a URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

// Function to fetch and show results based on a URL
async function fetchAndShowResult(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
}

// Function to create an HTML template for a movie card
function createMovieCard(movie) {
    const { poster_path, original_title, release_date, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    const formattedDate = release_date || "No release date";

    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="./img-01.jpeg">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                            <h3 style="font-weight: 600">${truncatedTitle}</h3>
                            <span style="color: #12efec">${formattedDate}</span>
                        </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                        </div>
                    </div>
                    <div class="info">
                        ${overview || "No overview yet..."}
                    </div>
                </div>
            </div>
        </div>
    `;

    return cardTemplate;
}

// Function to clear the result element for a new search
function clearResults() {
    result.innerHTML = "";
}

// Function to show results on the page
function showResults(items) {
    const newContent = items.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>No results found.</p>";
}

// Function to load more results when the end of the page is reached
async function loadMoreResults() {
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResult(url);
}

// Function to detect when the end of the page is reached and load more results
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

// Function to handle the search form submission
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if (searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
    }
}

// Event listeners
form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

// Initialize the page with default results
async function init() {
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
}

// Call the initialization function to load initial results
init();
