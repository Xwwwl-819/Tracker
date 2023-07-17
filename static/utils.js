function clearIncomeRecordsHandler() {
  fetch("/clear_records", { method: "POST" });
}
function clearAbsenceRecordsHandler() {
  fetch("/absence_clear_records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

export function clearRecordsHandler() {
  document.querySelector(".main-content").innerHTML = `
        <div id="divBox">
          <div id="box" class="active">    
            <h2 class="centered-text">Clear Prompt</h2>
            <p class="centered-text ">Are You Sure to Clear All Records?</p>
            <div class="clear-button-group">
              <button id="confirm-clear-records" class="custom-button button-c">Confirm</button>
              <button id="cancel-clear-records" class="custom-button button-c">Cancel</button>
            </div>
          </div>  
        </div>`;

  document.body.addEventListener("click", function (event) {
    const box = document.getElementById("box");
    if (event.target.id === "confirm-clear-records") {
      if (window.location.pathname === "/absence") {
        // If the current page is the absence page
        clearAbsenceRecordsHandler();
      } else {
        // If the current page is not the absence page
        clearIncomeRecordsHandler(); // Assuming this function is defined somewhere
      } // Assuming this function is defined somewhere
      box.classList.remove("active");
      box.classList.add("de-active");
      displayAlert("Records Has Been Cleared", "!");
    } else if (event.target.id === "cancel-clear-records") {
      box.classList.remove("active");
      box.classList.add("de-active");
      displayAlert("Action Terminated", "!");
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
