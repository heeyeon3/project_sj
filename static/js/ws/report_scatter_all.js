//  스캐터 제외 report!

let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let graphdata = [];
let project_id = "";
let sensorgroup_type = "";

let chart;
let wchart;
let tabledata;
let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let initial_data = "";

let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let topname=""

let sensor_fx_check =""
let curStart = 0;
let sensor_display_name="";
let sensor_initial_date = "";

let sensorname_list = [];
let sensorname_list_xy = [] ;

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

    // console.log(project_id, sensorgroup_id, place_id ,datarogger_id )
    // console.log(date_time_end, date_time_start, time,intervalday )

    if(date_time_start){
        $("#date_time_start").val(date_time_start)
        $("#date_time_end").val(date_time_end)
    }else{
        let today = new Date()
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
       
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        console.log(minutes, String(minutes).length)
        if(String(month).length <2){month = "0"+month}
        if(String(minutes).length <2){minutes = "0"+minutes}
        if(String(date).length <2){date = "0"+date}
    
    
        let endday = year+"."+month+"."+date+" "+hours+":"+minutes
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
    
        let startday = Agodateyear+"."+Agodatemonth+"."+Agodatedate+" "+Agodatehours+":"+Agodateminutes
        $("#date_time_start").val(startday)
    }


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
            console.log(sensordata[0].project_name)
            $('#project_name').val(sensordata[0].project_name)
            $('#place_name').val(sensordata[0].place_name)
            $('#sensor_display_name').val(sensordata[0].sensorgroup_name)
            $('#initial_date').val(sensordata[0].sensor_initial_date)

            

             sensorname_list = []
             sensorname_list_xy = []
             for(let i=0; i<sensordata.length; i++){
                 if(sensorname_list.indexOf(sensordata[i].sensor_display_name) == -1){
                     
                    sensorname_list.push(sensordata[i].sensor_display_name)
                     if(sensordata[i].sensor_type == 'x'){
                        
                        for(let j=0; j<sensordata.length; j++){
                            if(sensordata[i].sensor_display_name == sensordata[j].sensor_display_name && sensordata[i].sensor_type != sensordata[j].sensor_type){
                               
                                sensorname_list_xy.push({"sensor_display_name":sensordata[i].sensor_display_name, "x":sensordata[i].sensor_name, "y":sensordata[j].sensor_name,"sensor_data_x":sensordata[i].sensor_initial_data,"sensor_data_y":sensordata[i].sensor_initial_data})
                            }
                         }
                     }else{
                      
                        for(let j=0; j<sensordata.length; j++){
                            if(sensordata[i].sensor_display_name == sensordata[j].sensor_display_name && sensordata[i].sensor_type != sensordata[j].sensor_type){
                            
                                sensorname_list_xy.push({"sensor_display_name":sensordata[i].sensor_display_name, "x":sensordata[j].sensor_name, "y":sensordata[i].sensor_name,"sensor_data_x":sensordata[i].sensor_initial_data,"sensor_data_y":sensordata[i].sensor_initial_data})
                            }
                         }
                     }
                     
                    
                 }
             }
             console.log(sensorname_list)
             console.log(sensorname_list_xy)

             level1_max = sensordata[0].sensorgroup_gl1_max
             if(level1_max && level1_max.length != 0 ){level1_min = '-'+level1_max}
             
             level2_max = sensordata[0].sensorgroup_gl2_max
             if(level2_max && level2_max.length != 0 ){level2_min = '-'+level2_max}
             
             level3_max = sensordata[0].sensorgroup_gl3_max
             if(level3_max && level3_max.length != 0 ){level3_min = '-'+level3_max}
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#initial_datetime').val(sensordata[0].sensorgroup_initial_date)
     
            $('#topsensername').text(sensordata[0].sensorgroup_name)
         }
    })

    
    searchdata()
    



    // $.ajax({
    //     url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_id,
    //     type:"get",
    //     contentType: false,
    //     processData : false,
    //     error:function(err){
    //         console.log(err);
    //      },
    //      success:function(json) {
    //          console.log(json.data)

    //          sensordata = json.data
    //          console.log(sensordata)

    //          $('#topsensername').text(sensordata[0].sensor_name)
    //         level1_max = sensordata[0].sensor_gl1_max
    //         level1_min = sensordata[0].sensor_gl1_min
    //         level2_max = sensordata[0].sensor_gl2_max
    //         level2_min = sensordata[0].sensor_gl2_min
    //         level3_max = sensordata[0].sensor_gl3_max
    //         level3_min = sensordata[0].sensor_gl3_min

    //         initial_data = sensordata[0].sensor_initial_data
    //         sensor_display_name = sensordata[0].sensor_display_name
      

    //         level1_max = sensordata[0].sensor_gl1_max
    //         level1_min = sensordata[0].sensor_gl1_min
    //         level2_max = sensordata[0].sensor_gl2_max
    //         level2_min = sensordata[0].sensor_gl2_min
    //         level3_max = sensordata[0].sensor_gl3_max
    //         level3_min = sensordata[0].sensor_gl3_min

    //         sensor_fx1 = sensordata[0].sensor_fx1
    //         sensor_fx2 = sensordata[0].sensor_fx2
    //         sensor_fx3 = sensordata[0].sensor_fx3
    //         sensor_fx4 = sensordata[0].sensor_fx4
    //         sensor_fx5 = sensordata[0].sensor_fx5
    //         sensor_fx_check = sensordata[0].sensor_fx_check

    //         if(sensor_fx_check == 1){
    //             $('#sensorfxname').text(sensordata[0].sensor_fx1_name)
    //         }else if(sensor_fx_check == 2){
    //             $('#sensorfxname').text(sensordata[0].sensor_fx2_name)
    //         }else if(sensor_fx_check == 3){
    //             $('#sensorfxname').text(sensordata[0].sensor_fx3_name)
    //         }else if(sensor_fx_check == 4){
    //             $('#sensorfxname').text(sensordata[0].sensor_fx4_name)
    //         }else if(sensor_fx_check == 5){
    //             $('#sensorfxname').text(sensordata[0].sensor_fx5_name)
    //         }

           
           
    //         // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
    //         if(sensordata[0].sensor_gauge_factor){
    //             // $('#gaugefactorandvalue').text("Gauge Factor: 0")
    //             // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
    //         }
    //         $('#initial_date').val(sensordata[0].sensor_initial_date)

            
    //         $('#porject_name').val(sensordata[0].project_name)
    //         $('#place_name').val(sensordata[0].place_name)
 
    //         topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
    //         $('#sensor_display_name').val(sensordata[0].sensor_display_name)
 
    //      }
    // })

    // $("#initialX, #initialcancle, #guidelineX, #guidelinecancle").click(function(){
    //     console.log("1")
    //     window.location.href = "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&intervalday="+intervalday+"&time="+time+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
   
       
        
      
    // })

    

    // $.ajax({
    //     url : '/fomula/list/project?project_id='+project_id,
    //     type : "get",
    //     contentType : false,
    //     processData : false,
    //     error:function(){
    //        alert("공식이 올바르지 않습니다.");
    //     },
    //     success:function(data) {

    //         console.log(data.data)

    //         fomulalist = data.data

    //         for(let i=0; i<fomulalist.length; i++){
    //             $('#fomulas').append("<option value='"+(i+1)+"' formula='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
    //         }


            
    //    }
    // });

});





