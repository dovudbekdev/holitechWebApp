function adjustButtonPosition() {
    const checkoutButton = document.querySelector(".checkout");
    if (window.visualViewport) {
        const bottomPadding = window.visualViewport.height - window.innerHeight;
        checkoutButton.style.bottom = `${20 + bottomPadding}px`;
    }
}

window.addEventListener("resize", adjustButtonPosition);
window.addEventListener("focusin", adjustButtonPosition);
window.addEventListener("focusout", () => {
    document.querySelector(".checkout").style.bottom = "20px";
});

adjustButtonPosition();
