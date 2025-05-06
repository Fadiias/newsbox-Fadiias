// C:\Users\45206\sites\newsbox-Fadiias\Newsify\Newsbox\src\home.js
import './style.scss';
import { addLoader, removeLoader } from './components/loader.js';
import { renderIntro } from './components/intro.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderMain } from './components/main.js';
import { showToast } from './components/toast.js';
import { CATEGORIES } from '/src/categories.js';

// Use a single DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  try {
    showLogoThenOnboarding();
  } catch (error) {
    console.error('Error during initial flow:', error);
  }
});

function showLogoThenOnboarding() {
  const main = document.getElementById('main') || document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <section class="intro-logo" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;">
        <img src="/newsify_logo_2.png" alt="Newsify logo" />
        <h1 id="introTitle">Newsify</h1>
      </section>
    `;
    // Animate the h1 in
    setTimeout(() => {
      const introTitle = document.getElementById('introTitle');
      if (introTitle) introTitle.classList.add('show');
    }, 300);
    // After animation, show onboarding
    setTimeout(() => {
      renderIntro(completeOnboarding);
    }, 4000);
  }
}

function completeOnboarding() {
  // Always show auth after onboarding
  showAuthScreen();
}

function showAuthScreen() {
  const main = document.getElementById('main') || document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <section class="auth-view">
      <div class="logo">
        <img src="/newsify_logo_1.png" alt="Newsify logo">
        <h1>Newsify</h1>
      </div>
          <p>Welcome! Let’s dive into your account!</p>
         <div class="auth-buttons">
           <button type="submit">Continue with Facebook</button>
            <button type="submit">Continue with Google</button>
          </div>
        <div class="or" >  <hr><p>or</p> <hr></div>
         
           <button type="submit" style="margin-top: 4em">Sign in with password</button>
          <p> Don’t have an account? <span style="color:rgba(77, 134, 31, 1)">Sign up</span></p>
        </section>
    `;
    setupAuthForm();
    // Only proceed to main app after successful auth (simulate for demo)
    const mainAppStart = (e) => {
      // Only trigger on button or form submit
      if (
        e.target.matches('.auth-buttons button') ||
        e.target.matches('.auth-view button[type="submit"]')
      ) {
        e.preventDefault && e.preventDefault();
        main.removeEventListener('click', mainAppStart);
        loadPage();
      }
    };
    main.addEventListener('click', mainAppStart);
  }
}

// Prevent duplicate hashchange events by using debouncing
let debounceTimer;
window.addEventListener('hashchange', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadPage();
  }, 300);
});

function loadPage() {
  const view = location.hash.slice(1) || 'home';
  console.log("Loading view:", view);

  const header = document.getElementById('header');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');
  const contentContainer = document.getElementById('content-container');
  const loaderContainer = document.getElementById('loader-container');

  console.log('Header element:', header);
  console.log('Main element:', main);
  console.log('Footer element:', footer);
  console.log('Content container:', contentContainer);
  console.log('Loader container:', loaderContainer);

  if (contentContainer) {
    contentContainer.style.display = 'none';
    console.log('Content container hidden');
  } else {
    console.warn('content-container element not found');
  }
  if (loaderContainer) {
    loaderContainer.style.display = 'flex';
    console.log('Loader container displayed');
  } else {
    console.warn('loader-container element not found');
  }

  setTimeout(() => {
    if (loaderContainer) {
      loaderContainer.style.display = 'none';
      console.log('Loader container hidden');
    }
    if (contentContainer) {
      contentContainer.style.display = 'block';
      console.log('Content container displayed');
    }
    // Move animation here so it runs immediately after loader hides
    animateRainAll();
    loadContent(view);
  }, 1000);

  try {
    if (header) {
      header.innerHTML = renderHeader(view);
      console.log('Header rendered');
    }
    if (main) {
      main.innerHTML = renderMain(view);
      console.log('Main rendered');
      // Only animate rain effect for home/news
      if (view === 'home' || view === 'popular') {
        animateMainContentRain();
      }
    }
    if (footer) {
      footer.innerHTML = renderFooter(view);
      console.log('Footer rendered');
    }
  } catch (error) {
    console.error(`Render error for view ${view}:`, error);
    if (main) {
      main.innerHTML = `<h2>Error rendering page: ${error.message}</h2>`;
    }
  }
}

