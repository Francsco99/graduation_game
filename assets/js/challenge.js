// Mostra la richiesta di consenso per i cookie e per audio/video al caricamento della pagina
window.onload = function() {
  // Verifica se l'utente ha già dato il consenso
  if (!getCookie("userConsent")) {
    // Chiedi il consenso all'utente per cookie e audio/video
    Swal.fire({
      title: 'Consenso per cookie',
      html: `
        <img class="swal-media" src="assets/challenge/cookie_monster.gif"></img>
        <p>Per una migliore esperienza, utilizziamo i cookie e richiediamo il permesso di riprodurre audio/video. Accetti?</p>
      `,
      icon: 'question',
      confirmButtonText: 'Accetta',
      // Non mettiamo il pulsante "Rifiuta", quindi non serve gestirlo
    }).then(() => {
      // Memorizza il consenso nei cookie
      setCookie("userConsent", "accepted", 365);

      // Mostra il tutorial con l'interazione
      showTutorial(true);
    });
  } else {
    // Se il consenso è già stato dato, mostra il tutorial direttamente
    const consentGiven = getCookie("userConsent") === "accepted";
    showTutorial(consentGiven);
  }

  // Inizializza il numero di tips usate se il cookie non esiste
  if (!getCookie("tipsUsed")) {
    setCookie("tipsUsed", "0", 1);
  }
};

// Funzione per mostrare il tutorial
function showTutorial(consentGiven = true) {
  Swal.fire({
    title: 'Benvenuto alla challenge!',
    html: `
      <div style="display: flex; justify-content: center; align-items: center; padding: 10px;">
        <video class="swal-media" id="introVideo" playsinline autoplay muted loop
          style="width: 100%; max-width: 500px;" 
          src="assets/challenge/challenge_cropped.mp4">
        </video>
      </div>
      <div style="text-align: left; margin-top: 10px;">
        <p><strong>Regole del gioco:</strong></p>
        <ul>
          <li>Inserisci le risposte corrette</li>
          <li>Hai a disposizione solamente <strong>2 tips</strong>, usale con cautela!</li>
          <li>Puoi provare a vedere se hai vinto tutte le volte che vuoi</li>
          <li>I primi tre classificati vinceranno un altro</li>
        </ul>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Iniziamo!',
    didOpen: () => {
      let video = document.getElementById("introVideo");

      if (consentGiven) {
        let introAudio = new Audio("assets/challenge/intro_audio.mp3");

        // Avvia il video e audio se il consenso è stato dato
        video.muted = false;

        // La riproduzione del video/audio deve essere avviata tramite interazione
        Swal.getConfirmButton().addEventListener("click", () => {
          video.play().catch(error => console.log("Errore nel riprodurre il video:", error));
          introAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));
        });
      } else {
        // Se il consenso è negato, il video è silenziato e l'audio non parte
        video.muted = true; 
      }
    }
  });
}


// Funzione per gestire la visualizzazione delle tips (ora ne concede 2)
function showTip(id) {
  let tipsUsed = parseInt(getCookie("tipsUsed")) || 0;

  if (tipsUsed >= 2) {
    Swal.fire({
      icon: 'warning',
      title: 'Attenzione!',
      text: 'Hai già usato entrambe le tue tips!',
    });
  } else {
    document.getElementById('tip' + id).style.display = "block";
    setCookie("tipsUsed", (tipsUsed + 1).toString(), 1); // Aggiorna il numero di tips usate
  }
}

// Verifica risposte
function checkAnswers() {
  const answers = {
    challenge1: "16",
    challenge2: "vacca",
    challenge3: "198",
    challenge4: "4",
    challenge5: "25",
    challenge6: "", // Permettiamo qualsiasi valore
    challenge7: "ajalab",
    challenge8: "orma",
    challenge9: "suvaziendali",
    challenge10: "32",
  };

  let allCorrect = true;

  for (let key in answers) {
    let userAnswer = document.getElementById(key).value.trim().toLowerCase().replace(/\s+/g, "");

    // Challenge 6 viene sempre considerata corretta
    if (key !== "challenge6" && userAnswer !== answers[key].toLowerCase().replace(/\s+/g, "")) {
      allCorrect = false;
    }
  }

  if (allCorrect) {
    let victoryAudio = new Audio("assets/challenge/rat_dance.mp3"); // Sostituisci con il tuo file audio
    victoryAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));

    Swal.fire({
      icon: 'success',
      title:'Hai superato tutte le sfide!',
      html:`
      <img class="swal-media" src="assets/challenge/rat_dance.gif" alt="Winner">
      `,
    }).then(() => {
      // Ferma la canzone quando l'utente chiude l'alert
      if (victoryAudio) {
        victoryAudio.pause();
        victoryAudio.currentTime = 0; // Riavvia da inizio se viene riprodotta di nuovo
      }
    });
  } else {
    let lostAudio = new Audio("assets/challenge/sad_hamster.mp3"); // Sostituisci con il tuo file audio
    lostAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));
    
    Swal.fire({
      icon: 'error',
      title: 'Oh no, alcune risposte sono sbagliate!',
      html:`
      <img class="swal-media" width="50%" src="assets/challenge/sad_hamster.jpg" alt="Winner">
      `,
    }).then(() => {
      // Ferma la canzone quando l'utente chiude l'alert
      if (lostAudio) {
        lostAudio.pause();
        lostAudio.currentTime = 0; // Riavvia da inizio se viene riprodotta di nuovo
      }
    });
  }
}

// Funzione per gestire i cookie
function setCookie(name, value, hours) {
  let expires = "";
  if (hours) {
    let date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + "; path=/" + expires;
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Disabilita il pulsante di verifica finché non sono compilati tutti i campi
function checkInputs() {
  let allFilled = true;
  for (let i = 1; i <= 10; i++) { // Ora abbiamo 10 sfide
    let input = document.getElementById("challenge" + i);
    if (!input.value.trim()) {
      allFilled = false;
      break;
    }
  }
  document.getElementById("verifyButton").disabled = !allFilled;
}
