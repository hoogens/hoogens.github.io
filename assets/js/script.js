document.addEventListener("DOMContentLoaded", function() {
    let currentProject = 0;

    function showProject(index) {
        const projects = document.querySelectorAll('.project');
        projects.forEach( project => project.classList.remove('active'));
        projects[index].classList.add('active');
    }

    function nextProject() {
        const projects = document.querySelectorAll('.project');
        currentProject = (currentProject + 1) % projects.length;
        showProject(currentProject);
    }

    function prevProject() {
        const projects = document.querySelectorAll('.project');
        currentProject = (currentProject - 1 + projects.length) % projects.length;
        showProject(currentProject);
    }

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
                    const projectContainer = document.getElementById("project-container");

                    projectContainer.innerHTML = "";

                    repos.forEach((repo, index) => {
                        const projectElement = document.createElement("div");
                        projectElement.classList.add("project");
                        if (index === 0) projectElement.classList.add("active");
                        projectElement.innerHTML = `
                            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                            <p>${repo.description || "No description available."}</p>
                            <p>Language: ${repo.language || "Not specified."}</p>`;
                            projectContainer.appendChild(projectElement);
                    });

                    if (repos.length > 0) {
                        document.getElementById('next-project').addEventListener('click', nextProject);
                        document.getElementById('prev-project').addEventListener('click', prevProject);                        
                    }

                })
                .catch(error => {
                    document.getElementById("project-container").innerHTML = "<p>Unable to load projects from GitHub</p>"
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
});