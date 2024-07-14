import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, onValue } from "firebase/database";

/// Replace the configuration with your own Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyBshSfkcAi6nx6BV3yg9cFGev7ioF_fV9M",
  authDomain: "webchatting-99923.firebaseapp.com",
  projectId: "webchatting-99923",
  storageBucket: "webchatting-99923.appspot.com",
  messagingSenderId: "521514629601",
  appId: "1:521514629601:web:d460da0fa862c316ffbaa0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const chatRef = database.ref('chat');

// Function to send a new chat message
export function sendMessage() {
  const message = document.getElementById('chat-input').value.trim();
  const nickname = document.getElementById('nickname-input').value.trim();

  if (message !== '' && nickname !== '') {
    const newMessage = {
      nickname: nickname,
      message: message,
      timestamp: new Date().toLocaleString()
    };

    // Add the new message to the Realtime Database
    chatRef.child('messages').push(newMessage);
    document.getElementById('chat-input').value = '';
  }
}

// Listen for new chat messages
chatRef.child('messages').on('value', (snapshot) => {
  const messages = snapshot.val();
  if (messages) {
    Object.values(messages).forEach((message) => {
      displayMessage(message.nickname, message.message, message.timestamp);
    });
  }
});

// Function to display a new chat message
function displayMessage(nickname, message, timestamp) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${timestamp} - ${nickname}: ${message}`;
  document.getElementById('chat-messages').appendChild(messageElement);
}