'use strict';

console.log('=== SKRYPT URUCHOMIONY POPRAWNIE ===');
//Stała optArticleSelector
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list'; // Nowa stała wybierająca listę <ul>


// Główna funkcja wykonująca Twój algorytm po kliknięciu w link
const titleClickHandler = function(event) {
  // Blokujemy domyślne zachowanie linku (skakanie strony do kotwicy)
  event.preventDefault();
  
  // Zdefiniowanie zmiennej 'clickedElement' WEWNĄTRZ funkcji (wskazuje na kliknięty link)
  const clickedElement = this;
  console.log('Kliknięto w link:', clickedElement);

  /* ETAP 1: Ustaw klasy linków */
  // Usuń klasę 'active' ze wszystkich linków na liście tytułów
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  // Dodaj klasę 'active' do klikniętego linku
  clickedElement.classList.add('active');

  /* ETAP 2: Ukryj wszystkie artykuły */
  // Usuń klasę 'active' ze wszystkich artykułów
  const activePosts = document.querySelectorAll('.posts .post.active');
  for (let activePost of activePosts) {
    activePost.classList.remove('active');
  }

  /* ETAP 3: Znalezienie i wyświetlenie artykułu */
  // Weź zawartość atrybutu href z klikniętego linku (np. "#article-2")
  const articleSelector = clickedElement.getAttribute('href');
  
  // Znajdź na stronie element pasujący do pobranego selektora (np. id="article-2")
  const targetArticle = document.querySelector(articleSelector);
  
  // Wyświetl znaleziony artykuł (dodaj klasę 'active')
  if (targetArticle) {
    targetArticle.classList.add('active');
    console.log('Sukces: Wyświetlono artykuł:', articleSelector);
  } else {
    console.error('Błąd: Nie znaleziono artykułu dla selektora:', articleSelector);
  }
};

// INICJALIZACJA: Znalezienie wszystkich linków i przypisanie im nasłuchiwania kliknięcia
const links = document.querySelectorAll('.titles a');
console.log('Liczba znalezionych linków w menu bocznym:', links.length);

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}
const generateTags = function() {
  console.log('--- URUCHOMIONO GENEROWANIE TAGÓW ---');

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('Znaleziono artykułów do otagowania:', articles.length);

  /* START LOOP: for every article: */
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    console.log(`Przetwarzanie artykułu: ${articleId}`);

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagSelector);

    /* check if wrapper exists to avoid script errors */
    if (!tagsWrapper) {
      console.warn(`Brak wrappera tagów w artykule: ${articleId}`);
      continue;
    }

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(`-> Odczytane tagi (tekst): "${articleTags}"`);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(`-> Rozbito na tablicę:`, articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      
      /* add generated code to html variable */
      html = html + linkHTML;
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    console.log(`-> Sukces: Wstrzyknięto HTML tagów do ${articleId}`);
  }
  /* END LOOP: for every article: */
  
  console.log('--- ZAKOŃCZONO GENEROWANIE TAGÓW ---');
};

// Uruchomienie funkcji
generateTags();

