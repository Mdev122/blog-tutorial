'use strict';

console.log('=== SKRYPT URUCHOMIONY POPRAWNIE ===');

// JEDEN WSPÓLNY BLOK KONFIGURACYJNY
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optArticleAuthorDataSelector = '[data-author]',
  optTagsListSelector = '.tags.list'; // Poprawnie zdefiniowany selektor listy tagów bocznych

/* === ETAP 1: OBSŁUGA KLIKNIĘCIA W TYTUŁ (MENU BOCZNE) === */
const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Kliknięto w link artykułu:', clickedElement);

  /* Usuń klasę 'active' ze wszystkich linków na liście tytułów */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* Dodaj klasę 'active' do klikniętego linku */
  clickedElement.classList.add('active');

  /* Usuń klasę 'active' ze wszystkich artykułów */
  const activePosts = document.querySelectorAll('.posts .post.active');
  for (let activePost of activePosts) {
    activePost.classList.remove('active');
  }

  /* Weź zawartość atrybutu href z klikniętego linku */
  const articleSelector = clickedElement.getAttribute('href');

  /* Znajdź na stronie element pasujący do pobranego selektora */
  const targetArticle = document.querySelector(articleSelector);

  /* Wyświetl znaleziony artykuł */
  if (targetArticle) {
    targetArticle.classList.add('active');
    console.log('Sukces: Wyświetlono artykuł:', articleSelector);
  } else {
    console.error('Błąd: Nie znaleziono artykułu dla selektora:', articleSelector);
  }
};

/* === ETAP 2: DYNAMICZNE GENEROWANIE LISTY TYTUŁÓW === */
const generateTitleLinks = function() {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};

/* === ETAP 3: DYNAMICZNE GENEROWANIE TAGÓW === */
const generateTags = function() {
  console.log('--- URUCHOMIONO GENEROWANIE TAGÓW ---');
  
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = [];

  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const tagsWrapper = article.querySelector(optArticleTagSelector);

    if (!tagsWrapper) {
      console.warn(`Brak wrappera tagów w artykule: ${articleId}`);
      continue;
    }

    let html = '';
    const articleTags = article.getAttribute('data-tags');
    console.log(`-> Odczytane tagi dla ${articleId}: "${articleTags}"`);
    const articleTagsArray = articleTags.split(' ');

    for (let tag of articleTagsArray) {
      const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (allTags.indexOf(linkHTML) == -1) {
        /* [NEW] add generated code to allTags array */
        allTags.push(linkHTML);
      }
    }

    /* Wstawienie tagów do konkretnego artykułu */
    tagsWrapper.innerHTML = html;
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */
  if (tagList) {
    tagList.innerHTML = allTags.join(' ');
  } else {
    console.warn(`Brak listy tagów w chmurze bocznej dla selektora: ${optTagsListSelector}`);
  }

  console.log('--- ZAKOŃCZONO GENEROWANIE TAGÓW ---');
};

/* === ETAP 4: DYNAMICZNE GENEROWANIE AUTORÓW === */
const generateAuthors = function() {
  console.log('--- URUCHOMIONO GENEROWANIE AUTORÓW ---');
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    if (!authorWrapper) {
      console.warn(`Brak wrappera autora w artykule: ${articleId}`);
      continue;
    }

    const authorName = article.getAttribute('data-author');
    console.log(`-> Odczytany autor dla ${articleId}: "${authorName}"`);
    const authorUrl = authorName.replace(' ', '-').toLowerCase();
    const linkHTML = `by <a href="#author-${authorUrl}">${authorName}</a>`;
    authorWrapper.innerHTML = linkHTML;
  }
  console.log('--- ZAKOŃCZONO GENEROWANIE AUTORÓW ---');
};

/* === ETAP 5: OBSŁUGA KLIKNIĘCIA W AUTORA (FILTROWANIE) === */
const authorClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Kliknięto w link autora:', clickedElement);

  const href = clickedElement.getAttribute('href');
  const authorUrl = href.replace('#author-', '');

  const activeAuthorLinks = document.querySelectorAll('a[href^="#author-"].active');
  for (let activeLink of activeAuthorLinks) {
    activeLink.classList.remove('active');
  }

  const matchingAuthorLinks = document.querySelectorAll(`a[href="${href}"]`);
  for (let matchingLink of matchingAuthorLinks) {
    matchingLink.classList.add('active');
  }

  const allArticles = document.querySelectorAll(optArticleSelector);
  for (let article of allArticles) {
    article.classList.remove('active');
  }

  for (let article of allArticles) {
    const articleAuthor = article.getAttribute('data-author');
    const formattedArticleAuthor = articleAuthor.replace(' ', '-').toLowerCase();

    if (formattedArticleAuthor === authorUrl) {
      article.classList.add('active');
    }
  }
};

/* === ETAP 6: PRZYPISANIE NASŁUCHIWANIA DO LINKÓW AUTORÓW === */
const addClickListenersToAuthors = function() {
  const authorLinks = document.querySelectorAll('.post-author a');
  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
  console.log(`Przypisano nasłuchiwanie kliknięć do ${authorLinks.length} linków autorów.`);
};

// INICJALIZACJA WYWOŁAŃ PRZY STARCIE STRONY
generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToAuthors();
