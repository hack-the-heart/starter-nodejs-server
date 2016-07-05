// alldata.js

var REST_DATA = 'api/alldata';

function loadItems(){
	xhrGet(REST_DATA, function(responseData){
		var success = responseData.success;

		if(success == true) {
			for(i = 0; i < responseData.records.length; i++){
				var record = responseData.records[i];

				var tdElements = [];
				tdElements.push("<td>"+record._id+"</td>")
				tdElements.push("<td>"+record.insertionDateInSeconds+"</td>")
				tdElements.push("<td>"+record.dateInSeconds+"</td>")
				tdElements.push("<td>"+record.healthObjType+"</td>")
				tdElements.push("<td>"+record.sourceName+"</td>")
				tdElements.push("<td>"+JSON.stringify(record.data)+"</td>")

				$('#allDataTableTBody').after("<tr>"+tdElements.join("")+"</tr>");
			}
		} else {
			$('#allDataTableTBody').after("No Data Found");
		}
	}, function(err){
		console.error(err);
	});
}

loadItems();
