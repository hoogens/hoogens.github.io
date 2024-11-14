document.addEventListener('DOMContentLoaded', function(){
    const searchInput = document.getElementById('search-input');
    const contentContainer = document.getElementById('content-container');

    // Listener Enter button
    searchInput.addEventListener('keypress', function(e) {
        if (e.key == 'Enter') {
            handleSearch();
        }
    });
});

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const contentContainer = document.getElementById('content-container');
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm) {
        contentContainer.style.display = 'block';
        document.querySelector('.search-container').style.marginTop = '20px';

        // Filter and highlight based on search term
        highlightContent(searchTerm);
    }
}

function feelingLucky() {
    const sections = ['about', 'projects', 'skills', 'contact'];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];

    document.getElementById('content-container').style.display = 'block';
    document.querySelector('.search-container').style.marginTop = '20px';
    document.getElementById(randomSection).scrollIntoView({behavior: 'smooth'});
}

function highlightContent(searchTerm) {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const text = section.innerHTML;
        const highlightedText = text.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<mark>${match}</mark>`
        );
        section.innerHTML = highlightedText;
    });
}