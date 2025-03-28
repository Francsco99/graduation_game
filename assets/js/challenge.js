let introAudio, victoryAudio, lostAudio, tipsAudio;  // Variabili per gli audio

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
        <img class="swal-media" id="introGif" src="assets/challenge/challenge_cropped.gif" 
          style="width: 100%; max-width: 500px;">
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <p><strong>Regole del gioco:</strong></p>
        <p>Sfide da affrontare, senza paura,
          <br>con risposte giuste, la vittoria è una fortuna!
          <br>Hai delle tips a disposizione, usale con saggezza,
          <br>per arrivare in cima, serve molta destrezza!
          <br>Puoi tentare e riprovare, senza alcun paura,
          <br>i primi tre a vincere festeggeranno con un'altra bevuta!</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Iniziamo!',
    didOpen: () => {
      // Crea gli oggetti audio
      introAudio = new Audio("assets/challenge/challenge_cropped.mp3");
      victoryAudio = new Audio("assets/challenge/rat_dance.mp3");
      lostAudio = new Audio("assets/challenge/sad_hamster.mp3");
      tipsAudio = new Audio("assets/challenge/spinning_cat.mp3");

      // Impostiamo tutti gli audio in loop
      introAudio.loop = true;
      victoryAudio.loop = true;
      lostAudio.loop = true;
      tipsAudio.loop = true;

      // Avvia l'audio di intro
      introAudio.play().catch(error => console.log("Errore nel riprodurre l'audio di intro:", error));

      // Ferma gli audio quando l'utente chiude il popup
      Swal.getConfirmButton().addEventListener("click", () => {
        stopAllAudio();
      });
    },
    willClose: () => {
      // Quando il popup si chiude, fermiamo gli audio
      stopAllAudio();
    }
  });
}

// Funzione per fermare tutti gli audio
function stopAllAudio() {
  if (introAudio) {
    introAudio.pause();
    introAudio.currentTime = 0; // Riavvia da inizio se viene riprodotto di nuovo
  }
  if (victoryAudio) {
    victoryAudio.pause();
    victoryAudio.currentTime = 0; // Riavvia da inizio se viene riprodotto di nuovo
  }
  if (lostAudio) {
    lostAudio.pause();
    lostAudio.currentTime = 0; // Riavvia da inizio se viene riprodotto di nuovo
  }
  if (tipsAudio) {
    tipsAudio.pause();
    tipsAudio.currentTime = 0; // Riavvia da inizio se viene riprodotto di nuovo
  }
}

// Funzione per gestire la visualizzazione delle tips (ora ne concede 2)
function showTip(id) {
  let tipsUsed = parseInt(getCookie("tipsUsed")) || 0;

  if (tipsUsed >= 2) {
    tipsAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));
    Swal.fire({
      icon: 'warning',
      title: 'Hai gia usato tutte le tue tips!',
      html:`
      <img width="50%" class="swal-media" src="assets/challenge/spinning_cat.gif" alt="Tips">
      `,
    }).then(() => {
      stopAllAudio(); // Ferma gli audio quando l'utente chiude l'alert
    });

    // Avvia il timer di 45 secondi per mostrare il messaggio di aiuto
    let seconds = 45;  // Timer di 45 secondi
    
    // Controlla se il cookie per il Rickroll è stato settato
    if (!getCookie("rickrollShown")) {
      let timerInterval = setInterval(() => {
        console.log(`Timer: ${seconds} secondi rimasti`);
        seconds--;
        
        if (seconds <= 0) {
          clearInterval(timerInterval);
          // Mostra il messaggio di aiuto dopo 45 secondi
          Swal.fire({
            title: 'Vedo che sei in difficoltà!',
            text: 'Clicca qui per ottenere un\'altra tip!',
            confirmButtonText: 'Ottieni un\'altra tip',
            icon: 'info',
            preConfirm: () => {
              // Link scherzoso che manda a una pagina esterna (Rickroll)
              window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0"; // Link scherzo (Rickroll)
            }
          });

          // Imposta il cookie per evitare che lo Swal venga mostrato di nuovo
          setCookie("rickrollShown", "true", 365); // Imposta il cookie per un anno
        }
      }, 1000); // Ogni secondo, quindi 1000 millisecondi
    }
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
    victoryAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));

    Swal.fire({
      icon: 'success',
      title:'Hai superato tutte le sfide!',
      html:`
      <img class="swal-media" src="assets/challenge/rat_dance.gif" alt="Winner">
      `,
    }).then(() => {
      stopAllAudio(); // Ferma gli audio quando l'utente chiude l'alert
    });
  } else {
    lostAudio.play().catch(error => console.log("Errore nel riprodurre l'audio:", error));
    
    Swal.fire({
      icon: 'error',
      title: 'Oh no, alcune risposte sono sbagliate!',
      html:`
      <img class="swal-media" width="50%" src="assets/challenge/sad_hamster.jpg" alt="Winner">
      `,
    }).then(() => {
      stopAllAudio(); // Ferma gli audio quando l'utente chiude l'alert
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
