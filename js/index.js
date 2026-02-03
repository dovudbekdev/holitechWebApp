document.addEventListener("DOMContentLoaded", async function () {
  const startPage = document.getElementById("startPage");
  const errorPage = document.getElementById("errorPage");

  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("user_id");
  let projectId = urlParams.get("project_id");
  let duration = urlParams.get("duration");

  console.log("Project ID:", projectId);
  console.log("User ID:", userId);

  // POST so'rov yuborish
  try {
    if (userId && projectId && duration) {
      localStorage.setItem("project_id", projectId);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("duration", duration);
    } else {
      projectId = localStorage.getItem("project_id");
      userId = localStorage.getItem("user_id");
      duration = localStorage.getItem("duration");
    }

    console.log(userId, projectId);

    const response = await fetch(`${URL}/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        projectId: projectId,
        duration: duration,
      }),
    });

    console.log(response);

    if (response.ok) {
      window.location.href = "/success.html";
    } else if (response.status === 402) {
      window.location.href = "/card.html";
    } else if (response.status === 409) {
      window.location.href = "/subscription.html";
    } else if (response.status === 403) {
      console.log(true);
      startPage.classList.remove("active");
      errorPage.classList.add("active");
      const telegramWebApp = window.Telegram.WebApp;

      // Telegram Web App buttonini sozlash
      telegramWebApp.ready();
      telegramWebApp.MainButton.setText("Yopish");
      telegramWebApp.MainButton.show();
      telegramWebApp.MainButton.onClick(function () {
        telegramWebApp.close();
      });
    } else {
      window.location.href = "/error.html";
    }
  } catch (error) {
    window.location.href = "/error.html";
    console.error("Error:", error);
  }
});
