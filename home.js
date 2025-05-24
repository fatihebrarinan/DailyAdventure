// Ev sahnesine özel veriler ve elementler burada tanımlanacak. 

const allHomeTasks = [
    { id: 'task-bed', name: 'Yatağı topla', objectId: 'bed-object', completed: false },
    { id: 'task-dishes', name: 'Bulaşıkları yıka', objectId: 'dishes-object', completed: false },
    { id: 'task-vacuum', name: 'Süpürge yap', objectId: 'vacuum-object', completed: false },
    { id: 'task-trash', name: 'Çöpü at', objectId: 'trash-bin-object', completed: false },
    { id: 'task-laundry', name: 'Çamaşırları yıka', objectId: 'laundry-machine-object', completed: false },
    { id: 'task-desk', name: 'Masayı düzenle', objectId: 'desk-object', completed: false },
    { id: 'task-plant', name: 'Bitkileri sula', objectId: 'plant-object', completed: false },
    { id: 'task-read-home', name: 'Kitap oku (ev)', objectId: 'bookshelf-object', completed: false }
];

// Ev Sahnesi DOM Elementleri (script.js yüklendiğinde erişilebilir olacak)
const homeSceneElement = document.getElementById('home-scene');
const homeGameCanvasElement = homeSceneElement ? homeSceneElement.querySelector('.game-canvas') : null;
const homePlayerElement = homeSceneElement ? homeSceneElement.querySelector('.player-character') : null; // ID'si player olanı da seçebiliriz
const homeTimerDisplayElement = homeSceneElement ? homeSceneElement.querySelector('#home-timer-display') : null;
const homeTaskPanelListElement = homeSceneElement ? homeSceneElement.querySelector('#home-task-list') : null;
const exitHomeButtonElement = homeSceneElement ? homeSceneElement.querySelector('#exit-home-btn') : null; 