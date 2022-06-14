let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensordata = [];
let tabledata = [];
let sensorgroup_type = "";

let click_pagenum = "";

let chart;
let datatable;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_name_list = []
let sensor_display_name_list = []

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let sensorgroup_interval = "";

let table_fx_data =[];


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

    
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)

   
    searchdata()

 
   
    $('#tablelen').change(function(){
        click_pagenum = 0
        pagenation()
    })



    $.ajax({
        url:"sensorgroup/mapping?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
             console.log(json.data)

             sensordata = json.data

             $('#project_name').val(sensordata[0].project_name)
             $('#place_name').val(sensordata[0].place_name)
             $('#sensor_display_name').val(sensordata[0].sensorgroup_name)
             $('#initial_date').val(sensordata[0].sensor_initial_date)
 

             sensor_name_list = []
             sensor_display_name_list = []
             for(let i=0; i<sensordata.length; i++){
                sensor_name_list.push(sensordata[i].sensor_name)
                sensor_display_name_list.push(sensordata[i].sensor_display_name)
                
             }

            level1_max = sensordata[0].sensorgroup_gl1_max
            level1_min = sensordata[0].sensorgroup_gl1_min
            level2_max = sensordata[0].sensorgroup_gl2_max
            level2_min = sensordata[0].sensorgroup_gl2_min
            level3_max = sensordata[0].sensorgroup_gl3_max
            level3_min = sensordata[0].sensorgroup_gl3_min
            
            sensorgroup_interval = sensordata[0].sensorgroup_interval

  
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#topname').text(sensordata[0].sensorgroup_name)
         }
    })


});



function searchdata(){
    // intervalday = $('#intervalday').val()
    // time = $('#time').val()
    // date_time_start = $('#date_time_start').val()
    // date_time_end = $('#date_time_end').val()

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
    // else if(time.length == 0){
    //     alert("시간을 입력해 주세요")
    //     $('#intervalday').focus()
    //     return;
    // }else if(intervalday.length == 0){
    //     alert("간격을 입력해 주세요")
    //     $('#intervalday').focus()
    //     return;
    // }


    $.ajax({
        url : "/editdata/all/line",
        type : "POST",
        data : {
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            "datarogger_id": datarogger_id,
            "sensorgroup_id": sensorgroup_id,
            "sensorgroup_type": sensorgroup_type

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.resultString)
        //    console.log("Success")

           tabledata = []
           tabledata = data.data
           console.log(tabledata)

           table_fx_data = data.table_fx_data
           console.log(table_fx_data)

           click_pagenum = 0
           if(tabledata[0].length ==0){
            alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selecttable()

              
            }
       
       }
    });


    // 그래프용
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
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.resultString)
       
            graphdata = data.table_fx_data
            console.log(graphdata)
            console.log("sensorgroup_type", sensorgroup_type)
            if(graphdata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else if(sensorgroup_type=='0201'){
                    selectgraph()
            }else if(sensorgroup_type='0202'){
                selectgraphVvertical()
            }
            
       }
    });

}



