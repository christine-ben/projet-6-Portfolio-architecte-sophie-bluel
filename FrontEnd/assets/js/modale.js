//----------------- Code pour la première modal ------------------------------
//  bouton "Modifier"
const modifierBtn = document.getElementById("button-modifer");

//  fenêtre modale
const modal = document.getElementById("myModal");

//  bouton de fermeture
const closeBtn = document.getElementsByClassName("close")[0];

// bouton "Modifier"
modifierBtn.addEventListener("click", function() {
  modal.style.display = "block";
  generateModalGallery();
});

//  bouton de fermeture
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});


// Fonction pour générer la galerie à l'intérieur de la première modal---------------------
async function generateModalGallery() {
  try {
    console.log('Début de la génération de la galerie');

    const response = await fetch('http://localhost:5678/api/works/');
    const works = await response.json();
    
    const workContainer = document.querySelector('.work-container');
    workContainer.innerHTML = '';
    
    if (works.length === 0) {
      console.log('Aucun work trouvé.');
    }

    works.forEach(work => {
      console.log('Création dune figure pour le work :', work.title);
      
      const figure = document.createElement('figure');
      figure.setAttribute('data-work-id', work.id);
      figure.setAttribute('data-category', work.category.name.toLowerCase());
  
      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;
      
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title;
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('icon-container');
      const deleteIcon = document.createElement('i');

      deleteIcon.classList.add('delete-icon');
      deleteIcon.classList.add('fa-solid');
      deleteIcon.classList.add('fa-trash-can');
      deleteIcon.classList.add('delete-icon-modal1'); 

      
      deleteIcon.addEventListener('click', function() {
        let workId = work.id;
        console.log('Avant deleteWork');
        // Mettez à jour la galerie après suppression
        deleteWork(workId, true);
        console.log('Après deleteWork');
      });
      
      iconContainer.appendChild(deleteIcon);
      imageContainer.appendChild(iconContainer);
    
      figure.appendChild(imageContainer);
      figure.appendChild(img);
      figure.appendChild(figcaption);
      workContainer.appendChild(figure);
    });

    console.log('Galerie générée avec succès.');
    updateHomePage();
  
  } catch (error) {
    console.error('Erreur lors de la génération de la galerie :', error);
  }
}
generateModalGallery();
console.log('Après generateModalGallery - Avant code suivant');

// -----------------Fonction pour mettre à jour la page d'accueil--------------------------------------
async function updateHomePage() {
  
  try {
    const response = await fetch('http://localhost:5678/api/works/');
    const works = await response.json();

const homeGallery = document.querySelector('.gallery');
homeGallery.innerHTML = '';

if (works.length === 0) {
  console.log('Aucun work trouvé sur la page daccueil.');
}

works.forEach(work => {
  
  const figure = document.createElement('figure');
  figure.setAttribute('data-category', work.category.name.toLowerCase());

  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  homeGallery.appendChild(figure);
});
console.log('Page daccueil mise à jour avec succès.');

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la page daccueil :', error);
  }
}

//----------------- Code pour la fonction de suppression -------------------------
// Fonction pour supprimer un work avec l'ID 
function deleteWork(workId, updateGallery) {
  // Récupère le jeton 
  const token = localStorage.getItem('token');
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text(); 
  })
  .then(() => {
    const modalWorkFigure = modal.querySelector(`figure[data-work-id="${workId}"]`);
    const modalDeleteIcons = modal.querySelectorAll('.delete-icon-modal1');
    
    if (modalWorkFigure) {
      modalWorkFigure.remove();
    } else {
      console.log('Aucune figure trouvée dans la modal1 pour le work ID:', workId);
    }
    if (updateGallery) {
      generateModalGallery();
    }
  })
  .catch(error => console.error('Erreur lors de la suppression du work :', error));
}

//----------------- Code pour la deuxième modal ----------------------------------

// Ajouter un événement de clic au bouton "Ajouter une photo"
const ajoutPhotoBtn = document.querySelector("#ajouter-photo");
ajoutPhotoBtn.addEventListener("click", function(event) {
  // Empêcher la propagation de l'événement jusqu'au document
  event.stopPropagation();
  document.querySelector(".modal-content").style.display = "none";
  document.querySelector(".modalAjout").style.display = "flex";

 
  const boutonRetour = document.querySelector(".fa-arrow-left-long");
  boutonRetour.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".modalAjout").style.display = "none";
    document.querySelector(".modal-content").style.display = "flex";
  });
});

//---------------------------pour fermer la 2 modal--------------------------------

// Récupérer la deuxième modal
const modalAjout = document.querySelector(".modalAjout");
document.addEventListener("click", function(event) {
  if (event.target !== modalAjout && !modalAjout.contains(event.target)) {
    
    modalAjout.style.display = "none";
    document.querySelector(".modal-content").style.display = "block";
  }
});

//------code formulaire(ajout photo)-------------------------------------------
//Aperçu photo avant upload
const image = document.getElementById('photo-file');
const title = document.getElementById('photo-title');
const category = document.getElementById('photo-category');
const submit = document.getElementById('valider');

// Événement lorsque l'utilisateur sélectionne une image
image.addEventListener('change', function(event) {
  const file = image.files[0];
  const container = document.querySelector('.image-content');
  container.style.background = 'center / contain no-repeat url(' + URL.createObjectURL(file) + ')';
  
  const faImage = document.querySelector('.fa-image');
  const photoLabel = document.querySelector('.photo');
  const descr = document.querySelector('.discr');
  
  image.style.display="none";
  faImage.style.display = 'none';
  photoLabel.style.display = 'none';
  descr.style.display = 'none';
});

//-----------------------------------------------------------------------

// Fonction de recherche de l'id de la catégorie
async function getIdCategory(category) {
  try {
    const response = await fetch('http://localhost:5678/api/categories');

    const data = await response.json();
    const foundCategory = data.find(cat => cat.name.toLowerCase() === category.toLowerCase());

    if (foundCategory) {
      console.log('Catégorie trouvée. ID:', foundCategory.id);

      return foundCategory.id;
    } else {
      throw new Error('Catégorie non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    throw error;
  }
}


  //--------------------------envoie du formulaire-----------------------------------------
 
  submit.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Formulaire soumis avec succès');

  // Validation des champs
  if (!image.files[0]) {
    alert('Veuillez sélectionner une image.');
    return;
  }
  if (!title.value) { 
    alert('Veuillez entrer un titre.');
    return;
  }
  if (!category.value) { 
    alert('Veuillez sélectionner une catégorie.');
    return;
  }
// Construction du formulaire FormData
  const formData = new FormData();
  formData.append('image', image.files[0]);
  formData.append('title', title.value);

  try {
    const categoryID = await getIdCategory(category.value);
    formData.append('category', categoryID);

    // Envoi du formulaire 
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    

    if (response.status === 201) {
      const workContainer = document.querySelector('.work-container');
      workContainer.innerHTML = '';
      title.value = '';
      category.value = '';

      // Restaurer la classe .image-content
      const container = document.querySelector('.image-content');
      container.style.background = '';
      const faImage = document.querySelector('.fa-image');
      const photoLabel = document.querySelector('.photo');
      const descr = document.querySelector('.discr');
      const photofile = document.getElementById('photo-file');
      
      photofile.style.display = "block";
      faImage.style.display = 'block';
      photoLabel.style.display = 'block';
      descr.style.display = 'block';
      
    
      generateModalGallery();

      document.querySelector(".modalAjout").style.display = 'none';
      document.querySelector('.modal-content').style.display = 'flex';
    } else {
      alert('Erreur lors de l\'ajout du projet');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire :', error);
  }
});