function searchdata(){
    
    let startday = new Date(date_time_start)
    let lastday = new Date(date_time_end)
    let diffdate = lastday.getTime() - startday.getTime()
    let diffDay = Math.floor(diffdate/(1000 * 3600 * 24));
    
    let today = new Date()

    if(lastday > today){
        alert("미래데이터는 표출할 수 없습니다.")
        return;
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
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.resultString)
       
            graphdata = data.data
            console.log(graphdata)
            tabledata = data.data
            console.log(tabledata)

            if(graphdata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selectgraph()
                selecttable()
            }

            
       }
    });
    

    

}


let labels = [];

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
    
        let labels = []
        for(let i=0; i<graphdata[0].length; i++){
            labels.push(graphdata[0][i].sensor_data_date)

        }
        console.log(labels, graphdata.length)
        // const labels = ['2021.10.01 21:00', '2021.10.02 21:00' ,'2021.10.03 21:00', '2021.10.04 21:00', '2021.10.05 21:00', '2021.10.06 21:00', '2021.10.07 21:00'];
        let data = []
        let datasets = []
        let datalist = []
        for(let i=0; i<sensorname_list_xy.length; i++){
            data = []
            for(j=0; j<graphdata.length; j++){
                if(sensorname_list_xy[i].x == graphdata[j][0].sensor_name){
                   
                    for(let k = 0; k<graphdata[j].length; k++){
                      
                        data.push({"x":graphdata[j][k].sensor_fx1_data, "y": null})
                    }
                    
                }
                
            }


            for(j=0; j<graphdata.length; j++){
                
                if(sensorname_list_xy[i].y ==graphdata[j][0].sensor_name){
                    for(let k = 0; k<graphdata[j].length; k++){
                      
                        data[k].y = graphdata[j][k].sensor_fx1_data
                    }
                    
                }
            }
            datalist.push(data)
            console.log(data)
            
        }
        console.log(datalist)

        for(let i=0; i<datalist.length; i++){
            datasets.push(
                {
                    label: sensorname_list[i],
                    data: datalist[i],
                    borderColor: colors[i],
                    pointBackgroundColor: colors[i],
                    pointHoverRadius: 1,
                    borderWidth: 2,
                    pointRadius: 0.5,
                }
            )
        }
      
        console.log(labels)
        let idx = 0
        chart = new Chart('sensors', {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
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
                            // x: {min: 'original', max: 'original', minRange: 3},
                            // y: {min: 'original', max: 'original', minRange: 1}
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
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
                            mode: 'xy',
                        },
                    },
                    tooltip: {
                        padding: 10,
                        cornerRadius: 0,
                        bodySpacing: 4,
                        titleSpacing: 10,
                            //multiKeyBackground: '#00000000',
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    var label = context.dataset.label || '';
                                    console.log(context)
                                    console.log("!!!")
                                    var date = labels[0];
                                    // idx++
                                    var data = '( x : ' + context.parsed.x + ', y : ' + context.parsed.y + ' )';
                                    if (label) {
                                        label += '';
                                    }
                                    return [label, date, data];
                                }
                            }
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
                            line1: { // Guideline Lv.1
                                type: 'box',
                                xMin: level1_min,
                                xMax: level1_max,
                                yMin: level1_min,
                                yMax: level1_max,
                                backgroundColor: 'transparent',
                                borderColor: '#FFD60A',
                                borderWidth: 1.5,
                                // borderDash: [2, 2],
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
                                }
                            },
                            line2: { // Guideline Lv.2
                                type: 'box',
                                xMin: level2_min,
                                xMax: level2_max,
                                yMin: level2_min,
                                yMax: level2_max,
                                backgroundColor: 'transparent',
                                borderColor: '#FF9F0A',
                                borderWidth: 1.5,
                                // borderDash: [2, 2],
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
                                }
                            },
                            line3: { // Guideline Lv.3
                                type: 'box',
                                xMin: level3_min,
                                xMax: level3_max,
                                yMin: level3_min,
                                yMax: level3_max,
                                backgroundColor: 'transparent',
                                borderColor: '#FF453A',
                                borderWidth: 1.5,
                                // borderDash: [2, 2],
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
                                }
                            },
                            line4: { // Initial
                                type: 'line',
                                xMin: 0,
                                xMax: 0,
                                borderColor: 'rgba(255, 255, 255, .1)',
                                borderWidth: 1.5,
                                label: {
                                    enabled: true,
                                    position: "end",
                                    cornerRadius: 0,
                                    backgroundColor: '#191919',
                                    content: '',
                                    color: '#1e87f0',
                                    font: {
                                        style: 'normal',
                                    }
                                }
                            },
                            line5: { // Initial
                                type: 'line',
                                yMin: 0,
                                yMax: 0,
                                borderColor: 'rgba(255, 255, 255, .1)',
                                borderWidth: 1,
                                label: {
                                    enabled: true,
                                    position: "end",
                                    cornerRadius: 0,
                                    backgroundColor: '#191919',
                                    content: '',
                                    color: '#1e87f0',
                                    font: {
                                        style: 'normal',
                                    }
                                }
                            },
                        }
                    }
                }
            }
        })
}

