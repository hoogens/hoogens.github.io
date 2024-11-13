document.addEventListener("DOMContentLoaded", function() {
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
                    const githubProjects = document.getElementById("github-projects");

                    githubProjects.innerHTML = "";

                    repos.slice(0, 5).forEach(repo => {
                        const projectElement = document.createElement("div");
                        projectElement.classList.add("project");
                        projectElement.innerHTML = `
                            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                            <p>${repo.description || "No description available"}</p>
                        `;
                        githubProjects.appendChild(projectElement);
                    });
                })
                .catch(error => {
                    document.getElementById("github-projects").innerHTML = "<p>Unable to load projects from GitHub</p>"
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