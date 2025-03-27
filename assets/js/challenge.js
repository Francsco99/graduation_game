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

  function showTip(id) {
    if (getCookie("tipUsed")) {
      alert("Hai già usato la tua tip!");
    } else {
      document.getElementById('tip' + id).style.display = "block";
      setCookie("tipUsed", "true", 1); // Il cookie scade dopo 1 ora
    }
  }

  function checkInputs() {
    let allFilled = true;
    for (let i = 1; i <= 5; i++) {
      let input = document.getElementById("challenge" + i);
      if (!input.value.trim()) {
        allFilled = false;
        break;
      }
    }
    document.getElementById("verifyButton").disabled = !allFilled;
  }

  function checkAnswers() {
    const answers = {
      challenge1: "16",
      challenge2: "corretta", // puoi cambiare la parola giusta
      challenge3: "198",
      challenge4: "Wenzhou",
      challenge5: "25"
    };

    let allCorrect = true;

    for (let key in answers) {
      let userAnswer = document.getElementById(key).value.trim();
      if (userAnswer.toLowerCase() !== answers[key].toLowerCase()) {
        allCorrect = false;
      }
    }

    if (allCorrect) {
      document.getElementById("result").innerHTML = "🎉 Hai superato tutte le sfide! 🎉";
    } else {
      document.getElementById("result").innerHTML = "❌ Alcune risposte sono errate. Riprova!";
    }
  }