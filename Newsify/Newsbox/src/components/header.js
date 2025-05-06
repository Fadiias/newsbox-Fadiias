// header.js
export function renderHeader(view) {
    return `
      <div class="logo">
        <img src="/newsify_logo_1.png" alt="Newsify logo">
        <h1>Newsify</h1>
      </div>
    `;
  }
  
  // toast.js
  export function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }