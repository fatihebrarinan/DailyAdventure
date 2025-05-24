// İş sahnesine özel veriler ve elementler burada tanımlanacak. 

const allWorkTasks = [
    { id: 'task-coding', name: 'Kod yaz', objectId: 'computer-desk-object', completed: false },
    { id: 'task-meeting', name: 'Toplantıya katıl', objectId: 'meeting-table-object', completed: false },
    { id: 'task-coffee', name: 'Kahve al', objectId: 'coffee-machine-object', completed: false },
    { id: 'task-planning', name: 'Proje planla', objectId: 'project-board-object', completed: false },
    { id: 'task-water-plant-work', name: 'Ofis bitkisini sula', objectId: 'office-plant-object', completed: false },
    { id: 'task-report-write', name: 'Rapor yaz', objectId: 'computer-desk-object', completed: false },
    { id: 'task-email-check', name: 'E-postaları kontrol et', objectId: 'computer-desk-object', completed: false }
];

// İş Sahnesi DOM Elementleri
const workSceneElement = document.getElementById('work-scene');
const workGameCanvasElement = workSceneElement ? workSceneElement.querySelector('.game-canvas') : null;
const workPlayerElement = workSceneElement ? workSceneElement.querySelector('.player-character') : null;
const workTimerDisplayElement = workSceneElement ? workSceneElement.querySelector('#work-timer-display') : null;
const workTaskPanelListElement = workSceneElement ? workSceneElement.querySelector('#work-task-list') : null;
const exitWorkButtonElement = workSceneElement ? workSceneElement.querySelector('#exit-work-btn') : null; 