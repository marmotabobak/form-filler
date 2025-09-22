document.getElementById("fillButton").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fillFirstInput
  });
});

function fillFirstInput() {
  const email = "igurvantsev@ozon.ru";
  // Выполняем поиск первого input или textarea на странице
  const input = document.querySelector("input[type='text'], input[type='email'], textarea, input:not([type])");
  if (input) {
    input.value = email;
    // Создаем и диспатчим событие input для обновления UI и связанного JS
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  } else {
    alert("Поле ввода не найдено на странице");
  }
}

