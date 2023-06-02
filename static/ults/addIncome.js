import {
  addIncomeHandler,
  resetForm,
  initCustomDropdown,
  displayAlert,
} from "./formUtils.js";

// 显示添加收入表单
export function displayAddIncomeForm() {
  const currentDate = new Date();
  document.querySelector(".main-content").innerHTML = `
     <div id="add-income" class="main-content">
     <div class="title">
        <h1>add income record
          <span> ${currentDate}</span>
        </h1>
     </div>
     <form id="add-income-form">
           <div class="input-container">
             <div class="field">
             <input type="number" step="0.01" id="amount" name="amount" class="form-input" placeholder=" " required>
             <span class="line"></span>
             <span class="placeholder">Please Enter Amount...</span>
           </div>
       </div>
       <div class="input-container">
       <div class="dropdown">
         <button class="dropdown-btn custom-button">现金</button>
         <div class="dropdown-menu">
           <a href="#" data-value="cash">现金</a>
           <a href="#" data-value="check">支票</a>
         </div>
         <input type="hidden" id="money_type" name="money_type" value="cash">
       </div>
     </div>
       <div class="button-group">
         <button type="submit" class="custom-button">Confirm</button>
         <button type="reset" class="reset-btn custom-button">Cancel</button>
       </div>
     </form>
    </div>
   `;
  //
  const amountInput = document.getElementById("amount");
  const amountContainer = document.querySelector(".field");
  const placeholder = document.querySelector(".placeholder");
  const reset = document.querySelector(".reset-btn");

  function onAmountFocus() {
    amountContainer.classList.add("show-dollar");
    if (amountInput.value !== "") {
      placeholder.classList.add("hide-placeholder");
    }
  }

  function onAmountBlur() {
    if (amountInput.value === "") {
      amountContainer.classList.remove("show-dollar");
      placeholder.classList.remove("hide-placeholder");
    }
  }

  function onAmountInput() {
    if (amountInput.value !== "") {
      placeholder.classList.add("hide-placeholder");
    } else {
      placeholder.classList.remove("hide-placeholder");
    }
  }

  amountInput.addEventListener("focus", onAmountFocus);
  amountInput.addEventListener("blur", onAmountBlur);
  amountInput.addEventListener("input", onAmountInput);

  document
    .getElementById("add-income-form")
    .addEventListener("submit", addIncomeHandler);
  document
    .getElementById("add-income-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // 阻止表单的默认提交行为
      displayAlert("Successfully Added: $", amountInput.value);
      addIncomeHandler();
      resetForm(); // 显示成功的提示框
    });

  reset.addEventListener("click", () => {
    resetForm();
  });

  initCustomDropdown();
}
