import { clearRecordsHandler } from "./utils.js";
import { displayAlert } from "./utils.js";
/***
 *
 *
 * 添加监听事件到3个按钮
 *
 *
 */
document.getElementById("add-income-btn").addEventListener("click", () => {
  displayAddIncomeForm();
});

document.getElementById("view-records-btn").addEventListener("click", () => {
  viewRecordsHandler();
});

document.getElementById("clear-records-btn").addEventListener("click", () => {
  clearRecordsHandler();
});

// 添加INCOME表单

function displayAddIncomeForm() {
  const currentDate = new Date();
  document.querySelector(".main-content").innerHTML = `
       <div id="add-income" class="main-content">
       <div class="title">
          <h1>add income
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
      displayAlert(`Successfully Added: $`, amountInput.value);
      addIncomeHandler();
      resetForm(); // 显示成功的提示框
    });

  reset.addEventListener("click", () => {
    resetForm();
  });

  initCustomDropdown();
}

/**
 *
 *  下方代码: 显示收入的函数
 *
 */

function viewRecordsHandler() {
  const currentDate = new Date();
  document.querySelector(".main-content").innerHTML = `
        <div class="title income-record">
          <h1 class="title-name">income record
            <span> ${currentDate}</span>
          </h1>
        </div>
        <div class="table-container income-table">
          <table id="recordsTable" class="data-table">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Types</th>
                      <th>Amount</th>
                      <th></th>
              </thead>
              <tbody id="tableBody">
              </tbody>
          </table>
        </div>
        <div id="totals" class="centered-text"></div>
        `;
  displayRecords();
}

//显示收入记录

let cashTotal = 0;
let checkTotal = 0;

function updateTotals() {
  const title = document.getElementsByClassName("title-name")[0]; // 获取第一个"title-name"元素

  // 创建或获取包裹div
  let wrapDiv = title.querySelector("#wrapDiv");
  if (!wrapDiv) {
    wrapDiv = document.createElement("div");
    wrapDiv.id = "wrapDiv";
    title.appendChild(wrapDiv);
  }

  // 尝试查找span，如果不存在就创建新的
  const cashTotalSpan =
    wrapDiv.querySelector("#cashTotal") ||
    createSpan("cashTotal", wrapDiv, "data-css");
  const checkTotalSpan =
    wrapDiv.querySelector("#checkTotal") ||
    createSpan("checkTotal", wrapDiv, "data-css");
  const amountTotalSpan =
    title.querySelector("#amountTotal") || createSpan("amountTotal", title);

  // 更新span的值
  cashTotalSpan.textContent = `Cash Total: $${cashTotal.toFixed(2)} | `;
  checkTotalSpan.textContent = `Check Total: $${checkTotal.toFixed(2)}`;
  amountTotalSpan.textContent = `Amount Total: $${(
    cashTotal + checkTotal
  ).toFixed(2)}`;
}

// 创建新的span，并添加到parent元素中
function createSpan(id, parent, cssClass) {
  const span = document.createElement("span");
  span.id = id;
  if (cssClass) {
    span.className = cssClass; // 如果指定了class，则添加到span上
  }
  parent.appendChild(span);
  return span;
}

function displayRecords() {
  cashTotal = 0;
  checkTotal = 0;
  fetch("/income_records_data")
    .then((response) => response.json())
    .then((transactions) => {
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";

      if (!transactions.cash.length && !transactions.check.length) {
        tableBody.innerHTML = "<td colspan='4'>There's no Record Yet!</td>";
        return;
      }

      function createRow(record, type) {
        const SUCCESS_MSG = "Record deleted successfully";
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${record.time}</td>
                        <td>${type}</td>  
                        <td>$ ${record.amount.toFixed(2)}</td>
                        <td><span class="delete">×</span></td>
                    `;
        tableBody.appendChild(row);

        const deleteBtn = row.querySelector(".delete");
        deleteBtn.style.display = "none";

        row.addEventListener("mouseover", () => {
          deleteBtn.style.display = "";
          deleteBtn.classList.remove("animate__fadeOut");
          deleteBtn.classList.add("animate__animated", "animate__fadeIn");
        });

        row.addEventListener("mouseout", () => {
          deleteBtn.classList.remove("animate__fadeIn");
          deleteBtn.classList.add("animate__animated", "animate__fadeOut");
          deleteBtn.addEventListener("animationend", () => {
            if (deleteBtn.classList.contains("animate__fadeOut")) {
              deleteBtn.style.display = "none";
            }
          });
        });

        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure to delete this record?")) {
            fetch("/delete_income", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                date: record.time,
                money_type: type.toLowerCase(),
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.message === SUCCESS_MSG) {
                  if (type === "Cash") cashTotal -= record.amount;
                  else checkTotal -= record.amount;
                  tableBody.removeChild(row);
                  displayAlert(`${type}: $${record.amount} `, "Deleted!");
                  updateTotals();
                }
              });
          }
        });

        if (type === "Cash") cashTotal += record.amount;
        else checkTotal += record.amount;
      }

      transactions.cash.forEach((record) => createRow(record, "Cash"));
      transactions.check.forEach((record) => createRow(record, "Check"));

      updateTotals();
    });
}

document
  .getElementById("clear-records-btn")
  .addEventListener("click", clearRecordsHandler);

/**
 *
 *  下方代码: 功能性的函数
 *
 *
 */

// 添加收入处理程序
function addIncomeHandler(event) {
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
function resetForm() {
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
function initCustomDropdown() {
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

