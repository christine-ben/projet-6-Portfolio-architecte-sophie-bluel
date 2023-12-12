

document.addEventListener("DOMContentLoaded", function () {
    
    // Partie pour gérer le formulaire de connexion
    const loginForm = document.getElementById("user-login-form");
    const loginURL = "http://localhost:5678/api/users/login";
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorContainer = document.getElementById("error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
        
            // récupérées l'email et password
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
           
           //(email et password) au format JSON.
                const response = await fetch(loginURL, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {

                    const userData = await response.json();

                    localStorage.setItem("token", userData.token);

                    window.location.href = "./index.html";
                
                } else if (response.status === 401) {
                    errorContainer.textContent = "Combinaison email/mot de passe incorrecte";
                } else {
                    errorContainer.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
                    console.error('Erreur lors de la connexion:', response.statusText);
                }
            } catch (error) {
                errorContainer.textContent = "Une erreur inattendue s'est produite lors de la connexion. Veuillez réessayer.";
                console.error('Erreur inattendue lors de la connexion:', error.message);
            }
        });
    }

});

//-------------------------fin code Gestion du formulaire de connexion-----------------------------------------------------


//----------------------------code Gestion de l'interface utilisateur--------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

    const baliseLogin = document.querySelector('.login-logout');
    const header = document.querySelector('header');
    const modeEdition = document.querySelector('.mode-edition');
    const buttonModifer = document.querySelector('#button-modifer');
    const buttonFiltr = document.querySelector('.filter');
    
    //  mettre à jour l'interface utilisateur.
    updateUI();
    
    if (baliseLogin) {
        baliseLogin.addEventListener('click', EtatConnexion);
    }

    function updateUI() {
        
        const token = localStorage.getItem('token');
        const isLoggedIn = token !== null;

        baliseLogin.innerHTML = isLoggedIn ? 'logout' : 'login';
       
        buttonModifer.style.display = isLoggedIn ? 'inline-flex' : 'none';
        buttonFiltr.style.display = isLoggedIn ? 'none' : 'inline-flex';
        
        header.style.margin = isLoggedIn ? '110px 0px 50px 0px' : '50px 0px 50px 0px';
       
        modeEdition.style.display = isLoggedIn ? 'flex' : 'none';
    }

    
    function EtatConnexion() {
        const token = localStorage.getItem('token');
        
        if (token) {
            localStorage.removeItem('token');
             
            // Met à jour l'interface 
            updateUI();
        } else {
            window.location.href= "login.html"
        }
    }
});

//----------------------------fin code Gestion de l'interface utilisateur--------------------------------------------------------
