const date = new Date();
const options = { weekday: "long", month: "long", day: "numeric" };
const today = date.toLocaleDateString("en-US", options);

document.getElementById("record-absence-btn").addEventListener("click", () => {
  fetch("/record_absence", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      clearCurrentPage();
      if (result.success) {
        displayAlert(today, "'s Absence Documented!");
      } else {
        let message = result.message
          ? result.message
          : "'s Absence Documented Already!";
        displayAlert(today, message);
      }
    });
});

function updatePageContent() {
  fetch("/record_absence") // replace with your actual API endpoint
    .then((response) => response.json())
    .then((data) => {
      const contentElement = document.querySelector(".content"); // replace with the actual selector of the element you want to update
      contentElement.innerHTML = data.newContent; // replace 'newContent' with the actual property of your data
    });
}

document.getElementById("absence-records-btn").addEventListener("click", () => {
  viewRecordsHandler();
});

function clearCurrentPage() {
  const content = document.getElementsByClassName("content");
  for (let i = 0; i < content.length; i++) {
    content[i].innerHTML = "";
  }
}
function viewRecordsHandler() {
  const currentDate = new Date();
  document.querySelector(".content").innerHTML = `
        <div class="title absence-record">
          <h1>absence record
            <span> ${currentDate}</span>
          </h1>
        </div>
        <table id="recordsTable"class="data-table" style="text-align: center;">
          <thead>
            <tr>
              <th style="text-align: center;">Date</th>
              <th style="text-align: center;">Weekdays</th>
              <th style="text-align: center;">Absence</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="tableBody">
          </tbody>
        </table>
      `;
  displayAbsenceRecords();
}

function displayAbsenceRecords() {
  fetch("/view_absence_records")
    .then((response) => response.json())
    .then((records) => {
      const tableBody = document.getElementById("tableBody");
      const table = document.getElementById("recordsTable");
      tableBody.innerHTML = "";

      if (Object.keys(records).length === 0) {
        tableBody.innerHTML = "<td colspan='4'>There's no Record Yet!</td>";
        return;
      }

      let totalAbsence = 0;

      function createRow(date, record) {
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${date}</td> 
                        <td>${record.weekdays}</td>  
                        <td>${record.absences}</td>
                        <td><span class="delete" style="display: none;">X</span></td>
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
            fetch("/delete_absence", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                date: date,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.message === "Absence record deleted successfully") {
                  tableBody.removeChild(row);
                  displayAlert(`Date: ${date}, `, " Deleted!");
                  totalAbsence -= record.absences;
                }
              });
          }
        });
      }

      Object.entries(records).forEach(([date, record]) => {
        createRow(date, record);
        totalAbsence += record.absences;
      });

      const tfoot = document.createElement("tfoot");
      tfoot.innerHTML = `
            <tr>  
              <td></td>
              <td>Total Absence</td>
              <td>${totalAbsence} Days</td>
            </tr>
          `;
      table.appendChild(tfoot);
    });
}

document.getElementById("working-days-btn").addEventListener("click", () => {
  fetch("/view_work_days")
    .then((response) => response.json())
    .then((info) => displayWorkDaysInfo(info));
});

function displayWorkDaysInfo(info) {
  const today = new Date();
  const date = today.toLocaleDateString();

  function calculateIncome(transactions) {
    let cashTotal = 0;
    let checkTotal = 0;

    transactions.cash.forEach((record) => {
      cashTotal += record.amount;
    });
    transactions.check.forEach((record) => {
      checkTotal += record.amount;
    });
    return cashTotal + checkTotal;
  }

  fetch("/income_records_data")
    .then((response) => response.json())
    .then((transactions) => {
      const income = calculateIncome(transactions);

      const workDaysInfo = `
        <div class="msgBox">
          <div class="dataMsg">
            <div class="title settlment-data">
              <h1>Days Settlement
                <span>${today}</span>
              </h1>
            </div>
            <p>Total Days: <span>${info.total_days}</span> days</p>
            <p>Day absences: <span>${info.absence_days}</span> days</p> 
            <p>Day Working: <span>${info.work_days}</span> days</p>
            <p>Amount received: <span> $${income}</span></p>
            <p>Not Yet Collected: <span> $${info.salary - income}</span></p>
            <p>Total Amount: <span> $${info.salary}</span></p>
            <p>Note: Total Days Excluding Sundays and Mondays</p>
          </div>
        </div>
      `;

      document.querySelector(".content").innerHTML = workDaysInfo;
    })
    .catch((error) => console.error("Error:", error));
}

function clearRecordsHandler() {
  fetch("/absence_clear_records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

// 显示 box
function showBox() {
  box.classList.add("active");
  box.classList.add("absenceMsg");
}

// 隐藏 box
function hideBox() {
  box.classList.add("absenceMsg");
  box.classList.remove("active");
}

document
  .getElementById("clear-records-btn")
  .addEventListener("click", function () {
    document.querySelector(".content").innerHTML = `
    
      <div id="divBox" class="absenceBox">
        <div id="box">    
          <h2 class="centered-text">Clear Prompt</h2>
          <p class="centered-text ">Are You Sure to Clear All Records?</p>
          <div class="clear-button-group">
              <button id="confirm-clear-records" class="custom-button button-c">Confirm</button>
              <button id="cancel-clear-records" class="custom-button button-c">Cancel</button>
          </div>
        </div>  
      </div> 
   
          `;
    const box = document.getElementById("box");
    showBox();
    document
      .getElementById("confirm-clear-records")
      .addEventListener("click", () => {
        clearRecordsHandler(); // 在这里调用 clearRecordsHandler 而不是作为事件监听器
        hideBox();
        setTimeout(() => {
          document.querySelector(".content").innerHTML = `
            <p  class="centered-text msgPrompt">Records Has Been Cleared!</p>
          `;
        }, 400);
      });

    document
      .getElementById("cancel-clear-records")
      .addEventListener("click", () => {
        hideBox();
        setTimeout(() => {
          document.querySelector(".content").innerHTML = `
            <p class="centered-text msgPrompt">Action Terminated!</p>
          `;
        }, 400);
      });
  });
function setActiveButton(buttonId) {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
    if (button.id === buttonId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
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
    updatePageContent();
  }, 3000);
}
