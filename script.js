document.addEventListener('DOMContentLoaded', () => {
    // Ana görünüm elementleri
    const mainView = document.getElementById('main-view');
    const homeButton = document.getElementById('home-btn');
    const schoolButton = document.getElementById('school-btn');
    const workButton = document.getElementById('work-btn');
    const currentLocationTitle = document.getElementById('current-location-title');
    const taskList = document.getElementById('task-list');

    // Ev Sahnesi elementleri
    const homeScene = document.getElementById('home-scene');
    const homeSceneContent = document.getElementById('home-scene-content');
    const player = document.getElementById('player');
    const exitHomeButton = document.getElementById('exit-home-btn');
    const homeTaskPanelList = document.getElementById('home-task-list');
    const gameCanvas = document.getElementById('game-canvas');
    const currentDayTextElement = document.getElementById('current-day-text'); // Gün göstergesi için
    const homeTimerDisplay = document.getElementById('home-timer-display'); // Ev zamanlayıcısı

    // Genişletilmiş görevler
    const allHomeTasks = [
        { id: 'task-bed', name: 'Yatağı topla', objectId: 'bed-object', completed: false, interactionText: 'Yatağı toplamak için E\'ye bas' },
        { id: 'task-dishes', name: 'Bulaşıkları yıka', objectId: 'dishes-object', completed: false, interactionText: 'Bulaşıkları yıkamak için E\'ye bas' },
        { id: 'task-vacuum', name: 'Süpürge yap', objectId: 'vacuum-object', completed: false, interactionText: 'Süpürge yapmak için E\'ye bas' },
        { id: 'task-trash', name: 'Çöpü at', objectId: 'trash-bin-object', completed: false, interactionText: 'Çöpü atmak için E\'ye bas' },
        { id: 'task-laundry', name: 'Çamaşırları yıka', objectId: 'laundry-machine-object', completed: false, interactionText: 'Çamaşırları yıkamak için E\'ye bas' },
        { id: 'task-desk', name: 'Masayı düzenle', objectId: 'desk-object', completed: false, interactionText: 'Masayı düzenlemek için E\'ye bas' },
        { id: 'task-plant', name: 'Bitkileri sula', objectId: 'plant-object', completed: false, interactionText: 'Bitkileri sulamak için E\'ye bas' },
        { id: 'task-read', name: 'Kitap oku (ev)', objectId: 'bookshelf-object', completed: false, interactionText: 'Kitap okumak için E\'ye bas' },
        // Daha fazla görev eklenebilir...
    ];

    // tasks objesi artık ana görünüm için kullanılacak, ev görevleri allHomeTasks'tan alınacak
    const tasks = {
        // ev: [] // Ev görevleri artık allHomeTasks ve activeHomeTasks ile yönetilecek
        okul: [
            { id: 'task-math', name: 'Matematik ödevini yap', priority: 1, completed: false },
            { id: 'task-read-school', name: 'Kitap oku (okul)', priority: 2, completed: false }
        ],
        is: [
            { id: 'task-email', name: 'E-postaları kontrol et', priority: 1, completed: false },
            { id: 'task-report', name: 'Raporu tamamla', priority: 2, completed: false }
        ]
    };

    let currentLocation = 'ev';
    // playerPosX, playerPosY, playerSpeed (Kullanıcı bunları CSS'te güncelledi, bu yüzden başlangıç değerlerini CSS'e bırakalım veya senkronize edelim)
    // player.style.left ve top doğrudan manipüle edilecek.

    let activeHomeTasks = [];
    let draggedItem = null;
    const movementKeys = { w: false, a: false, s: false, d: false, arrowup: false, arrowleft: false, arrowdown: false, arrowright: false };
    const playerSpeedPixels = 5; // Karakter hızı piksel cinsinden
    let gameLoopInterval = null;
    let homeSceneTimerInterval = null;
    let homeSceneTimeLeft = 60; // Saniye cinsinden

    const dayDurationMinutes = 2; // Her gün 2 dakika sürecek
    const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    let currentDayIndex = 0;
    let dayTimerInterval = null;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initializeGame() {
        updateDayDisplay();
        startDayTimer();
        // Diğer başlangıç ayarları (örneğin ilk mekanın yüklenmesi)
        updateLocation('ev', 'Ev'); // Ana görünüm için başlangıç konumu
    }

    function updateDayDisplay() {
        if (currentDayTextElement) {
            currentDayTextElement.textContent = `Gün: ${dayNames[currentDayIndex]}`;
        }
    }

    function advanceDay() {
        currentDayIndex = (currentDayIndex + 1) % dayNames.length;
        updateDayDisplay();
        console.log(`Yeni gün: ${dayNames[currentDayIndex]}`);
        resetAllTasks();
        // Eğer oyuncu bir görev sahnesindeyse (örn: ev), o sahnenin görev listesini de yenile
        if (homeScene.style.display === 'flex') {
            initializeHomeTasks(); // Ev görevlerini yeniden başlatır ve paneli günceller
        }
        // Benzer şekilde okul ve iş sahneleri için de kontroller eklenecek
    }

    function startDayTimer() {
        if (dayTimerInterval) clearInterval(dayTimerInterval);
        dayTimerInterval = setInterval(advanceDay, dayDurationMinutes * 60 * 1000);
    }

    function resetAllTasks() {
        console.log("Tüm görevler sıfırlanıyor...");
        allHomeTasks.forEach(task => task.completed = false);
        // Okul ve İş görevleri için de benzer sıfırlama yapılacak
        // tasks.okul.forEach(task => task.completed = false);
        // tasks.is.forEach(task => task.completed = false);
        
        // Ana görünümdeki görev listesini de güncelle (eğer oradaysa)
        if (mainView.style.display !== 'none' && currentLocation !== 'ev') {
             renderMainViewTasks(); // Ana görünümdeki okul/iş görevlerini günceller
        }
    }

    function initializeHomeTasks() {
        activeHomeTasks = []; // Aktif görevleri sıfırla
        homeTaskPanelList.innerHTML = '';
        // Sadece tamamlanmamış görevleri filtrele (resetAllTasks zaten hepsini sıfırladı)
        const availableTasks = allHomeTasks.filter(t => !t.completed); 
        shuffleArray(availableTasks);

        const tasksToShowCount = Math.min(availableTasks.length, 4);
        const tasksToShow = availableTasks.slice(0, tasksToShowCount);
        
        tasksToShow.forEach(task => {
            activeHomeTasks.push(task.id);
        });
        renderHomeTaskList();
    }

    function renderHomeTaskList() {
        homeTaskPanelList.innerHTML = ''; // Paneli temizle
        activeHomeTasks.forEach((taskId, index) => {
            const task = allHomeTasks.find(t => t.id === taskId);
            if (task) {
                const listItem = document.createElement('li');
                listItem.dataset.taskId = task.id;
                listItem.setAttribute('draggable', !task.completed); // Tamamlanmışsa sürüklenemez
                listItem.style.cursor = task.completed ? 'default' : 'grab';

                const orderSpan = document.createElement('span');
                orderSpan.classList.add('task-order-number');
                orderSpan.textContent = `${index + 1}.`;

                const nameSpan = document.createElement('span');
                nameSpan.textContent = task.name;
                nameSpan.style.flexGrow = '1'; // İsim alanı genişlesin

                listItem.appendChild(orderSpan);
                listItem.appendChild(nameSpan);

                if (task.completed) {
                    listItem.classList.add('completed-task');
                }
                homeTaskPanelList.appendChild(listItem);
            }
        });
        addDragAndDropListeners();
    }

    function addDragAndDropListeners() {
        const listItems = homeTaskPanelList.querySelectorAll('li[draggable="true"]');
        listItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    function handleDragStart(e) {
        draggedItem = this; // this, sürüklenen li elementidir
        setTimeout(() => {
            this.classList.add('dragging'); // Görsel geri bildirim için
        }, 0);
        // e.dataTransfer.setData('text/plain', this.dataset.taskId); // Gerekirse ID'yi transfer et
    }

    function handleDragOver(e) {
        e.preventDefault(); // Drop olayının çalışması için gerekli
        const afterElement = getDragAfterElement(homeTaskPanelList, e.clientY);
        const currentlyDragged = document.querySelector('.dragging');
        if (currentlyDragged) { // Sadece kendi listemizdeki sürüklemeleri dikkate al
            if (afterElement == null) {
                homeTaskPanelList.appendChild(currentlyDragged);
            } else {
                homeTaskPanelList.insertBefore(currentlyDragged, afterElement);
            }
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        updateActiveHomeTaskOrder();
        renderHomeTaskList(); // Sıralama değiştiğinde numaraları güncellemek için yeniden render et
    }

    function handleDragEnd() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        draggedItem = null;
        // handleDrop'ta zaten sıralama güncellendi, burada tekrar gerek yok.
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li[draggable="true"]:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateActiveHomeTaskOrder() {
        const newTaskOrder = [];
        homeTaskPanelList.querySelectorAll('li').forEach(li => {
            newTaskOrder.push(li.dataset.taskId);
        });
        activeHomeTasks = newTaskOrder;
        // renderHomeTaskList(); // handleDrop içinde çağrılıyor
    }

    function checkCollision(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    function handlePlayerInteraction(event) {
        if (event.key.toLowerCase() !== 'e' || homeScene.style.display === 'none') {
            return;
        }
        event.preventDefault(); // E tuşunun başka bir etkileşimini engelle

        if (activeHomeTasks.length === 0) return;

        const playerRect = player.getBoundingClientRect();
        const firstTaskId = activeHomeTasks[0];
        const taskToComplete = allHomeTasks.find(t => t.id === firstTaskId && !t.completed);

        if (!taskToComplete) {
            // console.log("Sıradaki görev (ID: " + firstTaskId + ") bulunamadı veya zaten tamamlanmış.");
            return;
        }

        let objectToInteract = null;
        if (taskToComplete.objectId && taskToComplete.objectId !== 'none') {
            objectToInteract = document.getElementById(taskToComplete.objectId);
        }

        if (objectToInteract) {
            const objectRect = objectToInteract.getBoundingClientRect();
            if (checkCollision(playerRect, objectRect)) {
                console.log(`Interacting with ${taskToComplete.objectId} for task: ${taskToComplete.name}`);
                completeTask(taskToComplete.id);
            } else {
                // console.log(`Pressed E near ${taskToComplete.objectId}, but no collision.`);
            }
        } else if (!taskToComplete.objectId || taskToComplete.objectId === 'none') {
            // Objesiz görevler (örneğin sadece E'ye basmak yeterliyse veya belirli bir bölgede E'ye basmak)
            // Bu tür görevler için çarpışma kontrolü gerekiyorsa, farklı bir mantık gerekebilir.
            // Şimdilik, eğer objesizse ve sıradaysa direkt tamamla.
            console.log(`Completing object-less task by pressing E: ${taskToComplete.name}`);
            completeTask(taskToComplete.id);
        }
    }

    function completeTask(taskId) {
        const taskIndexInAll = allHomeTasks.findIndex(t => t.id === taskId);
        const taskData = allHomeTasks[taskIndexInAll];

        if (taskData && !taskData.completed) {
            taskData.completed = true;
            renderHomeTaskList();

            // Tüm aktif görevler tamamlandı mı kontrol et
            const allActiveTasksCompleted = activeHomeTasks.every(id => {
                const task = allHomeTasks.find(t => t.id === id);
                return task && task.completed;
            });

            if (allActiveTasksCompleted && activeHomeTasks.length > 0) {
                clearInterval(homeSceneTimerInterval); // Tüm görevler tamamlanınca zamanlayıcıyı durdur
                // alert("Tebrikler! Evdeki tüm aktif görevleri zamanında tamamladın!"); // Opsiyonel başarı mesajı
                console.log("Evdeki tüm aktif görevler başarıyla tamamlandı!");
            }

            setTimeout(() => {
                // activeHomeTasks'tan silme ve yenisini ekleme mantığı burada kalabilir
                // ancak süre dolumu ve tüm görevlerin tamamlanması senaryoları ile çakışmamalı.
                // Şimdilik, görev panelinin güncellenmesi için renderHomeTaskList zaten çağrılıyor.
                // Eğer görevler zamanında tamamlandıysa, yeni görev eklemek yerine belki de sahne sonlanmalı
                // veya oyuncu ödüllendirilmeli.
                // Mevcut mantık: Tamamlanan görev listeden çıkarılır ve yenisi eklenir (eğer varsa).
                // Bu, zamanlayıcıdan bağımsız olarak devam ediyor.
                const taskStillInActiveList = activeHomeTasks.includes(taskId);
                if (taskStillInActiveList && homeSceneTimeLeft > 0) { // Sadece süre bitmediyse ve görev hala listedeyse çıkar/ekle
                     activeHomeTasks = activeHomeTasks.filter(id => id !== taskId);
                     renderHomeTaskList(); 
                     addNewTaskToPanel(); 
                } else if (!taskStillInActiveList && homeSceneTimeLeft > 0) {
                    // Görev zaten (belki başka bir mantıkla) çıkarılmış olabilir, sadece yeni görev ekle
                    addNewTaskToPanel();
                }
            }, 3000); 
        }
    }

    function addNewTaskToPanel() {
        const availableNewTasks = allHomeTasks.filter(task => !task.completed && !activeHomeTasks.includes(task.id));

        if (availableNewTasks.length > 0 && activeHomeTasks.length < 4) { // Panelde en fazla 4 görev olsun
            shuffleArray(availableNewTasks);
            const newTask = availableNewTasks[0];
            activeHomeTasks.push(newTask.id); // Yeni görevi aktif listeye ekle (sona)
            renderHomeTaskList(); // Yeni görev eklendi, listeyi güncelleyerek numaralandır
        } else if (activeHomeTasks.length === 0 && availableNewTasks.length === 0) {
            homeTaskPanelList.innerHTML = '<li>Tebrikler! Tüm ev görevleri tamamlandı.</li>';
        }
    }

    function updateLocation(newLocation, locationName) {
        currentLocation = newLocation;
        currentLocationTitle.textContent = `Şu anki Mekan: ${locationName}`;
        if (newLocation !== 'ev') { // Sadece ana görünümdeyse ve ev değilse görevleri render et
            renderMainViewTasks();
        }
    }

    function renderMainViewTasks() { // Renamed from renderTasks
        taskList.innerHTML = '';
        const currentTasksForView = tasks[currentLocation] || [];

        if (currentTasksForView.length === 0 && currentLocation !== 'ev') {
            const li = document.createElement('li');
            li.textContent = 'Bu mekanda yapılacak görev yok.';
            taskList.appendChild(li);
            return;
        }

        currentTasksForView.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.name} (Öncelik: ${task.priority !== undefined ? task.priority : 'N/A'})`;
            taskList.appendChild(li);
        });
    }

    function showHomeScene() {
        mainView.style.display = 'none';
        homeScene.style.display = 'flex';
        initializeHomeTasks();
        resetPlayerPosition();
        startHomeSceneTimer(); // Zamanlayıcıyı başlat

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('keydown', handlePlayerInteraction);
        if (gameLoopInterval) clearInterval(gameLoopInterval); // Önceki loop'u temizle
        gameLoopInterval = setInterval(gameLoop, 16);
    }

    function hideHomeScene() {
        homeScene.style.display = 'none';
        mainView.style.display = 'block';
        updateLocation('ev', 'Ev');
        stopHomeSceneTimer(); // Zamanlayıcıyı durdur ve sıfırla

        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('keydown', handlePlayerInteraction);
        clearInterval(gameLoopInterval);
        for (let key in movementKeys) movementKeys[key] = false;
    }
    
    function resetPlayerPosition(){
        // Oyuncuyu gameCanvas'ın ortasına veya belirlenen bir başlangıç noktasına yerleştir
        // CSS'deki top: 600px ve left: 50% değerlerini kullanabiliriz veya burada override edebiliriz.
        // Şimdilik CSS'e güvenelim, gerekirse burayı güncelleriz.
        // player.style.left = `calc(50% - ${player.offsetWidth / 2}px)`; // gameCanvas ortası için
        // player.style.top = `calc(50% - ${player.offsetHeight / 2}px)`; // gameCanvas ortası için
         player.style.left = '50%'; // CSS'deki gibi
         player.style.top = '600px'; // CSS'deki gibi
    }

    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key in movementKeys) {
            movementKeys[key] = true;
            event.preventDefault();
        }
    }

    function handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (key in movementKeys) {
            movementKeys[key] = false;
            event.preventDefault();
        }
    }

    function gameLoop() {
        if (homeScene.style.display !== 'flex') return;

        let newPlayerX = player.offsetLeft;
        let newPlayerY = player.offsetTop;

        if (movementKeys.w || movementKeys.arrowup) newPlayerY -= playerSpeedPixels;
        if (movementKeys.s || movementKeys.arrowdown) newPlayerY += playerSpeedPixels;
        if (movementKeys.a || movementKeys.arrowleft) newPlayerX -= playerSpeedPixels;
        if (movementKeys.d || movementKeys.arrowright) newPlayerX += playerSpeedPixels;

        const canvasRect = gameCanvas.getBoundingClientRect(); // gameCanvas sınırları
        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;

        // Sınır kontrolleri (oyuncuyu gameCanvas içinde tut)
        if (newPlayerX < 0) newPlayerX = 0;
        if (newPlayerX + playerWidth > canvasRect.width) newPlayerX = canvasRect.width - playerWidth;
        if (newPlayerY < 0) newPlayerY = 0;
        if (newPlayerY + playerHeight > canvasRect.height) newPlayerY = canvasRect.height - playerHeight;

        player.style.left = `${newPlayerX}px`;
        player.style.top = `${newPlayerY}px`;
    }

    function startHomeSceneTimer() {
        homeSceneTimeLeft = 60;
        updateHomeTimerDisplay();
        if (homeSceneTimerInterval) clearInterval(homeSceneTimerInterval);
        homeSceneTimerInterval = setInterval(() => {
            homeSceneTimeLeft--;
            updateHomeTimerDisplay();
            if (homeSceneTimeLeft <= 0) {
                clearInterval(homeSceneTimerInterval);
                // Aktif ve tamamlanmamış görev var mı kontrol et
                const pendingTasks = activeHomeTasks.some(taskId => {
                    const task = allHomeTasks.find(t => t.id === taskId);
                    return task && !task.completed;
                });
                if (pendingTasks) {
                    alert("Başarısız oldun! Evdeki görevleri zamanında tamamlayamadın.");
                    // İsteğe bağlı: Oyuncuyu ana menüye atabilir veya sahneyi sıfırlayabiliriz.
                    hideHomeScene(); // Örneğin ana menüye dön
                } else {
                    // Eğer süre dolduğunda tüm aktif görevler zaten tamamlanmışsa bir şey yapma
                    // veya bir başarı mesajı göster.
                    console.log("Ev görevleri süre dolmadan tamamlandı!");
                }
            }
        }, 1000);
    }

    function stopHomeSceneTimer() {
        clearInterval(homeSceneTimerInterval);
        homeSceneTimeLeft = 60; // Varsayılan süreye sıfırla
        if (homeTimerDisplay) homeTimerDisplay.textContent = "Süre: 01:00";
    }

    function updateHomeTimerDisplay() {
        if (!homeTimerDisplay) return;
        const minutes = Math.floor(homeSceneTimeLeft / 60);
        const seconds = homeSceneTimeLeft % 60;
        homeTimerDisplay.textContent = `Süre: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    homeButton.addEventListener('click', () => {
        // updateLocation('ev', 'Ev'); // Bu zaten ana görünümde ayarlı
        showHomeScene();
    });
    schoolButton.addEventListener('click', () => updateLocation('okul', 'Okul')); // Diğer mekanlar şimdilik ana görünümde kalır
    workButton.addEventListener('click', () => updateLocation('is', 'İş'));     // Diğer mekanlar şimdilik ana görünümde kalır

    exitHomeButton.addEventListener('click', hideHomeScene);

    // Oyunu ilk yüklemede ev görevlerini göster (ana görünüm için)
    updateLocation('ev', 'Ev'); // Ana görünüm için başlangıç konumu
    // renderTasks(); // updateLocation içinde çağrılıyor.

    initializeGame(); // Oyunu buradan başlat
}); 