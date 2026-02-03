document.addEventListener("DOMContentLoaded", async function () {
  const startPage = document.getElementById("startPage");
  const addCardPage = document.getElementById("addCardPage");
  const errorInfo = document.getElementById("errorInfo");

  const firstInput = document.querySelector(".input_field");
  if (firstInput) {
    firstInput.focus();
  }

  // BACKEND_URL = "https://launchpro.uz";
  // const BACKEND_URL = "https://3dc3-178-218-201-46.ngrok-free.app"

  const urlParams = new URLSearchParams(window.location.search);
  const addCardUserId = urlParams.get("add_card_user_id");

  localStorage.setItem("add_card_user_id", addCardUserId);

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
      userId = addCardUserId;
    }

    let cardNumber = document.querySelector("input[name='cardNumber']").value;
    const expiryDate = document.querySelector("input[name='expiryDate']").value;

    // Kartani qo'shish so'rovini yuborish
    if (validateForm(cardNumber, expiryDate)) {
      cardNumber = cardNumber.replace(/\D/g, "");
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
      data = await response.json();

      if (data.ok) {
        window.location.href = "/verify.html";
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
    }
  }

  document.querySelector(".checkout").addEventListener("click", function (e) {
    e.preventDefault(); // Formani avtomatik yuborilishini oldini olish
    submitForm(); // Formani yuborish funksiyasini chaqirish
  });

  // Telegram Web App interfeysiga murojaat qilamiz
  window.telegramWebApp = window.Telegram.WebApp;

  // Telegram Web App buttonini sozlash
  window.telegramWebApp.ready();
  window.telegramWebApp.MainButton.setText("Tasdiqlash");
  window.telegramWebApp.MainButton.show();
  window.telegramWebApp.MainButton.onClick(async function () {
    await submitForm();
  });
});
