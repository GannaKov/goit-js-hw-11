import { Notify } from 'notiflix';
import { Report } from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import './css/styles.css';
const BASEURL = 'https://pixabay.com/api/';
const keyApiPix = '30040272-179178153c29e3da83ceec1ea';

const optionsObserv = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, optionsObserv);
let page = 1;
let perPage = 30;
let inputValue = '';
// inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
const lightbox = new SimpleLightbox('.gallery__link');
// function onInput(evt) {
//https://pixabay.com/api/?key=30040272-179178153c29e3da83ceec1ea&q=cat&image_type=photo&orientation=horizont&safesearch=true
const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  guardEl: document.querySelector('.guard'),
};
refs.formEl.addEventListener('submit', onFormSubmit);
const optionsNotify = {
  position: 'center-center',
  showOnlyTheLastOne: true,
  timeout: 4000,
};
function onFormSubmit(evt) {
  evt.preventDefault();

  inputValue = evt.target.elements.searchQuery.value.toLowerCase().trim();
  if (inputValue === '') {
    Notify.failure('Please fill in the search field!', optionsNotify);
    return;
  }
  fetchPhotos(inputValue)
    .then(response => {
      // console.log(typeof response.data.total);
      if (response.data.total == 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.',
          optionsNotify
        );

        return;
      }

      const imgMarkUp = createSmallImgMarkup(response.data.hits);
      refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkUp);
      // const lightbox = new SimpleLightbox('.gallery__link');
      // lightBox();
      observer.observe(refs.guardEl);
    })
    .catch(error => console.log(error));
}
async function fetchPhotos(keyWord) {
  const response = await axios.get(
    `${BASEURL}?key=${keyApiPix}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );

  return response;
}
function createSmallImgMarkup(arrPhotos) {
  return arrPhotos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__link link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags} loading="lazy" /><a/>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>`;
      }
    )
    .join('');
}
function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchPhotos(inputValue).then(response => {
        console.log(page, Math.ceil(response.data.totalHits / perPage));
        if (page > Math.ceil(response.data.totalHits / perPage)) {
          Notify.warning(
            'We are sorry, but you have reached the end of search results.',
            optionsNotify
          );

          return;
        }
        const imgMarkUp = createSmallImgMarkup(response.data.hits);
        refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkUp);
        lightbox.refresh();
      });
    }
  });
}
// function lightBox() {
//   const lightbox = new SimpleLightbox('.gallery__link');
// }
// -------------------------
// `<div class="gallery__item">
//       <a class="gallery__link link" href="${largeImageURL}">
//             <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
//          </a>
//          <div class="bottom">
//          <ul class="gallery-bottom__block list">
//          <li class="gallery-bottom__item"><p class="gallery__text">Likes ${likes}</p></li>
//          <li class="gallery-bottom__item"><p class="gallery__text">Views ${views}</p></li>
//          <li class="gallery-bottom__item"><p class="gallery__text">Comments ${comments}</p></li>
//          <li class="gallery-bottom__item"><p class="gallery__text">Downloads ${downloads}</p></li>
//           </ul>
//           </div>
//     </div>`;
// --------------------
// async function fetchPhotos(keyWord) {
//   try {
//     const response = await axios.get(
//       `${BASEURL}?key=30040272-179178153c29e3da83ceec1ea&q=${keyWord}&image_type=photo&orientation=horizont&safesearch=true`
//     );
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }
