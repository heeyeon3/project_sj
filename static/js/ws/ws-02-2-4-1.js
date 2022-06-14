let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let graphdata = [];
let project_id = "";
let sensorgroup_type = "";

// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensor_fx_check = "";
let curStart = 0;

let next_time_start = "";
let next_time_end = "";
let get_initial_date = "";

$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
   
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
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});

    $.ajax({
        url:"sensordetail/select?sensor_id="+sensor_idx,
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

          
    
            $('#gaugefactorandvalue').text("Gauge Factor: "+sensordata[0].sensor_gauge_factor)
            $('#initialdateandvalue').text("Initial Date: "+sensordata[0].sensor_initial_date)
            $('#fomulasensorname').text(sensordata[0].sensor_display_name)

            $('#topname').text(sensordata[0].sensor_display_name)

            get_initial_date = sensordata[0].sensor_initial_date;
            
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }
            let fomula01 = sensordata[0].sensor_fx1
            let fomula02 = sensordata[0].sensor_fx2
            let fomula03 = sensordata[0].sensor_fx3
            let fomula04 = sensordata[0].sensor_fx4
            let fomula05 = sensordata[0].sensor_fx5
            let fomula01_name = sensordata[0].sensor_fx1_name
            let fomula02_name = sensordata[0].sensor_fx2_name
            let fomula03_name = sensordata[0].sensor_fx3_name
            let fomula04_name = sensordata[0].sensor_fx4_name
            let fomula05_name = sensordata[0].sensor_fx5_name
            sensor_fx_check = sensordata[0].sensor_fx_check

          
            console.log(usergr)
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

            if(fomula01 && fomula01.length !=0){
            let tdtag = " <tr data-state='one'>"
            tdtag += "<td>1</td>"
            if(sensor_fx_check == '1'){
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='1' checked>"+fomula01_name+"</label></td>"
            }else{
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='1' >"+fomula01_name+"</label></td>"
            }
            
            tdtag +=    " <td><input class='uk-input' type='text' placeholder='"+fomula01+"' disabled></td>"
            tdtag +=       " <td>"
            if(usergr == '0101' || usergr == '0102'){
                tdtag +=         "<a href=\"#formula\" class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(1)'></a>"
                // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash'  onclick='fomulaedel(1)' ></a>     "
            }
            // tdtag +=         "<a href=\"#formula\" class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(1)'></a>"
            // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash'  onclick='fomulaedel(1)' ></a>     "
            tdtag +=    " </td></tr>"

            $('#tbltbody').append(tdtag)
            }
            if(fomula02 && fomula02.length !=0){
            let tdtag = " <tr data-state='one'>"
            tdtag += "<td>2</td>"
            if(sensor_fx_check == '2'){
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='2' checked>"+fomula02_name+"</label></td>"
            }else{
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='2' >"+fomula02_name+"</label></td>"
            }
            tdtag +=    " <td><input class='uk-input' type='text' placeholder='"+fomula02+"' disabled></td>"
            tdtag +=       " <td>"
            if(usergr == '0101' || usergr == '0102'){
            tdtag +=         "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(2)'></a>"
            // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash'  onclick='fomulaedel(2)' ></a>     "
            }
            tdtag +=    " </td></tr>"

            $('#tbltbody').append(tdtag)
            }
            if(fomula03 && fomula03.length !=0){
            let tdtag = " <tr data-state='one'>"
            tdtag += "<td>3</td>"
            if(sensor_fx_check == '3'){
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='3' checked>"+fomula03_name+"</label></td>"
            }else{
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='3' >"+fomula03_name+"</label></td>"
            }
   
            tdtag +=    " <td><input class='uk-input' type='text' placeholder='"+fomula03+"' disabled></td>"
            tdtag +=       " <td>"
            if(usergr == '0101' || usergr == '0102'){
            tdtag +=         "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(3)'></a>"
            // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash'  onclick='fomulaedel(3)' ></a>   "
            }
            tdtag +=    " </td></tr>"

            $('#tbltbody').append(tdtag)
            }
            if(fomula04 && fomula04.length !=0){
            let tdtag = " <tr data-state='one'>"
            tdtag += "<td>4</td>"
            if(sensor_fx_check == '4'){
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='4' checked>"+fomula04_name+"</label></td>"
            }else{
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='4' >"+fomula04_name+"</label></td>"
            }
            
            tdtag +=    " <td><input class='uk-input' type='text' placeholder='"+fomula04+"' disabled></td>"
            tdtag +=       " <td>"
            if(usergr == '0101' || usergr == '0102'){
            tdtag +=         "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(4)'></a>"
            // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='fomulaedel(4)'></a>     "
            }
            tdtag +=    " </td></tr>"

            $('#tbltbody').append(tdtag)
            }
            if(fomula05 && fomula05.length !=0){
            let tdtag = " <tr data-state='one'>"
            tdtag += "<td>5</td>"
            if(sensor_fx_check == '5'){
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='5' checked>"+fomula05_name+"</label></td>"
            }else{
                tdtag += "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='5'>"+fomula05_name+"</label></td>"
            }
            
            tdtag +=    " <td><input class='uk-input' type='text' placeholder='"+fomula05+"' disabled></td>"
            tdtag +=       " <td>"
            if(usergr == '0101' || usergr == '0102'){
            tdtag +=         "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick='fomulaedit(5)'></a>"
            // tdtag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='fomulaedel(5)'></a>     "
            }
            tdtag +=    " </td></tr>"

            $('#tbltbody').append(tdtag)
            }
         }
    })

    $("#fomulamodal").on("click",function () {
        fomulaedit(sensor_fx_check)
    })

    $.ajax({
        url : '/fomula/list/project?project_id='+project_id,
        type : "get",
        async:false,
        contentType : false,
        processData : false,
        error:function(){
           alert("공식이 올바르지 않습니다.");
        },
        success:function(data) {

            console.log(data.data)

            fomulalist = data.data

            for(let i=0; i<fomulalist.length; i++){
                $('#fomulas').append("<option value='"+(i+1)+"' fomula='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
            }


            
       }
    });

    $('#calc').on('keydown', function(e){
        if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 17 || e.keyCode == 25 || e.keyCode == 67 || e.keyCode == 86){
            console.log("BACK SPACE");
        }else{
            e.preventDefault();
        }
    });

    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

});




