function injectOpenButton(videoId) {
  const existing = document.getElementById("yt-direct-link");
  if (existing) existing.remove();

  const link = document.createElement("a");
  link.id = "yt-direct-link";
  link.href = `https://www.youtube.com/watch?v=${videoId}`;
  link.textContent = "🔓 Abrir no YouTube";
  link.target = "_blank";

  Object.assign(link.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: 9999,
    padding: "8px 12px",
    background: "#000",
    color: "#0f0",
    fontWeight: "bold",
    borderRadius: "8px",
    boxShadow: "0 0 8px #0f0"
  });

  document.body.appendChild(link);
}

function extractVideoId(text) {
  const match = text.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function sendLoadVideoMessage(videoId) {
  const iframe = document.querySelector('iframe[id^="youtube-"]');
  if (!iframe) {
    alert("Iframe do YouTube não encontrado.");
    return;
  }

  const message = JSON.stringify({
    function: `player.loadVideoById("${videoId}")`
  });

  iframe.contentWindow.postMessage(message, "*");
  // injectOpenButton(videoId); // disabled, pretty useless
}


function setupDragAndDrop() {
  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    document.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  document.addEventListener("drop", (e) => {
    const data = e.dataTransfer.getData("text/plain");
    const videoId = extractVideoId(data);

    if (videoId) {
      sendLoadVideoMessage(videoId);
    } else {
      alert("Nenhum link do YouTube válido foi detectado.");
    }
  });
}

function init() {
  const iframe = document.querySelector('iframe[id^="youtube-"]');
  const srcdoc = iframe?.getAttribute("srcdoc");
  if (typeof srcdoc === "string") {
    // tenta extrair vídeo carregado do srcdoc (pode ser difícil)
    // melhor extrair do player via postMessage, mas aqui só um placeholder:
    // vamos assumir que não sabemos e só injetar o botão com vídeo padrão
  }

  // Pode tentar obter vídeo atual via postMessage se quiser (mais complexo)
  // Por enquanto só habilita drag and drop e botão ao carregar novo vídeo

  setupDragAndDrop();
}

window.addEventListener("load", () => {
  setTimeout(init, 1000);
  // alert("Injector by HouseY2K - modo alteração via postMessage"); // disabled, pretty annoying
});
