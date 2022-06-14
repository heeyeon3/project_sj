let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";

let sensordata = [];
let graphdata = [];

let chart;
let wchart;

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

let sensor_display_name_list = []
let sensorgroup_interval = "";

let labels = []
let datalabels = []

let next_time_start = "";
let next_time_end = "";
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
    next_time_start = date_time_start;
    next_time_end = date_time_end;

    time = urlParams.get('time')
    intervalday = urlParams.get('intervalday')

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

            level1_max = sensordata[0].sensorgroup_gl1_max
            level1_min = sensordata[0].sensorgroup_gl1_min
            level2_max = sensordata[0].sensorgroup_gl2_max
            level2_min = sensordata[0].sensorgroup_gl2_min
            level3_max = sensordata[0].sensorgroup_gl3_max
            level3_min = sensordata[0].sensorgroup_gl3_min

            sensor_display_name_list = []
            for(let i=0; i<sensordata.length; i++){
            //    sensor_name_list.push(sensordata[i].sensor_name)
               sensor_display_name_list.push(sensordata[i].sensor_display_name)
            }
            sensorgroup_interval = sensordata[0].sensorgroup_interval


            get_initial_date = sensordata[0].sensorgroup_initial_date;


            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#initial_datetime').val(get_initial_date)
            $('#initialsensorname').text(sensordata[0].sensorgroup_name)
            $('#sensorgroupinitail').text("Initial Date: "+get_initial_date)
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }

            if(sensordata[0].sensor_fx_check=='1'){
                $('#fomulaname').text(sensordata[0].sensor_fx1_name)
            }else if(sensordata[0].sensor_fx_check=='2'){
                $('#fomulaname').text(sensordata[0].sensor_fx2_name)
            }else if(sensordata[0].sensor_fx_check=='3'){
                $('#fomulaname').text(sensordata[0].sensor_fx3_name)
            }else if(sensordata[0].sensor_fx_check=='4'){
                $('#fomulaname').text(sensordata[0].sensor_fx4_name)
            }else if(sensordata[0].sensor_fx_check=='5'){
                $('#fomulaname').text(sensordata[0].sensor_fx5_name)
            }
         }
    })

    searchdata()


    $('#initialsavebtn').click(function(){
        let saveconfirm = confirm("전체 initial date 값이 수정됩니다. 수정하시겠습니까?")
        if(saveconfirm){
            let sensorgroup_initial_date = $('#initial_datetime').val()

            console.log(sensorgroup_initial_date)

            let form_data = new FormData()
            form_data.append("sensorgroup_id", sensorgroup_id)
            form_data.append("sensorgroup_initial_date", sensorgroup_initial_date)
            $.ajax({
                url : "/sensorgroup/mapping",
                type : "POST",
                data : form_data,
                contentType : false,
                processData : false,
                error:function(err){
                    console.log(err)
                    alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    alert(data.resultString)
                    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                    window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
                    // window.location.href = "/ws-02-1-9?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
            
            }
            });
        }


    })

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

});



function guideline(){
    console.log(sensordata)

    $('#sensorname').text(sensordata[0].sensorgroup_name)

    $('#sensor_gl1_max').val(sensordata[0].sensorgroup_gl1_max)
    $('#sensor_gl1_min').val(sensordata[0].sensorgroup_gl1_min)
    $('#sensor_gl2_max').val(sensordata[0].sensorgroup_gl2_max)
    $('#sensor_gl2_min').val(sensordata[0].sensorgroup_gl2_min)
    $('#sensor_gl3_max').val(sensordata[0].sensorgroup_gl3_max)
    $('#sensor_gl3_min').val(sensordata[0].sensorgroup_gl3_min)
}


