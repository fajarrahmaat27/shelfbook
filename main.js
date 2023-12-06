const toread = [];
const RENDER_EVENT = 'render-toread'


document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    const belumDibaca = document.getElementById('incompleteBookshelfList');
    if (isStorageExist()) {
        loadDataFromStorage();
      }
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addMovie();
    });    
});


function addMovie(){
    const textMovie = document.getElementById('inputBookTitle').value;
    const textPenulis = document.getElementById('inputBookAuthor').value;
    const textTahun = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generatedId();

    const movieObject = genereteBook(generatedID, textMovie, textPenulis, textTahun, isComplete);
    toread.push(movieObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generatedId(){
    return +new Date();
}

function genereteBook(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function (){
    console.log(toread);

    const uncompletedTOREADList = document.getElementById('incompleteBookshelfList');
    uncompletedTOREADList.innerHTML = '';

    const completedTOREADList = document.getElementById('completeBookshelfList');
    completedTOREADList.innerHTML = '';

    for (const toreadItem of toread) {
        const toreadElement = makeNoReadYet(toreadItem);
        if(!toreadItem.isComplete){
            uncompletedTOREADList.append(toreadElement);
        } else{
            completedTOREADList.append(toreadElement);
        }
    }
});


function makeNoReadYet(movieObject){
    
    const Judul = document.createElement('h3');
    Judul.innerText = 'Book Tittle';

    const textTitle = document.createElement('p');
    textTitle.innerText = movieObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = movieObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = movieObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner')
    textContainer.append(Judul, textTitle, textAuthor, textYear);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = movieObject.isComplete;

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            SudahSelesaiDibaca(movieObject.id);
        } else {
            BelumSelesaiDibaca(movieObject.id);
        }
    });

    const container = document.createElement('div');
    container.classList.add('book_shelf', 'book_item');
    container.append(textContainer);
    container.setAttribute('id', `toread-${movieObject.id}`);


    if(movieObject.isComplete) {
        const belumSelesaiDibaca = document.createElement('button');
        belumSelesaiDibaca.classList.add('green');
        belumSelesaiDibaca.innerText = 'Belum Selesai Dibaca';

        belumSelesaiDibaca.addEventListener('click', function(){
            BelumSelesaiDibaca(movieObject.id);
        });

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.innerText = 'Hapus Buku';

        hapusBuku.addEventListener('click', function() {
            hapusbukudariselesai(movieObject.id);
            alert('Kamu telah menghapus buku');
        });
        
    
        container.append(belumSelesaiDibaca, hapusBuku);
    } else {
        const selesaiDibaca = document.createElement('button');
        selesaiDibaca.innerText = 'Selesai dibaca';
        selesaiDibaca.classList.add('green');

        selesaiDibaca.addEventListener('click', function(){
            SudahSelesaiDibaca(movieObject.id);
        });
        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.innerText = 'Hapus Buku';

        hapusBuku.addEventListener('click', function() {
            hapusbukudariselesai(movieObject.id);
            alert('Kamu telah menghapus buku');

        });

        container.append(selesaiDibaca, hapusBuku);
    }

    return container;

}

function SudahSelesaiDibaca(toreadId){
    const toreadTarget = findToread(toreadId);

    if(toreadTarget == null) return;

    toreadTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findToread(toreadId) {
    for(const toreadItem of toread){
        if(toreadItem.id === toreadId){
            return toreadItem;
        }
    }
    return null
}

function hapusbukudariselesai(toreadId) {
    const toreadTarget = findToreadIndex(toreadId);

    if (toreadTarget === -1) return;

    toread.splice(toreadTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function BelumSelesaiDibaca(toreadId) {
    const toreadTarget = findToread(toreadId);

    if (toreadTarget == null) return;

    toreadTarget.isComplete = false;
    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
}

function findToreadIndex (toreadId) {
    for (const index in toread) {
        if(toread[index].id === toreadId){
            return index;
        }
    }
    return -1;
}

const SAVED_EVENT = 'saved-toread';
const STORAGE_KEY = 'TOREAD_APPS';


function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(toread);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const toRead of data) {
        toread.push(toRead);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }