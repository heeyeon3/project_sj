//  스캐터 차트용 report!


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
let tablelist=[];

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
let curStart = 0;

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
    // datarogger_id = urlParams.get('datarogger_id')
    // sensordetail_id = urlParams.get('sensordetail_id')
    // sensor_namex = urlParams.get('sensor_namex')
    // sensor_namey = urlParams.get('sensor_namey')
    sensor_idx = urlParams.get('c2Vx')
    sensor_idy = urlParams.get('c2Vy')
    sensorgroup_type = urlParams.get('Hlw')


    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)

    if(date_time_end){
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
    searchdata()


    console.log(date_time_end, date_time_start, time,intervalday )
    
    $.ajax({
        url:"sensordetail/select?&sensor_id="+sensor_idx,
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
            let gauge_factor_x = sensordata[0].sensor_gauge_factor

            $('#initial_datetime').val(sensordata[0].sensor_initial_date)
    

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
            $('#initial_date').val(sensordata[0].sensor_initial_date)

            
           $('#porject_name').val(sensordata[0].project_name)
           $('#place_name').val(sensordata[0].place_name)

           topname = sensordata[0].sensorgroup_name+"("+sensordata[0].sensor_name+")"
           $('#sensor_display_name').val(sensordata[0].sensor_display_name)


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
                    $('#gaugefactorvalue').text("Gauge Factor: x "+gauge_factor_x+" / y "+gauge_factor_y)
                }
            })

      
         }
    })

   
   


    
        
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

        
   })

})

// $('#savepdf').click(function() { 
    
//     window.scrollTo(0,0)
//     html2canvas($('#body')[0]).then(function(canvas) { 
//     // 캔버스를 이미지로 변환 
//     let imgData = canvas.toDataURL('image/png'); 
//     let margin = 0; // 출력 페이지 여백설정 
//     // let margin = {
//     //     top: 40,
//     //     bottom: 60,
//     //     left: 40,
//     //     width: 522
//     //   };
//     let imgWidth = 210; 
//     // 이미지 가로 길이(mm) A4 기준 
//     let pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준 
//     let imgHeight = canvas.height * imgWidth / canvas.width; 
//     let heightLeft = imgHeight; 
//     // console.log(imgHeight, pageHeight)
//     let doc = new jsPDF('p', 'mm', 'a4'); 
//     let position = 0; 
//     // 첫 페이지 출력
//      doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); 
//      heightLeft -= pageHeight; 

  
//     //  한 페이지 이상일 경우 루프 돌면서 출력 
//      while (heightLeft >= 0) { 
//          position = heightLeft - imgHeight; 
//          doc.addPage();
//          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
//           heightLeft -= pageHeight;
//         } 
//         //  파일 저장 
//          doc.save('sample.pdf'); 
//     }); 


    
// });


function pdfPrint(){

    // 현재 document.body의 html을 A4 크기에 맞춰 PDF로 변환
    html2canvas(document.body, {
        onrendered: function (canvas) {

            // 캔버스를 이미지로 변환
            var imgData = canvas.toDataURL('image/png');

            var imgWidth = 210; // 이미지 가로 길이(mm) A4 기준
            var pageHeight = imgWidth * 1.414;  // 출력 페이지 세로 길이 계산 A4 기준
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;

            var doc = new jsPDF('p', 'mm');
            var position = 0;

            // 첫 페이지 출력
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // 한 페이지 이상일 경우 루프 돌면서 출력
            while (heightLeft >= 20) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // 파일 저장
            doc.save('sample.pdf');

            console.log("??")
            //이미지로 표현
            //document.write('<img src="'+imgData+'" />');
        }
        
    });
    
}


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
                    selecttable()
                
            }
            });
        
       }
    });

    

    
}

