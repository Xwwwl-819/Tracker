// 添加收入处理程序
export function addIncomeHandler(event) {
  event.preventDefault();
  fetch("/add_income", {
    method: "POST",
    body: new FormData(event.target),
  })
    .then((response) => response.json())
    .then((data) => {
      // 重置表单
      resetForm();
    });
}

// 重置表单
export function resetForm() {
  // 重置金额输入框
  const amountInput = document.getElementById("amount");
  const amountField = document.querySelector(".field");
  const placeholder = document.querySelector(".placeholder");
  amountInput.value = "";
  amountField.classList.remove("show-dollar");
  placeholder.classList.remove("hide-placeholder");

  // 重置下拉菜单
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const moneyTypeInput = document.querySelector("#money_type");
  dropdownBtn.textContent = "现金";
  moneyTypeInput.value = "cash";
}

// 初始化自定义下拉菜单
export function initCustomDropdown() {
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const moneyTypeInput = document.querySelector("#money_type");

  dropdownBtn.addEventListener("click", () => {
    event.preventDefault();
    dropdownMenu.classList.toggle("show");
  });

  dropdownMenu.addEventListener("click", (event) => {
    event.preventDefault();
    const value = event.target.getAttribute("data-value");
    const text = event.target.textContent;
    moneyTypeInput.value = value;
    dropdownBtn.textContent = text;
  });

  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropdown-btn")) {
      const openDropdownMenu = document.querySelector(".dropdown-menu.show");
      if (openDropdownMenu) {
        openDropdownMenu.classList.remove("show");
      }
    }
  });
}

export function displayAlert(message, data) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert-box alert-enter";
  alertBox.innerHTML = `
    <div class="alert-message">${message}${data}</div>
  `;
  document.body.appendChild(alertBox);

  // Animation
  setTimeout(() => {
    alertBox.className = "alert-box alert-enter-active";
  }, 0);

  // 进入动画
  alertBox.className = "alert-box alert-enter";
  setTimeout(() => {
    alertBox.className = "alert-box alert-enter-active";
  }, 0);

  // 退出动画
  setTimeout(() => {
    alertBox.className = "alert-box alert-exit-active";
  }, 2000);
  setTimeout(() => {
    document.body.removeChild(alertBox);
  }, 3000);
}
