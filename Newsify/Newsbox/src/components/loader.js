function loadPage() {
  const view = location.hash.slice(1) || 'home';
  console.log("Loading view:", view);
  const header = document.getElementById('header');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');
  const contentContainer = document.getElementById('content-container');
  console.log('Header element:', header);
  console.log('Main element:', main);
  console.log('Footer element:', footer);
  console.log('Content container:', contentContainer);
  if (contentContainer) {
    contentContainer.style.display = 'block';
    console.log('Content container displayed');
  }
  try {
    if (header) {
      header.innerHTML = renderHeader(view);
      console.log('Header rendered');
    }
    if (main) {
      main.innerHTML = renderMain(view);
      console.log('Main rendered');
    }
    if (footer) {
      footer.innerHTML = renderFooter(view);
      console.log('Footer rendered');
    }
  } catch (error) {
    console.error(`Render error for view ${view}:`, error);
    main.innerHTML = `<h2>Error rendering page: ${error.message}</h2>`;
  }
  loadContent(view);
}
export function addLoader(parent) {
  // Remove any existing loader image with the loader-logo class
  let img = parent.querySelector('img.loader-logo');
  if (!img) {
    img = document.createElement('img');
    img.src = '/newsify_logo_1.png';
    img.alt = 'Loading...';
    img.className = 'loader-logo heartbeat'; // Ensure correct class
    parent.appendChild(img);
  }
  img.style.display = 'block';
  parent.style.display = 'flex';
}

export function removeLoader(parent) {
  const img = parent.querySelector('img.loader-logo');
  if (img) img.style.display = 'none';
  parent.style.display = 'none';
}

setTimeout(() => {
}, 600);