function loadContent(view) {
  try {
    switch (view) {
      case 'home':
        console.log('Initializing home view');
        loadNews();
        break;
      case 'setting':
        console.log('Initializing settings view');
        setupSettings();
        addDarkModeToggle();
        break;
      case 'archive':
        console.log('Initializing archive view');
        loadArchive();
        break;
      case 'auth':
        console.log('Initializing auth view');
        setupAuthForm();
        break;
      case 'popular':
        console.log('Initializing popular view');
        loadPopularNews();
        break;
      default:
        console.error('Unknown view:', view);
        const main = document.getElementById('main');
        if (main) {
          main.innerHTML = `<h2>Page not found</h2>`;
        }
    }
  } catch (error) {
    console.error(`Error initializing view ${view}:`, error);
    const main = document.getElementById('main');
    if (main) {
      main.innerHTML = `<h2>Error loading view: ${error.message}</h2>`;
    }
  }
}

const API_KEY = import.meta.env.VITE_NYT_API_KEY || 'wHo2uXGpV0jazXOxIfWcf7X0WZlBJDz0';
console.log('API Key:', API_KEY);
const PLACEHOLDER_IMAGE = '/placeholder_1.png';
const ONBOARDING_IMAGES = [
  './Onboarding_2.png',
  './Onboarding_3.png',
  './Onboarding_4.png',
];
const secondaryLogo = '/newsify_logo_2.png';

let hasUserInteracted = false;
document.addEventListener('touchstart', () => {
  hasUserInteracted = true;
}, { once: true });
document.addEventListener('click', () => {
  hasUserInteracted = true;
}, { once: true });