function guidelinesave(){
    console.log(sensordata)

    let sensor_gl1_max = $('#sensor_gl1_max').val()
    let sensor_gl1_min = $('#sensor_gl1_min').val()
    let sensor_gl2_max = $('#sensor_gl2_max').val()
    let sensor_gl2_min = $('#sensor_gl2_min').val()
    let sensor_gl3_max = $('#sensor_gl3_max').val()
    let sensor_gl3_min = $('#sensor_gl3_min').val()

    console.log(sensor_gl1_max )

    // if(sensor_gl1_max.length == 0){alert("Level 1 Max를 입력해주세요."); $('#sensor_gl1_max').focus(); return; }
    // else if(sensor_gl1_min.length == 0){alert("Level 1 Min를 입력해주세요."); $('#sensor_gl1_min').focus(); return; }
    // else if(sensor_gl2_max.length == 0){alert("Level 2 Max를 입력해주세요."); $('#sensor_gl2_max').focus(); return; }
    // else if(sensor_gl2_min.length == 0){alert("Level 2 Min를 입력해주세요."); $('#sensor_gl2_min').focus(); return; }
    // else if(sensor_gl3_max.length == 0){alert("Level 3 Max를 입력해주세요."); $('#sensor_gl3_max').focus(); return; }
    // else if(sensor_gl3_min.length == 0){alert("Level 3 Min를 입력해주세요."); $('#sensor_gl3_min').focus(); return; }

    let form_data = new FormData($('#guideLineminmax')[0])

    form_data.append("sensorgroup_id", sensorgroup_id)

    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };

    $.ajax({
        url : "/sensorgroup/guidline",
        type : "POST",
        data : form_data,
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
            alert("Guide line이 등록 되었습니다.")
            let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
        //    window.location.href = "/ws-02-1-9?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
       
       }
    });
   
}



function searchdata(){
    

    intervalday = $('#intervalday').val()
    time = $('#time').val()
    date_time_start = $('#date_time_start').val()
    date_time_end = $('#date_time_end').val()

    let startday = new Date(date_time_start)
    let lastday = new Date(date_time_end)
    
    let today = new Date()
    let initaildate = new Date(get_initial_date)

    if(lastday > today){
        alert("미래 데이터는 표출할 수 없습니다.")
        return;
    } else if(startday > lastday){
        alert("시작 날짜가 마지막 날짜보다 늦습니다.")
        return;
    } else if(startday < initaildate){
        date_time_start = get_initial_date;
        $('#date_time_start').val(get_initial_date);
    }

    console.log(intervalday, time, date_time_start, date_time_end, datarogger_id)

    if(date_time_start.length == 0 && date_time_end.length != 0){
        alert("시작 날짜를 입력해 주세요")
        $('#date_time_start').focus()
        return;
    }else if(date_time_start.length != 0 && date_time_end.length == 0){
        alert("마지막 날짜를 입력해 주세요")
        $('#date_time_end').focus()
        return;
    }

    $.ajax({
        url : "/editdata/all/line",
        type : "POST",
        data : {
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            "sensorgroup_type": sensorgroup_type,
            "sensorgroup_id": sensorgroup_id

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.resultString)
       
            graphdata = data.table_fx_data
            console.log(graphdata)

            next_time_start = date_time_start;
            next_time_end = date_time_end;


            if(graphdata.length !=0){
                selectgraph()
            }else{
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }
       }
    });

}


