// Mostra il tutorial al caricamento della pagina
window.onload = function() {
  Swal.fire({
    title: 'Benvenuto alla challenge!',
    html: `
      <div style="text-align: left;">
        <p><strong>Regole del gioco:</strong></p>
        <ul>
          <li>Inserisci le risposte corrette</li>
          <li>Hai a disposizione solamente <strong>2 tips</strong>, usale con cautela!</li>
          <li>Puoi provare a vedere se hai vinto tutte le volte che vuoi</li>
        </ul>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Iniziamo!'
  });

  // Inizializza il numero di tips usate se il cookie non esiste
  if (!getCookie("tipsUsed")) {
    setCookie("tipsUsed", "0", 1);
  }
};

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
    challenge2: "vacca", // esempio, puoi cambiare la parola giusta
    challenge3: "198",
    challenge4: "4",
    challenge5: "25",
    challenge6: "3", // esempio per il nerdle, inserisci il numero giusto
    challenge7: "ajalab",
    challenge8: "orma",
    challenge9: "suvaziendali", // Rimosso spazio per validazione corretta
    challenge10: "32",
  };

  let allCorrect = true;

  for (let key in answers) {
    let userAnswer = document.getElementById(key).value.trim().toLowerCase().replace(/\s+/g, "");
    if (userAnswer !== answers[key].toLowerCase().replace(/\s+/g, "")) {
      allCorrect = false;
    }
  }

  if (allCorrect) {
    Swal.fire({
      icon: 'success',
      title:'Hai superato tutte le sfide!',
      html:`
      <img src="assets/challenge/rat-dance.gif" alt="Winner">
      `,
    }).then(() => {
      window.location.href = "leaderboard.html"; // Reindirizza alla classifica
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oh no!',
      text: 'Alcune risposte sono errate. Riprova!',
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
