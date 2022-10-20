import { Notify } from 'notiflix';
import { Report } from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import fetchPhotos from './customFunction/fetchPhotos';
import createSmallImgMarkup from './customFunction/funcrionRender';
import cleanRender from './customFunction/functionCleanRender';
import './css/styles.css';

const lightbox = new SimpleLightbox('.gallery__link');

// -------------------
const optionsObserv = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

const observer = new IntersectionObserver(onLoad, optionsObserv);
let page = 1;
let perPage = 30;
let inputValue = '';

const optionsNotify = {
  position: 'center-center',
  showOnlyTheLastOne: true,
  timeout: 4000,
};
const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  guardEl: document.querySelector('.guard'),
};
refs.formEl.addEventListener('submit', onFormSubmit);
// -------------------

function onFormSubmit(evt) {
  evt.preventDefault();
  inputValue = evt.target.elements.searchQuery.value.toLowerCase().trim();
  if (inputValue === '') {
    Report.info('Please', 'Fill in the search field!', 'Okay', {
      backOverlayClickToClose: true,
    });
    return;
  }
  fetchPhotos(inputValue, perPage, page)
    .then(response => {
      console.log(response);
      cleanRender(refs.galleryEl);
      page = 1;
      console.log(response.data.hits.length);
      if (response.data.total === 0) {
        cleanRender(refs.galleryEl);
        Report.warning(
          'Sorry',
          'there are no images matching your search query. Please try again.',
          'Okay',
          {
            backOverlayClickToClose: true,
          }
        );
        return;
      }

      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      const imgMarkUp = createSmallImgMarkup(response.data.hits);
      refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkUp);

      lightbox.refresh();
      observer.observe(refs.guardEl);
    })
    .catch(error => console.log(error));
}

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchPhotos(inputValue, perPage, page).then(response => {
        if (
          response.data.totalHits > 0 &&
          page > Math.ceil(response.data.totalHits / perPage)
        ) {
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
      // .catch(error => console.log(error));
    }
  });
}
