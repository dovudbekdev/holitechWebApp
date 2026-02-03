document.addEventListener("DOMContentLoaded", async function () {
  const verifyCardPage = document.getElementById("verifyCardPage");
  const startPage = document.getElementById("startPage");
  const verifyInfo = document.querySelector(".verify-info");

  // BACKEND_URL = "https://launchpro.uz";
  // BACKEND_URL = "https://3dc3-178-218-201-46.ngrok-free.app"

  async function submitForm() {
    verifyCardPage.classList.remove("active");
    startPage.classList.add("active");

    const userId = localStorage.getItem("user_id");

    const verificationCode = document.querySelector(
      "input[name='verificationCode']"
    ).value;

    const response = await fetch(`${URL}/confirm-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        smsCode: verificationCode,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.ok) {
      window.location.href = "/";
    } else if (response.status === 403) {
      verifyInfo.textContent = "Sms kod xato, qayta urinib ko'ring";
      startPage.classList.remove("active");
      verifyCardPage.classList.add("active");
    } else if (response.status === 404) {
      console.log(data);
      window.location.href = "/error.html";
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
