let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let tabledata = [];

let datatable;
// let chart;

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

let sensor_fx_data = []
let sensor_initial_date = "";
let sensor_fx_name = "";

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

let namelist = [];
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

            sensor_initial_date = sensordata[0].sensor_initial_date
            sensor_fx_name = sensordata[0].function_name
            get_initial_date = sensordata[0].sensorgroup_initial_date;

     
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
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

    // selected_dataList = $("#selected_list").DataTable({
    //     "lengthChange": false,
    //     "searching": false,
    //     "ordering": true,
    //     "colReorder": false,
    //     "info": false,
    //     "autoWidth": true,
    //     "processing": true,
    //     "responsive": true,
    //     "columnDefs": [
    //         // { orderable: false, targets: 0 },
    //         // { orderable: false, targets: 4 },
    //         {"className": "text-center", "targets": "_all"}
    //     ],
    //     "paging": true,
    //     "scrollY":  "40%",
    //     "scrollCollapse": true,
    //     "language": {
    //       "zeroRecords": "선택된 목록이 없습니다."
    //     },
    //     dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
    //          "<'row'<'col-sm-12'tr>>" +
    //          "<'row'<'col-sm-12'p>>"
    // });


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

    $.ajax({
        url : "/editdata/all",
        // url : "/editdata/all/roadcell",
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

            $.ajax({
                url : "/editdata/all/roadcell",
                type : "POST",
                async : false,
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
               
                    sensor_fx_data = data.data
                    console.log(sensor_fx_data)

                    namelist = data.namelist
                    console.log(namelist)
                 
               }
            });

            if(tabledata[0].length ==0){
                alert("선택된 날짜에 데이터가 존재하지 않습니다. 기간을 다시 설정해 주세요.")
            }else{
                selecttable()
            }
       }
    });

    

}


