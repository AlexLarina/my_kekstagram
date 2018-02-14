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
    pictureClickHandler(evt, galleryOverlay);
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

var pictureClickHandler = function (evt, overlay) {
  var currentPicture = evt.currentTarget;
  overlayOpenHandler(overlay);
  renderOverlay(currentPicture);
};

var overlayOpenHandler = function (overlay) {
  overlay.classList.remove('hidden');
};

var overlayCloseHandler = function (overlay) {
  overlay.classList.add('hidden');
};

var overlayClosePressHandler = function (evt, overlay) {
  if (evt.keyCode === ESC_KEYCODE) {
    overlayCloseHandler(overlay);
  }
};

var overlayFocusCloseHandler = function (evt, overlay) {
  if (evt.keyCode === ENTER_KEYCODE) {
    overlayCloseHandler(overlay);
  }
};

var picsArray = createPictureArray(PICTURE_NUMBER);

picturesContainer.appendChild(createFragment(picsArray));

overlayClose.addEventListener('click', function () {
  overlayCloseHandler(galleryOverlay);
});
overlayClose.addEventListener('keydown', function (evt) {
  overlayFocusCloseHandler(evt, galleryOverlay);
});
document.addEventListener('keydown', function (evt) {
  overlayClosePressHandler(evt, galleryOverlay);
});

var uploadForm = document.querySelector('#upload-select-image');
var uploadImage = uploadForm.querySelector('#upload-file');
var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
var uploadOverlay = uploadForm.querySelector('.upload-overlay');
var uploadFormClose = uploadForm.querySelector('.upload-form-cancel');
var uploadFormHashtags = uploadForm.querySelector('.upload-form-hashtags');

uploadImage.addEventListener('change', function () {
  overlayOpenHandler(uploadOverlay);
});

uploadFormClose.addEventListener('click', function () {
  overlayCloseHandler(uploadOverlay);
});

uploadFormClose.addEventListener('keydown', function (evt) {
  overlayFocusCloseHandler(evt, uploadOverlay);
});

document.addEventListener('keydown', function (evt) {
  overlayClosePressHandler(evt, uploadOverlay);
});

var buttonResizeDec = uploadForm.querySelector('.upload-resize-controls-button-dec');
var buttonResizeInс = uploadForm.querySelector('.upload-resize-controls-button-inc');
var buttonResizeValue = uploadForm.querySelector('.upload-resize-controls-value');

var rescaleHandler = function (direction) {
  var step = 25;
  var min = 0;
  var max = 100;
  var buttonValue = parseInt(buttonResizeValue.value, 10);

  if (direction === 'decrease') {
    buttonResizeValue.value = (buttonValue - step) > min ? buttonValue - step + '%' : buttonValue = 0 + '%';
  }
  if (direction === 'increase') {
    buttonResizeValue.value = (buttonValue + step) < max ? buttonValue + step + '%' : buttonValue = 100 + '%';
  }

  uploadImagePreview.style.transform = 'scale(' + parseInt(buttonResizeValue.value, 10) / 100 + ')';
};

buttonResizeDec.addEventListener('click', function () {
  rescaleHandler('decrease');
});

buttonResizeInс.addEventListener('click', function () {
  rescaleHandler('increase');
});

var uploadEffects = uploadForm.querySelector('.upload-effect-controls');

uploadEffects.addEventListener('click', function (evt) {
  if (evt.target.type === 'radio') {
    removeEffects(uploadImagePreview);
    var effectClass = 'effect-' + evt.target.value;
    uploadImagePreview.classList.add(effectClass);
  }
});

var removeEffects = function (element) {
  element.classList.forEach(function (item) {
    if (item !== 'effect-image-preview') {
      uploadImagePreview.classList.remove(item);
    }
  });
};

var setInvalid = function (target, message) {
  target.style.borderColor = 'red';
  target.setCustomValidity(message);
};

var setValid = function (target) {
  target.style.borderColor = '';
  target.setCustomValidity('');
};

uploadFormHashtags.addEventListener('change', function (evt) {
  var tags = evt.target.value.toLowerCase().split(' ');

  if (tags.length > 5) {
    setInvalid(uploadFormHashtags, 'Число тегов не должно превышать 2');
    return;
  } else {
    setValid(uploadFormHashtags);
  }

  tags.forEach(function (item) {
    if (item[0] !== '#') {
      setInvalid(uploadFormHashtags, 'Теги должны начинаться с #');
      return;
    } else {
      setValid(uploadFormHashtags);
    }

    if (item.length > 20) {
      setInvalid(uploadFormHashtags, 'Длина не больше 20 символов');
      return;
    } else {
      setValid(uploadFormHashtags);
    }
  });

  for (var i = 0; i < tags.length - 1; i++) {
    for (var j = i + 1; j < tags.length; j++) {
      if (tags[i] === tags[j]) {
        setInvalid(uploadFormHashtags, 'Теги не должны повторяться');
        return;
      } else {
        setValid(uploadFormHashtags);
      }
    }
  }

});
