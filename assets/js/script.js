document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    fetchGithubProjects(); // Haalt projecten op van GitHub
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
    const searchInput = document.getElementById('search-input');
    const contentContainer = document.getElementById('content-container');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm) {
        contentContainer.style.display = 'block';
        document.querySelector('.search-container').style.marginTop = '20px';
        highlightContent(searchTerm);
        scrollToRelevantSection(searchTerm);
    }
}

function feelingLucky() {
    const sections = ['about', 'projects', 'skills', 'contact'];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    
    document.getElementById('content-container').style.display = 'block';
    document.querySelector('.search-container').classList.add('content-visible'); // Correcte manier om een klasse toe te voegen
    document.getElementById(randomSection).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function highlightContent(searchTerm) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const text = section.innerHTML;
        const highlightedText = text.replace(
            new RegExp(`(${searchTerm})`, 'gi'),
            '<mark>$1</mark>'
        );
        section.innerHTML = highlightedText;
    });
}

function scrollToRelevantSection(searchTerm) {
    const sections = document.querySelectorAll('section');
    for (const section of sections) {
        if (section.textContent.toLowerCase().includes(searchTerm)) {
            section.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}