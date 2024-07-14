let db;
let messages = [];
let nickname = '';

// Инициализация базы данных
async function initializeDatabase() {
  // Открываем базу данных
  db = await new Promise((resolve, reject) => {
    const request = window.indexedDB.open('chatDB', 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

  // Загружаем сообщения из базы данных
  await loadMessagesFromDB();
}

// Загрузка сообщений из базы данных
async function loadMessagesFromDB() {
  const transaction = db.transaction(['messages'], 'readonly');
  const objectStore = transaction.objectStore('messages');
  const request = objectStore.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      messages = event.target.result;
      displayMessages();
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Сохранение сообщения в базе данных
async function saveMessageToDB(message) {
  const transaction = db.transaction(['messages'], 'readwrite');
  const objectStore = transaction.objectStore('messages');
  const request = objectStore.add(message);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Отображение сообщений
function displayMessages() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    const nicknameElement = document.createElement('div');
    nicknameElement.classList.add('nickname');
    nicknameElement.textContent = message.nickname;

    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.textContent = message.text;

    messageElement.appendChild(nicknameElement);
    messageElement.appendChild(textElement);
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Отправка сообщения
async function sendMessage() {
  const nicknameInput = document.getElementById('nickname-input');
  const chatInput = document.getElementById('chat-input');
  const message = {
    nickname: nicknameInput.value.trim() || 'Anonymous',
    text: chatInput.value.trim()
  };
  if (message.text) {
    await saveMessageToDB(message);
    messages.push(message);
    chatInput.value = '';
    displayMessages();
  }
}

initializeDatabase();