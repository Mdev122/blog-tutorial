/* global Handlebars */
'use strict';

console.log('=== SKRYPT URUCHOMIONY POPRAWNIE Z HANDLEBARS ===');

// JEDEN WSPÓLNY BLOK KONFIGURACYJNY
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,       
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

// GLOBALNY OBIEKT PRZECHOWUJĄCY SKOMPILOWANE SZABLONY
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};

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
const generateTitleLinks = function(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
    // WYKONANO: Pkt. 1 - Wykorzystanie szablonu pojedynczego linku artykułu
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

  if (links.length > 0) {
    links[0].click();
  }
};

/* === ETAP 2.5: FUNKCJE POMOCNICZE DLA CHMURY TAGÓW === */
const calculateTagsParams = function(tags) {
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    if (tags[tag] > params.max) params.max = tags[tag];
    if (tags[tag] < params.min) params.min = tags[tag];
  }
  return params;
};

const calculateTagClass = function(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  
  if (normalizedMax === 0) {
    return optCloudClassPrefix + 1;
  }

  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
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
    const articleTagsArray = articleTags.split(' ');

    for (let tag of articleTagsArray) {
      // WYKONANO: Pkt. 2 - Wykorzystanie szablonu pojedynczego linku tagu w poście
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.articleTag(linkHTMLData);
      
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

  // WYKONANO: Pkt. 4 - Stworzenie pustego obiektu struktury danych chmury zamiast allTagsHTML
  const allTagsData = { tags: [] };

  for(let tag in allTags) {
    // WYKONANO: Pkt. 4 - Wpychanie kolejnych obiektów do tablicy z parametrami dla chmury
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  console.log('Zawartość obiektu allTagsData dla punktu 4:', allTagsData);

  if (tagList) {
    // WYKONANO: Pkt. 4 - Przekazanie zbiorczego obiektu do szablonu zawierającego pętlę {{#each}}
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  } else {
    console.warn(`Brak listy tagów w chmurze bocznej dla selektora: ${optTagsListSelector}`);
  }
  console.log('--- ZAKOŃCZONO GENEROWANIE TAGÓW ---');
};

/* === ETAP 4: DYNAMICZNE GENEROWANIE AUTORÓW ORAZ LISTY BOCZNEJ === */
const generateAuthors = function() {
  console.log('--- URUCHOMIONO GENEROWANIE AUTORÓW ---');
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
    const authorUrl = authorName.replace(/ /g, '-').toLowerCase();
    
    // WYKONANO: Pkt. 3 - Wykorzystanie szablonu pojedynczego linku autora pod wpisem
    const linkHTMLData = { authorName: authorName, authorUrl: authorUrl };
    const linkHTML = templates.articleAuthor(linkHTMLData);
    
    authorWrapper.innerHTML = linkHTML;

    if (!allAuthors[authorName]) {
      allAuthors[authorName] = 1;
    } else {
      allAuthors[authorName]++;
    }
  }

  const authorList = document.querySelector(optAuthorsListSelector);
  
  // WYKONANO: Pkt. 5 - Analogiczne stworzenie obiektu struktury danych listy autorów bocznych
  const allAuthorsData = { authors: [] };

  for (let authorName in allAuthors) {
    allAuthorsData.authors.push({
      authorName: authorName,
      authorUrl: authorName.replace(/ /g, '-').toLowerCase(),
      count: allAuthors[authorName]
    });
  }

  console.log('Zawartość obiektu allAuthorsData dla punktu 5:', allAuthorsData);

  if (authorList) {
    // WYKONANO: Pkt. 5 - Przekazanie zbiorczego obiektu do szablonu zawierającego pętlę {{#each}}
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
  } else {
    console.warn(`Brak listy autorów w menu bocznym dla selektora: ${optAuthorsListSelector}`);
  }

  console.log('--- ZAKOŃCZONO GENEROWANIE AUTORÓW ---');
};

/* === ETAP 5: OBSŁUGA KLIKNIĘCIA W AUTORA (FILTROWANIE) === */
const authorClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  const authorName = clickedElement.getAttribute('data-author');

  const activeAuthorLinks = document.querySelectorAll('a[href^="#author-"].active');
  for (let activeLink of activeAuthorLinks) {
    activeLink.classList.remove('active');
  }

  const matchingAuthorLinks = document.querySelectorAll(`a[href="${href}"]`);
  for (let matchingLink of matchingAuthorLinks) {
    matchingLink.classList.add('active');
  }

  generateTitleLinks(`[data-author="${authorName}"]`);
};

/* === ETAP 5.5: OBSŁUGA KLIKNIĘCIA W TAG (FILTROWANIE) === */
const tagClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const activeTagLinks = document.querySelectorAll('a[href^="#tag-"].active');
  for (let activeLink of activeTagLinks) {
    activeLink.classList.remove('active');
  }

  const matchingTagLinks = document.querySelectorAll(`a[href="${href}"]`);
  for (let matchingLink of matchingTagLinks) {
    matchingLink.classList.add('active');
  }

  generateTitleLinks(`[data-tags~="${tag}"]`);
};

/* === ETAP 6: PRZYPISANIE NASŁUCHIWANIA === */
const addClickListenersToAuthors = function() {
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
};

const addClickListenersToTags = function() {
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  for (let link of tagLinks) {
    link.addEventListener('click', tagClickHandler);
  }
};

/* === RESETOWANIE FILTRÓW PO KLIKNIĘCIU W LOGO === */
const logo = document.querySelector('.logo');
if (logo) {
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', function() {
    const activeLinks = document.querySelectorAll('a.active');
    for (let link of activeLinks) {
      link.classList.remove('active');
    }
    generateTitleLinks();
  });
}

// INICJALIZACJA WYWOŁAŃ PRZY STARCIE STRONY
generateTags();
generateAuthors();
generateTitleLinks();
addClickListenersToAuthors();
addClickListenersToTags();