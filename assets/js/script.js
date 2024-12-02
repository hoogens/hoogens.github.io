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
  
    // Event listeners
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  
    searchButton.addEventListener('click', handleSearch);
    luckyButton.addEventListener('click', feelingLucky);
  
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
  
    document.querySelectorAll('.fas.fa-search').forEach(searchIcon => {
      searchIcon.addEventListener('click', handleSearch);
    });
  
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.classList.contains('logo')) {
          contentContainer.style.display = 'none';
          document.getElementById('search-input').value = '';
          removeMarkings();
          return;
        }
        contentContainer.style.display = 'block';
        removeMarkings();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    fetchGithubProjects();
  });
  
  function removeMarkings() {
    document.querySelectorAll('mark').forEach(mark => {
      const text = mark.textContent;
      mark.replaceWith(text);
    });
  }
  
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
      const sortedRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      
      const projectsSection = document.querySelector('#projects');
      projectsSection.innerHTML = sortedRepos.map(repo => `
        <div class="project-card">
          <div class="project-url">${repo.html_url}</div>
          <h3 class="project-title">${repo.name}</h3>
          <p>${repo.description || 'No description available'}</p>
          <div class="project-stats">
            <span>Stars: ${repo.stargazers_count}</span>
            <span>Forks: ${repo.forks_count}</span>
            <span>Last updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error fetching GitHub projects', error);
    }
  }
  
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    contentContainer.style.display = 'block';
    
    sections.forEach(section => {
      const sectionElement = document.getElementById(section.id);
      const sectionContent = sectionElement.innerHTML;
      const highlightedContent = highlightText(sectionContent, searchTerm);
      sectionElement.innerHTML = highlightedContent;
    });
  
    const firstHighlight = document.querySelector('mark');
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  function highlightText(content, searchTerm) {
    const regex = new RegExp(searchTerm, 'gi');
    return content.replace(regex, match => `<mark>${match}</mark>`);
  }
  
  function feelingLucky() {
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    contentContainer.style.display = 'block';
    document.getElementById(randomSection.id).scrollIntoView({ behavior: 'smooth' });
  }
  
  function showSuggestions(sections, suggestionsDiv) {
    suggestionsDiv.innerHTML = sections.map((section, index) => `
      <div class="suggestion-item" data-section="${section.id}">
        <span>${index + 1}</span>
        <span>${section.title}</span>
      </div>
    `).join('');
  
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        contentContainer.style.display = 'block';
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        suggestionsDiv.style.display = 'none';
      });
    });
  }