(function(){
  var dropzone = document.documentElement || document.body;
  var dropfiles = document.getElementById('dropfiles');

  var uploadprogress = document.getElementById('uploadprogress');
  var listprogress = document.getElementById('listProgress');

  var upload = function(path, file, id) {

    var formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    formData.append("local", document.getElementById('pathtitle').innerHTML);

    ajax.post('upload.php', formData, function(data){
      // console.log(data);
      if(data.error == 0){
          document.querySelector('#up'+id).classList.add('success');
          loadList();
      }else{
          document.querySelector('#up'+id).classList.add('error');
      }
      setTimeout(function(){
        var x = document.querySelector('#up'+id);
        x.remove(x.selectedIndex);
        if(listprogress.innerHTML == '') {
          uploadprogress.classList.remove('show');
        }
      }, 2000);
      loadList();
    }, function(percent){
        document.querySelector('#up'+id+' .progress').style.width = percent+'%';
    });
  }

  var ids = 1;

  var traverseFileTree = function(item, path) {

    uploadprogress.classList.add('show');

    path = path || "";

    if (item.isFile) {
      // Get file
      item.file(function(file) {

        listprogress.innerHTML = listprogress.innerHTML
        +'<div class="uploading" id="up'+ids+'">'
        +   '<div class="default">'+path+file.name+'</div>'
        +   '<div class="progress" style="width:0%;">'+path+file.name+'</div>'
        + '</div>'

        upload(path, file, ids);

        ids++;

      });
    } else if (item.isDirectory) {
      // Get folder contents
      var dirReader = item.createReader();
      dirReader.readEntries(function(entries) {
        for (var i=0; i<entries.length; i++) {
          traverseFileTree(entries[i], path + item.name + "/");
        }
      });
    }

  }

  dropzone.ondrop = function(evt) {
    //se não tiver ele abre o arquivo no navegador
    evt.preventDefault();
    dropfiles.classList.remove('active');
    // console.log(e.dataTransfer.files);
    var items = evt.dataTransfer.items;

    for (var i=0; i<items.length; i++) {
      var item = items[i].webkitGetAsEntry();
      if (item) {
        traverseFileTree(item);
      }else{
        console.log('Error item: ' + item);
      }
    }
  }

  //hover de classe para arquivo
  dropzone.ondragover = function() {
    dropfiles.classList.add('active');
    return false;
  }

  dropzone.ondragleave = function() {
    dropfiles.classList.remove('active');
    return false;
  }


  loadList = function() {
    var formData = new FormData();
    formData.append("local", document.getElementById('pathtitle').innerHTML);
    ajax.post('list.php', formData, function(data){
      html = '';
      for (var i = 0; i < data.length; i++) {
        type = data[i].type;
        path = data[i].path;
        name = data[i].name;

        if(type == 'dir') {
          html = html
          +'<a href="#'+path+'" class="path">'
          +  '<i class="fa fa-folder-o" aria-hidden="true"></i>'
          +  name
          +'</a>';
        }else{
          html = html
          +'<a href="'+path+'" class="file" target="_blank">'
          +  '<i class="fa fa-file-o" aria-hidden="true"></i>'
          +  name
          +'</a>';
        }
      }
      document.getElementById('list').innerHTML = html;
    }, function(progress){});
  }


  diretorio = function(path) {
    document.getElementById('list').innerHTML = '';

    if(path == '')
      document.getElementById('pathtitle').innerHTML = "/";
    else
      document.getElementById('pathtitle').innerHTML = path.slice(1);

    loadList();
  }
  diretorio(location.hash);

  window.addEventListener("hashchange", function(){
    diretorio(location.hash);
  });

})();