function selecttable(){
  

    let sensor_Date = []
    for(let i=0; i<tabledata[0].length; i++){
        sensor_Date.push(tabledata[0][i].sensor_data_date)
    }
    let t1h_data = [];
    let rn1_data = [];

  

    let rowindex = 0
    $('#tabletbody').empty()
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>측정일시</th>")
    
    $('#tabletbody').append("<tr class='uk-text-success' id='Displacement'><td>최대변위 (Max Displacement)</td></tr>")
    for(let i = 0; i<sensorname_list_xy.length; i++){
        $('#table_top_name').append("<th>"+sensorname_list_xy[i].sensor_display_name+"</th>")
        // $('#Displacement').append("<td>x: -0.0060423<br>y: -0.0060423</td>")
     
    }
    

    
       
        let data = []
        let datasets = []
        let datalist = []
        for(let i=0; i<sensorname_list_xy.length; i++){
            data = []
            for(j=0; j<tabledata.length; j++){
                if(sensorname_list_xy[i].x == tabledata[j][0].sensor_name){
                   
                    for(let k = 0; k<tabledata[j].length; k++){
                      
                        data.push({"sensor_data_date":tabledata[j][k].sensor_data_date,"x":tabledata[j][k].sensor_data, "y": null, "sensor_fx_check_data_x":tabledata[j][k].sensor_fx_check_data, "sensor_fx_check_data_y": null})
                    }
                    
                }
                
            }


            for(j=0; j<tabledata.length; j++){
                
                if(sensorname_list_xy[i].y ==tabledata[j][0].sensor_name){
                    for(let k = 0; k<tabledata[j].length; k++){
                      
                        data[k].y = tabledata[j][k].sensor_data
                        data[k].sensor_fx_check_data_y = tabledata[j][k].sensor_fx_check_data
                    }
                    
                }
            }
            datalist.push(data)
          
            
        }
    

    for(let i=0; i<sensorname_list_xy.length; i++){

        let data_X = 0
        let data_Y = 0
        let initial_X = sensorname_list_xy[i].sensor_data_x
        let initial_Y = sensorname_list_xy[i].sensor_data_y
        let current_fx_data_x;
        let current_fx_data_y;
        for(let j=0; j<datalist[0].length; j++){
            // console.log(datalist[i][j])
            if(datalist[i][j]){
                let displacement_x =Math.abs(parseFloat(datalist[i][j].x) - parseFloat(initial_X))
                let displacement_y = Math.abs(parseFloat(datalist[i][j].y) - parseFloat(initial_Y))

                if(data_X < displacement_x){
                    data_X = displacement_x
                    current_fx_data_x = datalist[i][j].sensor_fx_check_data_x

                }

                if(data_Y < displacement_y){
                    data_X = displacement_x
                    current_fx_data_y = datalist[i][j].sensor_fx_check_data_y

                }
               
        
            }
            
        }
 
        $('#Displacement').append("<td>x: "+current_fx_data_x+"<br>y: "+current_fx_data_y+"</td>")
        if(i == sensorname_list_xy.length-1){
            $('#Displacement').append("<th></th>")
            $('#Displacement').append("<th></th>")
        }
    }
   



    

    for(let i = 0; i<datalist[0].length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+datalist[0][i].sensor_data_date.substr(0,16)+"</td>"

        for(let j = 0; j<datalist.length; j++){

    
            if(datalist[j][i].sensor_fx_check_data_x){

                if((level3_min && parseFloat(level3_min) > parseFloat(datalist[j][i].sensor_fx_check_data_x)) || (level3_max && parseFloat(level3_max) < parseFloat(datalist[j][i].sensor_fx_check_data_x)) ){
                    tdtag += "<td><span class='uk-text-red'>x: "+datalist[j][i].sensor_fx_check_data_x+"</span>"
                }else if((level2_min && parseFloat(level2_min) > parseFloat(datalist[j][i].sensor_fx_check_data_x)) || (level2_max && parseFloat(level2_max) < parseFloat(datalist[j][i].sensor_fx_check_data_x)) ){
                    tdtag += "<td><span class='uk-text-orange'>x: "+datalist[j][i].sensor_fx_check_data_x+"</span>"
                }else if((level1_min && parseFloat(level1_min) > parseFloat(datalist[j][i].sensor_fx_check_data_x)) || (level1_max && parseFloat(level1_max) < parseFloat(datalist[j][i].sensor_fx_check_data_x)) ){
                    tdtag += "<td><span class='uk-text-yellow'>x: "+datalist[j][i].sensor_fx_check_data_x+"</span>"
                }else{
                    tdtag += "<td>x: "+datalist[j][i].sensor_fx_check_data_x
                }
             

                
            }else{
                tdtag += "<td>x: "
              
            }


            if(datalist[j][i].sensor_fx_check_data_y){

                if((level3_min && parseFloat(level3_min) > parseFloat(datalist[j][i].sensor_fx_check_data_y)) || (level3_max && parseFloat(level3_max) < parseFloat(datalist[j][i].sensor_fx_check_data_y)) ){
                    tdtag += "<br><span class='uk-text-red'>y: "+datalist[j][i].sensor_fx_check_data_y+"</span></td>"
                }else if((level2_min && parseFloat(level2_min) > parseFloat(datalist[j][i].sensor_fx_check_data_y)) || (level2_max && parseFloat(level2_max) < parseFloat(datalist[j][i].sensor_fx_check_data_y)) ){
                    tdtag += "<br><span class='uk-text-orange'>y: "+datalist[j][i].sensor_fx_check_data_y+"</span></td>"
                }else if((level1_min && parseFloat(level1_min) > parseFloat(datalist[j][i].sensor_fx_check_data_y)) || (level1_max && parseFloat(level1_max) < parseFloat(datalist[j][i].sensor_fx_check_data_y)) ){
                    tdtag += "<br><span class='uk-text-yellow'>y: "+datalist[j][i].sensor_fx_check_data_y+"</span></td>"
                }else{
                    tdtag +="<br>y: "+datalist[j][i].sensor_fx_check_data_y+"</td>"
                }
             
         

                
            }else{
                
                tdtag +="<br>y:</td>"
            }        

            
        }

        tdtag +="</tr>"
        $('#datatbletbody').append(tdtag)
        // $('#row_'+i).hide()
    }

    


}