function savebtn(){
    console.log("1")

    let radiocheck =$('input[name="radio2"]:checked').val();
    console.log(radiocheck)

    $.ajax({
        url:"/fumula/list/sensor",
        type:"post",
        data:{
            "sensor_fx_check": radiocheck,
            "sensor_id": sensor_idx
        },
        // contentType: false,
        // processData : false,
        error:function(err){
            console.log(err);
            alert("공식 적용시 오류가 발생하였습니다.")
        },
        success:function(json) {
            alert(json.resultString)
            window.location.reload();
        }
    })

}

function fomulaedit(num) {
    console.log(num)
    console.log(sensordata[0].sensor_fx1_name)
    $('#test_result').text('-');
    if(num == 1){
        $('#fomulaname').val(sensordata[0].sensor_fx1_name)
        $('#calc').val(sensordata[0].sensor_fx1)
    }else if(num == 2){
        $('#fomulaname').val(sensordata[0].sensor_fx2_name)
        $('#calc').val(sensordata[0].sensor_fx2)
    }else if(num == 3){
        $('#fomulaname').val(sensordata[0].sensor_fx3_name)
        $('#calc').val(sensordata[0].sensor_fx3)
    }else if(num == 4){
        $('#fomulaname').val(sensordata[0].sensor_fx4_name)
        $('#calc').val(sensordata[0].sensor_fx4)
    }else if(num == 5){
        $('#fomulaname').val(sensordata[0].sensor_fx5_name)
        $('#calc').val(sensordata[0].sensor_fx5)
    }

    


    $('#formulaeditbtn').click(function(){
        console.log("!!!!!!수정!!!!")

        let fomula_name = $('#fomulaname').val()
        let calc = $('#calc').val()

        if(fomula_name.length == 0){
            alert("공식명을 입력해 주세요.")
            return;
        }else if(calc.length == 0 ){
            alert("공식을 입력해 주세요.")
            return;
        }
        
        let form_data = new FormData
        form_data.append("function_name", fomula_name)
        form_data.append("sensor_del_num", num)
        form_data.append("sensor_id", sensor_idx)
        form_data.append("sensorgroup_type", sensorgroup_type)
        form_data.append("calc", calc)
        

        console.log(fomula_name, calc)

        $.ajax({
            url:"/fumula/list/sensor",
            type:"put",
            data:form_data,
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
                alert("공식변경에 실패했습니다. 공식을 확인 해주세요.");
            },
            success:function(json) {
                alert(json.resultString)
                window.location.reload()
            }
        })

    })
    
    
}

