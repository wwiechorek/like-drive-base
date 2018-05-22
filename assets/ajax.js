ajax = {};
ajax.xhr = new Array();
ajax.newAjax = function(){
  var xhr = typeof XMLHttpRequest != 'undefined'
  ? new XMLHttpRequest()
  : new ActiveXObject('Microsoft.XMLHTTP');
  return xhr;
}

ajax.post = function(url, data, callbackDone, callbackProgress){
  ajax.xhr.push(ajax.newAjax());
  var indice = ajax.xhr.length-1;

  ajax.xhr[indice].onreadystatechange = function() {
    if(ajax.xhr[indice].readyState == 4 && ajax.xhr[indice].status == 200){
      data = ajax.xhr[indice].responseText;
      type = ajax.xhr[indice].getResponseHeader("Content-Type");
      if(type.indexOf("json") != -1){
        try {
            data = JSON.parse(data);
        } catch(ex) {
            data = data;
        }
      }

      callbackDone(data);
    }
  }

  ajax.xhr[indice].upload.addEventListener("progress", function(event){
    if (event.lengthComputable) {
      var percent = Math.round(event.loaded * 100 / event.total);
      callbackProgress(percent);
    }
  }, false);


  ajax.xhr[indice].open("POST", url);
  //Se setar setRequestHeader não funciona formData se for JSON talvez necessite
  //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  ajax.xhr[indice].send(data);
}
