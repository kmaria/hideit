(function hideIt() {
  var unwantedWords = [];
  var wantedWords = [];

  function hideOtherContent() {
    var sponsoredBlockList = document.getElementsByClassName('szponzoralt-blokk_container');
    var embeddedBlockList = document.getElementsByClassName('medium-rectangle-anyag ad-label-top');

    for (var i = 0; i < sponsoredBlockList.length; i++) {
      sponsoredBlockList[i].style.display = 'none';
    }

    for (var i = 0; i < embeddedBlockList.length; i++) {
      embeddedBlockList[i].style.display = 'none';
    }
  }

  function hideArticles() {
    if (unwantedWords.length === 0) {
      return;
    }

    var matcher = unwantedWords.join('|');

    $('article').each(function(index, article) {
      var text=$(article).text().trim().toLowerCase();

      if (text.match(matcher)) {
        //$(article).css('background-color', 'red');
        $(article).hide(3000);
      }
    });
  }

  function saveWordList() {
    chrome.storage.sync.set({'words': {'unwanted': unwantedWords, 'wanted': wantedWords}}, function() {
      //printWords();
    });
  }

  function printWords() {
    console.log('Wordlist:' + wantedWords.join(',') + "-" + unwantedWords.join(","));
  }

  function loadWordList() {
    chrome.storage.sync.get(['words'], function(result) {
      var words = (result && result.words) || {};
      unwantedWords = words.unwanted || [];
      wantedWords = words.wanted || [];

      //printWords();
      hideArticles();
    });
  }

  function getSelectionText() {
      var text = "";

      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }

      if (text !== "") {
        openTextSaver(text.toLowerCase());
      }
  }

  function unwantedButtonHandler(text) {
    unwantedWords.push(text);
    saveWordList();
    hideArticles();
  }

  function wantedButtonHandler(text) {
    wantedWords.push(text);
    saveWordList();
    hideArticles();
  }

  function textSaverDialog(text) {
    console.log("textSaverDialog:", text);

    $( "#hideit-text-saver" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Unwanted": function() {
          unwantedButtonHandler(text);
          $( this ).dialog( "close" );
        },
        "Wanted": function() {
          wantedButtonHandler(text);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  }

  function openTextSaver(text) {
    $('#hideit-text-saver input').val(text);
    var save = textSaverDialog.bind(null, text);

    setTimeout(save, 0);
  }

  function setMouseUpEventToOpenSelection() {
    $('article').mouseup(getSelectionText);
  }

  function injectPopupIntoDOM() {
    var s = 
    '<div id="hideit-text-saver" title="Save text">'+
      '<p>' +
        '<span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>' +
        '<input class="hideit-text" type="text" value="">' +
      '</p>' +
    '</div>';

    $('body').append(s);
  }

  function init() {
    setMouseUpEventToOpenSelection();

    injectPopupIntoDOM();

    loadWordList();
  }

  init();
})();