function fomulaedel(num) {
    console.log(num)
    console.log(sensordata[0].sensor_fx1_name)

    if(num == sensor_fx_check){
        alert("표출되는 공식은 삭제할 수 없습니다.")
        return;
    }

    let delconfirm = confirm("공식을 삭제 하시겠습니까?")

    if(delconfirm){
        console.log("삭제")

        $.ajax({
            url:"/fumula/list/sensor",
            type:"delete",
            data:{
                "sensor_del_num": num,
                "sensor_id": sensor_id,
                "sensorgroup_type": sensorgroup_type
            },
            // contentType: false,
            // processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                 console.log(json.resultString)
             }
        })
    }
   
    
    
}



function setTextToPos(str) {
    var textarea = document.getElementById("calc");
    console.log(textarea)

    curStart = textarea.selectionStart;
    console.log(curStart)
    let x = $("#calc").val();
    console.log(x)
    // $("#textarea").val(x.slice(0, curStart) + str + x.slice(curStart));
}


function fomulaadd(type){
    console.log("fomula add")

    $('#fomulaselect').empty()
    $('#fomulaselect').append("<option>변위공식 불러오기</option>")

    $('#calc').val('');
    $('#fomulaname').val('');
    $('#fomulaname').val('');
    $('#test_result').text('-');

    $.ajax({
        url : '/function_formula',
        type : "get",
        contentType : false,
        processData : false,
        error:function(){
            alert("공식 리스트 조회에 실패하였습니다.");
        },
        success:function(data) {
            console.log(data.data)
            
            let fomula_list = data.data
            console.log(fomula_list)

            for(let i = 0; i<fomula_list.length; i++){
                $('#fomulaselect').append("<option value='"+fomula_list[i].function_formula+"'>"+fomula_list[i].function_name+"</option>")

            }

            



        }
    });

    $('#fomulaselect').change(function(){
        console.log("change")
        let function_id = $('#fomulaselect option:selected').val()
        console.log(function_id)

        $('#calc').val(function_id)
    })
   
    
}

function trashbtn(function_id){
    console.log("teash!", function_id)
    let delconfirm = confirm("공식을 삭제하겠습니까?")
    if(delconfirm){
        $.ajax({
            url : '/function_formula?function_id='+function_id,
            type : "delete",
            contentType : false,
            processData : false,
            error:function(){
                console.log("공식 삭제 실패.");
            },
            success:function(data) {
                // console.log(data.data)
                alert(data.resultString)
                window.location.href =  "/ws-02-2-4-1?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end +"&intervalday="+intervalday+"&time="+time
            
            }
        });
    }
    else{}

}

function caclulation(value){

    var textarea = document.getElementById("calc");
    curStart = textarea.selectionStart;
    console.log(curStart)
    var position = curStart;
   
    // console.log("!!")
    console.log(value)
    console.log(curStart)

    if(value == 'AC'){
        calcvalue = "";
        curStart = 0;
        $('#calc').val(calcvalue);
        return;
    }

    

    calcvalue = $('#calc').val()
    console.log("calcvalue", calcvalue)

    // calcvalue += value    


    var output = [calcvalue.slice(0, position), value, calcvalue.slice(position)].join('');
    console.log("output",output);

    $('#calc').val(output)
    $("#calc").focus()
    textarea.setSelectionRange(position+value.length, position+value.length);

}


function check_function(type){
    var checkFomula = '';
    checkFomula = $('#calc').val();
    // if(type == 'add'){
    //     checkFomula = $('#calc').val();
    // } else if(type == 'edit'){
    //     checkFomula = $('#calc2').val();
    // }
    console.log("checkFomula", checkFomula)
    var form_data = new FormData();
    form_data.append("function_formula", checkFomula)

    $.ajax({
        url : '/function_formula_chk',
        data : form_data,
        type : "post",
        contentType : false,
        processData : false,
        error:function(){
            alert("공식이 올바르지 않습니다.");
        },
        success:function(data) {
            console.log(data);
            // if(type == 'add'){
            //     $("#test_result").text(data.resultString)
            // } else if(type == 'edit'){
            //     $("#test_result2").text(data.resultString)
            // }
            $("#test_result").text(data.resultString)
        }
    });

    

}



function trendlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-7?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-7?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function datalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-8?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-8?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function fomulalocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-4-1?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-4-1?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}
function infolocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-9?"+encodeURIComponent(uri)
    // window.location.href =  "/ws-02-2-9?sensor_idx="+sensor_idx+"&sensor_idy="+sensor_idy+"&project_id="+project_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+next_time_start+"&date_time_end="+next_time_end +"&intervalday="+intervalday+"&time="+time
}


function chartlocation(){
    let uri = "c2Vx="+sensor_idx+"&c2Vy="+sensor_idy+"&cHJ="+project_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-2-6?"+encodeURIComponent(uri)
}