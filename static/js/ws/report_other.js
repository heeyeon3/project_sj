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
$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
   
    // url = decodeURIComponent( url )
    // console.log(url)
    const urlParams = url.searchParams;
    console.log(urlParams)



    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')

    sensorgroup_type = urlParams.get('Hlw')
    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    next_time_start = date_time_start;
    next_time_end = date_time_end;
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')
    
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)

    console.log(date_time_end, date_time_start, time,intervalday )

    


    
    searchdata()
    



    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_id,
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
      

            level1_max = sensordata[0].sensor_gl1_max
            level1_min = sensordata[0].sensor_gl1_min
            level2_max = sensordata[0].sensor_gl2_max
            level2_min = sensordata[0].sensor_gl2_min
            level3_max = sensordata[0].sensor_gl3_max
            level3_min = sensordata[0].sensor_gl3_min

            sensor_fx1 = sensordata[0].sensor_fx1
            sensor_fx2 = sensordata[0].sensor_fx2
            sensor_fx3 = sensordata[0].sensor_fx3
            sensor_fx4 = sensordata[0].sensor_fx4
            sensor_fx5 = sensordata[0].sensor_fx5
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
            $('#initial_date').val(sensordata[0].sensor_initial_date)

            
            $('#porject_name').val(sensordata[0].project_name)
            $('#place_name').val(sensordata[0].place_name)
 
            topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
            $('#sensor_display_name').val(sensordata[0].sensor_display_name)
 
         }
    })

    // $("#initialX, #initialcancle, #guidelineX, #guidelinecancle").click(function(){
    //     console.log("1")
    //     window.location.href = "ws-02-2-1?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&sensor_name="+sensor_name+"&project_id="+project_id+"&intervalday="+intervalday+"&time="+time+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
   
       
        
      
    // })

    

    $.ajax({
        url : '/fomula/list/project?project_id='+project_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(){
           alert("공식이 올바르지 않습니다.");
        },
        success:function(data) {

            console.log(data.data)

            fomulalist = data.data

            for(let i=0; i<fomulalist.length; i++){
                $('#fomulas').append("<option value='"+(i+1)+"' formula='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
            }


            
       }
    });

    
   $('#savepdf').click(function() { 


    // // window.scrollTo(0,0)
    // var renderedImg = new Array;

    // var contWidth = 200, // 너비(mm) (a4에 맞춤)
    //         padding = 5; //상하좌우 여백(mm)
    // createPdf()
    // function createPdf() { //이미지를 pdf로 만들기
    //     // document.getElementById("loader").style.display = "block"; //로딩 시작
    
    //     var lists = document.querySelectorAll(".pdf_page"),
    //             deferreds = [],
    //             doc = new jsPDF("p", "mm", "a4"),
    //             listsLeng = lists.length;
    //         console.log(lists)
    
    //     for (var i = 0; i < listsLeng; i++) { // li 개수만큼 이미지 생성
    //         var deferred = $.Deferred();
    //         deferreds.push(deferred.promise());
    //         generateCanvas(i, doc, deferred, lists[i]);
    //     }
    
    //     $.when.apply($, deferreds).then(function () { // 이미지 렌더링이 끝난 후
    //         var sorted = renderedImg.sort(function(a,b){return a.num < b.num ? -1 : 1;}), // 순서대로 정렬
    //                 curHeight = padding, //위 여백 (이미지가 들어가기 시작할 y축)
    //                 sortedLeng = sorted.length;
        
    //         for (var i = 0; i < sortedLeng; i++) {
    //             var sortedHeight = sorted[i].height, //이미지 높이
    //                     sortedImage = sorted[i].image; //이미지
    
    //             if( curHeight + sortedHeight > 297 - padding * 2 ){ // a4 높이에 맞게 남은 공간이 이미지높이보다 작을 경우 페이지 추가
    //                 doc.addPage(); // 페이지를 추가함
    //         curHeight = padding; // 이미지가 들어갈 y축을 초기 여백값으로 초기화
    //                 doc.addImage(sortedImage, 'jpeg', padding , curHeight, contWidth, sortedHeight); //이미지 넣기
    //                 curHeight += sortedHeight; // y축 = 여백 + 새로 들어간 이미지 높이
    //             } else { // 페이지에 남은 공간보다 이미지가 작으면 페이지 추가하지 않음
    //                 doc.addImage(sortedImage, 'jpeg', padding , curHeight, contWidth, sortedHeight); //이미지 넣기
    //                 curHeight += sortedHeight; // y축 = 기존y축 + 새로들어간 이미지 높이
    //             }
    //         }
    //         doc.save('pdf_test.pdf'); //pdf 저장
    
    //         // document.getElementById("loader").style.display = "none"; //로딩 끝
    //         curHeight = padding; //y축 초기화
    //         renderedImg = new Array; //이미지 배열 초기화
    //     });
    // }
    
    // function generateCanvas(i, doc, deferred, curList){ //페이지를 이미지로 만들기
    //     var pdfWidth = $(curList).outerWidth() * 0.2645, //px -> mm로 변환
    //             pdfHeight = $(curList).outerHeight() * 0.2645,
    //             heightCalc = contWidth * pdfHeight / pdfWidth; //비율에 맞게 높이 조절
    //     html2canvas( curList ).then(
    //         function (canvas) {
    //             var img = canvas.toDataURL('image/jpeg'); //이미지 형식 지정
    //             renderedImg.push({num:i, image:img, height:heightCalc}); //renderedImg 배열에 이미지 데이터 저장(뒤죽박죽 방지)     
    //             deferred.resolve(); //결과 보내기
    //             }
    //     );
    // }


        window.scrollTo(0,0)
        // html2canvas($('#pdfcanvas')[0]).then(function(canvas) { 
        html2canvas(document.querySelector("body")).then(function(canvas) { 
        // html2canvas($('#pdfcanvas')[0]).then(function(canvas) { 
        // 캔버스를 이미지로 변환 
        let imgData = canvas.toDataURL('image/png'); 
        let margin = 0; // 출력 페이지 여백설정 
        // let margin = {
        //     top: 40,
        //     bottom: 60,
        //     left: 40,
        //     width: 522
        //   };
        let imgWidth = 210; 
        // 이미지 가로 길이(mm) A4 기준 
        let pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준 
        let imgHeight = canvas.height * imgWidth / canvas.width; 
        let heightLeft = imgHeight; 
        // console.log(imgHeight, pageHeight)
        let doc = new jsPDF('p', 'mm', 'a4'); 
        let position = 0; 
        // 첫 페이지 출력
        doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); 
        heightLeft -= pageHeight; 


        //  한 페이지 이상일 경우 루프 돌면서 출력 
        while (heightLeft >= 0) { 
            position = heightLeft - imgHeight; 
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
            heightLeft -= pageHeight;
            } 
            //  파일 저장 
            doc.save('sample.pdf'); 
        }); 
        // var element = document.getElementById("pdfcanvas")
        // html2pdf().from(element).set({
        //     margin: 0,
        //     filename: 'test.pdf',
        //     html2canvas: { scale: 1 },
        //     jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true}
        // }).save();
  
  
        
        
  
  
        // html2pdf(element);
            
        })

});





