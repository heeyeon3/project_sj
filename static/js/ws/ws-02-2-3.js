let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let tabledata = [];
let project_id = "";
let sensorgroup_type = "";
let sensor_fx_check = "";

let datatable;
// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let click_pagenum = "";

let sensor_initial_date = "";


let intervalday = "";
let time = "";
let date_time_start = "";
let date_time_end = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";
let user_gr = "";


$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
   
    // url = decodeURIComponent( url )
    // console.log(url)
    const urlParams = url.searchParams;
    console.log(urlParams)

    // console.log(window.btoa("sensor_id")) // c2V
    // console.log(window.btoa("project_id")) // cHJ
    // console.log(window.btoa("sensorgroup_type")) // Hlw
    // console.log(window.btoa("date_time_start")) // N0Y
    // console.log(window.btoa("date_time_end")) //X2V
    // console.log(window.btoa("intervalday")) // aW5
    // console.log(window.btoa("time")) //dGl
    // console.log(window.btoa("company_id")) //pZA
    // console.log(window.btoa("sensorgroup_id")) //aWQ

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')

    sensorgroup_type = urlParams.get('Hlw')
    date_time_end = urlParams.get('X2V')
    date_time_start = urlParams.get('N0Y')
    next_time_start = date_time_start;
    next_time_end = date_time_end;
    time = urlParams.get('dGl')
    intervalday = urlParams.get('aW5')

    console.log(sensor_id)
    console.log(date_time_end, date_time_start, time,intervalday )

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)



    $.ajax({
        url : "current/user",
        type : "POST",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            
            let currentdata =JSON.parse(data.data)
            let usergr = currentdata.user_grade
            if(usergr != '0101'){
                $('#originaldata').hide()
                $('#recorddata').hide()
                $('#Upload').hide()
              
            }

        }
    })

    $('#topsensername').text(sensor_name)

    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_id,
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
            

            sensor_initial_date = sensordata[0].sensor_initial_date
            console.log(level1_max, level1_min,level2_max,  level2_min)

            
            $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)

            $('#topname').text(sensordata[0].sensor_display_name)

            if(sensordata[0].sensor_fx1 && sensordata[0].sensor_fx1 != 0){
                $('#tabletr').append("<th>"+sensordata[0].sensor_fx1_name+"</th>")
            }
            if(sensordata[0].sensor_fx2 && sensordata[0].sensor_fx2 != 0){
                $('#tabletr').append("<th>"+sensordata[0].sensor_fx2_name+"</th>")
            }
            if(sensordata[0].sensor_fx3 && sensordata[0].sensor_fx3 != 0){
                $('#tabletr').append("<th>"+sensordata[0].sensor_fx3_name+"</th>")
            }
            if(sensordata[0].sensor_fx4 && sensordata[0].sensor_fx4 != 0){
                $('#tabletr').append("<th>"+sensordata[0].sensor_fx4_name+"</th>")
            }
            if(sensordata[0].sensor_fx5 && sensordata[0].sensor_fx5 != 0){
                $('#tabletr').append("<th>"+sensordata[0].sensor_fx5_name+"</th>")
            }

            $('#tabletr').append("<th>기온</th>")
            $('#tabletr').append("<th>강수량</th>")

            get_initial_date = sensordata[0].sensor_initial_date;
            
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }
     
         }
    })

    searchdata()



    $('#tablelen').change(function(){
        click_pagenum = 0
        pagenation()
    })

    $('#canclebtn', '#closebtn').click(function(){
        searchdata()
    })

    $('#excelbtn').click(function(){
        console.log("excel down click!!")
    })


    $('#Upload').click(function(e){
        console.log("Upload click!!")
        if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
            alert("RESET 버튼을 누른 이후에 시도해주세요.")
            return;
        }

        e.preventDefault();
        let myInput = document.getElementById("my-input");
            myInput.click();

    })

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })
});

function uploadFile(input){

    var file = input.files[0];
    console.log(file)

    let form_data = new FormData()
    form_data.append("file",file )
    form_data.append("datarogger_id",datarogger_id )
    form_data.append("sensor_id",sensor_id )
      
    
    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };
  
    let uploadconfirm = confirm("데이터 upload시 값이 수정됩니다. upload 하시겠습니끼?")

    if(uploadconfirm){
        alert("UPLOAD가 시작되었습니다. 화면을 이동하지 말아주세요.")
        $.ajax({
            url : "/data/upload",
            type : "POST",
            data : form_data,
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
               alert("형식에 맞게 upload 해주세요.")
               let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
            //    window.location.href =  "/ws-02-2-3?sensor_id="+sensor_id+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
            },
            success:function(data) {
                alert(data.resultString)
               console.log("excel upload.")
               let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
            //    window.location.href =  "/ws-02-2-3?sensor_id="+sensor_id+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
           
           }
        });
    }

    
}