function selectgraph(){

    console.log(graphdata_x)
    console.log(graphdata_y)

    if(chart){console.log("차트삭제") ; chart.destroy()}


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


 

    let labels = [];
    let datax = [];
    let datay = [];
    if(sensor_fx_check == 1){
        for(let i = 0; i<graphdata_x.length; i++){
            labels.push(graphdata_x[i].sensor_data_date)
            datax.push(graphdata_x[i].sensor_fx1_data)
        }
        for(let i = 0; i<graphdata_y.length; i++){
            datay.push(graphdata_y[i].sensor_fx1_data)
        }
      
    }else if(sensor_fx_check == 2){
        for(let i = 0; i<graphdata_x.length; i++){
            labels.push(graphdata_x[i].sensor_data_date)
            datax.push(graphdata_x[i].sensor_fx2_data)
        }
        for(let i = 0; i<graphdata_y.length; i++){
            datay.push(graphdata_y[i].sensor_fx2_data)
        }
       
    }else if(sensor_fx_check == 3){
        for(let i = 0; i<graphdata_x.length; i++){
            labels.push(graphdata_x[i].sensor_data_date)
            datax.push(graphdata_x[i].sensor_fx3_data)
        }
        for(let i = 0; i<graphdata_y.length; i++){
            datay.push(graphdata_y[i].sensor_fx3_data)
        }
      
    }else if(sensor_fx_check == 4){
        for(let i = 0; i<graphdata_x.length; i++){
            labels.push(graphdata_x[i].sensor_data_date)
            datax.push(graphdata_x[i].sensor_fx4_data)
        }
        for(let i = 0; i<graphdata_y.length; i++){
            datay.push(graphdata_y[i].sensor_fx4_data)
        }
 
    }else if(sensor_fx_check == 5){
        for(let i = 0; i<graphdata_x.length; i++){
            labels.push(graphdata_x[i].sensor_data_date)
            datax.push(graphdata_x[i].sensor_fx5_data)
        }
        for(let i = 0; i<graphdata_y.length; i++){
            datay.push(graphdata_y[i].sensor_fx5_data)
        }
       
    }

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
    
        // const labels = ['2021.10.01 21:00', '2021.10.02 21:00' ,'2021.10.03 21:00', '2021.10.04 21:00', '2021.10.05 21:00', '2021.10.06 21:00', '2021.10.07 21:00'];
        const datasets = [
        {
            label: sensor_display_name+'(X)',
            data: datax,
            borderColor: '#1e87f0',
            pointBackgroundColor: '#1e87f0',
            pointHoverRadius: 6,
            borderWidth: 2.5,
            pointRadius: 0,
        },
        {
            label: sensor_display_name+'(Y)',
            data: datay,
            borderColor: '#4cd964',
            pointBackgroundColor: '#4cd964',
            pointHoverRadius: 3,
            borderWidth: 2.5,
            pointRadius: 0,
        },
        ];
    
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
                                display : max_lv1_display
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

    console.log("graphdata_x : ", graphdata_x)
    console.log("graphdata_y : ",graphdata_y)
    tabledata = []
        
    labels =[]


    for(let i = 0; i<graphdata_x.length; i++){
        labels.push(graphdata_x[i].sensor_data_date)
        tabledata.push({sensor_data_date:null,x: null, y: null, sensor_fx1_data_x: null, sensor_fx1_data_y: null,sensor_fx2_data_x: null,sensor_fx2_data_y: null,
            sensor_fx3_data_x: null,sensor_fx3_data_y: null,sensor_fx4_data_x: null,sensor_fx4_data_y: null,sensor_fx5_data_x: null,sensor_fx5_data_y: null})

        
    }

    for(let i=0; i<labels.length; i++){
        for(let j=0; j<graphdata_x.length; j++){
            tabledata[i].sensor_data_date = labels[i]
        

            if(labels[i] == graphdata_x[j].sensor_data_date){
                tabledata[i].x = graphdata_x[j].sensor_data

                if(graphdata_x[j].sensor_fx1_data){
                    tabledata[i].sensor_fx1_data_x = graphdata_x[j].sensor_fx1_data
                }
                if(graphdata_x[j].sensor_fx2_data){
                    tabledata[i].sensor_fx2_data_x = graphdata_x[j].sensor_fx2_data
                }
                if(graphdata_x[j].sensor_fx3_data){
                    tabledata[i].sensor_fx3_data_x = graphdata_x[j].sensor_fx3_data
                }
                if(graphdata_x[j].sensor_fx4_data){
                    tabledata[i].sensor_fx4_data_x = graphdata_x[j].sensor_fx4_data
                }
                if(graphdata_x[j].sensor_fx5_data){
                    tabledata[i].sensor_fx5_data_x = graphdata_x[j].sensor_fx5_data
                }
            }
        }

        for(let j=0; j<graphdata_y.length; j++){
            if(labels[i] == graphdata_y[j].sensor_data_date){
                tabledata[i].y = graphdata_y[j].sensor_data
                // console.log(j, graphdata_y[j].sensor_data_date, graphdata_y[j].sensor_fx1_data, typeof(graphdata_y[j].sensor_fx1_data))

                if( graphdata_y[j].sensor_fx1_data == 0 ){
                    console.log(graphdata_y[j].sensor_fx1_data)
                    graphdata_y[j].sensor_fx1_data = '0'
                }
                if(graphdata_y[j].sensor_fx1_data){
                    tabledata[i].sensor_fx1_data_y = graphdata_y[j].sensor_fx1_data
                }
                if(graphdata_y[j].sensor_fx2_data){
                    tabledata[i].sensor_fx2_data_y = graphdata_y[j].sensor_fx2_data
                }
                if(graphdata_y[j].sensor_fx3_data){
                    tabledata[i].sensor_fx3_data_y = graphdata_y[j].sensor_fx3_data
                }
                if(graphdata_y[j].sensor_fx4_data){
                    tabledata[i].sensor_fx4_data_y = graphdata_y[j].sensor_fx4_data
                }
                if(graphdata_y[j].sensor_fx5_data){
                    tabledata[i].sensor_fx5_data_y = graphdata_y[j].sensor_fx5_data
                }
            }
        }
     
    }
  


    console.log(tablelist)
   
    $('#tabletr').append("<th>측정치</th>")
    if(graphdata_x[0].sensor_fx1_data && graphdata_y[0].sensor_fx1_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx1_name+"</th>")

    }
    if(graphdata_x[0].sensor_fx2_data && graphdata_y[0].sensor_fx2_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx2_name+"</th>")
       
    }
    if(graphdata_x[0].sensor_fx3_data && graphdata_y[0].sensor_fx3_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx3_name+"</th>")
      
    }
    if(graphdata_x[0].sensor_fx4_data && graphdata_y[0].sensor_fx4_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx4_name+"</th>")
        
    }
    if(graphdata_x[0].sensor_fx5_data && graphdata_y[0].sensor_fx5_data){
        $('#tabletr').append("<th>"+sensordata[0].sensor_fx5_name+"</th>")
        
    }

    $('#datatbletbody').empty()

    for(let i=0; i<tabledata.length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[i].sensor_data_date+"</td>"
        tdtag += "<td>"
        tdtag +=   " <div class='uk-flex uk-flex-middle uk-text-center'>"
        tdtag +=        " <div class='dis-inbl'>x: "+tabledata[i].x+"<br>y: "+tabledata[i].y+"</div>"
        // tdtag +=        "<div class='dis-inbl'><a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle></a></div>"
        tdtag +=    "</div>"
        tdtag += "</td>"

        if(graphdata_x[i].sensor_fx1_data && graphdata_y[i].sensor_fx1_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx1_data_x+"<br>y: "+tabledata[i].sensor_fx1_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx2_data && graphdata_y[i].sensor_fx2_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx2_data_x+"<br>y: "+tabledata[i].sensor_fx2_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx3_data && graphdata_y[i].sensor_fx3_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx3_data_x+"<br>y: "+tabledata[i].sensor_fx3_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx4_data && graphdata_y[i].sensor_fx4_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx4_data_x+"<br>y: "+tabledata[i].sensor_fx4_data_y+"</td>"
        }
        if(graphdata_x[i].sensor_fx5_data && graphdata_y[i].sensor_fx5_data){
            tdtag += " <td>x: "+tabledata[i].sensor_fx5_data_x+"<br>y: "+tabledata[i].sensor_fx5_data_y+"</td>"
        }
        tdtag +=" </tr>"
        $('#datatbletbody').append(tdtag)
     

    }
//  $('#firsttable').empty()

}


function printWindow() {
    var factory = $('html');
    factory.printing.header = ""
    factory.printing.footer = ""    //여기를 ""로 처리!!
    factory.printing.portrait = true
    factory.printing.leftMargin = 30.0
    factory.printing.topMargin = 30.0
    factory.printing.rightMargin = 30.0
    factory.printing.bottomMargin = 30.0
    factory.printing.Print(false, window)
}