function loadNews() {
  let newsList = document.getElementById('news-list');
  const loaderContainer = document.getElementById('loader-container');
  if (loaderContainer) addLoader(loaderContainer);
  if (!newsList) {
    console.error('news-list element not found. Creating a placeholder.');
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
      newsList = document.createElement('div');
      newsList.id = 'news-list';
      contentContainer.appendChild(newsList);
    } else {
      console.error('content-container element not found.');
      return;
    }
  }
  newsList.innerHTML = '';
  newsList.style.display = 'block';
  console.log('News list initialized');

  if (!API_KEY) {
    console.error('NYT API key is not configured.');
    newsList.innerHTML = '<p>Error: News cannot be loaded because the API key is missing. Please contact the administrator.</p>';
    return;
  }

  let enabledCategories = JSON.parse(localStorage.getItem('enabledCategories') || '[]');
  // Normalize all category names: map 'sport' and any case to 'sports', and lowercase all
  enabledCategories = enabledCategories.map(c => {
    if (typeof c === 'string' && c.toLowerCase() === 'sport') return 'sports';
    return typeof c === 'string' ? c.toLowerCase() : c;
  });
  // Remove duplicates
  enabledCategories = Array.from(new Set(enabledCategories));
  // Remove 'europe' from enabledCategories if present
  enabledCategories = enabledCategories.filter(c => c !== 'europe');
  if (!enabledCategories || enabledCategories.length === 0) {
    enabledCategories = CATEGORIES.map(c => c.label.toLowerCase());
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
    console.log('Enabled all categories by default:', enabledCategories);
  } else {
    // Save the fixed categories back to localStorage if any were changed
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
  }
  const categoriesToShow = CATEGORIES.filter(c => enabledCategories.includes(c.label.toLowerCase()));
  console.log('Categories to show:', categoriesToShow);

  if (categoriesToShow.length === 0) {
    newsList.innerHTML = '<p>No categories enabled. Please enable at least one category in settings.</p>';
    return;
  }

  let newsFound = false;
  let fetchCount = 0;
  categoriesToShow.forEach(category => {
    const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${category.label.toLowerCase()}.json?api-key=${API_KEY}`;
    console.log(`Fetching news for ${category.label}: ${apiUrl}`);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        fetchCount++;
        if (data.results && data.results.length > 0) {
          newsFound = true;
          fetchNewsForCategory(apiUrl, category, newsList);
        }
        if (fetchCount === categoriesToShow.length) {
          if (loaderContainer) removeLoader(loaderContainer);
          if (!newsFound) {
            newsList.innerHTML = '<p>No news found for the selected categories.</p>';
          }
        }
      })
      .catch(error => {
        fetchCount++;
        if (fetchCount === categoriesToShow.length) {
          if (loaderContainer) removeLoader(loaderContainer);
          if (!newsFound) {
            newsList.innerHTML = '<p>No news found for the selected categories.</p>';
          }
        }
      });
  });
}

function loadPopularNews() {
  const loaderContainer = document.getElementById('loader-container');
  if (loaderContainer) addLoader(loaderContainer);
  if (!API_KEY) {
    const newsList = document.getElementById('news-list');
    if (newsList) {
      newsList.innerHTML = '<p>Error: News cannot be loaded because the API key is missing. Please contact the administrator.</p>';
    }
    if (loaderContainer) removeLoader(loaderContainer);
    console.error('NYT API key is not configured.');
    return;
  }
  const url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${API_KEY}`;
  console.log(`Fetching popular news: ${url}`);
  fetchNewsWithLoader(url, 'popular', loaderContainer);
}

function fetchNewsWithLoader(url, view, loaderContainer) {
  const newsList = document.getElementById("news-list");
  if (!newsList) {
    if (loaderContainer) removeLoader(loaderContainer);
    console.error(`news-list element not encountered for view: ${view}`);
    return;
  }
  newsList.innerHTML = '';
  newsList.style.display = 'block';
  console.log(`News list initialized for ${view}`);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing API key. Please check your NYT API key configuration.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0 || !data.results[0].title) {
        throw new Error('No valid articles in API response');
      }
      console.log(`API response for ${view}:`, data.results[0]);

      const list = document.createElement('ul');
      list.className = 'article-list';
      list.innerHTML = data.results.map(article => {
        const hasImage = article.multimedia && article.multimedia.length > 0;
        const imageTag = hasImage ? `<img src="${article.multimedia[0].url}" alt="${article.title}" class="news-image" />` : '';
        const swipeActions = `<div class="icon right"><i class="fa-regular fa-bookmark"></i></div>`;
        return `
          <li class="news-article" data-id="${article.uri}" data-url="${article.url}">
            <div class="swipe-background">${swipeActions}</div>
            <span class="article-content">
              ${imageTag}
              <div class="news-text">
                <h4>${article.title}</h4>
                <p>${article.abstract || 'No description available.'}</p>
              </div>
            </span>
          </li>
        `;
      }).join('');
      newsList.appendChild(list);
      console.log(`Appended article list for ${view}`);

      document.querySelectorAll('.news-article').forEach(item => handleSwipe(item, view));
      if (loaderContainer) removeLoader(loaderContainer);
    })
    .catch(error => {
      if (loaderContainer) removeLoader(loaderContainer);
      console.error(`Fetch error for ${view}:`, error);
      newsList.innerHTML = `
        <p>Failed to load news: ${error.message}. 
        <button onclick="loadPopularNews()">Retry</button></p>`;
      console.log(`Appended error message for ${view}`);
    });
}

function fetchNewsForCategory(apiUrl, category, newsList) {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing API key. Please check your NYT API key configuration.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0 || !data.results[0].title) {
        throw new Error('No valid articles in API response');
      }
      console.log(`API response for ${category.id}:`, data.results[0]);

      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      if (category.id === CATEGORIES[0].id) {
        categorySection.classList.add('expanded');
      }

      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.innerHTML = `
        <img src="/newsify_logo_1.png" alt="Newsify Logo" class="heartbeat" style="height: 38px;" />
        <h3>${category.label.toUpperCase()}</h3>
        <i class="fas toggle-arrow ${category.id === CATEGORIES[0].id ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
      `;
      categorySection.appendChild(categoryHeader);

      const list = document.createElement('ul');
      list.className = 'category-news-list';
      list.innerHTML = data.results.map(article => {
        const hasImage = article.multimedia && article.multimedia.length > 0;
        const imageTag = hasImage ? `<img src="${article.multimedia[0].url}" alt="${article.title}" class="news-image" />` : '';
        return `
          <li class="news-article" data-id="${article.uri}" data-url="${article.url}">
            <div class="swipe-background">
              <div class="icon right"><i class="fa-regular fa-bookmark"></i></div>
            </div>
            <span class="article-content">
              ${imageTag}
              <div class="news-text">
                <h4>${article.title}</h4>
                <p>${article.abstract || 'No description available.'}</p>
              </div>
            </span>
          </li>
        `;
      }).join('');
      categorySection.appendChild(list);

      categoryHeader.addEventListener('click', () => {
        categorySection.classList.toggle('expanded');
        const arrow = categoryHeader.querySelector('.toggle-arrow');
        arrow.classList.toggle('fa-chevron-right');
        arrow.classList.toggle('fa-chevron-down');
      });

      list.querySelectorAll('.news-article').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.swipe-background') || e.target.closest('.icon')) return;
          const articleUrl = item.dataset.url;
          if (articleUrl) {
            window.open(articleUrl, '_blank');
          }
        });
      });

      newsList.appendChild(categorySection);
      console.log(`Appended category section for ${category.label}`);
      document.querySelectorAll('.news-article').forEach(item => handleSwipe(item, 'home'));
    })
    .catch(error => {
      console.error(`Fetch error for ${category.id}:`, error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'category-section';
      errorDiv.innerHTML = `
        <div class="category-header">
          <h3>${category.label.toUpperCase()}</h3>
          <i class="fas fa-chevron-right toggle-arrow"></i>
        </div>
        <p>Failed to load news: ${error.message}</p>
      `;
      newsList.appendChild(errorDiv);
      console.log(`Appended error section for ${category.label}`);
    });
}

