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


let date_time_start = "";
let date_time_end = "";
let intervalday = "";
let time = "";


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
            sensorgroup_interval = sensordata[0].sensorgroup_interval

            get_initial_date = sensordata[0].sensorgroup_initial_date;

            sensor_name_list = []
            sensor_display_name_list = []
             for(let i=0; i<sensordata.length; i++){
                sensor_name_list.push(sensordata[i].sensor_name)
                sensor_display_name_list.push(sensordata[i].sensor_display_name)
             }

            $('#sensorgroupinitail').text("Initial Date: "+get_initial_date)
     
            $('#topsensername').text(sensordata[0].sensorgroup_name)

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


    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })
})



function searchdata(){
    let intervalday = $('#intervalday').val()
    let time = $('#time').val()
    let date_time_start = $('#date_time_start').val()
    let date_time_end = $('#date_time_end').val()

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

            next_time_start = date_time_start;
            next_time_end = date_time_end;

            graphdata = graphdata.sort((a,b) => {
                return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
            })

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

 
    
    let datasets = []
    let data = []
    let graphindex = 0;
    
    
    // for(let i = 0; i<graphdata[0].length; i++){
    //     labels.push(graphdata[0][i].sensor_data_date)
    // }

    const total = graphdata.length;
    const gradation = [];
    for (i = 0; i < total; i++) {
        const c = 255 - i*(255/total);
        gradation.push('rgba('+c+','+c+','+c+', 1');  
    }


    let labels = [];
    let labels2 = ['0m'];
    console.log(labels)

    for(let i=0; i< sensor_display_name_list.length; i++){
        let interval = parseInt(sensorgroup_interval)*(i+1)
        let intervallabel = interval+'m'
        labels2.push(intervallabel)
    }
    console.log("labels", labels2)
    // console.log("labels", sensor_display_name_list)

    for(let i=labels2.length-1; i>=0; i--){
        labels.push(labels2[i])
    }


    for(let i=0; i< graphdata.length; i++){
        // console.log(i)
        let currentdata = 0

        data = []
        for(let j=0; j<labels.length; j++){
            data.push(graphdata[i][labels[j]])
        }
        // for(j= graphdata.length-1; j>=0; j--){
            
        //     // currentdata += parseFloat(graphdata[j][i].sensor_fx_data)

        //     data.push(currentdata)
        // }

        console.log(data)

        if(i==0){
            datasets.push({
                label: graphdata[i].sensor_data_date.substr(2,14),
                data: data,
                // data: graphdatalist,
                borderColor: '#00AFFF',
                pointBackgroundColor: '#00AFFF',
                pointHoverRadius: 6,
                borderWidth: 2,
                })
        }else{
            datasets.push({
                label: graphdata[i].sensor_data_date.substr(2,14),
                data: data,
                // data: graphdatalist,
                borderColor: gradation[i-1],
                pointBackgroundColor: gradation[i-1],
                pointHoverRadius: 6,
                borderWidth: 2,
                })
        }

        
        
    }
    
   
    // for(let i=0; i< graphdata[0].length; i++){
    //     // console.log(i)
    //     let currentdata = 0
    //     data = []
    //     for(j= graphdata.length-1; j>=0; j--){
    //         // console.log(currentdata, graphdata[j][i].sensor_fx_data)
    //         currentdata += parseFloat(graphdata[j][i].sensor_fx_data)
    //         data.push(currentdata)
    //     }

    //     console.log(data)
    //     let graphdatalist = [0]
    //     for(j= graphdata.length-1; j>=0; j--){
    //         graphdatalist.push(data[j])
    //     }
    //     console.log("graphdatalist" , graphdatalist) 
    //     // for(j=0; j<graphdata.length; j++){
    //     //     data.push(graphdata[j][i].sensor_fx1_data)
    //     // }
    //     // console.log(data)

    //     if(i==0){
    //         datasets.push({
    //             label: graphdata[0][i].sensor_data_date,
    //             data: graphdatalist,
    //             borderColor: '#00AFFF',
    //             pointBackgroundColor: '#00AFFF',
    //             pointHoverRadius: 6,
    //             borderWidth: 2,
    //             })
    //     }else{
    //         datasets.push({
    //             label: graphdata[0][i].sensor_data_date,
    //             data: graphdatalist,
    //             borderColor: gradation[i],
    //             pointBackgroundColor: gradation[i],
    //             pointHoverRadius: 6,
    //             borderWidth: 2,
    //             })
    //     }
        
        
        
        
    // }

    console.log(labels)

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
            indexAxis: 'y',
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: '#222',
                    }
                },
                y: {
                    reverse: true,
                    grid: {
                        color: '#222',
                    }
                }
            },
            plugins: {
                zoom: {
                    limits: {
                        // x: {min: 'original', max: 'original', minRange: 3},
                        y: {min: 'original', max: 'original'}
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
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
                        mode: 'x',
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
                        line7: { // Initial
                            type: 'line',
                            xMin: 0,
                            xMax: 0,
                            borderColor: '#1e87f0',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                yPadding: -20,
                                enabled: true,
                                position: "start",
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
    window.location.href = "/ws-02-1-2?" +encodeURIComponent(uri)
  
}

function trendlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-4?" +encodeURIComponent(uri)
   
}
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