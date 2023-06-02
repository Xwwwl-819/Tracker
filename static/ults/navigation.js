// 设置激活按钮
export function setActiveButton(buttonId) {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
    if (button.id === buttonId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// 保存激活按钮
export function saveActiveButton(buttonId) {
  localStorage.setItem("activeButton", buttonId);
}

// 加载激活按钮
export function loadActiveButton() {
  const activeButtonId = localStorage.getItem("activeButton");
  if (activeButtonId) {
    setActiveButton(activeButtonId);
  }
}
