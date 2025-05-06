// C:\Users\45206\sites\newsbox-Fadiias\Newsify\Newsbox\src\components\toast.js
export function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.textContent = '';
  }, 3000);
}