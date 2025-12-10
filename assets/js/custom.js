document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector(".php-email-form");
  if (!form) return;

  // Inputs
  const nameInput = form.querySelector('input[name="name"]');
  const surnameInput = form.querySelector('input[name="surname"]');
  const emailInput = form.querySelector('input[name="email"]');
  const addressInput = form.querySelector('input[name="address"]');
  const phoneInput = form.querySelector('input[name="phone"]');

  const rating1 = form.querySelector('input[name="rating1"]');
  const rating2 = form.querySelector('input[name="rating2"]');
  const rating3 = form.querySelector('input[name="rating3"]');

  const submitBtn = form.querySelector('button[type="submit"]');
  const resultsBox = document.getElementById("formResults");

  submitBtn.disabled = true; // initially disabled

  /* -------------------------
        ERROR HANDLING
  --------------------------*/
  function showError(input, message) {
    input.style.border = "2px solid red";

    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-text")) {
      const err = document.createElement("small");
      err.className = "error-text";
      err.style.color = "red";
      err.innerText = message;
      input.after(err);
    }
  }

  function clearError(input) {
    input.style.border = "2px solid green";
    if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-text")) {
      input.nextElementSibling.remove();
    }
  }

  /* -------------------------
        VALIDATION FUNCTIONS
  --------------------------*/
  function validateName() {
    const regex = /^[A-Za-z\s]+$/;
    if (!nameInput.value.trim()) return showError(nameInput, "Name required"), false;
    if (!regex.test(nameInput.value)) return showError(nameInput, "Only letters allowed"), false;
    clearError(nameInput);
    return true;
  }

  function validateSurname() {
    const regex = /^[A-Za-z\s]+$/;
    if (!surnameInput.value.trim()) return showError(surnameInput, "Surname required"), false;
    if (!regex.test(surnameInput.value)) return showError(surnameInput, "Only letters allowed"), false;
    clearError(surnameInput);
    return true;
  }

  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) return showError(emailInput, "Email required"), false;
    if (!regex.test(emailInput.value)) return showError(emailInput, "Invalid email"), false;
    clearError(emailInput);
    return true;
  }

  function validateAddress() {
    if (addressInput.value.trim().length < 5) return showError(addressInput, "Address too short"), false;
    clearError(addressInput);
    return true;
  }

  /* -------------------------
      PHONE MASK + VALIDATION
  --------------------------*/
  function validatePhone() {
    let val = phoneInput.value.replace(/\D/g, "");

    if (val.startsWith("370")) val = val.slice(3);
    if (val.length > 8) val = val.slice(0, 8);

    if (val.length > 0) {
      phoneInput.value = "+370 " + val.replace(/(\d{3})(\d{0,5})/, "$1 $2").trim();
    }

    if (val.length !== 8) {
      showError(phoneInput, "Invalid Lithuanian number");
      return false;
    }

    clearError(phoneInput);
    return true;
  }

  /* -------------------------
        RATING VALIDATION
  --------------------------*/
  function validateRatings() {
    const nums = [rating1, rating2, rating3];
    let ok = true;

    nums.forEach(input => {
      const v = Number(input.value);
      if (!v || v < 1 || v > 10) {
        showError(input, "1–10 only");
        ok = false;
      } else clearError(input);
    });

    return ok;
  }

  /* -------------------------
       FORM VALIDATION CHECK
  --------------------------*/
  function checkForm() {
    const valid =
      validateName() &&
      validateSurname() &&
      validateEmail() &&
      validateAddress() &&
      validatePhone() &&
      validateRatings();

    submitBtn.disabled = !valid;
    return valid;
  }

  // Real-time listeners
  nameInput.addEventListener("input", checkForm);
  surnameInput.addEventListener("input", checkForm);
  emailInput.addEventListener("input", checkForm);
  addressInput.addEventListener("input", checkForm);
  phoneInput.addEventListener("input", checkForm);
  rating1.addEventListener("input", checkForm);
  rating2.addEventListener("input", checkForm);
  rating3.addEventListener("input", checkForm);

  /* -------------------------
       SUBMIT HANDLING
  --------------------------*/
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!checkForm()) return;

    const avg = ((+rating1.value + +rating2.value + +rating3.value) / 3).toFixed(1);

    let avgColor = "red";
    if (avg >= 4 && avg < 7) avgColor = "orange";
    if (avg >= 7) avgColor = "green";

    resultsBox.style.display = "block";
    resultsBox.innerHTML = `
      <p><strong>Name:</strong> ${nameInput.value} ${surnameInput.value}</p>
      <p><strong>Email:</strong> ${emailInput.value}</p>
      <p><strong>Phone:</strong> ${phoneInput.value}</p>
      <p><strong>Address:</strong> ${addressInput.value}</p>
      <p><strong>Ratings:</strong> ${rating1.value}, ${rating2.value}, ${rating3.value}</p>
      <p><strong>Average Rating:</strong> <span style="color:${avgColor}; font-weight:bold;">${avg}</span></p>
      <hr>
    `;

    alert("Form submitted successfully!");

    form.reset();
    submitBtn.disabled = true;
  });

});
