let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let graphdata = [];


// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let date_time_start = "";
let date_time_end = "";
let intervalday = "";
let time = "";

let get_initial_date = "";


$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensorgroup_id = urlParams.get('aWQ')
    // place_id = urlParams.get('place_id')
    // datarogger_id = urlParams.get('datarogger_id')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    console.log(date_time_end, date_time_start, time,intervalday )

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    $.ajax({
        url:"sensorgroup/mapping?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id,
        type:"get",
        contentType: false,
        processData : false,
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
             console.log(json.data)

             sensordata = json.data

             $('#projectName').text(sensordata[0].project_name)
             $('#placeName').text(sensordata[0].place_name)
             namelist = []
             for(let i=0; i<sensordata.length; i++){
                 if(namelist.indexOf(sensordata[i].sensor_display_name) ==-1){
                    namelist.push(sensordata[i].sensor_display_name)
                 }
                 
             }
          
             let sensornamelist = "";
             for(let i = 0; i<namelist.length; i++){
                if(sensornamelist.length == 0 ){
                    sensornamelist += namelist[i]
                  
                }else{sensornamelist += ", "+namelist[i]}
         
                if(i == namelist.length-1){$('#sensorNameList').text(sensornamelist)}
             }


            // level1_max = sensordata[0].sensorgroup_gl1_max
            // level1_min = sensordata[0].sensorgroup_gl1_min
            // level2_max = sensordata[0].sensorgroup_gl2_max
            // level2_min = sensordata[0].sensorgroup_gl2_min
            // level3_max = sensordata[0].sensorgroup_gl3_max
            // level3_min = sensordata[0].sensorgroup_gl3_min

            // $('#linechart').attr("href", "ws-02-1-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name)
            // $('#trendchart').attr("href", "ws-02-1-3?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name)
            // $('#timelinechart').attr("href", "ws-02-1-9?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name)
            // $('#data').attr("href", "ws-02-1-5?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name)
            // $('#info').attr("href", "ws-02-1-6?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name)
    

            if(sensordata[0].sensorgroup_gl1_max){$('#gl1max').text(sensordata[0].sensorgroup_gl1_max)}
            if(sensordata[0].sensorgroup_gl1_max){$('#gl1min').text(sensordata[0].sensorgroup_gl1_min)}
            if(sensordata[0].sensorgroup_gl1_max){$('#gl2max').text(sensordata[0].sensorgroup_gl2_max)}
            if(sensordata[0].sensorgroup_gl1_max){$('#gl2min').text(sensordata[0].sensorgroup_gl2_min)}
            if(sensordata[0].sensorgroup_gl1_max){$('#gl3max').text(sensordata[0].sensorgroup_gl3_max)}
            if(sensordata[0].sensorgroup_gl1_max){$('#gl3min').text(sensordata[0].sensorgroup_gl3_min)}

            $('#sensorinitaildate').text(sensordata[0].sensorgroup_initial_date)

            $('#topname').text(sensordata[0].sensorgroup_name)
            get_initial_date = sensordata[0].sensorgroup_initial_date;

            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }
        //    $('#projectName').text(sensordata[0].project_name)
        //    $('#placeName').text(sensordata[0].place_name)
         }
    })

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

});



function chartlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-7?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-7?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}


function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-9-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-10?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-10?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-6-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}