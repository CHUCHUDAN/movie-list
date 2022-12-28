const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const search = document.querySelector('#search-submit-button')
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
console.log(movies)

function renderMovieList(data) {  
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL}${item.image}"
              class="card-img-top" alt="Movie-poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id='${item.id}'>More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id='${item.id}'>x</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const title = document.querySelector('#movie-modal-title')
  const image = document.querySelector('#movie-modal-image')
  const date = document.querySelector('#movie-modal-date')
  const description = document.querySelector('#movie-modal-description')
  axios.get(`${INDEX_URL}${id}`)
    .then(function (response) {
      // handle success
      const data = response.data.results
      title.innerText = data.title
      date.innerText = 'release at: ' + data.release_date
      description.innerText = data.description
      image.innerHTML = `
        <img class="w-100" src="${POSTER_URL}${data.image}" alt="movie-poster">
      `
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function removeFromFavorite (id) {
  if (!movies || !movies.length) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  console.log(movieIndex)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)