function exceldown(){
    // intervalday = $('#intervalday').val()
    // time = $('#time').val()
    // date_time_start = $('#date_time_start').val()
    // date_time_end = $('#date_time_end').val()

    // let lastday = new Date(date_time_end)
    // let today = new Date()
    // if(lastday > today){
    //     alert("미래데이터는 표출할 수 없습니다. 선택된 날짜를 변경해 주세요.")
    //     return;
    // }

    console.log(intervalday, time, date_time_start, date_time_end, datarogger_id, sensor_name)

   
    // else if(time.length == 0){
    //     alert("시간을 입력해 주세요")
    //     $('#intervalday').focus()
    //     return;
    // }else if(intervalday.length == 0){
    //     alert("간격을 입력해 주세요")
    //     $('#intervalday').focus()
    //     return;
    // }

    let url = "/excel/down?sensor_id="+sensor_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time+"&sensor_name="+sensor_name

    $.ajax({
        url : url,
        type : "get",
        // data : {
        //     "sensor_id": sensor_id,
        //     "datarogger_id": datarogger_id,
        //     "date_time_start": date_time_start,
        //     "date_time_end": date_time_end,
        //     "intervalday": intervalday,
        //     "time": time,
        //     "sensor_name": sensor_name

        // },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}


function searchdata(){
    intervalday = $('#intervalday').val()
    time = $('#time').val()
    date_time_start = $('#date_time_start').val()
    date_time_end = $('#date_time_end').val()

    console.log(intervalday, time, date_time_start, date_time_end, datarogger_id, sensor_name)

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

    console.log("user_grade")
   
    $.ajax({
        url : "current/user",
        type : "POST",
        async : false,
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.data)
            let currentdata =JSON.parse(data.data)
            user_gr = currentdata.user_grade
            console.log(user_gr)

        }
    })


    if(user_gr == '0101' && time.length == 0 && intervalday.length == 0 ){
        console.log("????")
        $.ajax({
            url : "/editdata/table?sensor_id="+sensor_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end,
            type : "get",
            data : {
                "sensor_id": sensor_id,
                "datarogger_id": datarogger_id,
                "date_time_start": date_time_start,
                "date_time_end": date_time_end,
                "intervalday": intervalday,
                "time": time,
                "sensor_name": sensor_name
    
            },
            async : false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                // alert(data.resultString)
               console.log("Success")
    
               tabledata = []
               tabledata = data.data
               console.log(tabledata)
    
               next_time_start = date_time_start;
               next_time_end = date_time_end;
    
            //    tabledata = tabledata.sort((a,b) => {
            //     return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
        
            //     })
            //     console.log(tabledata)
    
               click_pagenum = 0
             
    
               if(tabledata.length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
                }else{
                    selecttable()
                }
           }
        });
    }else{
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
                "sensor_name": sensor_name
    
            },
            async : false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                // alert(data.resultString)
               console.log("Success")
    
               tabledata = []
               tabledata = data.data
               console.log(tabledata)
    
               next_time_start = date_time_start;
               next_time_end = date_time_end;
    
            //    tabledata = tabledata.sort((a,b) => {
            //     return new Date(b.sensor_data_date) - new Date(a.sensor_data_date)
        
            //     })
            //     console.log(tabledata)
    
               click_pagenum = 0
             
    
               if(tabledata.length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
                }else{
                    selecttable()
                }
           }
        });
    }
  

}

