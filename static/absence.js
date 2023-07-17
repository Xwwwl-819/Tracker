import { clearRecordsHandler } from "./utils.js";
import { displayAlert } from "./utils.js";
///ssd

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
          <h1 class="title-name">absence record
            <span> ${currentDate}</span>
          </h1>
        </div>
        <table id="recordsTable"class="data-table" style="text-align: center;">
          <thead>
            <tr>
              <th style="text-align: center;">Date</th>
              <th style="text-align: center;">Weekdays</th>
              <th style="text-align: center;">Absence</th>
              <th id="absence-th"></th>
            </tr>
          </thead>
          <tbody id="tableBody">
          </tbody>
        </table>
      `;
  displayAbsenceRecords();
}

let totalAbsence = 0;

function displayAbsenceRecords() {
  totalAbsence = 0;

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

      function createRow(date, record) {
        const SUCCESS_MSG = "Absence record deleted successfully";
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${date}</td> 
                        <td>${record.weekdays}</td>  
                        <td>${record.absences} Count</td>
                        <td><span class="delete" style="display: none;">×</span></td>

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
                if (data.message === SUCCESS_MSG) {
                  tableBody.removeChild(row);
                  displayAlert(date, " Deleted!");
                  totalAbsence -= record.absences;
                  updateTotals();
                }
              });
          }
        });

        totalAbsence += record.absences;
      }

      // Reversing the array so the latest date comes first
      Object.entries(records)
        .reverse()
        .forEach(([date, record]) => {
          createRow(date, record);
        });

      updateTotals();
    });
}

function updateTotals() {
  const title = document.getElementsByClassName("title-name")[0]; // 获取第一个"title-name"元素

  // 尝试查找span
  let totalDiv = title.querySelector("#totalDiv");

  // 如果span不存在，就创建一个新的
  if (!totalDiv) {
    totalDiv = document.createElement("span");
    totalDiv.id = "totalDiv"; // 为新的span添加id，方便下次查找
    title.appendChild(totalDiv); // 把新的span添加到title元素中
  }

  // 更新span
  totalDiv.textContent = `Total Absence: ${totalAbsence} days`;
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

document
  .getElementById("clear-records-btn")
  .addEventListener("click", clearRecordsHandler);
