import SimpleLightbox from "simplelightbox";
import axios from "axios";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";

let attributes = new URLSearchParams({
    key: "14913081-9710da4d7f7aed2b3641f6036",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: 40
}).toString();
let page = 1;
let lightbox;
let form = document.querySelector(".search-form");
let input = document.querySelector("[name=searchQuery]");
let gallery = document.querySelector(".gallery");
let loadMore = document.querySelector(".load-more");

let createGallery = (imageArray) => {
    Notiflix.Notify.success(`Hooray! We found ${imageArray.totalHits} images.`)
    for (let i = 0; i < imageArray.hits.length; i++) {
        gallery.innerHTML += `<a class="gallery__item" href="${imageArray.hits[i].largeImageURL}">
            <img class="gallery__image" loading="lazy" src="${imageArray.hits[i].previewURL}" alt="${imageArray.hits[i].tags}" />
            <ul>
                <li>
                    <b>Likes</b>
                    <p>${imageArray.hits[i].likes}</p>
                </li>
                <li>
                    <b>Views</b>
                    <p>${imageArray.hits[i].views}</p>
                </li>
                <li>
                    <b>Comments</b>
                    <p>${imageArray.hits[i].comments}</p>
                </li>
                <li>
                    <b>Downloads</b>
                    <p>${imageArray.hits[i].downloads}</p>
                </li>
            </ul>
        </a>`;
    }
    lightbox = new SimpleLightbox('.gallery a');
    lightbox.on('show.simplelightbox');
}

let getImages = (e) => {
    gallery.innerHTML = "";
    axios.get(`https://pixabay.com/api/?${attributes}&q=${input.value}&page=${page}`)
    .then(responce => {
        if(responce.data.hits.length === 0){
            loadMore.classList.add("none");
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        else {
            createGallery(responce.data);
        }
    });
    loadMore.classList.remove("none");
    e.preventDefault();
}

form.addEventListener("submit", getImages);

loadMore.addEventListener("click", (e) => {
    page = page + 1;
    axios.get(`https://pixabay.com/api/?${attributes}&q=${input.value}&page=${page}`)
    .then(responce => {
        createGallery(responce.data)
        if(responce.data.hits.length === 0){
            loadMore.classList.add("none");
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    });
    e.preventDefault();
})
