const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const sendButton = document.getElementById('sendButton');
const installButton = document.getElementById('installButton');

function addMessage(text, who) {
  const article = document.createElement('article');
  article.className = `message ${who === 'user' ? 'user-message' : 'machine-message'}`;
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = who === 'user' ? 'NELSON' : 'MÁQUINA · LUMENOR';
  const body = document.createElement('p');
  body.textContent = text;
  article.append(label, body);
  messages.appendChild(article);
  article.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, 'user');
  addMessage('Esta interface já recebeu a tua mensagem, mas ainda não está ligada ao modelo de inteligência artificial. A próxima etapa é configurar essa ligação de forma segura, sem colocar chaves privadas no navegador.', 'machine');
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && window.matchMedia('(min-width: 700px)').matches) {
    event.preventDefault();
    form.requestSubmit();
  }
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});
