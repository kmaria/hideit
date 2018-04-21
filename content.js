var list = document.getElementsByClassName('cimlap-anyag');
var sponsoredBlockList = document.getElementsByClassName('szponzoralt-blokk_container');
var embeddedBlockList = document.getElementsByClassName('medium-rectangle-anyag ad-label-top');
var proposedList = document.getElementsByClassName('cikk_also_ajanlo visible');

var listOfWords = ['futball', 'barca', 'átlövő', 'chelsea', 'liverpool', 'real', 'levetkőzött', 'hajdú', 'sarka', 'közösülj', 'berki krisztián', '18+'];
let arrayLength = listOfWords.length;

for (var i = 0; i < list.length; i++) {
  for (var j = 0; j < arrayLength; j++) {
    if (list[i].textContent.toLowerCase().match(listOfWords[j]) ) {
      list[i].style.display = 'none';
    }
  }
}

for (var i = 0; i < sponsoredBlockList.length; i++) {
  sponsoredBlockList[i].style.display = 'none';
}

for (var i = 0; i < embeddedBlockList.length; i++) {
  embeddedBlockList[i].style.display = 'none';
}

for (var i = 0; i < proposedList.length; i++) {
  for (var j = 0; j < arrayLength; j++) {
    if (proposedList[i].textContent.toLowerCase().match(listOfWords[j]) ) {
      proposedList[i].style.display = 'none';
    }
  }
}