function fetchNews(url, view = 'popular') {
  const newsList = document.getElementById("news-list");
  if (!newsList) {
    console.error(`news-list element not encountered for view: ${view}`);
    return;
  }
  newsList.innerHTML = '';
  newsList.style.display = 'block';
  console.log(`News list initialized for ${view}`);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing API key. Please check your NYT API key configuration.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0 || !data.results[0].title) {
        throw new Error('No valid articles in API response');
      }
      console.log(`API response for ${view}:`, data.results[0]);

      const list = document.createElement('ul');
      list.className = 'article-list';
      list.innerHTML = data.results.map(article => {
        const hasImage = article.multimedia && article.multimedia.length > 0;
        const imageTag = hasImage ? `<img src="${article.multimedia[0].url}" alt="${article.title}" class="news-image" />` : '';
        const swipeActions = `<div class="icon right"><i class="fa-regular fa-bookmark"></i></div>`;
        return `
          <li class="news-article" data-id="${article.uri}" data-url="${article.url}">
            <div class="swipe-background">${swipeActions}</div>
            <span class="article-content">
              ${imageTag}
              <div class="news-text">
                <h4>${article.title}</h4>
                <p>${article.abstract || 'No description available.'}</p>
              </div>
            </span>
          </li>
        `;
      }).join('');
      newsList.appendChild(list);
      console.log(`Appended article list for ${view}`);

      document.querySelectorAll('.news-article').forEach(item => handleSwipe(item, view));
    })
    .catch(error => {
      console.error(`Fetch error for ${view}:`, error);
      newsList.innerHTML = `
        <p>Failed to load news: ${error.message}. 
        <button onclick="loadPopularNews()">Retry</button></p>`;
      console.log(`Appended error message for ${view}`);
    });
}
function handleSwipe(item, view = 'home') {
  let startX = 0;
  let deltaX = 0;
  const content = item.querySelector('.article-content');
  const background = item.querySelector('.swipe-background');
  const icon = background.querySelector('.icon');

  item.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  item.addEventListener('touchmove', (e) => {
    deltaX = e.touches[0].clientX - startX;
    content.style.transform = `translateX(${deltaX}px)`;

    const isDarkMode = document.body.classList.contains('dark-mode'); // Check if dark mode is active

    // Set the background color for dark mode or light mode
    if (view === 'archive') {
      background.style.background = deltaX < -50 ? '#D32F2F' : 'transparent'; // Red background for delete
      if (isDarkMode) {
        background.style.background = deltaX < -50 ? 'rgba(211, 47, 47, 0.8)' : 'transparent'; // Slight transparency in dark mode
      }
    } else if (view === 'home' || view === 'popular') {
      background.style.background = deltaX < -100 ? '#4D861F' : 'transparent'; // Green background for save
      if (isDarkMode) {
        background.style.background = deltaX < -100 ? 'rgba(77, 134, 31, 0.8)' : 'transparent'; // Slight transparency in dark mode
      }
    }

    // Show/hide icon based on swipe direction
    if (deltaX < -50) {
      icon.style.display = 'block';
    } else {
      icon.style.display = 'none';
    }
  });

  item.addEventListener('touchend', () => {
    const isDarkMode = document.body.classList.contains('dark-mode'); // Check if dark mode is active
    const swipeThreshold = 150;

    if (isDarkMode) {
      icon.style.display = 'none'; // Hide the icon in dark mode
    }

    // Execute actions based on the swipe threshold
    if (view === 'archive' && deltaX < -swipeThreshold) {
      if (hasUserInteracted && navigator.vibrate) navigator.vibrate(50);
      deleteArticle(item);
    } else if ((view === 'home' || view === 'popular') && deltaX < -swipeThreshold) {
      if (hasUserInteracted && navigator.vibrate) navigator.vibrate(50);
      saveArticle(item);
    }

    // Reset the swipe state
    content.style.transform = 'translateX(0)';
    background.style.background = 'transparent'; // Reset background after swipe
  });

  item.querySelector('.swipe-background .icon')?.addEventListener('click', () => {
    if (view === 'archive') {
      if (hasUserInteracted && navigator.vibrate) navigator.vibrate(50);
      deleteArticle(item);
    } else if (view === 'home' || view === 'popular') {
      if (hasUserInteracted && navigator.vibrate) navigator.vibrate(50);
      saveArticle(item);
    }
  });
}


