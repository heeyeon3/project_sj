let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let graphdata = [];

let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_name_list = []
let sensor_display_name_list = []
let sensorgroup_interval = "";

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";

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

    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)


    if(date_time_start){
        $("#date_time_start").val(date_time_start)
        $("#date_time_end").val(date_time_end)
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    }else{
        let today = new Date()
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
    
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        if(String(month).length <2){month = "0"+month}
        if(String(minutes).length <2){minutes = "0"+minutes}
        if(String(date).length <2){date = "0"+date}


        let endday = year+"."+month+"."+date+" "+hours+":00"
        $("#date_time_end").val(endday)

        var Agodate = new Date(today.getTime() - (7*24*60*60*1000))
        let Agodateyear = Agodate.getFullYear(); // 년도
        let Agodatemonth = Agodate.getMonth() + 1;  // 월
        let Agodatedate = Agodate.getDate();  // 날짜
    
        let Agodatehours = Agodate.getHours(); // 시
        let Agodateminutes = Agodate.getMinutes();  // 분
        if(String(Agodatemonth).length <2){Agodatemonth = "0"+Agodatemonth}
        if(String(Agodateminutes).length <2){Agodateminutes = "0"+Agodateminutes}
        if(String(Agodatedate).length <2){Agodatedate = "0"+Agodatedate}

        let startday = Agodateyear+"."+Agodatemonth+"."+Agodatedate+" "+Agodatehours+":00"
        next_time_start = startday;
        next_time_end = endday;
        $("#date_time_start").val(startday)
        $('#date_time_end').datetimepicker({minDate:startday});
    }

    

 
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

             sensor_name_list = []
             sensor_display_name_list = []
             for(let i=0; i<sensordata.length; i++){
                sensor_name_list.push(sensordata[i].sensor_name)
                sensor_display_name_list.push(sensordata[i].sensor_display_name)
             }

             if(sensordata[0].sensorgroup_gl1_max){
                level1_max = sensordata[0].sensorgroup_gl1_max
             }
             if(sensordata[0].sensorgroup_gl1_min){
                level1_min = sensordata[0].sensorgroup_gl1_min
             }
             if(sensordata[0].sensorgroup_gl2_max){
                level2_max = sensordata[0].sensorgroup_gl2_max
             }
             if(sensordata[0].sensorgroup_gl2_min){
                level2_min = sensordata[0].sensorgroup_gl2_min
             }
             if(sensordata[0].sensorgroup_gl3_max){
                level3_max = sensordata[0].sensorgroup_gl3_max
             }
             if(sensordata[0].sensorgroup_gl3_min){
                level3_min = sensordata[0].sensorgroup_gl3_min
             }
            // level1_max = sensordata[0].sensorgroup_gl1_max
            // level1_min = sensordata[0].sensorgroup_gl1_min
            // level2_max = sensordata[0].sensorgroup_gl2_max
            // level2_min = sensordata[0].sensorgroup_gl2_min
            // level3_max = sensordata[0].sensorgroup_gl3_max
            // level3_min = sensordata[0].sensorgroup_gl3_min

            sensorgroup_interval = sensordata[0].sensorgroup_interval;
            get_initial_date = sensordata[0].sensorgroup_initial_date;
            $('#topsensername').text(sensordata[0].sensorgroup_name)
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
                    // alert("initial date가 등록 되었습니다.")
                    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                    window.location.href = "/ws-02-1-1?" +encodeURIComponent(uri)
                    // window.location.href =  "/ws-02-1-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end+"&intervalday="+intervalday+"&time="+time
            
            }
            });
        }


    })


    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })
})

function initialmodal() {
    $('#initial_datetime').val(get_initial_date)
}

function guideline(){
    console.log(sensordata)

    $('#sensorname').text(sensordata[0].sensor_display_name)

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
            // console.log(data.resultString)
            alert("Guide line이 등록 되었습니다.")
            let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-1-1?" +encodeURIComponent(uri)
            // window.location.href =  "/ws-02-1-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end+"&intervalday="+intervalday+"&time="+time
       
       }
    });
   
}



