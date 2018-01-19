'use strict';
var PICTURE_NUMBER = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
var picturesContainer = document.querySelector('.pictures');
var galleryOverlay = document.querySelector('.gallery-overlay');

var getRandFromRange = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createPicture = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    likes: getRandFromRange(MIN_LIKES, MAX_LIKES),
    comments: COMMENTS[getRandFromRange(0, COMMENTS.length)]
  };
};

var createPictureArray = function (picNumber) {
  var picArray = [];
  for (var i = 0; i < picNumber; i++) {
    picArray[i] = createPicture(i);
  }

  return picArray;
};

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('img').src = picture.url;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

var renderOverlay = function (overlay, picture) {
  overlay.querySelector('.gallery-overlay-image').src = picture.url;
  overlay.querySelector('.likes-count').textContent = picture.likes;
  overlay.querySelector('.comments-count').textContent = picture.comments.length;
};

var createFragment = function (pics) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PICTURE_NUMBER; i++) {
    fragment.appendChild(renderPicture(pics[i]));
  }

  return fragment;
};

var picsArray = createPictureArray(PICTURE_NUMBER);
// console.log(picsArray);

picturesContainer.appendChild(createFragment(picsArray));

// galleryOverlay.classList.remove('hidden');
renderOverlay(galleryOverlay, picsArray[0]);

/*
i did my own repo :3
*/
