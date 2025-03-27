console.clear();

const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

const frameCount = 135;

// Imposta il canvas per adattarsi a 100vh
function resizeCanvas() {
  canvas.width = window.innerWidth;  // Imposta la larghezza del canvas uguale a quella della finestra
  canvas.height = window.innerHeight;  // Imposta l'altezza del canvas uguale a quella della finestra
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const currentFrame = (index) =>
  `assets/images/frame_${(index + 1).toString().padStart(5, "0")}.jpg`;  // Aggiungi padStart a 5 cifre per uniformare i nomi dei file

const images = [];
const box = {
  frame: 0
};

// Carica tutte le immagini nella lista
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i); // Ora carica le immagini dalla cartella assets/images
  images.push(img);
}

// Impostazione animazione GSAP
gsap.to(box, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".canvas-container",
    start: "top top",
    end: "+=3500",
    //markers: true,
    pin: true,
    scrub: 0.5
  },
  onUpdate: render // usa onUpdate di gsap invece di scrollTrigger's onUpdate
});

images[0].onload = render;

// Funzione di rendering aggiornata
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const img = images[box.frame];
  
  // Calcola l'aspect ratio dell'immagine
  const imgAspectRatio = img.width / img.height;
  
  // Calcola la larghezza in base all'altezza del canvas mantenendo l'aspect ratio
  const newHeight = canvas.height;
  const newWidth = newHeight * imgAspectRatio;

  // Se la larghezza dell'immagine è maggiore della larghezza del canvas, ridimensiona
  if (newWidth > canvas.width) {
    const newWidth = canvas.width;
    const newHeight = newWidth / imgAspectRatio;
  }

  // Centra l'immagine
  const xOffset = (canvas.width - newWidth) / 2;
  const yOffset = 0; // L'immagine è sempre centrata verticalmente

  context.drawImage(img, xOffset, yOffset, newWidth, newHeight); // Ridimensiona l'immagine al canvas
}