function selectgraph(){
    console.log("가로형 그래프!!")
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
    if(colors.length < graphdata[0].length){
        for(let i=0; i< graphdata[0].length; i++){

            colors.push(colors[i])
        }
    }

    let datasets = [
 
    ];

    for(let i=0; i<graphdata.length; i++){
        let graphdatalist = []
        for(let j=0; j<labels.length; j++){
            graphdatalist.push(graphdata[i][labels[j]])
        }

        datasets.push({
            label: graphdata[i].sensor_data_date,
            data: graphdatalist,
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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
                            borderWidth: 1.5,
                                // borderDash: [2, 2],
                            label: {
                                enabled: true,
                                position: "end",
                                cornerRadius: 0,
                                backgroundColor: '#ffffff',
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




function selectgraphVvertical(){
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
    

        if(colors.length < graphdata[0].length){
            for(let i=0; i< graphdata[0].length; i++){
    
                colors.push(colors[i])
            }
        }
        console.log(colors)

        
    let daylabel = []
    let data = []
    let graphindex = 0;
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
    console.log(labels)
    // for(let i = 0; i<graphdata[0].length; i++){
    //     labels.push(graphdata[0][i].sensor_data_date)
    // }
    
    let datasets = [];
    
   
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

        
        datasets.push({
            label: graphdata[i].sensor_data_date,
            data: data,
            // data: graphdatalist,
            borderColor: colors[i],
            pointBackgroundColor: colors[i],
            pointHoverRadius: 6,
            borderWidth: 2,
            })
        
        
    }

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
                            x: {min: 'original', max: 'original'},
                            // y: {min: 'original', max: 'original', minRange: 1}
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
                            line1: { // Guideline Lv.1 Max
                                type: 'line',
                                xMin: level1_max,
                                xMax: level1_max,
                                borderColor: '#FFD60A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                xMin: level1_min,
                                xMax: level1_min,
                                borderColor: '#FFD60A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                xMin: level2_max,
                                xMax: level2_max,
                                borderColor: '#FF9F0A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                xMin: level2_min,
                                xMax: level2_min,
                                borderColor: '#FF9F0A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                xMin: level3_max,
                                xMax: level3_max,
                                borderColor: '#FF453A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                xMin: level3_min,
                                xMax: level3_min,
                                borderColor: '#FF453A',
                                borderWidth: 1,
                                borderDash: [2, 2],
                                label: {
                                    yPadding: -20,
                                    enabled: true,
                                    position: "start",
                                    cornerRadius: 0,
                                    backgroundColor: '#ffffff',
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
                                    backgroundColor: '#ffffff',
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


function selecttable(){
    console.log(tabledata)
    if(datatable){datatable.destroy()}


    let sensorM = []
    if(sensorgroup_type == '0202'){
        sensorM.push('0m')
    }
    for(let i=0; i< tabledata.length; i++){
        sensorgroup_interval = parseInt(sensorgroup_interval)
        let sensorinterval = String(parseInt(sensorgroup_interval)*(i+1))+'m'
        sensorM.push(sensorinterval)
    }
    // console.log(sensorM)
    let tablelen = 0
    if(sensorM.length > 8){
        console.log("inin", sensorM)
        // let current_col_len = sensorM.length - 8

        tablelen = parseInt(sensorM.length / 8)
        console.log(tablelen)
        for(let i=0; i<tablelen; i++){
            let tabletag = "<table class='second_table'>"
            tabletag += "<thead>"
            tabletag +=    " <tr id='table_top_name_"+i+"'>"
   
            tabletag +=    "</tr>"
            tabletag += "</thead>"
            tabletag += "<tbody class='td-v-c' id='datatbletbody_"+i+"'>"

            tabletag += "</tbody>"
            tabletag += "</table>"

            $('#firsttable').append(tabletag)
        }
        

    }

    let tableindex = 0
    let colindex = 0
    $('#tabletbody').empty()
    $('#tabletbody').append("<tr class='uk-text-blue' id='table_top_initial'></tr>")
    $('#tabletbody').append("<tr class='uk-text-success' id='table_top_Displacement'></tr>")
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>측정일시</th>")
    for(let i=0; i<tablelen; i++){
        $('#table_top_name_'+i).append("<th>측정일시</th>")

    }
    for(let i = 0; i<sensorM.length; i++){
        // $('#table_top_name').append("<th>"+sensorM[i]+"</th>")
       
        if(i>7){
            $('#table_top_name_'+tableindex).append("<th>"+sensorM[i]+"</th>")
            colindex =+1

            if(tableindex ==8){
                tableindex +=1
                colindex = 0
            }
        }else{
            console.log("?")
            $('#table_top_name').append("<th>"+sensorM[i]+"</th>")
        }
        
    }

    $('#table_top_initial').empty()
    $('#table_top_initial').append("<td>초기값 (Inicial Data)</td> ")
    if(sensorgroup_type == '0202'){
        $('#table_top_initial').append("<td>-</td> ")
    }
    for(let i = 0; i<sensordata.length; i++){
        if(sensordata[i].sensor_initial_data){
            $('#table_top_initial').append("<td>"+sensordata[i].sensor_initial_data+"</td>")
        }
        
    }
   
    $('#table_top_Displacement').empty()
    $('#table_top_Displacement').append("<td>최대변위 (Max Displacement)</td>")
    if(sensorgroup_type == '0202'){
        $('#table_top_Displacement').append("<td>-</td> ")
    }

    for(let i = 0; i<sensordata.length; i++){
       
        if(sensordata[i].sensor_initial_data){
        let displacement = []
        for(let j = 0; j<tabledata[0].length; j++){
            let displ = parseFloat(tabledata[i][j].sensor_data) - parseFloat(sensordata[i].sensor_initial_data)
            displacement.push(displ.toFixed(4))
        }
        if(displacement.length !=0){
            $('#table_top_Displacement').append("<td>"+Math.max.apply(null,displacement)+"</td>")
        }
        }
       
    }

    tableindex = 0
    colindex = 0
    console.log(table_fx_data)


    if(tablelen != 0){
        for(let idx=0; idx<tablelen; idx++){
            console.log(tablelen)
            if(idx == 0){
                console.log("????")
                for(let i=0; i<table_fx_data.length; i++){
                    console.log("ininin")
                    let tdtag = "<tr>"
                    tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
                  
                    for(let j=0; j<8; j++){
                   
                        tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
            
                    }
                    tdtag +="</tr>"
                    $('#datatbletbody').append(tdtag)
                }
            
            }
    
            let startnum = (idx+1) * 8
            let endnum = (idx+2) * 8
            if(endnum > sensorM.length){
                endnum = sensorM.length
            }
            console.log(startnum, endnum)
            for(let i=0; i<table_fx_data.length; i++){
                let tdtag = "<tr>"
                tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
                
                for(let j=startnum; j<endnum; j++){
                    
                    tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
        
                }
                tdtag +="</tr>"
                $('#datatbletbody_'+idx).append(tdtag)
            }
    
            
        }
    }else{
      
        for(let i=0; i<table_fx_data.length; i++){
           
            let tdtag = "<tr>"
            tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
          
            for(let j=0; j<sensorM.length; j++){
           
                tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
    
            }
            tdtag +="</tr>"
            $('#datatbletbody').append(tdtag)
        }
    }

    
    // for(let i=0; i<table_fx_data.length; i++){
    //     let tdtag = "<tr>"
    //     tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
        
    //     //2개 이상의 테이블에 값 넣어줄때
    //     let tdtag1 = "<tr>"
    //     tdtag1 += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
        
    //     for(let j=0; j<sensorM.length; j++){
       
    //         tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"

            

    //         if(j==7){
    //             tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
    //             tdtag +="</tr>"
    //             $('#datatbletbody').append(tdtag)
    //             // let tdtag = "<tr>"
    //             // tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
    //             // tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
    //             // tdtag +="</tr>"
    //             // $('#datatbletbody'+tableindex).append(tdtag)
    //             // colindex =+1
    
    //             // if(tableindex ==8){
    //             //     tableindex +=1
    //             //     colindex = 0
    //             // }
    //         }else{
    //             // let tdtag = "<tr>"
    //             // tdtag += "<td>"+table_fx_data[i].sensor_data_date+"</td>"
    //             tdtag += "<td >"+table_fx_data[i][sensorM[j]]+"</td>"
    //             tdtag +="</tr>"
    //             $('#datatbletbody').append(tdtag)
    //         }
            

    //     }
    //     // tdtag +="</tr>"
    //     // $('#datatbletbody').append(tdtag)
    // }

    


}

let tabletag = "<table>"
tabletag += "<thead>"
tabletag +=    " <tr id='table_top_name'>"
tabletag +=        "<th>계측일자</th>"
tabletag +=        "<th>측정치</a></th>"

tabletag +=    "</tr>"
tabletag += "</thead>"
tabletag += "<tbody class='td-v-c' id='atatbletbody'>"

tabletag += "</tbody>"
tabletag += "</table>"