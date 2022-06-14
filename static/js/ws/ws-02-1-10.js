let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let graphdata = [];

let datatable;
// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensorname_list = []
let sensorname_list_xy = []


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

             $('#projectName').text(sensordata[0].project_name)
             $('#placeName').text(sensordata[0].place_name)

             let sensornamelist = "";
             for(let i = 0; i<sensordata.length; i++){
                if(sensornamelist.length == 0 ){
                    sensornamelist += sensordata[i].sensor_name
                }else{sensornamelist += ", "+sensordata[i].sensor_name}

                if(i == sensordata.length-1){$('#sensorNameList').text(sensornamelist)}
             }


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
             console.log(sensorname_list_xy)


            // level1_max = sensordata[0].sensorgroup_gl1_max
            // level1_min = sensordata[0].sensorgroup_gl1_min
            // level2_max = sensordata[0].sensorgroup_gl2_max
            // level2_min = sensordata[0].sensorgroup_gl2_min
            // level3_max = sensordata[0].sensorgroup_gl3_max
            // level3_min = sensordata[0].sensorgroup_gl3_min

       

            $('#gl1max').text(sensordata[0].sensorgroup_gl1_max)
            $('#gl1min').text(sensordata[0].sensorgroup_gl1_min)
            $('#gl2max').text(sensordata[0].sensorgroup_gl2_max)
            $('#gl2min').text(sensordata[0].sensorgroup_gl2_min)
            $('#gl3max').text(sensordata[0].sensorgroup_gl3_max) 
            $('#gl3min').text(sensordata[0].sensorgroup_gl3_min)

            get_initial_date = sensordata[0].sensorgroup_initial_date;

            $('#topname').text(sensordata[0].sensorgroup_name)
            $('#topinitialdate').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }
            
        //    $('#projectName').text(sensordata[0].project_name)
        //    $('#placeName').text(sensordata[0].place_name)
         }
    })

    searchdata()


    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

});




function searchdata(){
    intervalday = $('#intervalday').val()
    time = $('#time').val()
    date_time_start = $('#date_time_start').val()
    date_time_end = $('#date_time_end').val()

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
    
    let initaildate = new Date(get_initial_date)
    let today = new Date()

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
       
            tabledata = data.data
            console.log(tabledata)

            next_time_start = date_time_start;
            next_time_end = date_time_end;

            if(tabledata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selecttable()
            }

       }
    });

}


function selecttable(){
    console.log(tabledata)

    let sensor_Date = []
    for(let i=0; i<tabledata[0].length; i++){
        sensor_Date.push(tabledata[0][i].sensor_data_date)
    }
    let t1h_data = [];
    let rn1_data = [];

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

                for(let i=0; i<sensor_Date.length; i++){
                    t1h_data.push("")
                    rn1_data.push("")
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == sensor_Date[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h + " ℃"
                            rn1_data[i] = weatherdata[j].weather_rn1 + " mm"
    
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
    
                for(let i=0; i<sensor_Date.length; i++){
                    t1h_data.push("")
                    rn1_data.push("")
                    for(let j=0; j<weatherdata.length; j++){
                        if(weatherdata[j].weather_date == sensor_Date[i]){
                            t1h_data[i] = weatherdata[j].weather_t1h + " ℃"
                        rn1_data[i] = weatherdata[j].weather_rn1 + " mm"
    
                        }
                    }
                }
    
           }
        });
    }

 
    console.log(t1h_data)
    if(datatable){datatable.destroy()}

    let rowindex = 0
    $('#tabletbody').empty()
    $('#table_top_name').empty()
    $('#table_top_name').append("<th>측정일시</th>")
    
    $('#tabletbody').append("<tr class='uk-text-success' id='Displacement'><td>최대변위 (Max Displacement)</td></tr>")
    for(let i = 0; i<sensorname_list_xy.length; i++){
        $('#table_top_name').append("<th>"+sensorname_list_xy[i].sensor_display_name+"</th>")
        // $('#Displacement').append("<td>x: -0.0060423<br>y: -0.0060423</td>")
        
        if(i == sensorname_list_xy.length-1){
            $('#table_top_name').append("<th>기온</th>")
            $('#table_top_name').append("<th>깅수량</th>")
            

        }
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
        tdtag += "<td>"+t1h_data[i]+"</td>"
        tdtag += "<td>"+rn1_data[i]+"</td>"
        tdtag +="</tr>"
        $('#tabletbody').append(tdtag)
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

}




function pagenation(){

    let tablelen = $('#tablelen').val()
    // console.log(tablelen)
  
    let datalen = tabledata[0].length
    // let datalen = $('#tabletbody tr').length
    console.log("datalen", datalen)

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)


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
 

    if(click_pagenum == 0){
        pagemove(0)
    }

}


function pagemove(pagenum){
    console.log("pagemove")
    click_pagenum = pagenum

    let tablelen = $('#tablelen').val()
  
    console.log(tablelen)

    let datalen = tabledata[0].length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)
    console.log(last)
    for(let i =0; i <tabledata[0].length; i++){
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

function pdfdown(params) {
    //                          project_id=6&sensorgroup_id=13&sensorgroup_type=0203&date_time_start=2022.04.21%2014:08&date_time_end=2022.04.28%2014:08&intervalday=&time=
   
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time

    window.open("/report_scatter_all?"+encodeURIComponent(uri))
}


function exceldown(){
  
    

    // "datarogger_id": datarogger_id,
    // "date_time_start": date_time_start,
    // "date_time_end": date_time_end,
    // "intervalday": intervalday,
    // "time": time,
    // "datarogger_id": datarogger_id,
    // "sensorgroup_id": sensorgroup_id

    let url = "/excel/down/all?sensorgroup_id="+sensorgroup_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time

    $.ajax({
        url : url,
        type : "post",
        data : {
            "sensorgroup_id": sensorgroup_id,
            "datarogger_id": datarogger_id,
            "date_time_start": date_time_start,
            "date_time_end": date_time_end,
            "intervalday": intervalday,
            "time": time,
           

        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // alert(data.resultString)
           console.log("Success")
           console.log(data)
            window.location.href = data.url
       }
    });
}