function saveArticle(itemElement) {
  const id = itemElement.dataset.id;
  // Try to extract title, description, and image from DOM
  let title = itemElement.querySelector('.news-text h4')?.innerText;
  let description = itemElement.querySelector('.news-text p')?.innerText;
  let image = itemElement.querySelector('.news-image')?.getAttribute('src');
  const url = itemElement.dataset.url || '#';

  // Fallbacks if selectors fail (log for debugging)
  if (!title) {
    title = itemElement.innerText || 'Untitled';
    console.warn('Title fallback used:', title);
  }
  if (!description) {
    description = 'No description available.';
    console.warn('Description fallback used:', description);
  }
  if (!image) {
    image = PLACEHOLDER_IMAGE;
    console.warn('Image fallback used:', image);
  }
  console.log('Saving article:', { id, title, description, image, url });

  const article = { id, title, description, image, url };
  let articles = JSON.parse(localStorage.getItem('articles') || '[]');

  if (!articles.some(a => a.id === id)) {
    articles.push(article);
    localStorage.setItem('articles', JSON.stringify(articles));
    showToast('Article Saved!');
  }
}

function deleteArticle(itemElement) {
  const id = itemElement.dataset.id;
  let articles = JSON.parse(localStorage.getItem('articles') || '[]');
  articles = articles.filter(article => article.id !== id);
  localStorage.setItem('articles', JSON.stringify(articles));
  itemElement.remove();
  showToast('Deleted!');
}

function addDarkModeToggle() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (darkModeToggle) {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    document.body.classList.toggle('dark-mode', isDarkModeEnabled);

    darkModeToggle.addEventListener('click', () => {
      const isEnabled = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
      console.log('Dark mode toggled:', isEnabled);
    });
  } else {
    console.error('Dark mode toggle button not found.');
  }
}

function setupSettings() {
  const checkboxes = document.querySelectorAll('.settings input[type="checkbox"][data-category]');
  const darkModeToggle = document.querySelector('.dark-mode-toggle');

  let enabledCategories = JSON.parse(localStorage.getItem('enabledCategories') || '[]');
  // Normalize all category names: map 'sport' and any case to 'sports', and lowercase all
  enabledCategories = enabledCategories.map(c => {
    if (typeof c === 'string' && c.toLowerCase() === 'sport') return 'sports';
    return typeof c === 'string' ? c.toLowerCase() : c;
  });
  // Remove duplicates
  enabledCategories = Array.from(new Set(enabledCategories));
  localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));

  checkboxes.forEach(checkbox => {
    const category = checkbox.dataset.category.toLowerCase();
    checkbox.checked = enabledCategories.includes(category);

    checkbox.addEventListener('change', (e) => {
      const category = e.target.dataset.category.toLowerCase();
      if (e.target.checked) {
        if (!enabledCategories.includes(category)) {
          enabledCategories.push(category);
        }
      } else {
        enabledCategories = enabledCategories.filter(c => c !== category);
      }
      localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
      console.log('Enabled categories updated:', enabledCategories);
    });
  });

  if (darkModeToggle) {
    const isDark = localStorage.getItem('darkMode') === 'enabled';
    darkModeToggle.checked = isDark;
    document.body.classList.toggle('dark-mode', isDark);

    darkModeToggle.addEventListener('change', () => {
      const enabled = darkModeToggle.checked;
      document.body.classList.toggle('dark-mode', enabled);
      localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
      console.log('Dark mode toggled:', enabled);
    });
  }
}

