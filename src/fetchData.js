/* eslint-disable no-use-before-define */
import axios from 'axios';

let element = '';
const grid = document.querySelector('.grid');
axios
  .post(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps',
  )
  .then((res) => localStorage.setItem('appId', res.data));
const gridLogic = (data) => {
  const appId = localStorage.getItem('appId');
  const numberlikes = JSON.parse(localStorage.getItem('likes'));
  const postLikes = Array.isArray(numberlikes) ? numberlikes : [];
  let postLikeNumber;
  // eslint-disable-next-line no-return-assign
  postLikes.forEach((like) => (parseInt(like.item_id, 10) === data.id ? (postLikeNumber = like.likes) : ''));

  axios
    .get(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appId}/likes`,
    )
    .then((res) => localStorage.setItem('likes', JSON.stringify(res.data)));
  element += `<div class="grid-item">
  <div class="imageContainer"><img src=${data.sprites.front_default} /></div>
  <h3>${data.species.name}</h3>
  ${postLikeNumber || ''}<button class="likeButton" id=${data.id}>like</button>
  <div class="buttonContainer"><button>Comments</button><button>Reservation</button></div>
  </div>`;
  grid.innerHTML = element;
  const likeButton = document.querySelectorAll('.likeButton');
  const likingHandle = () => {
    likeButton.forEach((button) => button.addEventListener('click', () => {
      const appId = localStorage.getItem('appId');
      axios
        .post(
          `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appId}/likes`,
          { item_id: button.id },
        )
        .then(() => setTimeout(() => {
          element = '';
          fetchData();
        }, 1000));
      setTimeout(() => {
        element = '';
        fetchData();
      }, 1000);
    }));
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
