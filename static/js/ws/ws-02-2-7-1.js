let project_id = "";
let sensorgrouplist = [];
let sensordetail_id = "";
let sensor_id = "";
let datarogger_id = "";
let sensor_namex = "";
let sensor_namey = "";
let sensorgroup_type = "";
let sensor_idx = "";
let sensor_idy = "";
let sensordata = [];


let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let topname=""

let graphdata_x = []
let graphdata_y = []
let chart;
let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";
let sensor_display_name = "";

let sensor_fx_check = ""
$(function(){
    var url = new URL(window.location.href);
    const urlParams = url.searchParams;

    project_id = urlParams.get('project_id')
    sensorgroup_id = urlParams.get('sensorgroup_id')
    place_id = urlParams.get('place_id')
    datarogger_id = urlParams.get('datarogger_id')
    sensorgroup_type = urlParams.get('sensorgroup_type')


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
    // searchdata()

    // $('#initial_datetime').val(sensordata[0].sensor_initial_date)

    $('#linechart').attr("href", "ws-02-1-7?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#trend').attr("href", "ws-02-2-7-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
 
    $('#timelinechart').attr("href", "ws-02-1-9-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#data').attr("href", "ws-02-1-10?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#info').attr("href", "ws-02-1-6-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)


    
    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_idx,
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

             $('#topsensername').text(sensordata[0].sensor_name)
            level1_max = sensordata[0].sensor_gl1_max
            level1_min = sensordata[0].sensor_gl1_min
            level2_max = sensordata[0].sensor_gl2_max
            level2_min = sensordata[0].sensor_gl2_min
            level3_max = sensordata[0].sensor_gl3_max
            level3_min = sensordata[0].sensor_gl3_min

            initial_data = sensordata[0].sensor_initial_data
            sensor_display_name = sensordata[0].sensor_display_name

            $('#initial_datetime').val(sensordata[0].sensor_initial_date)
            // $('#chart').attr("href", "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#data').attr("href", "ws-02-2-3?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#fomula').attr("href", "ws-02-2-4?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            // $('#info').attr("href", "ws-02-2-5?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type)
            
    

            $('#gl1max').text(sensordata[0].sensor_gl1_max)
            $('#gl1min').text(sensordata[0].sensor_gl1_min)
            $('#gl2max').text(sensordata[0].sensor_gl2_max)
            $('#gl2min').text(sensordata[0].sensor_gl2_min)
            $('#gl3max').text(sensordata[0].sensor_gl3_max) 
            $('#gl3min').text(sensordata[0].sensor_gl3_min)

            sensor_fx_check = sensordata[0].sensor_fx_check

            if(sensor_fx_check == 1){
                $('#sensorfxname').text(sensordata[0].sensor_fx1_name)
            }else if(sensor_fx_check == 2){
                $('#sensorfxname').text(sensordata[0].sensor_fx2_name)
            }else if(sensor_fx_check == 3){
                $('#sensorfxname').text(sensordata[0].sensor_fx3_name)
            }else if(sensor_fx_check == 4){
                $('#sensorfxname').text(sensordata[0].sensor_fx4_name)
            }else if(sensor_fx_check == 5){
                $('#sensorfxname').text(sensordata[0].sensor_fx5_name)
            }

           
            // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            if(sensordata[0].sensor_gauge_factor){
                // $('#gaugefactorandvalue').text("Gauge Factor: 0")
                // $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            }
            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)

            
           $('#projectName').text(sensordata[0].project_name)
           $('#placeName').text(sensordata[0].place_name)

           topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
           $('#topname').text(sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")")

        //    $.ajax({
        //     url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_idy,
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
    
                
        //      }
        //      })
         }
    })

    $('#initialsave').click(function(){
        let initial_datetime = $('#initial_datetime').val()
        console.log(initial_datetime)

        let form_data = new FormData()

        form_data.append("sensor_idx", sensor_idx)
        form_data.append("sensor_idy", sensor_idy)
        form_data.append("sensor_namex", sensor_namex)
        form_data.append("sensor_namey", sensor_namey)
        form_data.append("datarogger_id", datarogger_id)
        form_data.append("sensor_initial_date", initial_datetime)

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };

        $.ajax({
            url : "/sensordetail/initial/scatter",
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
                alert("initial Date가 등록 되었습니다.")
            //    window.location.href
           
           }
        });
    })



    
    

})

function searchdata(){
    intervalday = $('#intervalday').val()
    time = $('#time').val()
    date_time_start = $('#date_time_start').val()
    date_time_end = $('#date_time_end').val()

    let startday = new Date(date_time_start)
    let lastday = new Date(date_time_end)
    let diffdate = lastday.getTime() - startday.getTime()
    let diffDay = Math.floor(diffdate/(1000 * 3600 * 24));
    
    let today = new Date()

    if(lastday > today){
        alert("미래데이터는 표출할 수 없습니다.")
        return;
    }

    if(date_time_start.length == 0 && date_time_end.length != 0){
        alert("시작 날짜를 입력해 주세요")
        $('#date_time_start').focus()
        return;
    }else if(date_time_start.length != 0 && date_time_end.length == 0){
        alert("마지막 날짜를 입력해 주세요")
        $('#date_time_end').focus()
        return;
    }

    graphdata_x = []
    graphdata_y = []
    console.log($("#date_time_start").val())

    //y data
    $.ajax({
        url : "/editdata/table",
        type : "POST",
        data : {
            "sensor_id": sensor_idx,
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            "sensor_name": sensor_namex

        },
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
           console.log(data.data)
            graphdata_x = data.data

            //y data
            $.ajax({
                url : "/editdata/table",
                type : "POST",
                data : {
                    "sensor_id": sensor_idy,
                    "datarogger_id": datarogger_id,
                    "date_time_start": date_time_start,
                    "date_time_end": date_time_end,
                    "intervalday": intervalday,
                    "time": time,
                    "sensor_name": sensor_namey

                },
                error:function(err){
                    console.log(err)
                console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    console.log(data.data)
                    graphdata_y = data.data

                    selectgraph()
                
            }
            });
        
       }
    });

    

    
}

