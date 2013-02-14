(function() {
  var GUID = function () {
        var S4 = function() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
      debug = /[\?&]debug=(true|yes|1)/.exec(document.location.href),
      input;

  
  document.body.addEventListener('contextmenu', function(e) {
    if (e.target.nodeName !== "INPUT" || e.target.type !== "text") {
      chrome.extension.sendMessage({id: null});
      return true;
    }

    if (debug) {
      console.log('GUIDInjector: Detected context menu on %o', e.target);
    }
    if (e.target.id === "" || !e.target.id) {
      e.target.id = GUID();
    }
    chrome.extension.sendMessage({id: e.target.id});
  });

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.setGUID) {
      var element = document.getElementById(request.id);

      if (debug) {
        console.log('GUIDInjector: Apply GUID to input[type=text]#%s:%o',
          request.id, element);
      }

      if (element && element.type && element.type === "text") {
        element.value = GUID();
      }
    }
    else {
      alert('GUID Injector can only inject ids into text input fields, '
          + 'textarea and password input fields won\'t work. Fields with '
          + 'custom input methods developed in JavaScript may also pose '
          + 'problems.' );      
    }
  });
})();
