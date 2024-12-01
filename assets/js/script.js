document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-btn');
    const luckyButton = document.querySelector('.lucky-btn');
    const navLinks = document.querySelectorAll('.nav-left a, .nav-right a');
    const contentContainer = document.getElementById('content-container');

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    fetchGithubProjects();

    searchButton.addEventListener('click', function() {
        handleSearch();
    });

    luckyButton.addEventListener('click', function() {
        feelingLucky();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Toon de content container
            contentContainer.style.display = 'block';
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// GitHub
async function getGithubUsername() {
    try { 
        const response = await fetch('./assets/data/info.json');
        const data = await response.json();
        return data.github;
    } catch (error) {
        console.error('Error loading GitHub username', error);
        return null;
    }
}

async function fetchGithubProjects() {
    const githubUsername = await getGithubUsername();
    if (!githubUsername) return;

    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
        const repos = await response.json();
        
        // Sorteer laatste update
        const sortedRepos = repos.sort((a, b) => 
            new Date(b.updated_at) - new Date(a.updated_at)
        );

        // Toon projecten
        const projectsSection = document.querySelector('#projects');
        projectsSection.innerHTML = `
            <h2>Projects</h2>
            <div class="projects-grid">
                ${sortedRepos.map(repo => `
                    <div class="project-card">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="project-stats">
                            <span>⭐️ ${repo.stargazers_count}</span>
                            <span>🍴 ${repo.forks_count}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading GitHub projects', error);
    }
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const contentContainer = document.getElementById('content-container');
    let found = false;

    // Maak content zichtbaar
    contentContainer.style.display = 'block';

    // Verwijder eerst alle bestaande markeringen
    document.querySelectorAll('mark').forEach(mark => {
        const text = mark.textContent;
        mark.replaceWith(text);
    });

    // Als de zoekterm leeg is, stop de functie
    if (searchTerm === '') {
        return;
    }

    // Zoek alleen in de zichtbare tekst van secties
    const sections = document.querySelectorAll('section p, section h2, section h3, section li');

    sections.forEach(section => {
        const content = section.textContent.toLowerCase();
        if (content.includes(searchTerm)) {
            found = true;
            highlightText(section, searchTerm);
        }
    });

    if (!found && searchTerm !== '') {
        alert('Geen resultaten gevonden');
    }
}

// Highlight functie
function highlightText(element, searchTerm) {
    const innerHTML = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = innerHTML.replace(regex, '<mark>$1</mark>');
}

// Random content button
function feelingLucky() {
    const contentContainer = document.getElementById('content-container');
    contentContainer.style.display = 'block';
    
    const sections = ['about', 'projects', 'skills', 'contact'];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    const section = document.getElementById(randomSection);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}