var foption = "2";
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var flightData = {};    

$(function() {
    $( "#ddate, #rdate" ).datepicker({
        numberOfMonths: 2,
        showButtonPanel: true,
        minDate: 0
    }).val(getTodaysDate(0));
    
    $( "#slider-range" ).slider({
      range: true,
      min: 1000,
      max: 50000,
      values: [ 1000, 50000 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "Rs " + ui.values[ 0 ] + " - Rs " + ui.values[ 1 ] );
        var filterData = [];
        $(flightData.fd.departureFlights).each(function (index, val) {
            var totalPrice = (foption == 1) ? parseInt(flightData.fd.departureFlights[index].af) : parseInt(flightData.fd.departureFlights[index].af) + parseInt(flightData.fd.returnFlights[index].af)
            if(totalPrice >= parseInt(ui.values[ 0 ]) && totalPrice <= parseInt(ui.values[ 1 ])){
                var artId = "block_"+index;
                $("#block_"+index).show();
            } else {
                $("#block_"+index).hide();
            }
        });
      }
    });
    $( "#amount" ).val( "Rs " + $( "#slider-range" ).slider( "values", 0 ) +
      " - Rs " + $( "#slider-range" ).slider( "values", 1 ) );
});

function resetSlider() {
    var $slider = $("#slider-range");
    $slider.slider("values", 0, 1000);
    $slider.slider("values", 1, 50000);
    $( "#amount" ).val( "Rs " + $( "#slider-range" ).slider( "values", 0 ) +
      " - Rs " + $( "#slider-range" ).slider( "values", 1 ) );
}

function getTodaysDate (val) {
    var t = new Date, day, month, year = t.getFullYear();
    if (t.getDate() < 10) {
        day = "0" + t.getDate();
    }
    else {
        day = t.getDate();
    }
    if ((t.getMonth() + 1) < 10) {
        month = "0" + (t.getMonth() + 1 - val);
    }
    else {
        month = t.getMonth() + 1 - val;
    }

    return (day + '/' + month + '/' + year);
}

$(".radiogroup").change(function(e){
    var self = $(this);
    foption = $(this).val();
    if(foption == '2') {
        $("#returnDate").removeClass('hide');
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var output = day + '/' +
        ((''+month).length<2 ? '0' : '') + month + '/' +
        ((''+day).length<2 ? '0' : '') + d.getFullYear();

        $("#rdate").val(output);
    } else {
        $("#returnDate").addClass('hide');
        $("#rdate").val('');
    } 
});


$( ".btn-default" ).click(function(e) {
    e.preventDefault();
    resetSlider();
    var data = $( "form" ).serialize();
    $.ajax({
        dataType: 'json',
        url: "data/thought-2wayapi.json",
        data: data,
        success: success
    });
});

function success(data) {
    flightData = data;
    $("#slider-range, #slider-range-display").removeClass('hide');
    $("#panel-flight").empty();
    data.fd['foption'] = foption;
    $(".panel-info").removeClass('hide');
    $("#flightTemplate").tmpl( data.fd ).appendTo("#panel-flight");
}

function dateFormatter(formatDate, f){
    var date = new Date(formatDate);
    dateArray = (date.toLocaleString()).split(",");
    var t = dateArray[0].split("/");
    var myDate = new Date(new Date().getFullYear(), t[0] - 1, t[1]);
    if(f == "t")
        return dateArray[1].substring(1, 6);
    else
        return myFormatDate = myDate.getDate() + " " +MONTHS[myDate.getMonth()];   
}