function selecttable(){

    if(time.length == 0 && intervalday.length !=0){
        url = "/weather/data"
        $.ajax({
            url : url,
            type : "post",
            async: false,
            data:{
                "project_id":project_id,
                "date_time_start": date_time_start,
                "date_time_end":date_time_end,
                "intervalday":intervalday
                
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log(data.resultString)
        
                weatherdata = data.data
                console.log(weatherdata)

                for(let i=0; i<tabledata.length; i++){
                    tabledata[i]['t1h'] = ""
                    tabledata[i]['rn1'] = ""
             
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == tabledata[i].sensor_data_date){
                            tabledata[i]['t1h'] = weatherdata[j].weather_t1h + " ℃"
                            tabledata[i]['rn1'] = weatherdata[j].weather_rn1 + " mm"
    
                        }
                    }
                }
    
        }
        });

    }else{
        url = "/weather/data?project_id="+project_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
        $.ajax({
            url : url,
            type : "get",
            async: false,
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log(data.resultString)
           
                weatherdata = data.data
                console.log(weatherdata)
    
                for(let i=0; i<tabledata.length; i++){
                    tabledata[i]['t1h'] = ""
                    tabledata[i]['rn1'] = ""
             
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == tabledata[i].sensor_data_date){
                            tabledata[i]['t1h'] = weatherdata[j].weather_t1h + " ℃"
                            tabledata[i]['rn1'] = weatherdata[j].weather_rn1 + " mm"
    
                        }
                    }
                }
    
    
           }
        });
    }

    
    console.log(usergr)
    console.log(tabledata)

    let tablelen = $('#tablelen').val()
   
    if(datatable){datatable.destroy()}
    let datalen = tabledata.length

    let pagelen = Math.ceil(datalen/tablelen)

    // console.log(datalen, datalen/tablelen, pagelen)

    // level1_max = sensordata[0].sensor_gl1_max
    // level1_min = sensordata[0].sensor_gl1_min
    // level2_max = sensordata[0].sensor_gl2_max
    // level2_min = sensordata[0].sensor_gl2_min
    // level3_max = sensordata[0].sensor_gl3_max
    // level3_min = sensordata[0].sensor_gl3_min

    // console.log(level1_max)

    
    $('#datatbletbody').empty()
    for(let i =0; i <tabledata.length; i++){

        let tabletag =  "<tr id='row_"+i+"'>"
        tabletag +=   "<td>"+tabledata[i].sensor_data_date.substr(0,16)+"</td>"
      

        if(sensor_initial_date == tabledata[i].sensor_data_date.substr(0,16)){
            tabletag +=        "<td class='uk-text-blue' id='sensordata_"+i+"'>"+tabledata[i].sensor_data
        }else{
            if(sensor_fx_check =='1'){

                if(tabledata[i].use_yn == 'N'){
                    
                    tabletag +=        "<td class='sc-y'>"+tabledata[i].sensor_data
                }else if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[i].sensor_fx1_data) && parseFloat(level2_min) < parseFloat(tabledata[i].sensor_fx1_data)) || (parseFloat(level1_max) < parseFloat(tabledata[i].sensor_fx1_data) && parseFloat(level2_max) > parseFloat(tabledata[i].sensor_fx1_data)))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if((level2_min && level3_min &&  level2_min.length !=0 && level3_min.length !=0 && parseFloat(level2_min) >parseFloat(tabledata[i].sensor_fx1_data) && parseFloat(level3_min) < parseFloat(tabledata[i].sensor_fx1_data)) || 
                    (level2_max && level3_min && level3_max.length !=0 && level3_max.length !=0 && parseFloat(level2_max) < parseFloat(tabledata[i].sensor_fx1_data) && parseFloat(level3_max) > parseFloat(tabledata[i].sensor_fx1_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[i].sensor_fx1_data)) || (parseFloat(level3_max )< parseFloat(tabledata[i].sensor_fx1_data)))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
                
            }else if(sensor_fx_check =='2'){
                if(tabledata[i].use_yn == 'N'){
                    
                    tabletag +=        "<td class='sc-y'>"+tabledata[i].sensor_data
                }else if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[i].sensor_fx2_data) && parseFloat(level2_min) < parseFloat(tabledata[i].sensor_fx2_data)) || (parseFloat(level1_max) < parseFloat(tabledata[i].sensor_fx2_data) && parseFloat(level2_max) > parseFloat(tabledata[i].sensor_fx2_data)))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if((level2_min && level3_min &&  level2_min.length !=0 && level3_min.length !=0 && parseFloat(level2_min) >parseFloat(tabledata[i].sensor_fx2_data) && parseFloat(level3_min) < parseFloat(tabledata[i].sensor_fx2_data)) || 
                    (level2_max && level3_min && level3_max.length !=0 && level3_max.length !=0 && parseFloat(level2_max) < parseFloat(tabledata[i].sensor_fx2_data) && parseFloat(level3_max) > parseFloat(tabledata[i].sensor_fx2_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[i].sensor_fx2_data)) || (parseFloat(level3_max )< parseFloat(tabledata[i].sensor_fx2_data)))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
            }else if(sensor_fx_check =='3'){
                if(tabledata[i].use_yn == 'N'){
                    
                    tabletag +=        "<td class='sc-y'>"+tabledata[i].sensor_data
                }else if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[i].sensor_fx3_data) && parseFloat(level2_min) < parseFloat(tabledata[i].sensor_fx3_data)) || (parseFloat(level1_max) < parseFloat(tabledata[i].sensor_fx3_data) && parseFloat(level2_max) > parseFloat(tabledata[i].sensor_fx3_data)))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if((level2_min && level3_min &&  level2_min.length !=0 && level3_min.length !=0 && parseFloat(level2_min) >parseFloat(tabledata[i].sensor_fx3_data) && parseFloat(level3_min) < parseFloat(tabledata[i].sensor_fx3_data)) || 
                    (level2_max && level3_min && level3_max.length !=0 && level3_max.length !=0 && parseFloat(level2_max) < parseFloat(tabledata[i].sensor_fx3_data) && parseFloat(level3_max) > parseFloat(tabledata[i].sensor_fx3_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[i].sensor_fx3_data)) || (parseFloat(level3_max )< parseFloat(tabledata[i].sensor_fx3_data)))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
            }else if(sensor_fx_check =='4'){
                if(tabledata[i].use_yn == 'N'){
                    
                    tabletag +=        "<td class='sc-y'>"+tabledata[i].sensor_data
                }else if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[i].sensor_fx4_data) && parseFloat(level2_min) < parseFloat(tabledata[i].sensor_fx4_data)) || (parseFloat(level1_max) < parseFloat(tabledata[i].sensor_fx4_data) && parseFloat(level2_max) > parseFloat(tabledata[i].sensor_fx4_data)))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if((level2_min && level3_min &&  level2_min.length !=0 && level3_min.length !=0 && parseFloat(level2_min) >parseFloat(tabledata[i].sensor_fx4_data) && parseFloat(level3_min) < parseFloat(tabledata[i].sensor_fx4_data)) || 
                    (level2_max && level3_min && level3_max.length !=0 && level3_max.length !=0 && parseFloat(level2_max) < parseFloat(tabledata[i].sensor_fx4_data) && parseFloat(level3_max) > parseFloat(tabledata[i].sensor_fx4_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[i].sensor_fx4_data)) || (parseFloat(level3_max )< parseFloat(tabledata[i].sensor_fx4_data)))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
            }else if(sensor_fx_check =='5'){
                if(tabledata[i].use_yn == 'N'){
                    
                    tabletag +=        "<td class='sc-y'>"+tabledata[i].sensor_data
                }else if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[i].sensor_fx5_data) && parseFloat(level2_min) < parseFloat(tabledata[i].sensor_fx5_data)) || (parseFloat(level1_max) < parseFloat(tabledata[i].sensor_fx5_data) && parseFloat(level2_max) > parseFloat(tabledata[i].sensor_fx5_data)))){
                  
                        
                    tabletag +=        "<td class='uk-text-yellow'>"+tabledata[i].sensor_data
    
                }else if((level2_min && level3_min &&  level2_min.length !=0 && level3_min.length !=0 && parseFloat(level2_min) >parseFloat(tabledata[i].sensor_fx5_data) && parseFloat(level3_min) < parseFloat(tabledata[i].sensor_fx5_data)) || 
                    (level2_max && level3_min && level3_max.length !=0 && level3_max.length !=0 && parseFloat(level2_max) < parseFloat(tabledata[i].sensor_fx5_data) && parseFloat(level3_max) > parseFloat(tabledata[i].sensor_fx5_data))){
                        tabletag +=        "<td class='uk-text-orange'>"+tabledata[i].sensor_data
                    
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[i].sensor_fx5_data)) || (parseFloat(level3_max )< parseFloat(tabledata[i].sensor_fx5_data)))){
                    tabletag +=        "<td class='uk-text-red'>"+tabledata[i].sensor_data
                    $('#sensordata_'+i).addClass('uk-text-red')
                }else{
                    tabletag +=        "<td >"+tabledata[i].sensor_data
                }
            }

            
        }

        // tabletag +=        "<td id='sensordata_"+i+"'>"+tabledata[i].sensor_data
        if(usergr == '0101' && intervalday.length == 0){
            tabletag +=        "<a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].sensor_data+"\")'></a>"
            if (tabledata[i].use_yn =='Y'){
                tabletag +=        "<a class='uk-icon-link uk-margin-small-left' uk-icon='trash'  onclick='trashmodal(\""+tabledata[i].sensor_data_date+"\")'></a>"
            }
            
            tabletag += "</td>"
        }
        // tabletag +=        "<a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].sensor_data+"\")'></a></td>"
        
        
        else if(usergr == '0102' && intervalday.length == 0){
            tabletag +=        "<a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick='dataeditmodal(\""+tabledata[i].sensor_data_date+"\", \""+tabledata[i].sensor_data+"\")'></a>"
            tabletag += "</td>"
        }



        if(sensor_fx1 && sensor_fx1.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx1_data+"</td>"}
        if(sensor_fx2 && sensor_fx2.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx2_data+"</td>"}
        if(sensor_fx3 && sensor_fx3.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx3_data+"</td>"}
        if(sensor_fx4 && sensor_fx4.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx4_data+"</td>"}
        if(sensor_fx5 && sensor_fx5.length !=0){tabletag +=       "<td>"+tabledata[i].sensor_fx5_data+"</td>"}
     
        tabletag +=        "<td>"+tabledata[i].t1h+"</td>"
        tabletag +=        "<td>"+tabledata[i].rn1+"</td>"
        tabletag +=    "</tr>"

        $('#datatbletbody').append(tabletag)

        // $('#row_'+i).hide()
        
    }

    datatable = $("#data-list").DataTable({
        "order": [[ 0, "desc" ]],
        "displayLength": 50, 
        "info": false,
        "language": {
            "search": "",
            "show": "",
            "sLengthMenu": "<span style='position: absolute; top: 8px; left: 0; display:none;'>보기</span> _MENU_ <span style='position: absolute; top: 5px;'></span>",
            "emptyTable": "데이타가 없습니다.",
            "infoEmpty": "데이타가 없습니다.",
            "zeroRecords": "검색 결과가 없습니다."
        },
        "bDestroy": true
    });

    // $('#row_0').attr('style','display:none;')
    // $('#row_0').hide()

    // click_pagenum = 0
    // pagenation()
}



