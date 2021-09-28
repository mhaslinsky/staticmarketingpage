"use strict";
//nav
const nav = document.querySelector(`.nav`);
const header = document.querySelector(`.header`);
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
//sections
const section1 = document.querySelector(`#section--1`);
const section2 = document.querySelector(`#section--2`);
const section3 = document.querySelector(`#section--3`);
const sectionSignUp = document.querySelector(`.section--sign-up`);
//buttons
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
//tabs
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

//force to top of page on reload
window.addEventListener(`beforeunload`, function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);
});

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//PAGE NAV
btnScrollTo.addEventListener(`click`, function () {
  section1.scrollIntoView({ behavior: `smooth` });
});

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

//EVENT LISTENERS
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255))})`;

//Tab section

tabsContainer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const clicked = e.target.closest(`.operations__tab`);
  if (!clicked) return;
  //forEach works on node lists, not HTMLCollections
  tabs.forEach((t) => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach((tc) =>
    tc.classList.remove(`operations__content--active`)
  );

  clicked.classList.add(`operations__tab--active`);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//nav bar fade anim
function handleHover(e) {
  if (e.target.classList.contains(`nav__link`)) {
    const clicked = e.target;
    const siblings = clicked.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = clicked.closest(`.nav`).querySelector(`img`);
    siblings.forEach((el) => {
      el != clicked && this == `mouseover`
        ? (el.style.opacity = 0.5)
        : (el.style.opacity = 1);
    });
    this == `mouseover` ? (logo.style.opacity = 0.5) : (logo.style.opacity = 1);
  }
}
//bind sets THIS value to passed arg,
//addeventlistener then handles pass event to handlehover
nav.addEventListener(`mouseover`, handleHover.bind(`mouseover`));
nav.addEventListener(`mouseout`, handleHover.bind(`mouseout`));

//sticky nav bar
const navHeight = nav.getBoundingClientRect().height;

function obsCallback(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
}
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

//section load anim
const allSections = document.querySelectorAll(`.section`);
function revealSection(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove(`section--hidden`);
    observer.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add(`section--hidden`);
});

//lazy load images
const imgTargets = document.querySelectorAll(`img[data-src]`);

function loadImg(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener(`load`, function (e) {
      entry.target.classList.remove(`lazy-img`);
      observer.unobserve(entry.target);
    });
  }
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `300px`,
});
imgTargets.forEach((img) => imgObserver.observe(img));

//slider
function slider() {
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const slides = document.querySelectorAll(`.slide`);
  const dotContainer = document.querySelector(`.dots`);
  let currentSlide = 0;
  const maxSlide = slides.length;

  //functions
  function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activeDot(slide) {
    const dots = document.querySelectorAll(`.dots__dot`);
    dots.forEach((dot) => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  }

  function gotoSlide(currentSlide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    activeDot(currentSlide);
  }

  function nextSlide() {
    if (currentSlide == maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    gotoSlide(currentSlide);
  }

  function prevSlide() {
    if (currentSlide == 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
  }

  //init slider position
  createDots();
  gotoSlide(0);

  //slider event listeners
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);
  document.addEventListener(`keydown`, function (e) {
    if (e.key == `ArrowLeft`) prevSlide();
    if (e.key == `ArrowRight`) nextSlide();
  });
  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const slide = e.target.dataset.slide;
      gotoSlide(slide);
    }
  });
}
slider();
