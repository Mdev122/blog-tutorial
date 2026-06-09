'use strict';

console.log('=== SKRYPT URUCHOMIONY POPRAWNIE ===');

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
