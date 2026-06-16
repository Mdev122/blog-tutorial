'use strict';

console.log('=== SKRYPT URUCHOMIONY POPRAWNIE ===');

// JEDEN WSPÓLNY BLOK KONFIGURACYJNY
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optArticleAuthorDataSelector = '[data-author]',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,       
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors'; // Stała ustawień dla listy autorów bocznych

/* === ETAP 1: OBSŁUGA KLIKNIĘCIA W TYTUŁ (MENU BOCZNE) === */
const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Kliknięto w link artykułu:', clickedElement);

  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activePosts = document.querySelectorAll('.posts .post.active');
  for (let activePost of activePosts) {
    activePost.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);

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

/* === ETAP 2.5: FUNKCJA OBLICZAJĄCA MIN I MAX WYSTĄPIEŃ TAGÓW === */
const calculateTagsParams = function(tags) {
  const params = {
    max: 0,
    min: 999999
  };

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }

  return params;
};

/* === ETAP 2.6: FUNKCJA OBLICZAJĄCA KLASĘ DLA TAGU (CHMURA TAGÓW) === */
const calculateTagClass = function(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
};

/* === ETAP 3: DYNAMICZNE GENEROWANIE TAGÓW === */
const generateTags = function() {
  console.log('--- URUCHOMIONO GENEROWANIE TAGÓW ---');
  
  let allTags = {};

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

      if(!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }

    tagsWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  let allTagsHTML = '';

  for(let tag in allTags){
    const tagLinkClass = calculateTagClass(allTags[tag], tagsParams);
    allTagsHTML += `<li><a class="${tagLinkClass}" href="#tag-${tag}">${tag}</a></li> `;
  }

  if (tagList) {
    tagList.innerHTML = allTagsHTML;
  } else {
    console.warn(`Brak listy tagów w chmurze bocznej dla selektora: ${optTagsListSelector}`);
  }

  console.log('--- ZAKOŃCZONO GENEROWANIE TAGÓW ---');
};

/* === ETAP 4: DYNAMICZNE GENEROWANIE AUTORÓW ORAZ LISTY BOCZNEJ === */
const generateAuthors = function() {
  console.log('--- URUCHOMIONO GENEROWANIE AUTORÓW ---');
  
  /* Obiekt do zliczania liczby artykułów napisanych przez poszczególnych autorów */
  let allAuthors = {};

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

    /* Logika zliczania wystąpień autora bez pętli wewnętrznej */
    if (!allAuthors[authorName]) {
      allAuthors[authorName] = 1;
    } else {
      allAuthors[authorName]++;
    }
  }

  const authorList = document.querySelector(optAuthorsListSelector);
  let allAuthorsHTML = '';

  /* Pętla generująca kody HTML linków z licznikami do bocznej kolumny */
  for (let authorName in allAuthors) {
    const authorUrl = authorName.replace(' ', '-').toLowerCase();
    allAuthorsHTML += `<li><a href="#author-${authorUrl}"><span>${authorName} (${allAuthors[authorName]})</span></a></li> `;
  }

  if (authorList) {
    authorList.innerHTML = allAuthorsHTML;
  } else {
    console.warn(`Brak listy autorów w menu bocznym dla selektora: ${optAuthorsListSelector}`);
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
  /* Selektor wyłapuje linki autorów z artykułów oraz z bocznej listy */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
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
