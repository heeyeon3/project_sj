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


let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";
let sensor_fx_check = ""


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')

 
    sensor_idx = urlParams.get('c2Vx')
    sensor_idy = urlParams.get('c2Vy')
    sensorgroup_type = urlParams.get('Hlw')

    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    next_time_start = date_time_start;
    next_time_end = date_time_end;

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)


  
    
    
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
             if(level1_max && level1_max.length != 0 ){level1_min = '-'+level1_max}
             
             level2_max = sensordata[0].sensor_gl2_max
             if(level2_max && level2_max.length != 0 ){level2_min = '-'+level2_max}
             
             level3_max = sensordata[0].sensor_gl3_max
             if(level3_max && level3_max.length != 0 ){level3_min = '-'+level3_max}

            initial_data = sensordata[0].sensor_initial_data
            sensor_display_name = sensordata[0].sensor_display_name
            let gauge_factor_x = sensordata[0].sensor_gauge_factor

            $('#initial_datetime').val(sensordata[0].sensor_initial_date)
            $('#initialsensorname').text(sensordata[0].sensor_display_name)
          $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)

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
           $('#topname').text(sensordata[0].sensor_display_name)

           $.ajax({
                url:"sensordetail/select?&sensor_id="+sensor_idy,
                type:"get",
                contentType: false,
                processData : false,
                error:function(err){
                    console.log(err);
                },
                success:function(json) {

                    let gauge_factor_y = json.data[0].sensor_gauge_factor
                    // $('#gaugefactorvalue').text("Gauge Factor: x "+gauge_factor_x+" / y "+gauge_factor_y)
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

    $('#initialsave').click(function(){
        let saveconfirm = confirm("전체 initial date 값이 수정됩니다. 수정하시겠습니까?")
        if(saveconfirm){
            let initial_datetime = $('#initial_datetime').val()
            console.log(initial_datetime)

            let form_data = new FormData($('#initialmodal')[0])

            form_data.append("sensor_id", sensor_idx)
            // form_data.append("sensor_name", sensor_name)
            // form_data.append("datarogger_id", datarogger_id)

            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };

            $.ajax({
                url : "/sensordetail/initial",
                type : "POST",
                data : form_data,
                contentType : false,
                processData : false,
                error:function(err){
                    console.log(err)
                console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    alert(data.resultString)
                    // alert("initial Date가 등록 되었습니다.")
                //    window.location.href
                let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
                    // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
                }
            });
        }
    })


    searchdata()
    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

})

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
    }else if(startday < initaildate){
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
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
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
                    next_time_start = date_time_start;
                    next_time_end = date_time_end;

                    graphdata_x = graphdata_x.sort((a,b) => {
                        return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
                
                    })

                    graphdata_y = graphdata_y.sort((a,b) => {
                        return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
                
                    })


                    if(graphdata_y.length ==0){
                        alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
                        }else{
                            selectgraph()
                    }
                
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
    let datalabels = [];
    let datax = [];
    let datay = [];
    let data = [];
    for(let i = 0; i<graphdata_x.length; i++){
        labels.push(graphdata_x[i].sensor_data_date.substr(2,14))
        datalabels.push(graphdata_x[i].sensor_data_date)
        data.push({x: null, y: null})
        
    }
    if(sensor_fx_check == 1){
        for(let i=0; i<datalabels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(datalabels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx1_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(datalabels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx1_data
                }
            }
         
        }

      
      
    }else if(sensor_fx_check == 2){
        for(let i=0; i<datalabels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(datalabels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx2_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(datalabels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx2_data
                }
            }
         
        }
     
       
    }else if(sensor_fx_check == 3){
        for(let i=0; i<datalabels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(datalabels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx3_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(datalabels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx3_data
                }
            }
         
        }
     
      
    }else if(sensor_fx_check == 4){
        for(let i=0; i<datalabels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(datalabels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx4_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(datalabels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx4_data
                }
            }
         
        }
      
 
    }else if(sensor_fx_check == 5){
        for(let i=0; i<datalabels.length; i++){
            for(let j=0; j<graphdata_x.length; j++){
                if(datalabels[i] == graphdata_x[j].sensor_data_date){
                    data[i].x = graphdata_x[j].sensor_fx5_data
                }
            }
            for(let j=0; j<graphdata_y.length; j++){
                if(datalabels[i] == graphdata_y[j].sensor_data_date){
                    data[i].y = graphdata_y[j].sensor_fx5_data
                }
            }
         
        }
     
       
    }

  

    const total = data.length+1;
    const gradation = [];
    for (i = 0; i < total; i++) {
        const c = 255 - i*(255/total);
        gradation.push('rgba('+c+','+c+','+c+', 1');  
    }

    // labels = [sensor_display_name];
    datasets = []
    for(let i = 0; i<data.length; i++){
        datasets.push({
            label: labels[i],
            data: [data[i]],
            borderColor: gradation[i],
            pointBackgroundColor: gradation[i],
            pointHoverRadius: 6,
            borderWidth: 2,
        })
    }
   
    lv1_display = false
    lv2_display = false    
    lv3_display = false

//    console.log(level1_max, level1_min, level2_max, level2_min, level3_max, level3_min)
    if(level1_max && level1_max.length != 0){lv1_display = true}
    if(level2_max && level2_max.length != 0){lv2_display = true}
    if(level3_max && level3_max.length != 0){lv3_display = true}

    graphmin = parseFloat(level3_min)-parseFloat(level3_max)*0.1
    graphmax = parseFloat(level3_max)+parseFloat(level3_max)*0.1
   
    chart = new Chart('sensors', {
        type: 'scatter',
        data: {
            labels: sensor_display_name,
            datasets: datasets,
        },
        options: {
            interaction: {
                intersect: false,
                mode: 'index',
            },
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

function resetZoomChart() {
    chart.resetZoom();
}
function chartZoom(value) {
    chart.zoom(value);
}




function guideline(){
    console.log("sensordata")

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
            let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
            // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
        }
    });
   
}



let column00 = false
let column01 = true
let column02 = true
let column03 = true
let column04 = true
let column05 = true
let column06 = true

function orderling(num) {
    console.log("!!", num)
    if(column00){
        $('#order_0').attr('uk-icon', 'icon: chevron-down')
        tabledata = tabledata.sort((a,b) => {
            return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
    
            })
            selecttable()
            column00 = false
    }else{
        $('#order_0').attr('uk-icon', 'icon: chevron-up')
        column00 = tabledata.sort((a,b) => {
            return new Date(a.sensor_data_date) - new Date(b.sensor_data_date)
    
            })
            selecttable()
            column00 = true
    }

   
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
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-6?"+encodeURIComponent(uri)
}

function trendlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function fomulalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4-1?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-4-1?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function infolocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-9?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-9?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}