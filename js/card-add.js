document.addEventListener("DOMContentLoaded", async function () {
  const startPage = document.getElementById("startPage");
  const addCardPage = document.getElementById("addCardPage");
  const errorInfo = document.getElementById("errorInfo");

  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("user_id");
  localStorage.setItem("user_id", userId);

  const firstInput = document.querySelector(".input_field");
  if (firstInput) {
    firstInput.focus();
  }

  // BACKEND_URL = "https://launchpro.uz";
  // const BACKEND_URL = "https://3dc3-178-218-201-46.ngrok-free.app"

  document.getElementById("cardNumber").addEventListener("input", function (e) {
    let val = this.value;
    val = val.replace(/\D/g, ""); // Remove non-digit characters
    let formattedValue = "";
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue += val[i];
    }
    this.value = formattedValue;
  });

  document.getElementById("expiryDate").addEventListener("input", function () {
    const input = this.value.replace(/\D/g, "").substring(0, 4); // Remove non-digits and limit to 4 characters
    const month = input.substring(0, 2);
    const year = input.substring(2, 4);

    if (input.length > 2) {
      this.value = `${month}/${year}`;
    } else {
      this.value = month;
    }
  });

  function validateForm(cardNumber, expiryDate) {
    let valid = true;
    let currentDate = new Date();
    let [month, year] = expiryDate.split("/").map(Number);
    let expiryDateObj = new Date(`20${year}`, month - 1);

    document.querySelectorAll(".error_message").forEach((el) => el.remove());
    document
      .querySelectorAll(".input_error")
      .forEach((el) => el.classList.remove("input_error"));

    cardNumber = cardNumber.replace(/\D/g, "");

    if (!/^\d{16}$/.test(cardNumber)) {
      showError("cardNumber", "Karta raqami noto'g'ri");
      valid = false;
    }
    if (
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate) ||
      expiryDateObj < currentDate
    ) {
      showError("expiryDate", "Amal qilish muddati yaroqsiz.");
      valid = false;
    }

    return valid;
  }

  function showError(inputName, message) {
    const input = document.querySelector(`input[name='${inputName}']`);
    input.classList.add("input_error");
    const error = document.createElement("div");
    error.classList.add("error_message");
    error.innerText = message;
    input.parentNode.appendChild(error);
  }

  async function submitForm() {
    addCardPage.classList.remove("active");
    startPage.classList.add("active");

    let userId = localStorage.getItem("user_id");

    if (userId == null) {
      console.error("User ID is missing");
      return;
    }

    let cardNumber = document.querySelector("input[name='cardNumber']").value;
    const expiryDate = document.querySelector("input[name='expiryDate']").value;

    // Kartani qo'shish so'rovini yuborish
    if (validateForm(cardNumber, expiryDate)) {
      cardNumber = cardNumber.replace(/\D/g, "");
      try {
        const response = await fetch(`${URL}/card-add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            cardName: "launchpro",
            cardNumber: cardNumber,
            expiryDate: expiryDate,
          }),
        });
        const data = await response.json();

        if (data.ok) {
          window.location.href = "/verify2.html";
        } else if (response.status === 403) {
          const inputs = document.querySelectorAll(".input_field");
          inputs.forEach((input) => {
            input.style.borderColor = "red";
          });
          errorInfo.textContent = "Karta ma'lumotlari to'g'riligini tekshiring";
          startPage.classList.remove("active");
          addCardPage.classList.add("active");
        }
        // else if (response.status === 404) {
        //     window.location.href = "/error.html";
        // }
      } catch (error) {
        console.error("Error submitting form: ", error);
        errorInfo.textContent =
          "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";
      }
    }
  }

  document.querySelector(".checkout").addEventListener("click", function (e) {
    e.preventDefault(); // Formani avtomatik yuborilishini oldini olish
    submitForm(); // Formani yuborish funksiyasini chaqirish
  });

  // // Telegram Web App interfeysiga murojaat qilamiz
  // const telegramWebApp = window.Telegram.WebApp;

  // // Telegram Web App buttonini sozlash
  // telegramWebApp.ready();
  // telegramWebApp.MainButton.setText("Tasdiqlash");
  // telegramWebApp.MainButton.show();
  // telegramWebApp.MainButton.onClick(async function () {
  //   await submitForm();
  // });
  if (window.Telegram && window.Telegram.WebApp) {
    const telegramWebApp = window.Telegram.WebApp;
    telegramWebApp.expand(); // **Web App'ni to'liq ekran qilish**
    telegramWebApp.ready();

    telegramWebApp.MainButton.setText("Tasdiqlash");
    telegramWebApp.MainButton.show();
    telegramWebApp.MainButton.onClick(async function () {
      await submitForm();
    });

    console.log("Telegram Web App interfeysi yuklandi.");
  } else {
    console.error("Telegram Web App aniqlanmadi.");
  }
});
