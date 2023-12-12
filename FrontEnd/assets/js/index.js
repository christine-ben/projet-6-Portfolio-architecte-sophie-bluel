
//------------------------code pour récupere et afficher les projets(works)-----------------------------


//j' envoie une requête GET à l'URL spécifiée (l'API des works). 
fetch('http://localhost:5678/api/works/')

  .then(response => response.json()) 
  .then(works => {
    const gallery = document.querySelector('.gallery');

    works.forEach(work => {
     
      const figure = document.createElement('figure');
      figure.setAttribute('data-category', work.category.name.toLowerCase());
     
      const img = document.createElement('img');
      img.src = work.imageUrl;// URL de l'image 
      img.alt = work.title;// Texte alt de l'image

    
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title; 
     
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  })
  .catch(error => console.error('Erreur lors de la récupération des works :', error));

  //------------------------fin code pour récupere et afficher les projets(works)-----------------------------



  //--------------------code bouttons filtres------------------------------------------------------------

function filterSelection(category) {

    const gallery = document.querySelector('.gallery');
    const items = gallery.querySelectorAll('figure');

    items.forEach(item => {
 
      const itemCategory = item.getAttribute('data-category');

      if (category === 'tous' || category === itemCategory) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }



  //--------------------fin code bouttons filtres------------------------------------------------------------  