function selectgraph(){

    console.log(graphdata_x)
    console.log(graphdata_y)

    if(chart){
        console.log("차트삭제")
        chart.destroy()
        // chart.clear()
    }
        

 

    let labels = [];
    let datax = [];
    let datay = [];
    let data = [];
    for(let i = 0; i<graphdata_x.length; i++){
        labels.push(graphdata_x[i].sensor_data_date)
        data.push({x: null, y: null})
        
    }
    if(sensor_fx_check == 1){
        for(let i=0; i<labels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(labels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx1_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(labels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx1_data
                }
            }
         
        }

      
      
    }else if(sensor_fx_check == 2){
        for(let i=0; i<labels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(labels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx2_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(labels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx2_data
                }
            }
         
        }
     
       
    }else if(sensor_fx_check == 3){
        for(let i=0; i<labels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(labels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx3_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(labels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx3_data
                }
            }
         
        }
     
      
    }else if(sensor_fx_check == 4){
        for(let i=0; i<labels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(labels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx4_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(labels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx4_data
                }
            }
         
        }
      
 
    }else if(sensor_fx_check == 5){
        for(let i=0; i<labels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(labels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx5_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(labels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx5_data
                }
            }
         
        }
     
       
    }

    console.log(data)

    const total = data.length+1;
    const gradation = [];
    for (i = 0; i < total; i++) {
        const c = 255 - i*(255/total);
        gradation.push('rgba('+c+','+c+','+c+', 1');  
    }

    // labels = [sensor_display_name];
    datasets = []
    for(let i = 0; i<data.length; i++){
        console.log(data[i])
        datasets.push({
            label: labels[i],
            data: [data[i]],
            borderColor: gradation[i],
            pointBackgroundColor: gradation[i],
            pointHoverRadius: 6,
            borderWidth: 2,
        })
    }
   
    lv1_display = true
    lv2_display = true    
    lv3_display = true
    

   console.log(level1_max, level1_min, level2_max, level2_min, level3_max, level3_min)
    if(level1_max.length == 0 || level1_min.length == 0){lv1_display = false}
    if(level2_max.length == 0 || level2_min.length == 0){lv2_display = false}
    if(level3_max.length == 0 || level3_min.length == 0){lv3_display = false}
    console.log(level3_min-level3_max*0.1, level3_max+level3_max*0.1)

    graphmin = parseFloat(level3_min)-parseFloat(level3_max)*0.1
    graphmax = parseFloat(level3_max)+parseFloat(level3_max)*0.1
    console.log(lv1_display, lv2_display, lv3_display)
    chart = new Chart('sensors', {
        type: 'scatter',
        data: {
            labels: sensor_display_name,
            datasets: datasets,
        },
        options: {
            // maintainAspectRatio: true,
            responsive: false,
            scales: {
                x: {
                    // min: graphmin,
                    // max: graphmax,
                    grid: {
                        color: '#222',
                    }
                },
                y: {
                    // min: graphmin,
                    // max: graphmax,
                    grid: {
                        color: '#222',
                    }
                }
            },
            plugins: {
                tooltip: {
                    padding: 10,
                    cornerRadius: 0,
                    bodySpacing: 4,
                    titleSpacing: 10,
                        multiKeyBackground: '#00000000',
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                var data = '( x : ' + context.parsed.x + ', y : ' + context.parsed.y + ' )';
                                if (label) {
                                    label += '';
                                }
                                return [label, data];
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
                            display : lv1_display
                        },
                        line2: { // Guideline Lv.2
                            type: 'box',
                            xMin: level2_min,
                            xMax: level2_max,
                            yMin: level2_min,
                            yMax: level2_max,
                            backgroundColor: 'transparent',
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
                            display : lv2_display
                        },
                        line3: { // Guideline Lv.3
                            type: 'box',
                            xMin: level3_min,
                            xMax: level3_max,
                            yMin: level3_min,
                            yMax: level3_max,
                            backgroundColor: 'transparent',
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
                            display : lv3_display
                        },
                        line4: { // Initial
                            type: 'line',
                            xMin: 0,
                            xMax: 0,
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




function guideline(){
    console.log(sensordata)

    $('#sensorname').text(sensordata[0].sensor_display_name)

    $('#sensor_gl1_max').val(sensordata[0].sensor_gl1_max)
    $('#sensor_gl1_min').val(sensordata[0].sensor_gl1_min)
    $('#sensor_gl2_max').val(sensordata[0].sensor_gl2_max)
    $('#sensor_gl2_min').val(sensordata[0].sensor_gl2_min)
    $('#sensor_gl3_max').val(sensordata[0].sensor_gl3_max)
    $('#sensor_gl3_min').val(sensordata[0].sensor_gl3_min)
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

    form_data.append("sensor_idx", sensor_idx)
    form_data.append("sensor_idy", sensor_idy)

    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };

    $.ajax({
        url : "/sensordetail/guidline/scatter",
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
            alert("Guide line이 등록 되었습니다.")
        //    window.location.href
       
       }
    });
   
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