function setupAuthForm() {
  const authButtons = document.querySelectorAll('.auth-buttons button');
  authButtons.forEach(button => {
    button.addEventListener('click', () => {
      const provider = button.textContent.includes('Facebook') ? 'Facebook' : 'Google';
      showToast(`Continue with ${provider}`);
    });
  });
  const signInButton = document.querySelector('.auth-view button[type="submit"]');
  if (signInButton) {
    signInButton.addEventListener('click', () => {
      showToast('Sign in with password');
    });
  }
  const signUpLink = document.querySelector('.auth-view p span');
  if (signUpLink) {
    signUpLink.addEventListener('click', () => {
      showToast('Sign up link clicked');
    });
  }
}

function loadArchive() {
  const loaderContainer = document.getElementById('loader-container');
  if (loaderContainer) addLoader(loaderContainer);
  let newsList = document.getElementById('news-list');
  if (!newsList) {
    console.error('news-list element not found for archive. Creating a placeholder.');
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
      newsList = document.createElement('div');
      newsList.id = 'news-list';
      contentContainer.appendChild(newsList);
    } else {
      if (loaderContainer) removeLoader(loaderContainer);
      console.error('content-container element not found.');
      return;
    }
  }
  newsList.innerHTML = '';
  newsList.style.display = 'block';
  console.log('News list initialized for archive');

  setTimeout(() => {
    const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    if (savedArticles.length === 0) {
      newsList.innerHTML = `<p class="empty-archive">No saved articles yet.</p>`;
      if (loaderContainer) removeLoader(loaderContainer);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'article-list';
    list.innerHTML = savedArticles.map(article => {
      const imageUrl = article.image || PLACEHOLDER_IMAGE;
      const description = article.description || 'No description available.';
      return `
        <li class="news-article" data-id="${article.id}" data-url="${article.url}">
          <div class="swipe-background">
            <div class="icon right"><i class="fa-solid fa-trash" style="margin-right: 1em;" aria-hidden="true"></i></div>
          </div>
          <span class="article-content">
            <img src="${imageUrl}" alt="${article.title}" class="news-image" />
            <div class="news-text">
              <h4>${article.title}</h4>
              <p>${description}</p>
            </div>
          </span>
        </li>
      `;
    }).join('');
    newsList.appendChild(list);
    console.log('Appended archive article list');

    list.querySelectorAll('.news-article').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.swipe-background') || e.target.closest('.icon')) return;
        const articleUrl = item.dataset.url;
        if (articleUrl) {
          window.open(articleUrl, '_blank');
        }
      });
    });

    document.querySelectorAll('.news-article').forEach(item => handleSwipe(item, 'archive'));
    if (loaderContainer) removeLoader(loaderContainer);
  }, 500);
}

// Add rain/fall animation to all direct children of #main on page load
function animateMainContentRain() {
  const main = document.getElementById('main');
  if (!main) return;
  // Animate all direct children
  const children = Array.from(main.children);
  children.forEach((child, i) => {
    child.classList.remove('fall-in-stagger');
    setTimeout(() => {
      child.classList.add('fall-in-stagger');
      child.style.animationDelay = `${i * 0.08}s`;
    }, 10);
  });
  // Animate news articles if present
  const articles = main.querySelectorAll('.news-article');
  articles.forEach((article, i) => {
    article.classList.remove('fall-in-stagger');
    setTimeout(() => {
      article.classList.add('fall-in-stagger');
      article.style.animationDelay = `${i * 0.12 + 0.5}s`; // was 0.05 + 0.3
    }, 10);
  });
}

function animateRainAll() {
  const header = document.getElementById('header');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');
  const elements = [header, main, footer];
  elements.forEach((el, i) => {
    if (el) {
      el.classList.remove('fall-in-stagger');
      setTimeout(() => {
        el.classList.add('fall-in-stagger');
        el.style.animationDelay = `${i * 0.22}s`; // was 0.12s
      }, 10);
    }
  });
}

window.loadPopularNews = loadPopularNews;