function searchdata(){
 

  
  

    console.log(intervalday, time, date_time_start, date_time_end, datarogger_id, sensor_name)


    $.ajax({
        url : "/editdata/table",
        type : "POST",
        data : {
            "sensor_id": sensor_id,
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
            // "sensor_name": sensor_name

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")

           graphdata = []
           graphdata = data.data
           tabledata = data.data
           console.log(graphdata)

           selecttable()
           selectgraph()
       
       
       }
    });
   
}


let labels = [];

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

    labels = [];
    let data = []
    let selectdata;
    if(sensor_fx_check == 1){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx1_data)
        }
      
    }else if(sensor_fx_check == 2){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx2_data)
        }
       
    }else if(sensor_fx_check == 3){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx3_data)
        }
      
    }else if(sensor_fx_check == 4){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx4_data)
        }
 
    }else if(sensor_fx_check == 5){
        for(let i = 0; i<graphdata.length; i++){
            labels.push(graphdata[i].sensor_data_date.substr(2,14))
            data.push(graphdata[i].sensor_fx5_data)
        }
       
    }


    console.log(sensor_fx_check)
    console.log(graphdata)
    // for(let i = 0; i<graphdata.length; i++){
    //     labels.push(graphdata[i].sensor_data_date)
    //     data.push(selectdata)
    // }
    // weatherchart()

    // let labels = ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h','8h' ,'9h', '10h', '11h', '12h', '13h', '15h', '16h', '17h', '18h','19h', '20h', '21h', '22h','23h'];
    let datasets = [
        {
            label: sensor_display_name,
            data: data,
            borderColor: colors[0],
            pointBackgroundColor: colors[0],
            pointHoverRadius: 6,
            borderWidth: 2.5,
            pointRadius: 0,
        },
    ];

    max_lv1_display = false
    min_lv1_display = false
    max_lv2_display = false
    min_lv2_display = false
    max_lv3_display = false
    min_lv3_display = false

   
    if(level1_max && level1_max.length != 0){max_lv1_display = true}
    if(level1_min && level1_min.length != 0){min_lv1_display = true}
    if(level2_max && level2_max.length != 0){max_lv2_display = true}
    if(level2_min && level2_min.length != 0){min_lv2_display = true}
    if(level3_max && level3_max.length != 0){max_lv3_display = true}
    if(level3_min && level3_min.length != 0){min_lv3_display = true}

    console.log(level3_min, level3_max)


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
            zoom: {
                enabled: true,
                mode: 'xy', // or 'x' for "drag" version
              },
            plugins: {
                // zoom: {
                //     zoom: {
                //         enabled: {
                //         enabled: true,
                //       },
                //       drag: {
                //         enabled: true
                //       },
                //       mode: 'xy',
                //     }
                //   },
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
                                color: '#000000',
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
                                color: '#000000',
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
                                color: '#000000',
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
                                color: '#000000',
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
                                color: '#000000',
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
                                color: '#000000',
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


function selecttable(){

    if(sensordata[0].sensor_fx1 && sensordata[0].sensor_fx1 != 0){
        $('#tabletr').append("<th><a onclick='orderling(2)'>"+sensordata[0].sensor_fx1_name+"</a></th>")
    }
    if(sensordata[0].sensor_fx2 && sensordata[0].sensor_fx2 != 0){
        $('#tabletr').append("<th><a onclick='orderling(3)'>"+sensordata[0].sensor_fx2_name+"</a></th>")
    }
    if(sensordata[0].sensor_fx3 && sensordata[0].sensor_fx3 != 0){
        $('#tabletr').append("<th><a onclick='orderling(4)'>"+sensordata[0].sensor_fx3_name+"</a></th>")
    }
    if(sensordata[0].sensor_fx4 && sensordata[0].sensor_fx4 != 0){
        $('#tabletr').append("<th><a onclick='orderling(5)'>"+sensordata[0].sensor_fx4_name+"</a></th>")
    }
    if(sensordata[0].sensor_fx5 && sensordata[0].sensor_fx5 != 0){
        $('#tabletr').append("<th><a onclick='orderling(6)'>"+sensordata[0].sensor_fx5_name+"/a></th>")
    }


    
    $('#datatbletbody').empty()
    for(let i =0; i <tabledata.length; i++){

        let tabletag =  "<tr id='row_"+i+"'>"
        tabletag +=   "<td>"+tabledata[i].sensor_data_date.substr(0,16)+"</td>"
      

        if(sensor_initial_date == tabledata[i].sensor_data_date.substr(0,16)){
            tabletag +=        "<td class='uk-text-blue' id='sensordata_"+i+"'>"+tabledata[i].sensor_data
        }else{
            if(sensor_fx1.length !=0){
             
                if(level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((level1_min > tabledata[i].sensor_fx1_data && level2_min < tabledata[i].sensor_fx1_data) || (level1_max < tabledata[i].sensor_fx1_data && level2_max > tabledata[i].sensor_fx1_data))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if(level2_min.length !=0 && level2_max.length !=0 && level3_min.length !=0 && level3_max.length !=0 &&
                    ((level2_min >tabledata[i].sensor_fx1_data && level3_min < tabledata[i].sensor_fx1_data) || (level2_max < tabledata[i].sensor_fx1_data && level3_max > tabledata[i].sensor_fx1_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min.length !=0 && level3_max.length !=0 && ((level3_min > tabledata[i].sensor_fx1_data) || (level3_max < tabledata[i].sensor_fx1_data))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
                
            }

            
        }

        // tabletag +=        "<td id='sensordata_"+i+"'>"+tabledata[i].sensor_data
        tabletag +=        "<a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle style='display:none;' onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].sensor_data+"\")'></a></td>"
     


        if(sensor_fx1 && sensor_fx1.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx1_data+"</td>"}
        if(sensor_fx2 && sensor_fx2.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx2_data+"</td>"}
        if(sensor_fx3 && sensor_fx3.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx3_data+"</td>"}
        if(sensor_fx4 && sensor_fx4.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx4_data+"</td>"}
        if(sensor_fx5 && sensor_fx5.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx5_data+"</td>"}
     
        // tabletag +=        "<td>30 ℃</td>"
        // tabletag +=        "<td>10 mm</td>"
        tabletag +=    "</tr>"

        $('#datatbletbody').append(tabletag)


    }

    // $('#row_0').attr('style','display:none;')
   
}