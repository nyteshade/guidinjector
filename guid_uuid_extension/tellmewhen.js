(function() {
  let inputTypes = ['text', 'password', 'search'];
  let GUID = function () {
  let S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
  let debug = /[\?&]debug=(true|yes|1)/.exec(document.location.href);
  let input;

  function messageHandler(request, sender, sendResponse) {
    if (request.setGUID) {
      let element = document.querySelector(`[chrome-guid="${request.id}"]`);
      let check = validElement(element);
      
      if (debug) {
        console.log('GUIDInjector: Apply GUID %s to %o',
          request.id, element);
      }

      if (check.valid) {
        check.setter(request.id);
      }
      else {
        console.debug('Sadly %o fails to meet the requirements', check.element);
      }
    }
    else {
      alert(
        'GUID Injector was unable to locate and inject the data in %o', 
        document.querySelector(`[chrome-guid="${request.id}"]`)
      );      
    }    
  }

  function validElement(element) {
    var result = { 
      valid: false,
      element,
      setter: function(value) { /* no-op but always valid */ }
    };

    if (element) {
      if (element.tagName.toLowerCase() == "input") {
        if (element.type && ~inputTypes.indexOf(element.type)) {
          result.valid = true
          result.setter = function(value) { 
            element.value = value;
          };
        }
      }
      else if (element.tagName.toLowerCase() == "textarea") {
        result.valid = true
        result.setter = function(value) {
          element.innerHTML += value
        };
      }
    }

    return result;
  }

  document.body.addEventListener('contextmenu', function(e) {
    let guid = GUID();
    let check = validElement(e.target);

    if (debug) {
      console.debug('GUIDInjector: Detected context menu on %o', e.target);
      console.debug('Validity Check: %o', check);
    }

    if (!check.valid) {
      chrome.runtime.sendMessage({id: null});
      return true;
    }
    else {
      e.target.setAttribute("chrome-guid", guid);
      if (!chrome.runtime.onMessage.hasListener(messageHandler)) {
        chrome.runtime.onMessage.addListener(messageHandler);
      }
      chrome.runtime.sendMessage({ id: guid });      
    }
  });
})()