function selectgraph(){
    if(chart){chart.destroy()}
    const colors = [
        '#1e87f0', '#5856d6', '#ff9500', '#ffcc00', '#ff3b30', '#5ac8fa', '#007aff', '#4cd964', '#aeff00', '#00ffe1',
        '#00ff62', '#0066ff', '#00ffd5', '#b2ff00', '#ffe100', '#00ff91', '#ff8000', '#1900ff', '#ff1500', '#00ffd0',
        '#73ff00', '#ff8800', '#e6ff00', '#0055ff', '#fffb00', '#2f00ff', '#00ff73', '#006eff', '#ffcc00', '#22ff00',
        '#ff2600', '#00aeff', '#b2ff00', '#8cff00', '#ffbb00', '#d9ff00', '#00aeff', '#ffa600', '#ff4d00', '#ccff00', 
        '#fbff00', '#ffe100', '#c3ff00', '#00ff88', '#00e5ff', '#ff4000', '#00ccff', '#00ddff', '#00ff19', '#0088ff',
        ];
    
    const color = [];
    for (k = 0; k < 100; k++) {
        const r = Math.floor (Math.random () * 255);
        const g = Math.floor (Math.random () * 255);
        const b = Math.floor (Math.random () * 255);
        color.push('rgba('+r+', '+g+','+b+', 1)')
    }

    labels = []
    datalabels = []
    for(let i=0; i<graphdata.length; i++){
        labels.push(graphdata[i].sensor_data_date.substr(2,14))
        datalabels.push(graphdata[i].sensor_data_date)

    }

    console.log(sensor_display_name_list)

    let sensorM = [];
    if(sensorgroup_type =='0202'){
        sensorM.push('0m')
    }
    for(let i=0; i< sensor_display_name_list.length; i++){
        console.log("sensor_data_date")
        let interval = parseInt(sensorgroup_interval)*(i+1)
        let intervallabel = interval+'m'
        sensorM.push(intervallabel)
    }
    console.log("sensorM", sensorM)

  
    // console.log(graphdata[1].length)
    let datasets = []
 
    for(let i = 0; i< sensorM.length;i++){
        data = []
        for(let j=0; j<graphdata.length; j++){
            data.push(graphdata[j][sensorM[i]])
            // if(sensordata[i].sensor_name == graphdata[j][0].sensor_name){
            //     for(let k =0; k<graphdata[j].length; k++){
            //         data.push(graphdata[j][k].sensor_fx1_data)
            //     }
            // }
        }
        datasets.push( {
            label: sensorM[i],
            data: data,
            borderColor: colors[i],
            pointBackgroundColor: colors[i],
            pointHoverRadius: 6,
            borderWidth: 2,
        })
    }
   
    max_lv1_display = false
    min_lv1_display = false
    max_lv2_display = false
    min_lv2_display = false
    max_lv3_display = false
    min_lv3_display = false
   
    if(level1_max && level1_max.length != 0 ){max_lv1_display = true}
    if(level1_min && level1_min.length != 0){min_lv1_display = true}
    if(level2_max && level2_max.length != 0){max_lv2_display = true}
    if(level2_min && level2_min.length != 0){min_lv2_display = true}
    if(level3_max && level3_max.length != 0){max_lv3_display = true}
    if(level3_min && level3_min.length != 0){min_lv3_display = true}
    console.log("level3_min", level3_min,min_lv3_display )

   
    chart = new Chart('sensors', {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: '#222',
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        align: "center",
                    }
                },
                y: {
                    grid: {
                        color: '#222',
                    }
                }
            },
            plugins: {
                zoom: {
                    limits: {
                        x: {min: 'original', max: 'original', minRange: 1},
                        // y: {min: 'original', max: 'original', minRange: 1}
                    },
                    pan: {
                        enabled: true,
                        mode: 'y',
                        threshold: 2,
                    },
                    zoom: {
                        // speed: 0.1, 
                        // sensitivity: 0.5,
                        // threshold: 2,
                        // wheel: {
                        //     enabled: true
                        // },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                    },
                },
                tooltip: {
                    padding: 10,
                    cornerRadius: 0,
                    bodySpacing: 4,
                    titleSpacing: 10,
                    //multiKeyBackground: '#00000000',
                    displayColors: false,
                },
                legend: {
                    position: 'bottom',
                    align: 'start',
                    padding: 20,
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                    }
                },
                annotation: {
                    annotations: {
                        line1: { // Guideline Lv.1 Max
                            type: 'line',
                            yMin: level1_max,
                            yMax: level1_max,
                            borderColor: '#FFD60A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.1 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv1_display
                        },
                        line2: { // Guideline Lv.1 Min
                            type: 'line',
                            yMin: level1_min,
                            yMax: level1_min,
                            borderColor: '#FFD60A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.1 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : min_lv1_display
                        },
                        line3: { // Guideline Lv.2 Max
                            type: 'line',
                            yMin: level2_max,
                            yMax: level2_max,
                            borderColor: '#FF9F0A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.2 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv2_display
                        },
                        line4: { // Guideline Lv.2 Min
                            type: 'line',
                            yMin: level2_min,
                            yMax: level2_min,
                            borderColor: '#FF9F0A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.2 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv3_display
                        },
                        line5: { // Guideline Lv.3 Max
                            type: 'line',
                            yMin: level3_max,
                            yMax: level3_max,
                            borderColor: '#FF453A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.3 Max',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : max_lv3_display
                        },
                        line6: { // Guideline Lv.3 Min
                            type: 'line',
                            yMin: level3_min,
                            yMax: level3_min,
                            borderColor: '#FF453A',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                content: 'Lv.3 Min',
                                color: '#666',
                                font: {
                                    style: 'normal',
                                }
                            },
                            display : min_lv3_display
                        },
                        line7: { // Initial
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: '#1e87f0',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#191919',
                                // content: 'Initial',
                                color: '#1e87f0',
                                font: {
                                    style: 'normal',
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    weathergraph()
}
function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
}


function weathergraph(){
    console.log("!")
    console.log(project_id,date_time_start,date_time_end )

    let weather_graph = []

    let t1h_data = [];
    let rn1_data = [];

    if(time.length == 0 && intervalday.length !=0){
        url = "/weather/data"
        $.ajax({
            url : url,
            type : "post",
            async: false,
            data:{
                "project_id":project_id,
                "date_time_start": date_time_start,
                "date_time_end":date_time_end,
                "intervalday":intervalday
                
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log(data.resultString)
        
                weatherdata = data.data
                console.log(weatherdata)

                for(let i=0; i<datalabels.length; i++){
                    t1h_data.push(null)
                    rn1_data.push(null)
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == datalabels[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h
                            rn1_data[i] = weatherdata[j].weather_rn1

                        }
                    }
                }

        }
        });

    }else{
        url = "/weather/data?project_id="+project_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
        $.ajax({
            url : url,
            type : "get",
            async: false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log(data.resultString)
           
                weatherdata = data.data
                console.log(weatherdata)
    
                for(let i=0; i<datalabels.length; i++){
                    t1h_data.push(null)
                    rn1_data.push(null)
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == datalabels[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h
                            rn1_data[i] = weatherdata[j].weather_rn1
    
                        }
                    }
                }
    
           }
        });
    }

 



    if(wchart){wchart.destroy()}
    // let labels = ['2021.10.01 21:00', '2021.10.02 21:00' ,'2021.10.03 21:00', '2021.10.04 21:00', '2021.10.05 21:00', '2021.10.06 21:00', '2021.10.07 21:00'];
    wchart = new Chart('weather', {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                type: 'line',
                label: '기온 ( ℃ )',
                yAxisID: 'temp',
                data: t1h_data,
                borderColor: '#FF9F0A',
                pointBackgroundColor: '#FF9F0A',
                pointHoverRadius: 6,
                borderWidth: 2,
            }, {
                type: 'line',
                label: '강수량 ( mm )',
                yAxisID: 'rain',
                data: rn1_data,
                borderColor: '#00AFFF',
                pointBackgroundColor: '#00AFFF',
                pointHoverRadius: 6,
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        color: '#222',
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        align: "center",
                    }
                },
                temp: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: '#222',
                    },
                    ticks: {
                        color: 'rgba(255,159,10,.3)',
                    }
                },
                rain: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                    ticks: {
                        color: 'rgba(0,175,255,.3)',
                    },
                    beginAtZero : true
            }   
        },
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                padding: 10,
                cornerRadius: 0,
                bodySpacing: 4,
                titleSpacing: 10,
                multiKeyBackground: '#00000000',
                displayColors: false,
            },
            legend: {
                position: 'bottom',
                align: 'start',
                padding: 20,
                labels: {
                    boxWidth: 12,
                    padding: 20,
                }
            }
        }
    }
})
}