function pagenation(){

    let tablelen = $('#tablelen').val()
    // console.log(tablelen)
  
    let datalen = tabledata.length

    let pagelen = Math.ceil(datalen/tablelen)

    // console.log(datalen, datalen/tablelen, pagelen)



    $('#pagenation').empty()
    $('#pagenation').append("<li><a onclick='pagemove(0)'><span uk-pagination-previous></span></a></li>")
    for(let i =0; i<pagelen; i++){
        // $('#pagenation').append("<li><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // if(i == click_pagenum){
        //     $('#pagenation').append("<li id='page_"+i+"' class='uk-active'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // }else{
        //     $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
        // }
        if(i == pagelen-1){
            $('#pagenation').append("<li><a onclick='pagemove("+i+")'><span uk-pagination-next></span></a></li>")
        }
        $('#page_'+i).hide()
        
    }
    // $('#pagenation').append("<li><a onclick='pagemove(next)'><span uk-pagination-next></span></a></li>")

    if(click_pagenum == 0){
        pagemove(0)
    }

}


function pagemove(pagenum){
    console.log("pagemove")
    click_pagenum = pagenum

    let tablelen = $('#tablelen').val()
  

    let datalen = tabledata.length

    let pagelen = Math.ceil(datalen/tablelen)

    // console.log(datalen, datalen/tablelen, pagelen)

    // console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

    for(let i =0; i <tabledata.length; i++){
        if(tablelen*pagenum <= i && i < last ){
            // console.log("row", i)
            $('#row_'+i).show()
        }else{
            $('#row_'+i).hide()
        }
    }

    for(let i = 0; i <pagelen; i++){
        if(click_pagenum < 5){
            if(0 <= i && i <10){
                // console.log("1",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else if(click_pagenum > pagelen-6){
            
            if(pagelen-11 < i && i <= pagelen-1){
                // console.log("2",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else{
            if(click_pagenum-5 < i && i <= click_pagenum+5){
                // console.log("3",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }

        if(i == click_pagenum){
            $('#page_'+i).addClass('uk-active')
        }else{
            $('#page_'+i).removeClass('uk-active')
        }

    }

    // pagenation()

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

    switch(num){
        case 0:
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

            return

        case 1:
            if(column01){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_data - a.sensor_data
            
                    })
                    console.log(tabledata)
                    selecttable()
                column01 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_data - b.sensor_data
            
                    })
                    selecttable()
                column01 = true
            }
            return
        case 2:
          
            if(column02){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_fx1_data - a.sensor_fx1_data
            
                })
                selecttable()
                column02 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_fx1_data - b.sensor_fx1_data
            
                })
                selecttable()
                column02 = true
            }
            return
        case 3:
            
            if(column03){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_fx2_data - a.sensor_fx2_data
            
                })
                selecttable()
                column03 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_fx2_data - b.sensor_fx2_data
            
                })
                selecttable()
                column03 = true
            }
            return
        case 4:
            console.log("2222")
            if(column03){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_fx3_data - a.sensor_fx3_data
            
                })
                selecttable()
                column03 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_fx3_data - b.sensor_fx3_data
            
                })
                selecttable()
                column03 = true
            }
            return
        case 5:
            if(column05){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_fx4_data - a.sensor_fx4_data
            
                })
                selecttable()
                column05 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_fx4_data - b.sensor_fx4_data
            
                })
                selecttable()
                column05 = true
            }
            return

        case 6:
            if(column06){
                // $('#order_0').attr('uk-icon', 'icon: chevron-down')
                tabledata = tabledata.sort((a,b) => {
                    return b.sensor_fx5_data - a.sensor_fx5_data
            
                })
                selecttable()
                column06 = false
            }else{
                // $('#order_0').attr('uk-icon', 'icon: chevron-up')
                tabledata = tabledata.sort((a,b) => {
                    return a.sensor_fx5_data - b.sensor_fx5_data
            
                })
                selecttable()
                column06 = true
            }
            return
    }
        
}



