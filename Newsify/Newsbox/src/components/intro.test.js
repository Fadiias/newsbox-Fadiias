/// <reference types="vitest" />
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { renderIntro } from './intro.js';

beforeAll(() => {
  if (typeof document === 'undefined') {
    globalThis.document = require('jsdom').JSDOM.fragment('<!DOCTYPE html><html><body></body></html>').ownerDocument;
    globalThis.window = document.defaultView;
  }
});

describe('renderIntro', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main></main>'; // Ensure that the <main> tag is present
  });

  it('renders the first slide by default', () => {
    renderIntro(); // Run the renderIntro function

    const slideImage = document.getElementById('slideImage');
    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');

    expect(slideImage).toBeTruthy(); // Ensure the image is rendered
    expect(slideImage.src).toMatch(/Onboarding_2.png/); // Check if the first slide image is loaded
    expect(slideTitle.textContent).toMatch(/Stay Connected, Everywhere, Anytime/); // Verify the title text
    expect(slideText.textContent).toMatch(/Welcome to Newsify, your ultimate destination for breaking news, exclusive stories, and tailored content./); // Verify the text content
  });

  it('shows next slide when continue is clicked', async () => {
    renderIntro();
    const continueBtn = document.getElementById('continueBtn');
    const slideImage = document.querySelector('.intro-slider img');
    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');

    // Click the continue button
    continueBtn.click();

    // Wait for the DOM to update
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if the second slide is displayed
    expect(slideImage.src).toMatch(/Onboarding_3.png/);
    expect(slideTitle.textContent).toMatch(/Become a Savvy Global Citizen/);
    expect(slideText.textContent).toMatch(/Discover tailored news that aligns with your interests and preferences. Your personalized news journey awaits!/);
  });

  it('completes onboarding when continue is clicked on the last slide', async () => {
    renderIntro();
    const continueBtn = document.getElementById('continueBtn');
    const slideImage = document.querySelector('.intro-slider img');
    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');

    // Click the continue button twice to reach the last slide
    continueBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    continueBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if the last slide is displayed
    expect(slideImage.src).toMatch(/Onboarding_4.png/);
    expect(slideTitle.textContent).toMatch(/Enhance your News Journey Now!/);
    expect(slideText.textContent).toMatch(/Be part of our dynamic community and contribute your insights and participate in enriching conversations./);
  });

  it('skips onboarding when skip is clicked', () => {
    renderIntro(); // Run the renderIntro function

    const skipBtn = document.getElementById('skipBtn');
    skipBtn.click(); // Simulate the click on the skip button

    // Check localStorage for completion
    expect(localStorage.getItem('onboardingCompleted')).toBe('true');
  });
});

function showSlide(index) {
    console.log('Switching to slide:', index, slides[index]);
    slideImage.src = slides[index].img;
    slideTitle.textContent = slides[index].title;
    slideText.textContent = slides[index].text;
    renderIndicators();
    continueBtn.textContent = (index === slides.length - 1) ? 'Get Started' : 'Continue';
}
