let debounce = require('lodash.debounce');
import './css/styles.css';
import fetchCountries from "./fetchCountries";
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    infoCountry: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY));

function inputCountry(e) {
    const search = e.target.value.trim();
    if (search === ""){
        return refs.input.innerHTML = "",  refs.infoCountry.innerHTML = "";
    }
    fetchCountries(search)
    .then(country => {
        if (country.length > 10) {
            fetchMoreLetter(country)
        }
        if (country.length >= 2 && country.length <= 10) {
            fetchListCountry(country)
        }
        if (country.length === 1) {
            fetchCardCountry(country)
        }
    })
    .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function fetchMoreLetter(country) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    refs.listCountry.innerHTML = '';
    refs.infoCountry.innerHTML = '';
    return;
}
function fetchListCountry(country) {
    const markup = country.map(country => {
        return `<li class="item-card"><img src="${country.flags.svg}" alt="${country.name}" width="30" height="30"/>
            ${country.name.official}</li>`;
        }).join("");
    refs.infoCountry.innerHTML = '';
    refs.listCountry.classList.add('js-active');
    return refs.listCountry.innerHTML = markup;

}
function fetchCardCountry(country) {
    const markup = country.map(country => {
        return `<p class="item__text"><img src="${country.flags.svg}" alt="${country.name}" width="30" height="30"/><span class ="item__text-bold name">${country.name.official}</span></p>
            <p class="item__text"><span class ="item__text-bold">Capital: </span>${country.capital}</p>
            <p class="item__text"><span class ="item__text-bold">Population: </span>${country.population}</p>
            <p class="item__text"><span class ="item__text-bold">Languages: </span>${Object.values(country.languages)}</p>`;
    }).join("");
    refs.listCountry.innerHTML = '';
    refs.infoCountry.classList.add('js-active');
    return refs.infoCountry.innerHTML = markup;
}