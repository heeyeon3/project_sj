let sensordata = [];


let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";
let topname="";
let sensorname_list = [];
let sensorname_list_xy = [] ;
let chart; 

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

$(function(){
    var frames = window.frames;
    // console.log(frames)
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

             sensorname_list = []
             sensorname_list_xy = []
             for(let i=0; i<sensordata.length; i++){
                 if(sensorname_list.indexOf(sensordata[i].sensor_display_name) == -1){
                     
                    sensorname_list.push(sensordata[i].sensor_display_name)
                     if(sensordata[i].sensor_type == 'x'){
                        
                        for(let j=0; j<sensordata.length; j++){
                            if(sensordata[i].sensor_display_name == sensordata[j].sensor_display_name && sensordata[i].sensor_type != sensordata[j].sensor_type){
                               
                                sensorname_list_xy.push({"sensor_display_name":sensordata[i].sensor_display_name, "x":sensordata[i].sensor_name, "y":sensordata[j].sensor_name})
                            }
                         }
                     }else{
                      
                        for(let j=0; j<sensordata.length; j++){
                            if(sensordata[i].sensor_display_name == sensordata[j].sensor_display_name && sensordata[i].sensor_type != sensordata[j].sensor_type){
                            
                                sensorname_list_xy.push({"sensor_display_name":sensordata[i].sensor_display_name, "x":sensordata[j].sensor_name, "y":sensordata[i].sensor_name})
                            }
                         }
                     }
                     
                    
                 }
            }
           

            level1_max = sensordata[0].sensorgroup_gl1_max
            if(level1_max && level1_max.length != 0 ){level1_min = '-'+level1_max}
            
            level2_max = sensordata[0].sensorgroup_gl2_max
            if(level2_max && level2_max.length != 0 ){level2_min = '-'+level2_max}
            
            level3_max = sensordata[0].sensorgroup_gl3_max
            if(level3_max && level3_max.length != 0 ){level3_min = '-'+level3_max}

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

         

             
            get_initial_date = sensordata[0].sensorgroup_initial_date;

            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#initial_datetime').val(sensordata[0].sensorgroup_initial_date)
     
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#initialsensorname').text(sensordata[0].sensorgroup_name)

            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
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
                    // alert(data.resultString)
                    alert(data.resultString)
                    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                    window.location.href = "/ws-02-1-7?" +encodeURIComponent(uri)
                    // window.location.href =  "/ws-02-1-7?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
                }
            });
        }
        


    })

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })
})



function guideline(){
   
    $('#sensorname').text(sensordata[0].sensorgroup_name)

    $('#sensor_gl1_max').val(sensordata[0].sensorgroup_gl1_max)
    $('#sensor_gl1_min').val(sensordata[0].sensorgroup_gl1_min)
    $('#sensor_gl2_max').val(sensordata[0].sensorgroup_gl2_max)
    $('#sensor_gl2_min').val(sensordata[0].sensorgroup_gl2_min)
    $('#sensor_gl3_max').val(sensordata[0].sensorgroup_gl3_max)
    $('#sensor_gl3_min').val(sensordata[0].sensorgroup_gl3_min)
}

function guidelinesave(){
   

    let sensor_gl1_max = $('#sensor_gl1_max').val()
    let sensor_gl1_min = $('#sensor_gl1_min').val()
    let sensor_gl2_max = $('#sensor_gl2_max').val()
    let sensor_gl2_min = $('#sensor_gl2_min').val()
    let sensor_gl3_max = $('#sensor_gl3_max').val()
    let sensor_gl3_min = $('#sensor_gl3_min').val()



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
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.resultString)
            alert("Guide line이 등록 되었습니다.")
            let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-1-7?" +encodeURIComponent(uri)
            // window.location.href =  "/ws-02-1-7?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
       
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
        url : "/editdata/all",
        type : "POST",
        data : {
         
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            
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
            console.log(graphdata)

            next_time_start = date_time_start;
            next_time_end = date_time_end;

            if(graphdata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selectgraph()
            }

            
       }
    });
    

    

}


function selectgraph(){
    if(chart){chart.destroy()}
    
    const colors = [
        'rgba(255,99,71,1)',
        'rgba(154,205,50,1)',
        'rgba(102,205,170,1)',
        'rgba(100,149,237,1)',
        'rgba(138,43,226,1)',
        'rgba(238,130,238,1)',
        'rgba(255,182,193,1)',
        'rgba(244,164,96,1)',
        'rgba(176,196,222,1)',
        'rgba(255,140,0,1)',
        'rgba(240,230,140,1)',
        'rgba(124,252,0,1)',
        'rgba(60,179,113,1)',
        'rgba(64,224,208,1)',
        'rgba(127,255,212,1)',
        'rgba(106,90,205,1)',
        'rgba(216,191,216,1)',
        'rgba(250,235,215,1)',
        'rgba(255,255,0,1)',
        'rgba(0,255,255,1)'
        ];
        const alphas = [
        'rgba(255,99,71,0.5)',
        'rgba(154,205,50,0.5)',
        'rgba(102,205,170,0.5)',
        'rgba(100,149,237,0.5)',
        'rgba(138,43,226,0.5)',
        'rgba(238,130,238,0.5)',
        'rgba(255,182,193,0.5)',
        'rgba(244,164,96,0.5)',
        'rgba(176,196,222,0.5)',
        'rgba(255,140,0,0.5)',
        'rgba(240,230,140,0.5)',
        'rgba(124,252,0,0.5)',
        'rgba(60,179,113,0.5)',
        'rgba(64,224,208,0.5)',
        'rgba(127,255,212,0.5)',
        'rgba(106,90,205,0.5)',
        'rgba(216,191,216,0.5)',
        'rgba(250,235,215,0.5)',
        'rgba(255,255,0,0.5)',
        'rgba(0,255,255,0.5)'
    
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
            labels.push(graphdata[0][i].sensor_data_date.substr(2,14))

        }
        if(colors.length < graphdata.length){
            for(let i=0; i< graphdata[0].length; i++){
    
                colors.push(colors[i])
                alphas.push(alphas[i])
            }
        }
   
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
    
            
        }
    
        for(let i=0; i<datalist.length; i++){
            datasets.push(
                {
                    label: sensorname_list[i],
                    data: datalist[i],
                    borderColor: colors[i],
                    pointHoverRadius: 6,
                    borderWidth: 2,
                    pointBackgroundColor: function(context) {
                        var last = context.dataset.data.length - 1;
                        if (context.dataIndex == last ){
                            return colors[i];
                        } else {
                            return alphas[i];
                        }
                    }
                }
            )
        }
      
        lv1_display = false
        lv2_display = false    
        lv3_display = false

        if(level1_max && level1_max.length != 0){lv1_display = true}
        if(level2_max && level2_max.length != 0){lv2_display = true}
        if(level3_max && level3_max.length != 0){lv3_display = true}

      
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
                                    console.log(label)
                                    var date = labels[context.dataIndex];
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
function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
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
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-7?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-7?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}


function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-9-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-9-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-10?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-10?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-1-6-1?" +encodeURIComponent(uri)
    // window.location.href =  "/ws-02-1-6-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}