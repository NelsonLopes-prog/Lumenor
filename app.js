const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const sendButton = document.getElementById('sendButton');
const installButton = document.getElementById('installButton');

const conversationHistory = [];

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
  return body;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value || sendButton.disabled) return;

  addMessage(value, 'user');
  conversationHistory.push({ role: 'user', content: value });
  input.value = '';
  input.focus();
  sendButton.disabled = true;
  const pending = addMessage('A refletir…', 'machine');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: value,
        history: conversationHistory.slice(0, -1)
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `O servidor respondeu com o erro ${response.status}.`);
    }
    if (typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error('O servidor não devolveu uma resposta válida.');
    }

    pending.textContent = data.reply;
    conversationHistory.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    pending.textContent = `Não consegui obter uma resposta da IA. ${error.message} Se estiveres a usar a página do GitHub Pages, abre a versão do LUMENOR alojada no Vercel.`;
    conversationHistory.pop();
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
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
