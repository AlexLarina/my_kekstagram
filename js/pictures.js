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

var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
var picturesContainer = document.querySelector('.pictures');
var galleryOverlay = document.querySelector('.gallery-overlay');
var overlayClose = document.querySelector('.gallery-overlay-close');

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

  pictureElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    pictureClickHandler(evt);
  });

  return pictureElement;
};

var renderOverlay = function (picture) {
  galleryOverlay.querySelector('.gallery-overlay-image').src = picture.querySelector('img').src;
  galleryOverlay.querySelector('.likes-count').textContent = picture.querySelector('.picture-likes').textContent;
  galleryOverlay.querySelector('.comments-count').textContent = picture.querySelector('.picture-comments').textContent;


};

var createFragment = function (pics) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PICTURE_NUMBER; i++) {
    fragment.appendChild(renderPicture(pics[i]));
  }

  return fragment;
};

var pictureClickHandler = function (evt) {
  var currentPicture = evt.currentTarget;
  // console.log(currentPicture);
  galleryOverlay.classList.remove('hidden');
  renderOverlay(currentPicture);
};

var overlayCloseHandler = function () {
  galleryOverlay.classList.add('hidden');
};

var overlayClosePressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    // console.log('press works');
    overlayCloseHandler();
  }
};

var overlayFocusCloseHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    console.log('focus works');
    overlayCloseHandler();
  }
};

var picsArray = createPictureArray(PICTURE_NUMBER);
// console.log(picsArray);

picturesContainer.appendChild(createFragment(picsArray));
overlayClose.addEventListener('click', overlayCloseHandler);
overlayClose.addEventListener('keydown', overlayFocusCloseHandler);
document.addEventListener('keydown', overlayClosePressHandler);
