$(document).ready(function () {
    readRecords(); // calling function
});

//Read records
function readRecords(){
    $.get("/events/", {}, function(data,status){
        data.forEach(function(value){
            var row='<tr id="row_id_'+ value.id +'">' + displayColumns(value) + '</tr>';
            $('#events').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
			+ '<td class="name">'+ value.name+ '</td>'
			+ '<td class="date">'+ value.date +'</td>'
			+ '<td class="nrPhoto">'+ value.nrPhoto +'</td>'
			
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Delete</button>'
			+ '</td>';
}

function addRecord() {
    $('#name').val('');
    $('#date').val('');
    $('#nrPhoto').val('');
  
    
    
    $('#myModalLabel').html('Add New Event');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/events/" + id;
    
    $.get(url, {}, function (data, status) {
       
        $('#name').val(data.name);
        $('#date').val(data.date);
        $('#nrPhoto').val(data.nrPhoto);
        $('#id').val(id);
        $('#myModalLabel').html('Edit List');
        
        $('#add_new_record_modal').modal('show');
    });
}

function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/events/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#events').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/events/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.date').html(formData.date);
            $('#row_id_'+formData.id+'>td.nrPhoto').html(formData.nrPhoto);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

//delete record
function deleteRecord(id) {
    $.ajax({
        url: '/events/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}

//extending jQuery with a serializeObject method so that form values can be retrieved as JSON objects
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

