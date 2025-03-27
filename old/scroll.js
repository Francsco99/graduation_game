gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

const totalFrames = 135;
const currentFrame = index => (
  `assets/images/frame_${(index + 1).toString().padStart(5, '0')}.jpg` // Il percorso delle immagini
);

const images = [];
const box = { frame: 0 };

// Calcolare il rapporto di aspetto dell'immagine
const img = new Image();
img.src = currentFrame(0); // Carica la prima immagine per determinare il rapporto di aspetto
let aspectRatio;

img.onload = () => {
  aspectRatio = img.width / img.height; // Rapporto larghezza / altezza

  // Carica tutte le immagini
  for (let i = 0; i < totalFrames; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Ridimensiona il canvas in base all'altezza (100% della finestra) e al rapporto di aspetto
  resizeCanvas();
  render(); // Renderizza il primo frame
}

// Funzione per ridimensionare il canvas
function resizeCanvas() {
  canvas.height = window.innerHeight; // Imposta l'altezza del canvas al 100% della finestra
  canvas.width = canvas.height * aspectRatio; // Imposta la larghezza in base al rapporto di aspetto
  render(); // Ridisegna l'immagine una volta ridimensionato
}

// Funzione per rendere l'immagine sul canvas
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[box.frame], 0, 0, canvas.width, canvas.height); // Disegna l'immagine
}

// Inizializza l'animazione con ScrollTrigger
gsap.to(box, {
  frame: totalFrames - 1, // Arriva all'ultimo frame
  snap: "frame", // Snap alla posizione del frame
  ease: "none", // Nessuna animazione di easing, quindi l'animazione sarà lineare
  scrollTrigger: {
    trigger: ".image-section", // L'elemento che triggera lo scroll
    start: "top top", // Quando l'inizio dell'elemento è visibile nella parte superiore della finestra
    end: "bottom top", // Quando la fine dell'elemento arriva alla parte superiore della finestra
    scrub: 0.5, // Lega l'animazione alla posizione di scroll
    onUpdate: () => render(),
    onComplete: () => {
      // Una volta terminata l'animazione, abilita lo scroll normale
      document.body.style.overflow = 'auto'; // Riabilita lo scroll della pagina
    },
    onEnterBack: () => {
      // Quando si ritorna indietro, disabilita di nuovo il comportamento di scroll
      document.body.style.overflow = 'hidden'; // Disabilita temporaneamente lo scroll
    }
  }
}); // Chiamata alla funzione render ogni volta che lo scroll cambia

document.body.style.overflow = 'hidden';

// Aggiungi animazione per il pulsante
document.getElementById("first-button").addEventListener("click", function(event) {
  setTimeout(function() {
    const secondButton = document.getElementById("second-button");
    secondButton.classList.remove("d-none");

    // Animazione pulsazione con zoom e yoyo
    gsap.to(secondButton, {
      scale: 1.2, // Ingrandisce il pulsante
      duration: 0.6, // Durata dell'animazione
      repeat: -1, // Ripete all'infinito
      yoyo: true, // Torna alla dimensione originale
      ease: "power1.inOut" // Easing morbido
    });

  }, 3000); // Aspetta 3 secondi prima di mostrare il secondo pulsante
});

// Ridimensiona il canvas all'avvio e quando la finestra cambia dimensione
window.addEventListener("resize", resizeCanvas);
