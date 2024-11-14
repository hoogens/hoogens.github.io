document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("project-container");
    const prevButton = document.getElementById("prev-project");
    const nextButton = document.getElementById("next-project");
    let currentIndex = 0;

    function getVisibleProjects() {
        if (window.innerWidth <= 768) {
            return 1;
        } else if (window.innerWidth <= 1024) {
            return 2;
        } else {
            return 3;
        }
    }

    function showProject(index) {
        if (container.children.length > 0) {
            const projectWidth = container.children[0].offsetWidth;
            container.style.transform = `translateX(-${index * projectWidth}px)`;
        }
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const visibleProjects = getVisibleProjects();
        prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
        nextButton.style.display = currentIndex < container.children.length - visibleProjects ? 'block' : 'none';
    }

    nextButton.addEventListener('click', () => {
        const visibleProjects = getVisibleProjects();
        if (currentIndex < container.children.length - visibleProjects) {
            currentIndex++;
            showProject(currentIndex);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showProject(currentIndex);
        }
    });

    // Load information
    fetch("assets/data/info.json")
        .then(response => response.json())
        .then(data =>{
            // Set up LinkedIn link
            document.getElementById("contact-info").innerHTML = 
                `Feel free to reach out through <a href="${data.linkedin}" 
                target="_blank">LinkedIn</a>`;
        
            // Fetch GitHub projects
            fetch(`https://api.github.com/users/${data.github}/repos`)
                .then(response => response.json())
                .then (repos => {
                    const container = document.getElementById("project-container");

                    container.innerHTML = "";

                    repos.forEach((repo, index) => {
                        const projectElement = document.createElement("div");
                        projectElement.classList.add("project");
                        projectElement.innerHTML = `
                            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                            <p>${repo.description || "No description available."}</p>
                            <p>Language: ${repo.language || "Not specified."}</p>`;
                            container.appendChild(projectElement);
                    });

                    if (repos.length > 0) {
                        showProject(0);
                        updateNavigationButtons();
                    } else {
                        prevButton.style.display = 'none';
                        nextButton.style.display = 'none';    
                    }

                })
                .catch(error => {
                    document.getElementById("project-container").innerHTML = `<p>Unable to load projects from GitHub: ${error.message}</p>`;
                    prevButton.style.display = 'none';
                    nextButton.style.display = 'none'; 
                });
        })
        .catch(error => {
            console.error("Error loading information:", error);
        });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate skill bars
    const skills = document.querySelectorAll(".skill");
    skills.forEach(skill => {
        const level = skill.getAttribute("data-level");
        skill.style.width = level + '%';
    });

    // Update carousel on window resize

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

    // Update carousel 
    window.addEventListener('resize', debounce(() => {
        showProject(currentIndex);
    }, 250));
});