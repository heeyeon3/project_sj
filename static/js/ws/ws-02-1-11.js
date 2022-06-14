let project_id = "";
let sensorgroup_id = "";
let place_id = "";
let datarogger_id = "";
let sensorgroup_type = "";

let sensordata = [];
let tabledata = [];


// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_name_list = []
let sensor_display_name_list = []


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
    searchdata()


   
    $('#linechart').attr("href", "ws-02-1-8?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#data').attr("href", "ws-02-1-11?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    // $('#linechart').attr("href", "ws-02-1-1?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#trendchart').attr("href", "ws-02-1-3?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    $('#timelinechart').attr("href", "ws-02-1-9?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)
    
    $('#info').attr("href", "ws-02-1-6?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&place_id="+place_id+"&datarogger_id="+datarogger_id+"&sensorgroup_type="+sensorgroup_type)

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

  
     
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
         }
    })

    $('#tablelen').change(function(){
        click_pagenum = 0
        pagenation()
    })

    selected_dataList = $("#selected_list").DataTable({
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "colReorder": false,
        "info": false,
        "autoWidth": true,
        "processing": true,
        "responsive": true,
        "columnDefs": [
            // { orderable: false, targets: 0 },
            // { orderable: false, targets: 4 },
            {"className": "text-center", "targets": "_all"}
        ],
        "paging": true,
        "scrollY":  "40%",
        "scrollCollapse": true,
        "language": {
          "zeroRecords": "선택된 목록이 없습니다."
        },
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-sm-12'p>>"
    });

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
           alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.resultString)
       
            tabledata = data.data
            console.log(tabledata)

            selecttable()
       }
    });

}


function selecttable(){
    console.log(tabledata)

    

    let rowindex = 0
    $('#tabletbody').empty()
    $('#table_top_name').empty()
    $('#table_top_name').append("<th><a href='#' class='selected'>측정일시<span uk-icon='icon: chevron-down'></span></a></th>")
    for(let i = 0; i<sensor_display_name_list.length; i++){
        $('#table_top_name').append("<th><a>"+sensor_display_name_list[i]+"</a></th>")
       
        
    }
    $('#table_top_name').append("<th><a>Ton</a></th>")


    

    for(let i = 0; i<tabledata[0].length; i++){
        let tdtag = "<tr id='row_"+i+"'>"
        tdtag += "<td>"+tabledata[0][i].sensor_data_date+"</td>"

        avgdatatotal = 0
        avglen = 0

        for(let j = 0; j<tabledata.length; j++){

                
            if(tabledata[j][i].sensor_fx1_data){
             
                
                if(level1_min && level1_max && level2_min && level2_max && level1_min.length !=0 && level1_max.length !=0 && level2_min.length !=0 && level2_max.length !=0 && 
                    ((parseFloat(level1_min) > parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level1_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level2_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                  
                        
                    tdtag += "<td class='uk-text-yellow'>"+tabledata[j][i].sensor_data+"</td>"
                    avgdatatotal += parseFloat(tabledata[j][i].sensor_data)
                    avglen += 1
                    
                }else if(level2_min && level2_max && level3_min && level3_max && level2_min.length !=0 && level2_max.length !=0 && level3_min.length !=0 && level3_max.length !=0 &&
                    ((parseFloat(level2_min) >parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_min) < parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level2_max) < parseFloat(tabledata[j][i].sensor_fx1_data) && parseFloat(level3_max) > parseFloat(tabledata[j][i].sensor_fx1_data)))){
                        tdtag += "<td class='uk-text-orange'>"+tabledata[j][i].sensor_data+"</td>"
                        avgdatatotal += parseFloat(tabledata[j][i].sensor_data)
                        avglen += 1
                   
                }else if(level3_min && level3_max && level3_min.length !=0 && level3_max.length !=0 && ((parseFloat(level3_min) > parseFloat(tabledata[j][i].sensor_fx1_data)) || (parseFloat(level3_max) < parseFloat(tabledata[j][i].sensor_fx1_data)))){
                    tdtag += "<td class='uk-text-red'>"+tabledata[j][i].sensor_data+"</td>"
                    avgdatatotal += parseFloat(tabledata[j][i].sensor_data)
                    avglen += 1
                  
                }else{
                    tdtag += "<td>"+tabledata[j][i].sensor_data+"</td>"
                    avgdatatotal += parseFloat(tabledata[j][i].sensor_data)
                    avglen += 1
               
                }
                
            }else{
                tdtag += "<td >"+tabledata[j][i].sensor_data+"</td>"

                avgdatatotal += parseFloat(tabledata[j][i].sensor_data)
                avglen += 1
                 
            }

            if(j == tabledata.length-1){
                
                let avg = avgdatatotal/avglen
                tdtag += "<td >"+avg.toFixed(4)+"</td>"
            }
        }
        tdtag +="</tr>"
        $('#tabletbody').append(tdtag)
        $('#row_'+i).hide()
    }

    
    
    // for(let i = 0; i<tabledata.length; i++){



    //     let nameidx = t_sensorname.indexOf(tabledata[i].sensor_name) + 1
    //     let dateidx = t_sensordate.indexOf(tabledata[i].sensor_data_date)

    //     // console.log(dateidx)

    //     let td = $('#row_'+dateidx+' td').length //row 개수
    //     console.log(nameidx, td, nameidx - td)

    //     // $('#row_'+dateidx).append("<td>"+tabledata[i].sensor_data+"</td>")
    //     if(td == nameidx){
    //         if((level1_min > tabledata[i].sensor_data && level2_min < tabledata[i].sensor_data) || (level1_max < tabledata[i].sensor_data && level2_max > tabledata[i].sensor_data)){
    //             $('#row_'+dateidx).append("<td class='uk-text-yellow'>"+tabledata[i].sensor_data+"</td>")
        
    //         }else if((level2_min > tabledata[i].sensor_data && level3_min < tabledata[i].sensor_data) || (level2_max < tabledata[i].sensor_data && level3_max > tabledata[i].sensor_data)){
    //             $('#row_'+dateidx).append("<td class='uk-text-orange'>"+tabledata[i].sensor_data+"</td>")
             
    //         }else if((level3_min > tabledata[i].sensor_data) || (level3_max < tabledata[i].sensor_data)){
    //             $('#row_'+dateidx).append("<td class='uk-text-red'>"+tabledata[i].sensor_data+"</td>")
               
    //         }else{$('#row_'+dateidx).append("<td>"+tabledata[i].sensor_data+"</td>")}


    //         // $('#row_'+dateidx).append("<td>"+tabledata[i].sensor_data+"</td>")
    //     }else{
    //         let nonedata = nameidx - td
    //         for(let i = 0; i < nonedata; i++){
    //             $('#row_'+dateidx).append("<td></td>")
    //         }

    //         $('#row_'+dateidx).append("<td>"+tabledata[i].sensor_data+"</td>")
    //     }

        

    // }

    // for(let i = 0; i<rowindex; i++){
    //     $('#row_'+i).hide()
    // }

    click_pagenum = 0
    pagenation()


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
