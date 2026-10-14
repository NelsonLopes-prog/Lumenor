# LUMENOR — primeira versão da interface

Interface web instalável (PWA), em português europeu, para telemóvel e Chromebook.

## Estado desta versão
- A imagem oficial enviada foi copiada para `assets/lumenor-oficial.jpg` sem alterações.
- Interface adaptável a ecrãs móveis e computador.
- Conversa visual de demonstração.
- Manifesto e service worker para instalação e cache básica.
- **Ainda não existe ligação a um modelo de IA**, nem gravação persistente de conversas. O envio de mensagens é apenas uma demonstração local.

## Testar localmente
O service worker e a instalação PWA exigem `https://` ou `localhost`. Abrir diretamente `index.html` permite ver o aspeto, mas não ativa todas as funções PWA.

Com Python instalado, dentro desta pasta:
```bash
python -m http.server 8000
```
Depois abrir `http://localhost:8000`.

## Publicação
Para instalar no Android/Chromebook, publicar a pasta num alojamento HTTPS, por exemplo GitHub Pages. O próximo passo de desenvolvimento é ligar o formulário a um backend seguro. Não colocar chaves de API em `app.js` ou noutro ficheiro enviado ao navegador.
