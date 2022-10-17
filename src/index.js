import { Notify } from 'notiflix';
import { Report } from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
const baseUrl = 'https://pixabay.com/api/';
const keyApiPix = '30040272-179178153c29e3da83ceec1ea';
// inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// function onInput(evt) {
//https://pixabay.com/api/?key=30040272-179178153c29e3da83ceec1ea&q=cat&image_type=photo&orientation=horizont&safesearch=true
const form = document.querySelector('.search-form');
form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  let inputValue = evt.target.elements.searchQuery.value.toLowerCase().trim();

  console.log(inputValue);
  fetchPhotos(inputValue);
}

function fetchPhotos(keyWord) {}
