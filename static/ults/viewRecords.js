import { displayRecords } from "./recordsUtils.js";

// 显示收入记录处理程序
export function viewRecordsHandler() {
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
                </tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>
  </div>
  <div id="totals" class="centered-text"></div>
  `;
  displayRecords();
}
