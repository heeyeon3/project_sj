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

let date_time_start = "";
let date_time_end = "";
let intervalday = "";
let time = "";

let sensor_name_list = []
let sensor_display_name_list = []
let datarogger_id_list = []


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

   
    
    searchdata()

    
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

             console.log("sensordata",json.data)

             $('#project_name').val(sensordata[0].project_name)
             $('#place_name').val(sensordata[0].place_name)
             $('#sensor_display_name').val(sensordata[0].sensorgroup_name)
             $('#initial_date').val(sensordata[0].sensor_initial_date)
 

             sensor_name_list = []
             sensor_display_name_list = []
             for(let i=0; i<sensordata.length; i++){
                sensor_name_list.push(sensordata[i].sensor_name)
                datarogger_id_list.push(sensordata[i].datarogger_id)
                sensor_display_name_list.push(sensordata[i].sensor_display_name)
             }

            level1_max = sensordata[0].sensorgroup_gl1_max
            level1_min = sensordata[0].sensorgroup_gl1_min
            level2_max = sensordata[0].sensorgroup_gl2_max
            level2_min = sensordata[0].sensorgroup_gl2_min
            level3_max = sensordata[0].sensorgroup_gl3_max
            level3_min = sensordata[0].sensorgroup_gl3_min

  
     
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
         }
    })


    $('#initialsavebtn').click(function(){
        console.log("!")
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
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                // alert(data.resultString)
                alert(data.resultString)
            //    window.location.href
           
           }
        });


    })
})



function searchdata(){

    $.ajax({
        url : "/editdata/all",
        type : "POST",
        data : {
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            "datarogger_id": datarogger_id,
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
       
            graphdata = data.data
            tabledata = data.data
            console.log(graphdata)
            if(graphdata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selectgraph()
                selecttable()
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

        let labels = [];

        for(let i =0; i<graphdata[0].length; i++){
            labels.push(graphdata[0][i].sensor_data_date)
        }

        let datasets = []
        let data = []
        for(let i = 0; i<sensor_name_list.length; i++){
            data = []
            for(let j = 0; j<graphdata.length; j++){

                if(sensor_name_list[i] == graphdata[j][0].sensor_name && datarogger_id_list[i] == graphdata[j][0].datarogger_id){

                    for(let k = 0; k<graphdata[j].length; k++){
                        if(sensordata[j].sensor_fx_check == '1'){
                            data.push(graphdata[j][k].sensor_fx1_data)
                        }else if(sensordata[j].sensor_fx_check == '2'){
                            data.push(graphdata[j][k].sensor_fx2_data)
                        }else if(sensordata[j].sensor_fx_check == '3'){
                            data.push(graphdata[j][k].sensor_fx3_data)
                        }else if(sensordata[j].sensor_fx_check == '4'){
                            data.push(graphdata[j][k].sensor_fx4_data)
                        }else if(sensordata[j].sensor_fx_check == '5'){
                            data.push(graphdata[j][k].sensor_fx5_data)
                        }
                        
                    }
                }
                

            }

            datasets.push({
                label: sensor_display_name_list[i],
                data: data,
                borderColor: colors[i],
                pointBackgroundColor: colors[i],
                pointRadius:0,
                pointHoverRadius: 6,
                borderWidth: 2.5,
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
                                display : min_lv2_display
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



function selecttable(){
    console.log(tabledata)
   

    $('#tabletbody').empty()
    $('#tabletbody').append("<tr class='uk-text-blue' id='table_top_initial'></tr>")
    $('#tabletbody').append("<tr class='uk-text-success' id='table_top_Displacement'></tr>")
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>측정일시</th>")
    for(let i = 0; i<sensor_display_name_list.length; i++){
        $('#table_top_name').append("<th>"+sensor_display_name_list[i]+"</th>")
       
        
    }

    $('#table_top_initial').empty()
    $('#table_top_initial').append("<td>초기값 (Inicial Data)</td> ")
    for(let i = 0; i<sensordata.length; i++){
        console.log(sensordata[i].sensor_initial_data)
        $('#table_top_initial').append("<td>"+sensordata[i].sensor_initial_data+"</td>")
    }

    $('#table_top_Displacement').empty()
    $('#table_top_Displacement').append("<td>최대변위 (Max Displacement)</td>")
    for(let i = 0; i<sensordata.length; i++){
        console.log(sensordata[i].sensor_initial_data)
       
        let displacement = []
        for(let j = 0; j<tabledata[0].length; j++){
            let displ = parseFloat(tabledata[i][j].sensor_data) - parseFloat(sensordata[i].sensor_initial_data)
            displacement.push(displ.toFixed(4))
        }
        if(displacement.length !=0){
            $('#table_top_Displacement').append("<td>"+Math.max.apply(null,displacement)+"</td>")
        }
        // $('#table_top_Displacement').append("<td>"+Math.max.apply(null,displacement)+"</td>")
    }




    for(let i = 0; i<tabledata[0].length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[0][i].sensor_data_date+"</td>"

        for(let j = 0; j<tabledata.length; j++){

            if(tabledata[j][i].sensor_fx_check_data){
                // console.log(tabledata[j][i].sensor_fx_check_data)
                // if((level3_min && parseFloat(level3_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level3_max && parseFloat(level3_max) < parseFloat(tabledata[j][i].sensor_fx_check_data)) ){
                //     tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                // }else if((level2_min && parseFloat(level2_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level2_max && parseFloat(level2_max) < parseFloat(tabledata[j][i].sensor_fx_check_data))){
                //     tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                // }else if((level1_min && parseFloat(level1_min) > parseFloat(tabledata[j][i].sensor_fx_check_data)) || (level1_max && parseFloat(level1_max) < parseFloat(tabledata[j][i].sensor_fx_check_data))){
                //     tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                // }else{
                //     tdtag += "<td>"+tabledata[j][i].sensor_fx_check_data+"</td>"
                // }
             
                
                // if(level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                //     ((parseFloat(level1_min) > parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level1_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                  
                        
                //     tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_data+"</td>"
        
                // }else if(level2_min.length !=0 && level2_max.length !=0 && level3_min.length !=0 && level3_max.length !=0 &&
                //     ((parseFloat(level2_min) >parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level2_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                //         tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_data+"</td>"
                
                // }else if(level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level3_max) < parseFloat(tabledata[j][i].sensor_fx1_data)))){
                //     tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_data+"</td>"
                 

                   
                // }else{
                //     tdtag += "<td >"+tabledata[j][i].sensor_data+"</td>"
                // }
                tdtag += "<td >"+tabledata[j][i].sensor_fx_check_data+"</td>"
                
            }else{
                // console.log(tabledata[j][i].sensor_fx_check_data)
                // console.log("?")
                tdtag += "<td></td>"
            }
        }
        tdtag +="</tr>"
        $('#datatbletbody').append(tdtag)
        // $('#row_'+i).hide()
    }



}

// http://localhost:5300/report_independent_all?project_id=1&sensorgroup_id=8&sensorgroup_type=0205&date_time_start=2022.02.02%2018:00&date_time_end=2022.03.01%2016:06&intervalday=&time=
// http://localhost:5300/report_independent_all?project_id=1&sensorgroup_id=8&sensorgroup_type=0205&date_time_start=2022.02.02%2018:00&date_time_end=2022.03.02%2016:06&intervalday=&time=