// C:\Users\45206\sites\newsbox-Fadiias\Newsify\Newsbox\src\components\intro.js
export function renderIntro(callback) {
  const main = document.querySelector('main');
  main.innerHTML = `
 
      <div class="intro-slider">
        <img id="slideImage" src="/Onboarding_2.png" alt="Onboarding Image">
      </div>
      <div class="intro-content">
        <h2 id="slideTitle">Stay Connected, Everywhere, Anytime</h2>
        <p id="slideText">
          Welcome to Newsify, your ultimate destination for breaking news, exclusive stories, and tailored content.
        </p>
        <div class="intro-indicators" id="introIndicators"></div>
        <div class="intro-buttons">
        <button id="skipBtn" class="skip-button">Skip</button>
        <button id="continueBtn" class="continue-button">Continue</button>
           </div>     
        </div>
    </section>
  `;

  const slides = [
    {
      img: '/Onboarding_2.png',
      title: 'Stay Connected, Everywhere, Anytime',
      text: 'Welcome to Newsify, your ultimate destination for breaking news, exclusive stories, and tailored content.'
    },
    {
      img: '/Onboarding_3.png',
      title: 'Become a Savvy Global Citizen',
      text: 'Discover tailored news that aligns with your interests and preferences. Your personalized news journey awaits!'
    },
    {
      img: '/Onboarding_4.png',
      title: 'Enhance your News Journey Now!',
      text: 'Be part of our dynamic community and contribute your insights and participate in enriching conversations.'
    }
  ];

  let currentSlide = 0;

  const slideImage = document.getElementById('slideImage');
  const slideTitle = document.getElementById('slideTitle');
  const slideText = document.getElementById('slideText');
  const indicatorsContainer = document.getElementById('introIndicators');
  const continueBtn = document.getElementById('continueBtn');
  const skipBtn = document.getElementById('skipBtn');

  function renderIndicators() {
    indicatorsContainer.innerHTML = slides.map((_, idx) =>
      `<span class="indicator${idx === currentSlide ? ' active' : ''}" data-idx="${idx}"></span>`
    ).join('');
    // Add click listeners for indicators
    Array.from(indicatorsContainer.children).forEach((el, idx) => {
      el.addEventListener('click', () => {
        currentSlide = idx;
        showSlide(currentSlide);
      });
    });
  }

  function showSlide(index) {
    console.log('Switching to slide:', index, slides[index]);
    slideImage.src = slides[index].img;
    slideTitle.textContent = slides[index].title;
    slideText.textContent = slides[index].text;
    renderIndicators();
    continueBtn.textContent = (index === slides.length - 1) ? 'Get Started' : 'Continue';
  }

  continueBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      if (callback && typeof callback === 'function') {
        callback();
      } else {
        window.location.hash = '#home';
      }
    }
  });

  skipBtn.addEventListener('click', () => {
    localStorage.setItem('onboardingCompleted', 'true');
    if (callback && typeof callback === 'function') {
      callback();
    } else {
      window.location.hash = '#home';
    }
  });

  // Initial render of indicators
  renderIndicators();
}