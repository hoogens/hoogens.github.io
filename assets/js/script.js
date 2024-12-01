document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchWrapper = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-btn');
    const luckyButton = document.querySelector('.lucky-btn');
    const navLinks = document.querySelectorAll('.nav-left a, .nav-right a');
    const contentContainer = document.getElementById('content-container');

    // Maak container voor suggesties
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions-dropdown';
    document.querySelector('.autocomplete-container').appendChild(suggestionsDiv);
    
    // Array met secties
    const sections = [
        { title: 'About Me', id: 'about' },
        { title: 'Projects', id: 'projects' },
        { title: 'Technical Skills', id: 'skills' },
        { title: 'Contact', id: 'contact' }
    ];
    

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

    // Toon suggesties bij focus
    searchInput.addEventListener('focus', function() {
        suggestionsDiv.style.display = 'block';
        showSuggestions(sections, suggestionsDiv);
    });
    
    // Verberg suggesties bij klik buiten zoekbalk
    document.addEventListener('click', function(e) {
        if (!searchWrapper.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check of het de home link is
            if (this.classList.contains('logo')) {
                contentContainer.style.display = 'none';
                document.getElementById('search-input').value = ''; // Maakt zoekveld leeg
                // Verwijder markeringen
                document.querySelectorAll('mark').forEach(mark => {
                    const text = mark.textContent;
                    mark.replaceWith(text);
                });
                return;
            }
    
            // Normale navigatie voor andere links
            contentContainer.style.display = 'block';
            
            // Verwijder markeringen
            document.querySelectorAll('mark').forEach(mark => {
                const text = mark.textContent;
                mark.replaceWith(text);
            });
            
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

function showSuggestions(sections, suggestionsDiv) {
    const contentContainer = document.getElementById('content-container'); // Voeg deze regel toe
    
    suggestionsDiv.innerHTML = sections.map(section => 
        `<div class="suggestion-item" data-section="${section.id}">
            <span>🔍</span>
            <span style="margin-left: 10px">${section.title}</span>
        </div>`
    ).join('');
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            
            // Toon de content container
            contentContainer.style.display = 'block';
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                suggestionsDiv.style.display = 'none';
                searchInput.value = ''; // Maakt het zoekveld leeg na selectie
            }
        });
    });
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const contentContainer = document.getElementById('content-container');
    let found = false;
    let firstFoundSection = null;

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
            
            // Sla de eerste sectie op waar een match is gevonden
            if (!firstFoundSection) {
                firstFoundSection = section;
            }
        }
    });

    // Scroll naar het eerste gevonden resultaat
    if (firstFoundSection) {
        firstFoundSection.scrollIntoView({ behavior: 'smooth' });
    }

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