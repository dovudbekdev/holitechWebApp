document.addEventListener("DOMContentLoaded", async function () {
    // Telegram Web App interfeysiga murojaat qilamiz
    window.telegramWebApp = window.Telegram.WebApp;

    // Telegram Web App buttonini sozlash
    window.telegramWebApp.ready();
    window.telegramWebApp.MainButton.setText("Tasdiqlash");
    window.telegramWebApp.MainButton.show();
    window.telegramWebApp.MainButton.onClick(async function () {
        await telegramWebApp.close();
    });
});