function searchdata(){
    intervalday = $('#intervalday').val()
    time = $('#time').val()
    date_time_start = $('#date_time_start').val()
    date_time_end = $('#date_time_end').val()


    if(date_time_start.length == 0 && date_time_end.length != 0){
        alert("시작 날짜를 입력해 주세요")
        $('#date_time_start').focus()
        return;
    }else if(date_time_start.length != 0 && date_time_end.length == 0){
        alert("마지막 날짜를 입력해 주세요")
        $('#date_time_end').focus()
        return;
    }

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
            console.log(data.table_fx_data)
            next_time_start = date_time_start;
            next_time_end = date_time_end;

            if(graphdata.length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
                }else{
                    selectgraph()
            }
       }
    });

    
}


function selectgraph(){

    if(chart){chart.destroy()}

    let colors = [
        '#1e87f0', '#5856d6', '#ff9500', '#ffcc00', '#ff3b30', '#5ac8fa', '#007aff', '#4cd964', '#aeff00', '#00ffe1',
        '#00ff62', '#0066ff', '#00ffd5', '#b2ff00', '#ffe100', '#00ff91', '#ff8000', '#1900ff', '#ff1500', '#00ffd0',
        '#73ff00', '#ff8800', '#e6ff00', '#0055ff', '#fffb00', '#2f00ff', '#00ff73', '#006eff', '#ffcc00', '#22ff00',
        '#ff2600', '#00aeff', '#b2ff00', '#8cff00', '#ffbb00', '#d9ff00', '#00aeff', '#ffa600', '#ff4d00', '#ccff00', 
        '#fbff00', '#ffe100', '#c3ff00', '#00ff88', '#00e5ff', '#ff4000', '#00ccff', '#00ddff', '#00ff19', '#0088ff',
        ];
    
    let color = [];
    for (k = 0; k < 100; k++) {
        const r = Math.floor (Math.random () * 255);
        const g = Math.floor (Math.random () * 255);
        const b = Math.floor (Math.random () * 255);
        color.push('rgba('+r+', '+g+','+b+', 1)')
    }

    let labels = [];
    for(let i=0; i< sensor_display_name_list.length; i++){
        let interval = parseInt(sensorgroup_interval)*(i+1)
        let intervallabel = interval+'m'
        labels.push(intervallabel)
    }
    if(colors.length < graphdata.length){
        for(let i=0; i< graphdata.length; i++){

            colors.push(colors[i])
        }
    }


    let datasets = [
    // {
        // label: '2021.10.01 21:00',
        // data: [0, -0.259, 0.280, 0.1, 0.256, 0.255, 0.240],
        // borderColor: colors[0],
        // pointBackgroundColor: colors[0],
        // pointHoverRadius: 6,
        // borderWidth: 2,
        // },
    ];

    let data=[]

    for(let i=0; i<graphdata.length; i++){
        let graphdatalist = []
        for(let j=0; j<labels.length; j++){
            graphdatalist.push(graphdata[i][labels[j]])
        }
        datasets.push({
            label: graphdata[i].sensor_data_date.substr(2,14),
            data: graphdatalist,
            borderColor: colors[i],
            pointBackgroundColor: colors[i],
            pointHoverRadius: 6,
            borderWidth: 2,
        })
    }

    // for(let i=0; i< graphdata[0].length; i++){
    //     // console.log(i)
    //     let currentdata = 0
    //     data = []
    //     for(j= graphdata.length-1; j>=0; j--){
           
    //         currentdata += parseFloat(graphdata[j][i].sensor_fx_data)
    //         data.push(currentdata)
    //     }


    //     let graphdatalist = []
    //     for(j= graphdata.length-1; j>=0; j--){
    //         graphdatalist.push(data[j])
    //     }

        
    //     datasets.push({
    //         label: graphdata[0][i].sensor_data_date,
    //         data: graphdatalist,
    //         borderColor: colors[i],
    //         pointBackgroundColor: colors[i],
    //         pointHoverRadius: 6,
    //         borderWidth: 2,
    //         })
        
        
    // }


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


}
function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
}

// next_time_start, next_time_end

function chartlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-2?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function trendlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-3?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-4?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-9?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-5?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-5?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-6?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}