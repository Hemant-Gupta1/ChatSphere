const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if (position === 'left') {
        console.log('sound is playing');
        audio.play();
    }
}

// Initialize EmojioneArea and get the instance
$(document).ready(function () {
    const emojioneAreaInstance = $("#messageInp").emojioneArea({
        pickerPosition: "top"
    }).data("emojioneArea");

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim(); // Trim to remove leading/trailing spaces
        if (!message) {
            return; // Return early if message is empty
        }
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        emojioneAreaInstance.setText('');
    });

    const name = prompt("Enter your name to join LetsChat");
    socket.emit('new-user-joined', name);

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');
    });

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left');
    });

    socket.on('left', name => {
        append(`${name} left the chat`, 'left');
    });
});
