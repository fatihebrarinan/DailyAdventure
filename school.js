// Okul sahnesine özel veriler ve elementler burada tanımlanacak. 

const allSchoolTasks = [
    { id: 'task-lecture', name: 'Dersi dinle', objectId: 'blackboard-object', completed: false },
    { id: 'task-homework', name: 'Ödevi yap', objectId: 'school-desk-object', completed: false },
    { id: 'task-read-library', name: 'Kitap oku (kütüphane)', objectId: 'library-bookshelf-object', completed: false },
    { id: 'task-experiment', name: 'Deney yap', objectId: 'science-lab-object', completed: false },
    { id: 'task-art-project', name: 'Resim yap', objectId: 'art-easel-object', completed: false },
    { id: 'task-presentation-prep', name: 'Sunuma hazırlan', objectId: 'school-desk-object', completed: false },
    { id: 'task-group-study', name: 'Grup çalışması', objectId: 'library-bookshelf-object', completed: false }
];

// Okul Sahnesi DOM Elementleri
const schoolSceneElement = document.getElementById('school-scene');
const schoolGameCanvasElement = schoolSceneElement ? schoolSceneElement.querySelector('.game-canvas') : null;
const schoolPlayerElement = schoolSceneElement ? schoolSceneElement.querySelector('.player-character') : null;
const schoolTimerDisplayElement = schoolSceneElement ? schoolSceneElement.querySelector('#school-timer-display') : null;
const schoolTaskPanelListElement = schoolSceneElement ? schoolSceneElement.querySelector('#school-task-list') : null;
const exitSchoolButtonElement = schoolSceneElement ? schoolSceneElement.querySelector('#exit-school-btn') : null; 