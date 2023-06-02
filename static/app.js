// 导入其他模块
// import { setActiveButton, loadActiveButton } from "./ults/navigation.js";
import { displayAddIncomeForm } from "./ults/addIncome.js";
import { viewRecordsHandler } from "./ults/viewRecords.js";
import { clearRecordsHandler } from "./ults/clearRecords.js";

document.getElementById("add-income-btn").addEventListener("click", () => {
  displayAddIncomeForm();
});

document.getElementById("view-records-btn").addEventListener("click", () => {
  viewRecordsHandler();
});

document.getElementById("clear-records-btn").addEventListener("click", () => {
  clearRecordsHandler();
});
