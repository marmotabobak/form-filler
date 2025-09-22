const emailInput = document.getElementById("email");
const fioInput = document.getElementById("fio");
const fanIdInput = document.getElementById("fanId");
const autoConsentCheckbox = document.getElementById("autoConsent");
const saveBtn = document.getElementById("saveBtn");
const popupMsg = document.getElementById("popupMsg");

function fillForm(data) {
  if (data.email) emailInput.value = data.email;
  if (data.fio) fioInput.value = data.fio;
  if (data.fanId) fanIdInput.value = data.fanId;
  autoConsentCheckbox.checked = !!data.autoConsent;
}

function getFormData() {
  return {
    email: emailInput.value.trim(),
    fio: fioInput.value.trim(),
    fanId: fanIdInput.value.trim(),
    autoConsent: autoConsentCheckbox.checked
  };
}

function showPopupMessage(text, type = "success") {
  popupMsg.textContent = text;
  popupMsg.className = "";
  popupMsg.classList.add("show", type);
  setTimeout(() => popupMsg.classList.remove("show"), 2500);
}
