import { clearRecordsHandler as clearHandler } from "./recordsUtils.js";
// const box = document.getElementById("box");

// 显示 box
function showBox() {
  box.classList.add("active");
}

// 隐藏 box
function hideBox() {
  box.classList.remove("active");
}

export function clearRecordsHandler() {
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
      showBox();
    });

  // 添加事件委托
  document.body.addEventListener("click", function (event) {
    if (event.target.id === "confirm-clear-records") {
      clearHandler();
      hideBox();
      setTimeout(() => {
        document.querySelector(".main-content").innerHTML = `
          <p  class="centered-text msgPrompt">Records Has Been Cleared!</p>`;
      }, 400);
    } else if (event.target.id === "cancel-clear-records") {
      hideBox();
      setTimeout(() => {
        document.querySelector(".main-content").innerHTML = `
          <p class="centered-text msgPrompt">Action Terminated!</p>`;
      }, 400);
    }
  });
}
