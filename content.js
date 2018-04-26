(function hideIt() {
  var unwantedWords = [];
  var wantedWords = [];

  init();

  function init() {
    setMouseUpEventToOpenSelection();

    injectPopupIntoDOM();

    loadWordList();

    hideOtherContent();
  }

  function setMouseUpEventToOpenSelection() {
    $('article').mouseup(getSelectionText);
  }

  function injectPopupIntoDOM() {
    var s = 
    '<div id="hideit-text-saver" title="Save text">'+
      '<p>' +
        '<div>You can edit or add words separated by commas.</div>' +
        '<span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>' +
        '<input class="hideit-text" type="text" value="">' +
      '</p>' +
    '</div>';

    $('body').append(s);
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

  function getSelectionText() {
      var text = "";

      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }

      if (text !== "") {
        setDialogInputText(text);
        openTextSaver();
      }
  }

  function setDialogInputText(text) {
    $('#hideit-text-saver input').val(text.toLowerCase());
  }

  function openTextSaver() {
    $( "#hideit-text-saver" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Unwanted": function() {
          handleDialogButton(false);
          $( this ).dialog( "close" );
        },
        "Wanted": function() {
          handleDialogButton(true);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  }

  function handleDialogButton(wanted) {
    var words = getDialogInputText();
    if (words.length === 0) {
      return;
    }

    if (wanted) {
      wantedWords = wantedWords.concat(words);
    } else {
      unwantedWords = unwantedWords.concat(words);
    }

    saveWordList();
    hideArticles();
  }

  function getDialogInputText() {
    var text = $('#hideit-text-saver input').val();
    text = text.toLowerCase();
    var textArr = text.split(",");

    return textArr;
  }

  function saveWordList() {
    chrome.storage.sync.set({'words': {'unwanted': unwantedWords, 'wanted': wantedWords}}, function() {
      //printWords();
    });
  }

  function printWords() {
    console.log('Wordlist:' + wantedWords.join(',') + "-" + unwantedWords.join(","));
  }

})();