const form = document.getElementById("contactForm");
const result = document.getElementById("formResult");
const submitButton = document.getElementById("submitButton");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessKey = form.querySelector('input[name="access_key"]').value.trim();

  if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
    showResult("Add your Web3Forms access key before testing the form.", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = "Sending...";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      form.reset();
      showResult("✓ Message sent successfully! I'll get back to you soon.", false);
    } else {
      showResult(data.message || "Something went wrong. Please try again.", true);
    }
  } catch (error) {
    showResult("Unable to send the message right now. Please try again.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "<span>➤</span> Send Message";
  }
});

function showResult(message, isError) {
  result.textContent = message;
  result.classList.toggle("error", isError);
  result.style.display = "block";
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
