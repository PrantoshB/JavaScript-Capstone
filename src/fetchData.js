import axios from 'axios';

let element = '';
const grid = document.querySelector('.grid');
axios
  .post(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps'
  )
  .then((res) => localStorage.setItem('appId', res.data));
const gridLogic = (data, i) => {
  const appId = localStorage.getItem('appId');
  const numberlikes = JSON.parse(localStorage.getItem('likes'));
  let postLikes = Array.isArray(numberlikes) ? numberlikes : [];
  let postLikeNumber;
  postLikes.forEach((like) =>
    like.item_id == data.id ? (postLikeNumber = like.likes) : ''
  );

  console.log(postLikes);
  axios
    .get(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appId}/likes`
    )
    .then((res) => localStorage.setItem('likes', JSON.stringify(res.data)));
  element += `<div class="grid-item">
  <div class="imageContainer"><img src=${data.sprites.front_default} /></div>
  <h3>${data.species.name}</h3>
  ${postLikeNumber ? postLikeNumber : ''}<button class="likeButton" id=${
    data.id
  }>like</button>
  <div class="buttonContainer"><button>Comments</button><button>Reservation</button></div>
  </div>`;
  grid.innerHTML = element;
  const likeButton = document.querySelectorAll('.likeButton');
  const likingHandle = () => {
    likeButton.forEach((button) =>
      button.addEventListener('click', () => {
        const appId = localStorage.getItem('appId');
        axios
          .post(
            `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appId}/likes`,
            { item_id: button.id }
          )
          .then((res) =>
            setTimeout(() => {
              element = '';
              fetchData();
            }, 1000)
          );
        setTimeout(() => {
          element = '';
          fetchData();
        }, 1000);
      })
    );
  };
  likingHandle();
};

export const fetchData = () => {
  axios
    .get(' https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')
    .then((res) => {
      const data = res.data.results;

      data.forEach((el, i) => {
        axios.get(el.url).then((res) => gridLogic(res.data, i));
      });
    });
};
