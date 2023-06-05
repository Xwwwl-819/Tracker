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

/**
 *
 *  下方代码: 显示收入的函数
 *
 */

function viewRecordsHandler() {
  const currentDate = new Date();
  document.querySelector(".main-content").innerHTML = `
        <div class="title income-record">
          <h1>income record
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
// function displayRecords() {
//   fetch("/income_records_data")
//     .then((response) => response.json())
//     .then((transactions) => {
//       const tableBody = document.getElementById("tableBody");
//       const table = document.getElementById("recordsTable");
//       tableBody.innerHTML = "";

//       let cashTotal = 0;
//       let checkTotal = 0;

//       if (!transactions.cash.length && !transactions.check.length) {
//         tableBody.innerHTML = "<td colspan='3'>There's no Record Yet!</td>";
//         return;
//       }

//       function createRow(record, type) {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//                         <td>${record.time}</td>
//                         <td>${type}</td>
//                         <td>$ ${record.amount.toFixed(2)}</td>
//                     `;
//         tableBody.appendChild(row);

//         if (type === "Cash") cashTotal += record.amount;
//         else checkTotal += record.amount;
//       }

//       transactions.cash.forEach((record) => createRow(record, "Cash"));
//       transactions.check.forEach((record) => createRow(record, "Check"));

//       const tfoot = document.createElement("tfoot");
//       tfoot.innerHTML = `
//             <tr>
//               <td></td>
//               <td>Cash Total</td>
//               <td>$ ${cashTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Check Total</td>
//               <td>$ ${checkTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Amount Total</td>
//               <td>$ ${(cashTotal + checkTotal).toFixed(2)}</td>
//             </tr>
//           `;
//       table.appendChild(tfoot);
//     });
// }

// function displayRecords() {
//   fetch("/income_records_data")
//     .then((response) => response.json())
//     .then((transactions) => {
//       const tableBody = document.getElementById("tableBody");
//       const table = document.getElementById("recordsTable");
//       tableBody.innerHTML = "";

//       let cashTotal = 0;
//       let checkTotal = 0;

//       if (!transactions.cash.length && !transactions.check.length) {
//         tableBody.innerHTML = "<td colspan='3'>There's no Record Yet!</td>";
//         return;
//       }

//       function createRow(record, type) {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//                         <td>${record.time}</td>
//                         <td>${type}</td>
//                         <td>$ ${record.amount.toFixed(2)}</td>
//                         <td class='deleteCell' style="display:none;">Delete</td>
//                     `;
//         tableBody.appendChild(row);

//         row.onmouseover = function () {
//           this.lastChild.style.display = "block";
//         };

//         row.onmouseout = function () {
//           this.lastChild.style.display = "none";
//         };

//         row.lastChild.onclick = function () {
//           if (confirm("Do you want to delete this record?")) {
//             row.remove();
//           }
//         };

//         if (type === "Cash") cashTotal += record.amount;
//         else checkTotal += record.amount;
//       }

//       transactions.cash.forEach((record) => createRow(record, "Cash"));
//       transactions.check.forEach((record) => createRow(record, "Check"));

//       const tfoot = document.createElement("tfoot");
//       tfoot.innerHTML = `
//             <tr>
//               <td></td>
//               <td>Cash Total</td>
//               <td>$ ${cashTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Check Total</td>
//               <td>$ ${checkTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Amount Total</td>
//               <td>$ ${(cashTotal + checkTotal).toFixed(2)}</td>
//             </tr>
//           `;
//       table.appendChild(tfoot);
//     });
// }
// async function displayRecords() {
//   const response = await fetch("/income_records_data");
//   const transactions = await response.json();

//   const tableBody = document.getElementById("tableBody");
//   const table = document.getElementById("recordsTable");
//   tableBody.innerHTML = "";

//   let cashTotal = 0;
//   let checkTotal = 0;

//   if (!transactions.cash.length && !transactions.check.length) {
//     tableBody.innerHTML = "<td colspan='3'>There's no Record Yet!</td>";
//     return;
//   }

//   function createRow(record, type) {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//                     <td>${record.time}</td>
//                     <td>${type}</td>
//                     <td>$ ${record.amount.toFixed(2)}</td>
//                     <td class='deleteCell' style='display: none;'>Delete</td>
//                 `;
//     tableBody.appendChild(row);

//     row.onmouseover = function () {
//       this.lastChild.style.display = "block";
//     };

//     row.onmouseout = function () {
//       this.lastChild.style.display = "none";
//     };

//     row.lastChild.onclick = function () {
//       if (confirm("Do you want to delete this record?")) {
//         row.remove();
//       }
//     };

//     if (type === "Cash") cashTotal += record.amount;
//     else checkTotal += record.amount;
//   }

//   transactions.cash.forEach((record) => createRow(record, "Cash"));
//   transactions.check.forEach((record) => createRow(record, "Check"));

//   const tfoot = document.createElement("tfoot");
//   tfoot.innerHTML = `
//         <tr>
//           <td></td>
//           <td>Cash Total</td>
//           <td>$ ${cashTotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td></td>
//           <td>Check Total</td>
//           <td>$ ${checkTotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td></td>
//           <td>Amount Total</td>
//           <td>$ ${(cashTotal + checkTotal).toFixed(2)}</td>
//         </tr>
//       `;
//   table.appendChild(tfoot);
// }
// function displayRecords() {
//   fetch("/income_records_data")
//     .then((response) => response.json())
//     .then((transactions) => {
//       const tableBody = document.getElementById("tableBody");
//       const table = document.getElementById("recordsTable");
//       tableBody.innerHTML = "";

//       let cashTotal = 0;
//       let checkTotal = 0;

//       if (!transactions.cash.length && !transactions.check.length) {
//         tableBody.innerHTML = "<td colspan='3'>There's no Record Yet!</td>";
//         return;
//       }

//       function createRow(record, type) {
//         const row = document.createElement("tr");
//         const deleteCell = document.createElement("td");
//         deleteCell.textContent = "Delete";
//         deleteCell.classList.add("deleteCell");
//         deleteCell.style.display = "none";
//         row.appendChild(deleteCell);
//         row.innerHTML += `
//                         <td>${record.time}</td>
//                         <td>${type}</td>
//                         <td>$ ${record.amount.toFixed(2)}</td>
//                     `;
//         tableBody.appendChild(row);

//         row.onmouseover = function () {
//           deleteCell.style.display = "inline";
//         };

//         row.onmouseout = function () {
//           deleteCell.style.display = "none";
//         };

//         deleteCell.onclick = function () {
//           if (confirm("Do you want to delete this record?")) {
//             row.remove();
//           }
//         };

//         if (type === "Cash") cashTotal += record.amount;
//         else checkTotal += record.amount;
//       }

//       transactions.cash.forEach((record) => createRow(record, "Cash"));
//       transactions.check.forEach((record) => createRow(record, "Check"));

//       const tfoot = document.createElement("tfoot");
//       tfoot.innerHTML = `
//             <tr>
//               <td></td>
//               <td>Cash Total</td>
//               <td>$ ${cashTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Check Total</td>
//               <td>$ ${checkTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Amount Total</td>
//               <td>$ ${(cashTotal + checkTotal).toFixed(2)}</td>
//             </tr>
//           `;
//       table.appendChild(tfoot);
//     });
// }

// function displayRecords() {
//   fetch("/income_records_data")
//     .then((response) => response.json())
//     .then((transactions) => {
//       const tableBody = document.getElementById("tableBody");
//       const table = document.getElementById("recordsTable");
//       tableBody.innerHTML = "";

//       let cashTotal = 0;
//       let checkTotal = 0;

//       if (!transactions.cash.length && !transactions.check.length) {
//         tableBody.innerHTML = "<td colspan='4'>There's no Record Yet!</td>";
//         return;
//       }

//       function createRow(record, type) {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//                         <td>${record.time}</td>
//                         <td>${type}</td>
//                         <td>$ ${record.amount.toFixed(2)}</td>
//                         <td><span class="delete">x</span></td>
//                     `;
//         tableBody.appendChild(row);

//         row.querySelector(".delete").style.display = "none";

//         row.addEventListener("mouseover", () => {
//           row.querySelector(".delete").style.display = "";
//         });

//         row.addEventListener("mouseout", () => {
//           row.querySelector(".delete").style.display = "none";
//         });
//         row.querySelector(".delete").addEventListener("click", () => {
//           if (confirm("Are you sure to delete this record?")) {
//             if (type === "Cash") cashTotal -= record.amount;
//             else checkTotal -= record.amount;
//             tableBody.removeChild(row);
//           }
//         });

//         if (type === "Cash") cashTotal += record.amount;
//         else checkTotal += record.amount;
//       }

//       transactions.cash.forEach((record) => createRow(record, "Cash"));
//       transactions.check.forEach((record) => createRow(record, "Check"));

//       const tfoot = document.createElement("tfoot");
//       tfoot.innerHTML = `
//             <tr>
//               <td></td>
//               <td>Cash Total</td>
//               <td>${cashTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td></td>
//               <td>Check Total</td>
//               <td>${checkTotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td colspan='2'>Amount Total</td>
//               <td>${(cashTotal + checkTotal).toFixed(2)}</td>
//             </tr>
//           `;
//       table.appendChild(tfoot);
//     });
// }

function displayRecords() {
  fetch("/income_records_data")
    .then((response) => response.json())
    .then((transactions) => {
      const tableBody = document.getElementById("tableBody");
      const table = document.getElementById("recordsTable");
      tableBody.innerHTML = "";

      let cashTotal = 0;
      let checkTotal = 0;

      if (!transactions.cash.length && !transactions.check.length) {
        tableBody.innerHTML = "<td colspan='4'>There's no Record Yet!</td>";
        return;
      }

      function createRow(record, type) {
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${record.time}</td>
                        <td>${type}</td>  
                        <td>$ ${record.amount.toFixed(2)}</td>
                        <td><span class="delete">X</span></td>
                    `;
        tableBody.appendChild(row);

        row.querySelector(".delete").style.display = "none";

        row.addEventListener("mouseover", () => {
          row.querySelector(".delete").style.display = "";
        });

        row.addEventListener("mouseout", () => {
          row.querySelector(".delete").style.display = "none";
        });
        row.querySelector(".delete").addEventListener("click", () => {
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
                if (data.message === "Record deleted successfully") {
                  if (type === "Cash") cashTotal -= record.amount;
                  else checkTotal -= record.amount;
                  tableBody.removeChild(row);
                  displayAlert(`${type}: $${record.amount} `, "Deleted!");
                }
              });
          }
        });

        if (type === "Cash") cashTotal += record.amount;
        else checkTotal += record.amount;
      }

      transactions.cash.forEach((record) => createRow(record, "Cash"));
      transactions.check.forEach((record) => createRow(record, "Check"));

      const tfoot = document.createElement("tfoot");
      tfoot.innerHTML = `
            <tr>
              <td></td>  
              <td>Cash Total</td>
              <td>${cashTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>  
              <td>Check Total</td>
              <td>${checkTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>  
              <td>Amount Total</td>  
              <td>${(cashTotal + checkTotal).toFixed(2)}</td>
            </tr>
          `;
      table.appendChild(tfoot);
    });
}

/**
 *
 *  清除JSON文件的数据
 *
 */

function clearRecordsRequest() {
  fetch("/clear_records", { method: "POST" });
}

function clearRecordsHandler() {
  document
    .getElementById("clear-records-btn")
    .addEventListener("click", function () {
      document.querySelector(".main-content").innerHTML = `
          <div id="divBox">
            <div id="box">    
              <h2 class="centered-text">Clear Prompt</h2>
              <p class="centered-text ">Are You Sure to Clear All Records?</p>
              <div class="clear-button-group">
                <button id="confirm-clear-records" class="custom-button button-c">Confirm</button>
                <button id="cancel-clear-records" class="custom-button button-c">Cancel</button>
              </div>
            </div>  
          </div>`;
      box.classList.add("active");
    });

  // 添加事件委托
  document.body.addEventListener("click", function (event) {
    if (event.target.id === "confirm-clear-records") {
      clearRecordsRequest();
      box.classList.remove("active");
      box.classList.add("de-active");

      setTimeout(() => {
        document.querySelector(".main-content").innerHTML = `
              <p  class="centered-text msgPrompt">Records Has Been Cleared!</p>`;
      }, 400);
    } else if (event.target.id === "cancel-clear-records") {
      box.classList.remove("active");
      box.classList.add("de-active");
      setTimeout(() => {
        document.querySelector(".main-content").innerHTML = `
              <p class="centered-text msgPrompt">Action Terminated!</p>`;
      }, 400);
    }
  });
}

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

function displayAlert(message, data) {
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

/**
 *
 * 上方代码: 功能性的函数
 *
 *
 */
