// Newsify/src/components/main.js
import { CATEGORIES } from '/src/categories.js';
import { renderIntro } from './intro.js';



export function renderMain(view = 'home') {
  switch (view) {
    case 'home':
      return `
        <section class="home-view">
          <div id="news-list"></div>
        </section>
      `;
    case 'setting':
      // Hide news-list if it exists in the DOM
      setTimeout(() => {
        const newsList = document.getElementById('news-list');
        if (newsList) newsList.style.display = 'none';
      }, 0);
      const enabledCategories = JSON.parse(localStorage.getItem('enabledCategories') || '[]');
      return `
      <section class="settings-view">
  <h2>Settings</h2>
  <h3>Categories</h3>
  <div class="settings">
    ${CATEGORIES.map(category => `
      <div class="form-group">
      <img src="/newsify_logo_1.png" alt="Newsify Logo" class="heartbeat" style="height: 38px;" />
        <label>${category.label.toUpperCase()}</label>
        <label class="switch">
          <input type="checkbox" data-category="${category.label.toLowerCase()}" ${enabledCategories.includes(category.label.toLowerCase()) ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      </div>
    `).join('')}
  </div>
  <div class="dark">
  <button class="dark-mode-toggle">Toggle dark mode</button>
  <p class="version">Version 4.8.15.16.23.42</p>
  </div>
</section>

      `;
    case 'archive':
      return `
        <section class="archive-view">
          <h2>Archive</h2>
          <div id="news-list">No archived news available.</div> <!-- Added placeholder text -->
        </section>
      `;
   
    case 'popular':
      return `
      <section class="popular-view">
        <h2>Popular</h2>
        <div id="news-list">Fetching popular news...</div> <!-- Added placeholder text -->
      </section>
      `;
    default:
      return `<h2>Page not found</h2>`;
  }
}
if (!localStorage.getItem('onboardingCompleted')) {
  renderIntro(document.getElementById('main'));


} else {
  // Do not call loadPage here, as it is not defined in this file and should be handled in your main app logic
}