function selecttable(){
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
    console.log(tabledata)
    if(datatable){datatable.destroy()}
    

    let rowindex = 0
    $('#tabletbody').empty()
    $('#tabletbody').append("<tr class='uk-text-success' id='table_top_Displacement'></tr>")

    $('#table_top_name').empty()
    $('#table_top_name').append("<th>측정일시</th>")
    for(let i = 0; i<sensor_display_name_list.length; i++){
        $('#table_top_name').append("<th>"+sensor_display_name_list[i]+"</th>")
       
        
    }
    for(let j=0; j<sensor_fx_data[0].sensor_fx_len; j++){
        $('#table_top_name').append("<th>"+namelist[j]+"</th>")
    }
    // $('#table_top_name').append("<th>"+sensor_fx_name+"</th>")
    $('#table_top_name').append("<th>기온</th>")
    $('#table_top_name').append("<th>강수량</th>")

    $('#table_top_initial').empty()

    $('#table_top_Displacement').empty()
    $('#table_top_Displacement').append("<td>최대변위 (Max Displacement)</td>")

    for(let i = 0; i<sensordata.length; i++){
       
       
        if(sensordata[i].sensor_initial_data){
            let displacement = 0;
            let sensor_data = ""
        
            for(let j = 0; j<tabledata[0].length; j++){
                if(sensor_data.length == 0 ){
                    sensor_data =tabledata[i][j].sensor_fx_check_data
                }
                if(tabledata[i][j].sensor_data){
                  
                    let displ = Math.abs(parseFloat(tabledata[i][j].sensor_data) - parseFloat(sensordata[i].sensor_initial_data))
                    console.log(displ, tabledata[i][j].sensor_data, sensordata[i].sensor_initial_data)
                    if(displacement < displ){
                        displacement = displ
                        console.log(tabledata[i][j].sensor_fx_check_data)
                        sensor_data = tabledata[i][j].sensor_fx_check_data
                       
                    }
                }
                
            }
            console.log("sensor_data",sensor_data)
            console.log("<td>"+sensor_data+"</td>")
            $('#table_top_Displacement').append("<td>"+sensor_data+"</td>")

           
        }

        if(i == sensordata.length-1){
            let displacement = 0;
           let sensor_data  = "";

           for(let idx = 0; idx<sensor_fx_data[0].sensor_fx_len; idx++){

                for(let j = 0; j<sensor_fx_data.length; j++){
                    console.log(namelist[idx])
                    if(sensor_fx_data[j][namelist[idx]]){
                    
                        let displ = parseFloat(sensor_fx_data[j][namelist[idx]])
                        console.log(displ)
                    
                        if(displacement < displ){
                        
                            displacement = displ
                            sensor_data = sensor_fx_data[j][namelist[idx]]
                        }
                    
                    }
                    
                }

                $('#table_top_Displacement').append("<td>"+sensor_data+"</td>")

           }
            // for(let j = 0; j<sensor_fx_data.length; j++){
           
            //     if(sensor_fx_data[j].sensor_fx_data){
                  
            //         let displ = parseFloat(sensor_fx_data[j].sensor_fx_data)
            
                  
            //         if(displacement < displ){
                       
            //             displacement = displ
            //             sensor_data = sensor_fx_data[j].sensor_fx_data
            //         }
                   
            //     }
                
            // }
        

            // $('#table_top_Displacement').append("<td>"+sensor_data+"</td>")
            $('#table_top_Displacement').append("<td></td>")
            $('#table_top_Displacement').append("<td></td>")
        }
    }

  
    

    for(let i = 0; i<tabledata[0].length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[0][i].sensor_data_date.substr(0,16)+"</td>"

        avgdatatotal = 0
        avglen = 0

        for(let j = 0; j<tabledata.length; j++){

            if(sensor_initial_date == tabledata[0][i].sensor_data_date){
                tdtag += "<td class='uk-text-blue'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
            }else if((level3_min && parseFloat(tabledata[j][i].sensor_fx_check_data) < parseFloat(level3_min)) || (level3_max && parseFloat(tabledata[j][i].sensor_fx_check_data) > parseFloat(level3_max))){
                tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
            }else if((level2_min && parseFloat(tabledata[j][i].sensor_fx_check_data) < parseFloat(level2_min)) || (level2_max && parseFloat(tabledata[j][i].sensor_fx_check_data) > parseFloat(level2_max))){
                tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
            }else if((level1_min && parseFloat(tabledata[j][i].sensor_fx_check_data) < parseFloat(level1_min)) || (level1_max && parseFloat(tabledata[j][i].sensor_fx_check_data) > parseFloat(level1_max))){
                tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_fx_check_data+"</td>"
            }else{
                tdtag += "<td >"+tabledata[j][i].sensor_fx_check_data+"</td>"
            }
        }

        for(let j=0; j<sensor_fx_data[0].sensor_fx_len; j++){
            tdtag += "<td>"+sensor_fx_data[i][namelist[j]]+"</td>"
        }
        // tdtag += "<td>"+sensor_fx_data[i].sensor_fx_data+"</td>"
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
    // makedatatable()
    
   


}


function makedatatable(){
    $("#data-list").DataTable({
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
    window.location.href =  "/ws-02-1-13?" +encodeURIComponent(uri)
}


function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-14?" +encodeURIComponent(uri)
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-15?" +encodeURIComponent(uri)
  
}

function fomulalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
 
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-17?" +encodeURIComponent(uri)
    
}



function exceldown(){
  
    

    // "datarogger_id": datarogger_id,
    // "date_time_start": date_time_start,
    // "date_time_end": date_time_end,
    // "intervalday": intervalday,
    // "time": time,
    // "datarogger_id": datarogger_id,
    // "sensorgroup_id": sensorgroup_id

    let url = "/editdata/all/roadcell?sensorgroup_id="+sensorgroup_id+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end+"&intervalday="+intervalday+"&time="+time

    $.ajax({
        url : url,
        type : "get",
        // data : {
        //     "sensorgroup_id": sensorgroup_id,
        //     "datarogger_id": datarogger_id,
        //     "date_time_start": date_time_start,
        //     "date_time_end": date_time_end,
        //     "intervalday": intervalday,
        //     "time": time,
           

        // },
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


function pdfdown(params) {
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+next_time_start+"&X2V="+next_time_end +"&aW5="+intervalday+"&dGl="+time
    // window.location.href =  "/ws-02-1-17?" +encodeURIComponent(uri)
    window.open("/report_roadcell_all?"+encodeURIComponent(uri))
}