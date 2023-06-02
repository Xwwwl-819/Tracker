// 清空收入记录处理程序
export function clearRecordsHandler() {
  fetch("/clear_records", { method: "POST" });
}

//显示收入记录
export function displayRecords() {
  fetch("/income_records_data")
    .then((response) => response.json())
    .then((transactions) => {
      const tableBody = document.getElementById("tableBody");
      const table = document.getElementById("recordsTable");
      tableBody.innerHTML = "";

      let cashTotal = 0;
      let checkTotal = 0;

      if (!transactions.cash.length && !transactions.check.length) {
        tableBody.innerHTML = "<td colspan='3'>There's no Record Yet!</td>";
        return;
      }

      function createRow(record, type) {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${record.time}</td>
                    <td>${type}</td>
                    <td>$ ${record.amount.toFixed(2)}</td>
                `;
        tableBody.appendChild(row);

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
          <td>$ ${cashTotal.toFixed(2)}</td>
        </tr>
        <tr>  
          <td></td>
          <td>Check Total</td>  
          <td>$ ${checkTotal.toFixed(2)}</td>
        </tr>
        <tr>  
          <td></td>
          <td>Amount Total</td>  
          <td>$ ${(cashTotal + checkTotal).toFixed(2)}</td>
        </tr>
      `;
      table.appendChild(tfoot);
    });
}
