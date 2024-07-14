let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
let nickname = localStorage.getItem('nickname') || "";

// Заполняем поле ввода никнейма, если он есть в localStorage
document.getElementById('nickname-input').value = nickname;

// Функция отображения сообщений
function displayMessages() {
  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML = '';
  chatMessages.forEach(msg => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
    chatContainer.appendChild(messageElement);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Функция отправки сообщения
function sendMessage() {
  const message = document.getElementById('chat-input').value.trim();
  const nicknameInput = document.getElementById('nickname-input').value.trim();

  if (message !== '' && nicknameInput !== '') {
    const newMessage = {
      nickname: nicknameInput,
      message: message,
      timestamp: new Date().toLocaleString()
    };
    chatMessages.push(newMessage);
    saveMessages();
    document.getElementById('chat-input').value = '';
    displayMessages(); // Переместили вызов displayMessages() сюда
  }
}

// Функция сохранения сообщений
function saveMessages() {
  localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  localStorage.setItem('nickname', document.getElementById('nickname-input').value);
}

// Вызываем функцию отображения сообщений при загрузке страницы
displayMessages();