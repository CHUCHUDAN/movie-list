const BASE_URL = "https://webdev.alphacamp.io"; //主機網址
const INDEX_URL = BASE_URL + "/api/movies/";  //api網址
const POSTER_URL = BASE_URL + "/posters/";  //圖片網址
const dataPanel = document.querySelector("#data-panel"); //顯示電影區塊
const search = document.querySelector("#search-submit-button"); //search按扭區塊
const searchInput = document.querySelector("#search-input"); //input輸入框區塊
const searchForm = document.querySelector("#search-form"); //form區塊
const paginator = document.querySelector("#paginator"); //分頁區塊
const MOVIE_PER_PAGE = 12
let filteredMovies = []
const movies = []

//render電影畫面

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
              <button class="btn btn-info btn-add-favorite" data-id='${item.id}'>+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

//展開詳細資訊

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

// 搜尋功能-1
// function compare(text) {
//   let rawHTML = ''
//   movies.forEach((item) => {
//     const titleUpper = item.title.toUpperCase()
//     if (titleUpper.match(text) !== null) {
//       rawHTML += `
//         <div class="col-sm-3">
//         <div class="mb-2">
//           <div class="card">
//             <img
//               src="${POSTER_URL}${item.image}"
//               class="card-img-top" alt="Movie-poster">
//             <div class="card-body">
//               <h5 class="card-title">${item.title}</h5>
//             </div>
//             <div class="card-footer">
//               <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
//                 data-bs-target="#movie-modal" data-id='${item.id}'>More</button>
//               <button class="btn btn-info btn-add-favorite">+</button>
//             </div>
//           </div>
//         </div>
//       </div>
//       `
//     }
//   })
//   if (rawHTML === '') {
//     rawHTML = `
//       <h2 class='text-center my-5'>很抱歉，查無此項目</h2>
//     `
//   }
//   dataPanel.innerHTML = rawHTML
// }


// search.addEventListener('click', function () {
//   const inputValueUpper = document.querySelector('#search-input').value.toUpperCase()
//   compare(inputValueUpper)
// })
// searchInput.addEventListener('keyup', function (event) {
//   const inputValueUpper = document.querySelector('#search-input').value.toUpperCase()
//   if (event.key === 'Enter') {
//     compare(inputValueUpper)
//   } else if (inputValueUpper === '') {
//     renderMovieList(movies)
//   }
// })



//新增至我的最愛
function addToFavorite (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中')
  }
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  
}

//分割陣列為分頁資料
function getMoviesByPage (page) {
  const data = filteredMovies.length ? filteredMovies:movies
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

//render分頁器
function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount/MOVIE_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page='${page}' href="#">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//以下為監聽器

//分頁點擊事件
paginator.addEventListener('click', function onPaginatorClicked (event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

//search按鈕點擊事件
searchForm.addEventListener('submit', function onSearchFormSubmitted (event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    alert('Cannot find the keyword: ' + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})


//more按鍵及+按鍵點擊事件
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//取得api
axios.get(`${INDEX_URL}`)
  .then(function (response) {
    // handle success
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

