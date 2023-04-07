"use strict";

export async function getOfficeContextAsync() {
    return window.OfficeContext;
}

export async function setCurrentTimeAsync(timestr) {
	// exit if we are not in the "/time" page
	const url = window.location.href;
	if (url.indexOf("time") < 0) { return; }
    // Get the current context
    const officeContext = await getOfficeContextAsync();
    console.log(`officeContext=${officeContext}`);
    // make sure we are in Excel
    if (officeContext !== Office.HostType.Excel) { return; }

    await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const selectedRange = context.workbook.getSelectedRange();
        // Get the first cell of the range (row 0, column 0)
        const firstCell = selectedRange.getCell(0, 0);
        // Load the address of the first cell
        firstCell.load("address");
        console.log("First cell:", firstCell);
        await context.sync();

        // get the very first cell in the selected range
        const firstCellAddress = firstCell.address.split("!")[1]; // Remove the sheet name from the address
        console.log("First cell address:", firstCellAddress);

        // intsert value
        const range = sheet.getRange(firstCellAddress);
        range.values = timestr;
        range.format.autofitColumns();

        await context.sync();
    });
}