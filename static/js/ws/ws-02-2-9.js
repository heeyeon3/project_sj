let project_id = "";
let sensorgrouplist = [];
let sensordetail_id = "";
let sensor_id = "";
let datarogger_id = "";
let sensor_namex = "";
let sensor_namey = "";
let sensorgroup_type = "";
let sensordata = [];
let get_initial_date = "";


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    // sensor_id = urlParams.get('sensor_id')
    // datarogger_id = urlParams.get('datarogger_id')
    // sensordetail_id = urlParams.get('sensordetail_id')
    // sensor_namex = urlParams.get('sensor_namex')
    // sensor_namey = urlParams.get('sensor_namey')
    sensor_idx = urlParams.get('c2Vx')
    sensor_idy = urlParams.get('c2Vy')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});

   
    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_idx,
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
             console.log(sensordata)

             $('#topsensername').text(sensordata[0].sensor_name)
            level1_max = sensordata[0].sensor_gl1_max
            level1_min = sensordata[0].sensor_gl1_min
            level2_max = sensordata[0].sensor_gl2_max
            level2_min = sensordata[0].sensor_gl2_min
            level3_max = sensordata[0].sensor_gl3_max
            level3_min = sensordata[0].sensor_gl3_min

            initial_data = sensordata[0].sensor_initial_data
            sensor_display_name = sensordata[0].sensor_display_name

            
            // $('#chart').attr("href", "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#data').attr("href", "ws-02-2-3?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#fomula').attr("href", "ws-02-2-4?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#info').attr("href", "ws-02-2-5?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            
    

            if(sensordata[0].sensor_gl1_max){$('#gl1max').text(sensordata[0].sensor_gl1_max)}
            $('#gl1min').text(sensordata[0].sensor_gl1_min)
            if(sensordata[0].sensor_gl2_max){$('#gl2max').text(sensordata[0].sensor_gl2_max)}
            $('#gl2min').text(sensordata[0].sensor_gl2_min)
            if(sensordata[0].sensor_gl3_max){$('#gl3max').text(sensordata[0].sensor_gl3_max)}
            $('#gl3min').text(sensordata[0].sensor_gl3_min)

            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)

            $('#sensorName').text(sensor_display_name)

            $('#initialDate').text(sensordata[0].sensor_initial_date)
            $('#projectName').text(sensordata[0].project_name)
            $('#placeName').text(sensordata[0].place_name)
            $('#sensorLocation').text(sensordata[0].place_lat+", "+sensordata[0].place_lng)

           topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
           $('#topname').text(sensordata[0].sensor_display_name)
           $('#gaugefactormodalname').text(sensordata[0].sensor_display_name)

            let gayge_x = sensordata[0].sensor_gauge_factor
           $.ajax({
            url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_idy,
            type:"get",
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                console.log(json.data)

                sensordata = json.data
                console.log(sensordata)
                let gayge_y = sensordata[0].sensor_gauge_factor
                console.log(usergr)
                if(usergr == '0104'){
                    $('#guideFactor').append("x: "+gayge_x+"/ y: "+gayge_y)
                    // $('#guideFactor').append("x: "+gayge_x+"/ y: "+gayge_y+"<a href='#guage-factor' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle></a>")
                }else {
                    $('#guideFactor').append("x: "+gayge_x+"/ y: "+gayge_y+"<a href='#guage-factor' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle></a>")
                    $('#gauge_y').val(gayge_y)
                    $('#gauge_x').val(gayge_x)    
                }
             }
             })

             get_initial_date = sensordata[0].sensor_initial_date;
            
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }
         }
    })


    $('#gauge_save').click(function () {

        let gauge_x = $('#gauge_x').val()
        let gauge_y = $('#gauge_y').val()
        let form_data = new FormData($('#gaugefactoexy')[0])
        // form_data.append("gauge_x", gauge_x)
        // form_data.append("gauge_y", gauge_y)
        form_data.append("sensor_idx", sensor_idx)
        form_data.append("sensor_idy", sensor_idy)
        // form_data.append("sensor_namex", sensor_namex)
        // form_data.append("sensor_namey", sensor_namey)
        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };

        $.ajax({
            url : "/sensor/gauge/scatter",
            type : "POST",
            data : form_data,
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log(data.resultString)
                alert("gauge factor가 등록 되었습니다.")
            //    window.location.href
                location.reload()
           
           }
        });
    })

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

})


function trendlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function fomulalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4-1?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-4-1?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function infolocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-9?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-9?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}


function chartlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-6?"+encodeURIComponent(uri)
}