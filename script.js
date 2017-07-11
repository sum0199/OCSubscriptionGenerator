var addBtn = document.querySelector("#addToList");
var subBtn = document.querySelector("#makeSubProps");

var sourceCatInput = document.querySelector("#sourceCatalog");
var subscriberIdInput = document.querySelector("#subscriberId");
var priceTypeInput = document.querySelector("#priceType");
var discountInput = document.querySelector("#discount");
var subsTable = document.querySelector("#subsTable tbody");

var sub;
var lastRow;

var groovyFiles = [];

addBtn.addEventListener("click", function() {

	if (document.querySelector("form").reportValidity())
	{
		addSubscription();
	}
}
);

function addDataToTable(newRow, newFile, newSub, index)
{
	newRow.insertCell(0).textContent = newFile.sourceCatalog;
	newRow.insertCell(1).textContent = newFile.customerId;
	newRow.insertCell(2).textContent = newFile.contents.subscription.length;
	newRow.insertCell(3).innerHTML = "<a role='button' download='file.groovy' id='download-" + index + "' class='btn btn-success'>Download</a>";
}

var textFiles = [];
function makeTextFile(text, file) {
	var data = new Blob([text], {type: 'text/plain'});
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (file !== null) {
    	window.URL.revokeObjectURL(file);
    }
    file = window.URL.createObjectURL(data);
    return file;
};

var subFile;
function getSubscriptionProperties() {
	//Go through files, pick up customer ids and assign to relevant unique catalog
	var uniqueCats = [];
	groovyFiles.forEach(function(file) { 
		//Find object in catalog list for this sourceCatalog
		var targetCat = null;
		uniqueCats.forEach(function(cat) {
			if (cat.sourceCatalog === file.sourceCatalog)
			{
				targetCat = cat;
			}
		})
		//if cat doesn't already exist, add one
		if (targetCat === null)
		{ 
			targetCat = new subscriptionProperty(file.sourceCatalog);
			uniqueCats.push(targetCat);
		}
		targetCat.customers.push(file.customerId);
	})

	//return string
	return uniqueCats.map(function(cat) { return cat.toString() } ).join("\r\n");
}

function addSubscription() {
	//When user clicks "Add to list", create or update our array of files
	var sourceCatalog = sourceCatInput.value;
	var subscriberId = subscriberIdInput.value;
	var priceType = priceTypeInput.value;
	var discount = discountInput.value;

	var newFile = null;
	//Does a file already exist for this catalog and subscriber?
	groovyFiles.forEach(function(file) {
		if (file.sourceCatalog === sourceCatalog && file.customerId === subscriberId)
		{
			newFile = file;
		}
	})
	//if no newFile found, create new file
	if (newFile === null)
	{
		newFile = new groovyFile(sourceCatalog, subscriberId);
		groovyFiles.push(newFile);
	}
	var index = groovyFiles.indexOf(newFile);
	//Create new anonymous subscription object
	var newSub = [{
		contractId: "'" + sourceCatalog + "'",
		classificationId: "'*'",
		classificationGroupId: "'*'",
		priceType: "'" + priceType + "'",
		attributes: [],
		discount: "'" + discount + "'"
	}];

	//Add this new subscription to our file
	newFile.contents.subscription.push(newSub);

	//Also add to table.
	//Remove any existing formatting.
	if (lastRow != null) lastRow.classList.remove("success");
	//Insert new row with class success.
	var newRow;
	//If file index not in table, add a new row with data.
	if (index + 1 > subsTable.rows.length)
	{
		newRow = subsTable.insertRow();
		addDataToTable(newRow, newFile, newSub, index);
	}
	else //Update existing row.
	{
		newRow = subsTable.rows[index];
		newRow.cells[2].textContent = newFile.contents.subscription.length;
	}
	//Update download button
	var btn = document.querySelector("#download-" + index);
	btn.href = makeTextFile(newFile.toGroovy(), textFiles[index]);
	btn.download = newFile.fileName;
	btn.textContent = newFile.fileName;

	//Update subscriptions button
	subBtn.href = makeTextFile(getSubscriptionProperties(), subFile);

	newRow.classList.add("success");
	lastRow = newRow;
}