    const menuIcon = document.getElementById("menuIcon");
    const mobileNav = document.getElementById("mobileNav");
        menuIcon.addEventListener("click", () => {
        if (mobileNav.style.display === "flex") {
        mobileNav.style.display = "none";
        } else {
        mobileNav.style.display = "flex";
        }
        });