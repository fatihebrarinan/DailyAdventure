document.addEventListener("DOMContentLoaded", () => {
  // Başlangıç Ekranı Elementleri
  const startScreen = document.getElementById("start-screen");
  const startGameButton = document.getElementById("start-game-btn");
  const exitGameButton = document.getElementById("exit-game-btn");

  // Ana görünüm elementleri
  const mainView = document.getElementById("main-view");
  const currentLocationTitle = document.getElementById(
    "current-location-title"
  );
  const taskList = document.getElementById("task-list");
  const currentDayTextElement = document.getElementById("current-day-text"); // Gün göstergesi için

  // Yeni İnteraktif Harita Butonları
  const interactiveHomeButton = document.getElementById("interactive-home-btn");
  const interactiveSchoolButton = document.getElementById("interactive-school-btn");
  const interactiveWorkButton = document.getElementById("interactive-work-btn");

  // Genişletilmiş görevler (Sahneye özgü)
  const allHomeTasks = [
    { id: "task-bed", name: "Yatağı topla", objectId: "bed-object", completed: false, interactionText: "Yatağı toplamak için E'ye bas", imageStates: { initial: 'images/yatak_dağınık.png', completed: 'images/yatak_toplu.png' } },
    { id: "task-dishes", name: "Bulaşıkları yıka", objectId: "dishes-object", completed: false, interactionText: "Bulaşıkları yıkamak için E'ye bas", imageStates: { initial: 'images/makine_kirli.png', completed: 'images/makine_temiz.png' } },
    { id: "task-vacuum", name: "Süpürge yap", objectId: "vacuum-object", completed: false, interactionText: "Süpürge yapmak için E'ye bas", imageStates: { initial: 'images/süpürülmemiş_toz.png', completed: 'images/süpürülen_toz.png' } },
    { id: "task-trash", name: "Çöpü at", objectId: "trash-bin-object", completed: false, interactionText: "Çöpü atmak için E'ye bas", imageStates: { initial: 'images/çöp_kirli.png', completed: 'images/çöp_temiz.png' } },
    { id: "task-desk", name: "Masayı düzenle", objectId: "desk-object", completed: false, interactionText: "Masayı düzenlemek için E'ye bas", imageStates: { initial: 'images/masa_dağınık.png', completed: 'images/masa_toplu.png' } },
    { id: "task-plant", name: "Bitkileri sula", objectId: "plant-object", completed: false, interactionText: "Bitkileri sulamak için E'ye bas", imageStates: { initial: 'images/çiçek_kuru.png', completed: 'images/çiçek_sulanmış.png' } },
    { id: "task-read", name: "Kitap oku", objectId: "bookshelf-object", completed: false, interactionText: "Kitap okumak için E'ye bas", imageStates: { initial: 'images/muhasebe_önce.png', completed: 'images/kitap_okuma.png' } },
  ];

  const allSchoolTasks = [
    //{ id: "task-lecture", name: "Derse katıl", objectId: "blackboard-object", completed: false, interactionText: "Derse katılmak için E'ye bas" },
    { id: "task-homework", name: "Ödevi yap", objectId: "school-desk-object", completed: false, interactionText: "Ödevi yapmak için E'ye bas", imageStates: { initial: 'images/ödev_yapılmamış.png', completed: 'images/ödev_yapılmış.png' } }, 
    { id: "task-experiment", name: "Deney yap", objectId: "science-lab-object", completed: false, interactionText: "Deney yapmak için E'ye bas", imageStates: { initial: 'images/karakter_ön.png', completed: 'images/deney.png' } },
    { id: "task-art-project", name: "Çanta hazırla", objectId: "art-easel-object", completed: false, interactionText: "Çanta hazırlamak için E'ye bas", imageStates: { initial: 'images/çanta_boş.png', completed: 'images/çanta_dolu.png' } },
  ];

  const allWorkTasks = [
    { id: "task-coding", name: "Muhasebe işlerini yap", objectId: "computer-desk-object", completed: false, interactionText: "Muhasebe işlerini yapmak için E'ye bas", imageStates: { initial: 'images/muhasebe_önce.png', completed: 'images/muhasebe_sonra.png' } },
    { id: "task-meeting", name: "Toplantıya katıl", objectId: "meeting-table-object", completed: false, interactionText: "Toplantıya katılmak için E'ye bas" , imageStates: { initial: 'images/karakter_ön.png', completed: 'images/toplantı.png' } },
    //{ id: "task-coffee", name: "Kahve al", objectId: "coffee-machine-object", completed: false, interactionText: "Kahve almak için E'ye bas" },
    //{ id: "task-planning", name: "Proje planla", objectId: "project-board-object", completed: false, interactionText: "Plan yapmak için E'ye bas" },
    { id: "task-water-plant-work", name: "Çiçek sula", objectId: "office-plant-object", completed: false, interactionText: "Bitkiyi sulamak için E'ye bas" , imageStates: { initial: 'images/çiçek_kuru.png', completed: 'images/çiçek_sulanmış.png' } },
  ];


  // Ana görünüm için görevler
  const tasks = {
    okul: [
      { id: "task-math", name: "Matematik ödevini yap", priority: 1, completed: false },
      { id: "task-read-school", name: "Kitap oku (okul)", priority: 2, completed: false },
    ],
    is: [
      { id: "task-email", name: "E-postaları kontrol et", priority: 1, completed: false },
      { id: "task-report", name: "Raporu tamamla", priority: 2, completed: false },
    ],
  };

  let currentLocation = "ev"; // Ana görünümdeki konumu takip eder
  const playerSpeedPixels = 5;
  let draggedItem = null; // Ortak sürüklenen öğe

  // Gün Sistemi
  const dayDurationMinutes = 2;
  const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  let currentDayIndex = 0;
  let dayTimerInterval = null;

  // Sahne Konfigürasyonları
  const sceneConfigs = {
    home: {
      key: "home",
      name: "Ev",
      sceneElement: document.getElementById("home-scene"),
      canvasElement: document.getElementById("home-scene").querySelector(".game-canvas"),
      playerElement: document.getElementById("home-scene").querySelector(".player-character"),
      taskPanelListElement: document.getElementById("home-task-list"),
      timerDisplayElement: document.getElementById("home-timer-display"),
      exitButtonElement: document.getElementById("exit-home-btn"),
      allTasks: allHomeTasks,
      activeTasks: [],
      movementKeys: { w: false, a: false, s: false, d: false, arrowup: false, arrowleft: false, arrowdown: false, arrowright: false },
      gameLoopInterval: null,
      timerInterval: null,
      timeLeft: 60, // Saniye
      initialPlayerPos: { left: "50%", top: "600px" },
      playerImagePaths: {
        front: 'images/karakter_ön.png',
        back: 'images/karakter_arka.png',
        left: 'images/karakter_sol.png',
        right: 'images/karakter_sağ.png'
      }
    },
    school: {
      key: "school",
      name: "Okul",
      sceneElement: document.getElementById("school-scene"),
      canvasElement: document.getElementById("school-scene").querySelector(".game-canvas"),
      playerElement: document.getElementById("school-scene").querySelector(".player-character"),
      taskPanelListElement: document.getElementById("school-task-list"),
      timerDisplayElement: document.getElementById("school-timer-display"),
      exitButtonElement: document.getElementById("exit-school-btn"),
      allTasks: allSchoolTasks,
      activeTasks: [],
      movementKeys: { w: false, a: false, s: false, d: false, arrowup: false, arrowleft: false, arrowdown: false, arrowright: false },
      gameLoopInterval: null,
      timerInterval: null,
      timeLeft: 60, // Saniye
      initialPlayerPos: { left: "50%", top: "50%" },
      playerImagePaths: {
        front: 'images/karakter_ön.png',
        back: 'images/karakter_arka.png',
        left: 'images/karakter_sol.png',
        right: 'images/karakter_sağ.png'
      }
    },
    work: {
      key: "work",
      name: "İş",
      sceneElement: document.getElementById("work-scene"),
      canvasElement: document.getElementById("work-scene").querySelector(".game-canvas"),
      playerElement: document.getElementById("work-scene").querySelector(".player-character"),
      taskPanelListElement: document.getElementById("work-task-list"),
      timerDisplayElement: document.getElementById("work-timer-display"),
      exitButtonElement: document.getElementById("exit-work-btn"),
      allTasks: allWorkTasks,
      activeTasks: [],
      movementKeys: { w: false, a: false, s: false, d: false, arrowup: false, arrowleft: false, arrowdown: false, arrowright: false },
      gameLoopInterval: null,
      timerInterval: null,
      timeLeft: 60, // Saniye
      initialPlayerPos: { left: "50%", top: "50%" },
      playerImagePaths: {
        front: 'images/karakter_ön.png',
        back: 'images/karakter_arka.png',
        left: 'images/karakter_sol.png',
        right: 'images/karakter_sağ.png'
      }
    }
  };

  let currentSceneKey = null;
  let currentSceneConfig = null;


  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function initializeGame() {
    updateDayDisplay();
    startDayTimer();
    updateLocation("ev", "Ev"); // Ana görünüm için başlangıç konumu
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
    if (currentSceneConfig) { // Eğer bir oyun sahnesindeyse görevleri yeniden başlat
      initializeSceneTasks(currentSceneKey);
    }
    // Ana görünümdeki okul/iş görevlerini de güncellemek gerekebilir, bu şimdilik elle yapılmıyor.
  }

  function startDayTimer() {
    if (dayTimerInterval) clearInterval(dayTimerInterval);
    dayTimerInterval = setInterval(advanceDay, dayDurationMinutes * 60 * 1000);
  }

  function resetAllTasks() {
    console.log("Tüm görevler sıfırlanıyor...");
    Object.values(sceneConfigs).forEach(config => {
      config.allTasks.forEach((task) => {
        task.completed = false;
        // Görev nesnelerinin görsellerini başlangıç durumuna sıfırla
        if (task.objectId && task.imageStates && task.imageStates.initial) {
          const objectElement = document.getElementById(task.objectId);
          if (objectElement) {
            objectElement.style.backgroundImage = `url('${task.imageStates.initial}')`;
          }
        }
      });
    });

    // Ana görünümdeki görev listesini de güncelle (eğer oradaysa ve ev değilse)
    if (mainView.style.display !== "none" && currentLocation !== "ev") {
      renderMainViewTasks();
    }
  }

  // GENEL SAHNE YÖNETİMİ FONKSİYONLARI

  function initializeSceneTasks(sceneKeyToInit) {
    const config = sceneConfigs[sceneKeyToInit];
    if (!config) return;

    config.activeTasks = [];
    config.taskPanelListElement.innerHTML = "";

    // Sahnedeki etkileşimli nesnelerin görsellerini başlangıç durumuna ayarla
    config.allTasks.forEach(task => {
      if (task.objectId && task.imageStates && task.imageStates.initial) {
        const objectElement = document.getElementById(task.objectId);
        if (objectElement) {
          objectElement.style.backgroundImage = `url('${task.imageStates.initial}')`;
        }
      }
    });

    const availableTasks = config.allTasks.filter((t) => !t.completed);
    shuffleArray(availableTasks);

    const tasksToShowCount = Math.min(availableTasks.length, 4);
    const tasksToShow = availableTasks.slice(0, tasksToShowCount);

    tasksToShow.forEach((task) => {
      config.activeTasks.push(task.id);
    });
    renderSceneTaskList(sceneKeyToInit);
  }

  function renderSceneTaskList(sceneKeyToRender) {
    const config = sceneConfigs[sceneKeyToRender];
    if (!config) return;

    config.taskPanelListElement.innerHTML = "";
    config.activeTasks.forEach((taskId, index) => {
      const task = config.allTasks.find((t) => t.id === taskId);
      if (task) {
        const listItem = document.createElement("li");
        listItem.dataset.taskId = task.id;
        listItem.setAttribute("draggable", !task.completed);
        listItem.style.cursor = task.completed ? "default" : "grab";

        const orderSpan = document.createElement("span");
        orderSpan.classList.add("task-order-number");
        orderSpan.textContent = `${index + 1}.`;

        const nameSpan = document.createElement("span");
        nameSpan.textContent = task.name;
        nameSpan.style.flexGrow = "1";

        listItem.appendChild(orderSpan);
        listItem.appendChild(nameSpan);

        if (task.completed) {
          listItem.classList.add("completed-task");
        }
        config.taskPanelListElement.appendChild(listItem);
      }
    });
    addSceneDragAndDropListeners(sceneKeyToRender);
  }

  function addSceneDragAndDropListeners(sceneKeyForDragDrop) {
    const config = sceneConfigs[sceneKeyForDragDrop];
    if (!config) return;

    const listItems = config.taskPanelListElement.querySelectorAll(
      'li[draggable="true"]'
    );
    listItems.forEach((item) => {
      item.addEventListener("dragstart", handleSceneDragStart);
      item.addEventListener("dragover", handleSceneDragOver);
      item.addEventListener("drop", handleSceneDrop);
      item.addEventListener("dragend", handleSceneDragEnd);
    });
  }

  function handleSceneDragStart(e) { // `this` sürüklenen li olacak
    draggedItem = this;
    setTimeout(() => this.classList.add("dragging"), 0);
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('li[draggable="true"]:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function handleSceneDragOver(e) {
    e.preventDefault();
    if (!currentSceneConfig || !draggedItem || !currentSceneConfig.taskPanelListElement.contains(draggedItem)) return;

    const afterElement = getDragAfterElement(currentSceneConfig.taskPanelListElement, e.clientY);
    const currentlyDragged = currentSceneConfig.taskPanelListElement.querySelector(".dragging");

    if (currentlyDragged) {
      if (afterElement == null) {
        currentSceneConfig.taskPanelListElement.appendChild(currentlyDragged);
      } else {
        currentSceneConfig.taskPanelListElement.insertBefore(currentlyDragged, afterElement);
      }
    }
  }

  function handleSceneDrop(e) {
    e.preventDefault();
    if (!currentSceneConfig) return;
    updateActiveTaskOrderForCurrentScene();
    renderSceneTaskList(currentSceneKey);
  }

  function handleSceneDragEnd() {
    if (draggedItem) {
      draggedItem.classList.remove("dragging");
    }
    draggedItem = null;
  }

  function updateActiveTaskOrderForCurrentScene() {
    if (!currentSceneConfig) return;
    const newTaskOrder = [];
    currentSceneConfig.taskPanelListElement
      .querySelectorAll("li")
      .forEach((li) => newTaskOrder.push(li.dataset.taskId));
    currentSceneConfig.activeTasks = newTaskOrder;
  }

  function checkCollision(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  function handleScenePlayerInteraction(event) {
    if (event.key.toLowerCase() !== "e" || !currentSceneConfig) return;
    event.preventDefault();

    if (currentSceneConfig.activeTasks.length === 0) return;

    const playerRect = currentSceneConfig.playerElement.getBoundingClientRect();
    const firstTaskId = currentSceneConfig.activeTasks[0];
    const taskToComplete = currentSceneConfig.allTasks.find(
      (t) => t.id === firstTaskId && !t.completed
    );

    if (!taskToComplete) return;

    let objectToInteract = null;
    if (taskToComplete.objectId && taskToComplete.objectId !== "none") {
      // Sahne içindeki nesneleri ID ile bulurken, o sahneye ait DOM'da arama yapmak daha güvenli olabilir.
      // Ancak ID'ler global olduğu için document.getElementById yeterli olmalı.
      objectToInteract = document.getElementById(taskToComplete.objectId);
    }

    if (objectToInteract) {
      const objectRect = objectToInteract.getBoundingClientRect();
      if (checkCollision(playerRect, objectRect)) {
        completeSceneTask(taskToComplete.id);
      }
    } else if (!taskToComplete.objectId || taskToComplete.objectId === "none") {
      completeSceneTask(taskToComplete.id);
    }
  }

  function completeSceneTask(taskId) {
    if (!currentSceneConfig) return;
    const taskIndexInAll = currentSceneConfig.allTasks.findIndex((t) => t.id === taskId);
    const taskData = currentSceneConfig.allTasks[taskIndexInAll];

    if (taskData && !taskData.completed) {
      taskData.completed = true;

      // Görev nesnesinin görselini güncelle
      if (taskData.objectId && taskData.imageStates && taskData.imageStates.completed) {
        const objectElement = document.getElementById(taskData.objectId);
        if (objectElement) {
          objectElement.style.backgroundImage = `url('${taskData.imageStates.completed}')`;
        }
      }

      renderSceneTaskList(currentSceneKey);

      const allActiveTasksCompleted = currentSceneConfig.activeTasks.every((id) => {
        const task = currentSceneConfig.allTasks.find((t) => t.id === id);
        return task && task.completed;
      });

      if (allActiveTasksCompleted && currentSceneConfig.activeTasks.length > 0) {
        clearInterval(currentSceneConfig.timerInterval);
        console.log(`${currentSceneConfig.name} sahnesindeki tüm aktif görevler başarıyla tamamlandı!`);
      }

      setTimeout(() => {
        const taskStillInActiveList = currentSceneConfig.activeTasks.includes(taskId);
        if (taskStillInActiveList && currentSceneConfig.timeLeft > 0) {
          currentSceneConfig.activeTasks = currentSceneConfig.activeTasks.filter((id) => id !== taskId);
          renderSceneTaskList(currentSceneKey);
          addNewTaskToScenePanel();
        } else if (!taskStillInActiveList && currentSceneConfig.timeLeft > 0) {
          addNewTaskToScenePanel();
        }
      }, 3000);
    }
  }

  function addNewTaskToScenePanel() {
    if (!currentSceneConfig) return;
    const availableNewTasks = currentSceneConfig.allTasks.filter(
      (task) => !task.completed && !currentSceneConfig.activeTasks.includes(task.id)
    );

    if (availableNewTasks.length > 0 && currentSceneConfig.activeTasks.length < 4) {
      shuffleArray(availableNewTasks);
      const newTask = availableNewTasks[0];
      currentSceneConfig.activeTasks.push(newTask.id);
      renderSceneTaskList(currentSceneKey);
    } else if (currentSceneConfig.activeTasks.length === 0 && availableNewTasks.length === 0) {
      currentSceneConfig.taskPanelListElement.innerHTML =
        `<li>Tebrikler! Tüm ${currentSceneConfig.name.toLowerCase()} görevleri tamamlandı.</li>`;
    }
  }

  function updateLocation(newLocationKey, locationName) { // newLocationKey: "ev", "okul", "is"
    currentLocation = newLocationKey;
    currentLocationTitle.textContent = `Şu anki Mekan: ${locationName}`;
    if (newLocationKey !== "ev") { // Ana görünümde ev için ayrı bir task listesi yok
      renderMainViewTasks();
    } else {
      taskList.innerHTML = "<li>Ev görevleri oyun sahnesinde yönetilir.</li>"; // Ev için ana görünümde görev listesi yok
    }
  }

  function renderMainViewTasks() {
    taskList.innerHTML = "";
    const currentTasksForView = tasks[currentLocation] || []; // currentLocation 'okul' veya 'is' olmalı

    if (currentTasksForView.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Bu mekanda yapılacak görev yok.";
      taskList.appendChild(li);
      return;
    }

    currentTasksForView.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${task.name} (Öncelik: ${task.priority !== undefined ? task.priority : "N/A"
        })`;
      // İsteğe bağlı: Tamamlanma durumu da gösterilebilir.
      // if (task.completed) li.classList.add("completed-task");
      taskList.appendChild(li);
    });
  }

  function resetScenePlayerPosition(config) {
    if (!config || !config.playerElement) return;
    config.playerElement.style.left = config.initialPlayerPos.left;
    config.playerElement.style.top = config.initialPlayerPos.top;
  }

  function handleSceneKeyDown(event) {
    if (!currentSceneConfig) return;
    const key = event.key.toLowerCase();
    if (key in currentSceneConfig.movementKeys) {
      currentSceneConfig.movementKeys[key] = true;
      event.preventDefault();
    }
  }

  function handleSceneKeyUp(event) {
    if (!currentSceneConfig) return;
    const key = event.key.toLowerCase();
    if (key in currentSceneConfig.movementKeys) {
      currentSceneConfig.movementKeys[key] = false;
      event.preventDefault();
    }
  }

  function sceneGameLoop() {
    if (!currentSceneConfig || currentSceneConfig.sceneElement.style.display !== "flex") return;

    const config = currentSceneConfig;
    let newPlayerX = config.playerElement.offsetLeft;
    let newPlayerY = config.playerElement.offsetTop;

    // Determine target image based on movement keys
    let targetImage = config.playerImagePaths.front; // Default to front
    if (config.movementKeys.w) {
      targetImage = config.playerImagePaths.back;
    } else if (config.movementKeys.s) {
      targetImage = config.playerImagePaths.front;
    } else if (config.movementKeys.a) {
      targetImage = config.playerImagePaths.left;
    } else if (config.movementKeys.d) {
      targetImage = config.playerImagePaths.right;
    }
    config.playerElement.style.backgroundImage = `url('${targetImage}')`;

    // Movement logic
    if (config.movementKeys.w || config.movementKeys.arrowup) newPlayerY -= playerSpeedPixels;
    if (config.movementKeys.s || config.movementKeys.arrowdown) newPlayerY += playerSpeedPixels;
    if (config.movementKeys.a || config.movementKeys.arrowleft) newPlayerX -= playerSpeedPixels;
    if (config.movementKeys.d || config.movementKeys.arrowright) newPlayerX += playerSpeedPixels;

    const canvasRect = config.canvasElement.getBoundingClientRect();
    const playerWidth = config.playerElement.offsetWidth;
    const playerHeight = config.playerElement.offsetHeight;

    if (newPlayerX < 0) newPlayerX = 0;
    if (newPlayerX + playerWidth > canvasRect.width) newPlayerX = canvasRect.width - playerWidth;
    if (newPlayerY < 0) newPlayerY = 0;
    if (newPlayerY + playerHeight > canvasRect.height) newPlayerY = canvasRect.height - playerHeight;

    config.playerElement.style.left = `${newPlayerX}px`;
    config.playerElement.style.top = `${newPlayerY}px`;
  }

  function startGenericSceneTimer() {
    if (!currentSceneConfig) return;
    const config = currentSceneConfig;
    config.timeLeft = sceneConfigs[config.key].timeLeft; // Reset to initial time for the scene
    updateGenericTimerDisplay();

    if (config.timerInterval) clearInterval(config.timerInterval);
    config.timerInterval = setInterval(() => {
      config.timeLeft--;
      updateGenericTimerDisplay();
      if (config.timeLeft <= 0) {
        clearInterval(config.timerInterval);
        const pendingTasks = config.activeTasks.some((taskId) => {
          const task = config.allTasks.find((t) => t.id === taskId);
          return task && !task.completed;
        });
        if (pendingTasks) {
          alert(
            `Başarısız oldun! ${config.name} sahnesindeki görevleri zamanında tamamlayamadın.`
          );
          hideScene();
        }
      }
    }, 1000);
  }

  function stopGenericSceneTimer() {
    if (!currentSceneConfig) return;
    const config = currentSceneConfig;
    clearInterval(config.timerInterval);
    config.timerInterval = null;
    config.timeLeft = sceneConfigs[config.key].timeLeft; // Reset to initial time
    if (config.timerDisplayElement) { // Update display to initial time
      const minutes = Math.floor(config.timeLeft / 60);
      const seconds = config.timeLeft % 60;
      config.timerDisplayElement.textContent = `Süre: ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  function updateGenericTimerDisplay() {
    if (!currentSceneConfig || !currentSceneConfig.timerDisplayElement) return;
    const config = currentSceneConfig;
    const minutes = Math.floor(config.timeLeft / 60);
    const seconds = config.timeLeft % 60;
    config.timerDisplayElement.textContent = `Süre: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function showScene(sceneKeyToShow) {
    if (!sceneConfigs[sceneKeyToShow]) return;

    mainView.style.display = "none";
    if (currentSceneConfig) {
      currentSceneConfig.sceneElement.style.display = "none";
    }

    currentSceneKey = sceneKeyToShow;
    currentSceneConfig = sceneConfigs[currentSceneKey];

    // Set initial player image
    currentSceneConfig.playerElement.style.backgroundImage = `url('${currentSceneConfig.playerImagePaths.front}')`;
    // CSS should handle size, repeat, position. If not, add here:
    // currentSceneConfig.playerElement.style.backgroundSize = "contain"; 
    // currentSceneConfig.playerElement.style.backgroundRepeat = "no-repeat";
    // currentSceneConfig.playerElement.style.backgroundPosition = "center";

    currentSceneConfig.sceneElement.style.display = "flex";
    initializeSceneTasks(currentSceneKey);
    resetScenePlayerPosition(currentSceneConfig);
    startGenericSceneTimer();

    document.addEventListener("keydown", handleSceneKeyDown);
    document.addEventListener("keyup", handleSceneKeyUp);
    document.addEventListener("keydown", handleScenePlayerInteraction);

    if (currentSceneConfig.gameLoopInterval) clearInterval(currentSceneConfig.gameLoopInterval);
    currentSceneConfig.gameLoopInterval = setInterval(sceneGameLoop, 16);
  }

  function hideScene() {
    if (!currentSceneConfig) return;

    currentSceneConfig.sceneElement.style.display = "none";
    mainView.style.display = "block";
    updateLocation(currentSceneConfig.key, currentSceneConfig.name); // Ana menüdeki başlığı güncelle
    stopGenericSceneTimer();

    document.removeEventListener("keydown", handleSceneKeyDown);
    document.removeEventListener("keyup", handleSceneKeyUp);
    document.removeEventListener("keydown", handleScenePlayerInteraction);

    clearInterval(currentSceneConfig.gameLoopInterval);
    currentSceneConfig.gameLoopInterval = null;
    for (let key in currentSceneConfig.movementKeys) currentSceneConfig.movementKeys[key] = false;

    currentSceneKey = null;
    currentSceneConfig = null;
  }


  // Olay Dinleyicileri
  interactiveHomeButton.addEventListener("click", () => showScene("home"));
  interactiveSchoolButton.addEventListener("click", () => showScene("school"));
  interactiveWorkButton.addEventListener("click", () => showScene("work"));

  // Sahne çıkış butonları için config üzerinden dinamik olarak atama
  Object.values(sceneConfigs).forEach(config => {
    if (config.exitButtonElement) {
      config.exitButtonElement.addEventListener("click", hideScene);
    }
  });

  // Başlangıç Ekranı Olayları
  startGameButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    mainView.style.display = "block"; // Ana görünümü göster
    initializeGame(); // Oyunu başlat
  });

  exitGameButton.addEventListener("click", () => {
    window.close(); // Pencereyi kapatmayı dene
    // Alternatif olarak, kullanıcıya bir mesaj gösterebilir veya başka bir işlem yapabilirsiniz.
    // console.log("Çıkış butonuna basıldı."); 
  });

  // Oyunu Başlat
  // initializeGame(); // Oyun artık doğrudan başlamayacak, başlangıç ekranından sonra başlayacak.
});