function dataeditmodal(sensordate, sensordata){
    console.log("들어옴옴옴옴")
    $('#selectdate').text(sensordate)
    $('#editdatavalue').val(sensordata)
 
}

function savebtn(){
    console.log(intervalday)
    let editdatavalue = $('#editdatavalue').val()
    let selectdate = $('#selectdate').text()
    console.log(editdatavalue)

    if(intervalday.length !=0){
        alert("평균치일때 데이터를 수정할 수 없습니다.")
        return;
    }
    $.ajax({
        url : "/editdata",
        type : "POST",
        data : {
            "sensor_id": sensor_id,
            // "datarogger_id": datarogger_id,
            "sensor_data": editdatavalue,
            "sensor_data_date": selectdate,

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            alert(data.resultString)
          
            // searchdata()
           console.log("Success")
           let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
        //    window.location.href =  "/ws-02-2-3?sensor_id="+sensor_id+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
         
       }
    });
}




function exceldownorigin(){
    if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
        alert("RESET 버튼을 누른 이후에 시도해주세요.")
        return;
    }
    let url = "/excel/down/origin?sensor_id="+sensor_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
    // let url = "/excel/down/originam?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time+"&sensor_name="+sensor_name

    $.ajax({
        url : url,
        type : "get",
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}




function exceldownrecod(){
    if(intervalday.length > 0 || time.length > 0 || $('#intervalday').val() > 0 || $('#time').val() > 0){
        alert("RESET 버튼을 누른 이후에 시도해주세요.")
        return;
    }
    let url = "/excel/down/record?sensor_id="+sensor_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end
    // let url = "/excel/down/originam?sensor_id="+sensor_id+"&datarogger_id="+datarogger_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time+"&sensor_name="+sensor_name

    $.ajax({
        url : url,
        type : "get",
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}

// next_time_start, next_time_end
function chartlocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-2-1?"+encodeURIComponent(uri)
}
function datalocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
}
function fomulalocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4?"+encodeURIComponent(uri)
    
}
function infolocation(){
    let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-5?"+encodeURIComponent(uri)
    
}

function pdfdown(params) {
   
    window.open("/report_other?"+encodeURIComponent("c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time))
}




// var resetbtn = function(){
//     console.log("!!!")
//     $('#time').val('').prop("selected", true)
//     $('#intervalday').val('').prop("selected", true)
// }


function trashmodal(sensor_data_date){
    console.log("삭제", sensor_data_date)
    let confirmdata = confirm("해당 시간의 데이터를 모두 삭제하시겠습니까?")

    if(confirmdata){
        $.ajax({
            url : "/editdata/delete",
            type : "post",
            async: false,
            data:{
                "sensor_id":sensor_id,
                "sensor_data_date": sensor_data_date,
               
                
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
              alert(data.resultString)
              let uri = "c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href = "/ws-02-2-3?"+encodeURIComponent(uri)
            //   window.location.href =  "/ws-02-2-3?sensor_id="+sensor_id+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
    
        }
        });
    }
    
}