document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

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
    document.querySelector('.search-container').style.marginTop = '20px';
    document.getElementById(randomSection).scrollIntoView({
        behavior: 'smooth'
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