$("input:text[doubleOnly]").on("focus", function() {
    var x = $(this).val();
    $(this).val(x);
}).on("focusout", function() {
    var x = $(this).val();
    if(x && x.length > 0) {
        if(!$.isNumeric(x)) {
            x = x.replace(/[^-0-9\.]/g,"");
            // x = x.replace(/[^-0-9\.]/g,"");
        } 
        if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
            if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                x = "-"+x.replace(/[-]/gi,'');
            }else{
                x = x.replace(/[-]/gi,'');
            }
        }
      //마침표 2개 허용 X
        if ( (x.match(/\./g) || []).length > 1 ){
                x =x.replace('.','');
        }
        $(this).val(x);
    }
}).on("keyup", function() {
    var x = $(this).val().replace(/[^-0-9\.]/g,"");
    if(x && x.length > 0) {
         if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
             if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                 x = "-"+x.replace(/[-]/gi,'');
             }else{
                 x = x.replace(/[-]/gi,'');
             }
         }
    }		
     //마침표 2개 허용 X
     if ( (x.match(/\./g) || []).length > 1 ){
            x =x.replace('.','');
     }
    $(this).val(x);
});



// next_time_start, next_time_end
function chartlocation(){
    if(sensorgroup_type == '0201'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-1?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }else if(sensorgroup_type == '0202'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }
   
}

function trendlocation(){
    if(sensorgroup_type == '0201'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-3?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-3?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }else if(sensorgroup_type == '0202'){
        let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
        window.location.href = "/ws-02-1-4?" +encodeURIComponent(uri)
        // window.location.href =  "/ws-02-1-4?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    }


}
// function chartlocation(){
//     let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
//     window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
  
// }

// function trendlocation(){
//     let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
//     window.location.href = "/ws-02-1-4?" +encodeURIComponent(uri)
   
// }
function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
   
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-5?" +encodeURIComponent(uri)
 
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6?" +encodeURIComponent(uri)
    
}