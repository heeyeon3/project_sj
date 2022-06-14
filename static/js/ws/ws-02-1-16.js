let sensor_id = "";
let datarogger_id = "";
let sensor_name = "";
let sensordata = [];
let graphdata = [];
let project_id = "";
let sensorgroup_type = "";
let sensorgroup_id = "";

// let chart;

let level1_max = "";
let level1_min = "";
let level2_max = "";
let level2_min = "";
let level3_max = "";
let level3_min = "";

let sensorgroup_fx = "";
let curStart = 0;

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

    $("#date_time_start").val(date_time_start)
    $("#date_time_end").val(date_time_end)
    $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    $("#time").val(time).prop("selected", true)
    $("#intervalday").val(intervalday).prop("selected", true)

    let current_user_gr="";
    $.ajax({
        url : "current/user",
        type : "POST",
        async:false,
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.data)
            let currentdata =JSON.parse(data.data)
            current_user_gr = currentdata.user_grade
            console.log(usergr)

        }
    })

    $.ajax({
        url:"sensorgroup/mapping?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id,
        type:"get",
        contentType: false,
        processData : false,
        async:false,
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
            get_initial_date = sensordata[0].sensorgroup_initial_date;

             sensorgroup_fx = sensordata[0].sensorgroup_fx
            $('#topsensername').text(sensordata[0].sensorgroup_name)
            $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            // $('#sensorgroupinitail').text("Initial Date: "+sensordata[0].sensorgroup_initial_date)
            $('#date_time_start').datetimepicker({minDate:new Date(get_initial_date)});

            let startday = new Date($('#date_time_start').val())
            let initaildate = new Date(get_initial_date)

            if(initaildate > startday){
                $('#date_time_end').datetimepicker({minDate:new Date(get_initial_date)});
            }

            console.log(current_user_gr)
            // 로드셀 공식만 매핑
            $.ajax({
                url : '/function_formula/roadcell?project_id='+project_id,
                type : "get",
                contentType : false,
                processData : false,
                error:function(){
                    alert("공식조회에 실패하였습니다.");
                },
                success:function(data) {

                    console.log(data.data)

                    let roadcelllist = data.data

                    for(let i=0; i<roadcelllist.length; i++){

                        console.log(sensorgroup_fx)
                        console.log(roadcelllist[i].function_id)
                    let fxlist =   "<tr data-state='done'>"
                    fxlist += "<td>"+(i+1)+"</td>"
                    if(sensorgroup_fx == roadcelllist[i].function_id){
                        fxlist +=  "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='"+roadcelllist[i].function_id+"' checked>"+roadcelllist[i].function_name+"</label></td>"
                    }else{
                        fxlist +=  "<td><label><input class='uk-radio uk-margin-right' type='radio' name='radio2' value='"+roadcelllist[i].function_id+"'>"+roadcelllist[i].function_name+"</label></td>"
                    }
                    
                    fxlist +=   "<td><input class='uk-input' type='text' placeholder='$Sen-# - $Sen-02-iniial' disabled value='"+roadcelllist[i].function_formula+"'></td>"
                    fxlist +=   "<td>"
                    if(current_user_gr == '0101'){
                        fxlist +=       "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick=\"fomulaedit('"+roadcelllist[i].function_id+"','"+roadcelllist[i].function_name+"','"+roadcelllist[i].function_formula+"')\"></a>"
                        fxlist +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashbtn("+roadcelllist[i].function_id+")'></a>     "
                    }else if(current_user_gr == '0102'){
                        fxlist +=       "<a href='#formula' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick=\"fomulaedit('"+roadcelllist[i].function_id+"','"+roadcelllist[i].function_name+"','"+roadcelllist[i].function_formula+"')\"></a>"
                    }
                    fxlist +=  " </td>"
                    fxlist +=  "</tr>"

                    $('#tbltbody').append(fxlist)
                    }

                

                    
            }
            });
         }
    })


    



    $("#fomulamodal").on("click",function () {
        fomulaedit(sensorgroup_fx)
    })

    $.ajax({
        url : '/fomula/list/project?project_id='+project_id,
        type : "get",
        async : false,
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

    $('#fomulas').change(function(){
        console.log("change")
        let function_id = $('#fomulas option:selected').attr('fomula')
        console.log(function_id)

        $('#calc').val(function_id)
    })

    $('#calc').on('keydown', function(e){ 
        if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 17 || e.keyCode == 25 || e.keyCode == 67 || e.keyCode == 86){
            console.log("BACK SPACE");
        }else{
            e.preventDefault();
        }
    });


    $('#funcionmanage').click(function (){
        $('#fomulaname').val('')
        $('#calc').val('')
        $('#test_result').text('-')
        $('#formulaeditbtn').hide()
        $('#formuladsavebtn').show()
    })


    $('#formuladsavebtn').click(function (){
        console.log("!")
        let function_formula = $('#calc').val()
        let fomulaname = $('#fomulaname').val()
        console.log(function_formula)
        // function_formula01 = function_formula.replace(/^/gi, '**')
        // console.log(function_formula01)

        if(fomulaname.length == 0){
            alert("공식명을 입력해 주세요.")
            $('#fomulaname').focus()
            return;
        }else if(function_formula.length == 0){
            alert("공식을 입력해 주세요.")
            return;
        }
        var form_data = new FormData();
        form_data.append("function_formula", function_formula)
        form_data.append("function_name", fomulaname)
        form_data.append("project_id", project_id)

        $.ajax({
            url : '/function_formula/roadcell',
            data : form_data,
            type : "post",
            contentType : false,
            processData : false,
            error:function(){
               alert("공식이 올바르지 않습니다.");
            },
            success:function(data) {

                alert(data.resultString);
                let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
                // window.location.href =  "/ws-02-1-16?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end +"&intervalday="+intervalday+"&time="+time
 
                
           }
        });


    })
   


    $('#date_time_start').change(function () {
        $('#date_time_end').datetimepicker({minDate:new Date($('#date_time_start').val())});
    })

});




function savebtn(){
    console.log("1")

    let radiocheck =$('input[name="radio2"]:checked').val();
    console.log(radiocheck)

    $.ajax({
        url:"/function_formula_chk?sensorgroup_id="+ sensorgroup_id +"&sensorgroup_fx=" +radiocheck ,
        type:"get",
        // contentType: false,
        // processData : false,
        error:function(err){
            console.log(err);
            alert("공식 적용시 오류가 발생하였습니다.")
        },
        success:function(json) {
            console.log(json.resultString)
            alert("선택하신 공식이 적용 되었습니다.")
            let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
            window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
            // window.location.href =  "/ws-02-1-16?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end +"&intervalday="+intervalday+"&time="+time


        }
    })

}

function fomulaedit(id, name, fumula) {
    console.log(id, name, fumula)
    $('#formulaeditbtn').show()
    $('#formuladsavebtn').hide()
    $('#fomulaname').val(name)
    $('#calc').val(fumula)
    $('#test_result').text('-')
    
    


    $('#formulaeditbtn').click(function(){
        console.log("!!!!!!수정!!!!")

        let fomula_name = $('#fomulaname').val()
        let calc = $('#calc').val()


        if(fomula_name.length == 0){
            alert("공식명을 입력해 주세요.")
            $('#fomulaname').focus()
            return;
        }else if(calc.length == 0){
            alert("공식을 입력해 주세요.")
            return;
        }

        let form_data = new FormData()
        form_data.append("function_name", fomula_name)
        form_data.append("function_id", id)
        form_data.append("sensorgroup_id", sensorgroup_id)
        form_data.append("sensorgroup_type", sensorgroup_type)
        form_data.append("function_formula", calc)
        

        console.log(fomula_name, calc)

        $.ajax({
            url:"/function_formula/roadcell",
            type:"put",
            data:form_data,
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                 console.log(json.resultString)
                 alert("공식이 수정되었습니다.")
                 let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
                 window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
                //  window.location.href =  "/ws-02-1-16?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end +"&intervalday="+intervalday+"&time="+time
             }
        })

    })
    
    
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

    if(function_id == sensorgroup_fx){
        alert("표출되는 공식은 삭제할 수 없습니다.")
        return;
    }


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
                let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
                window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
                // window.location.href = "/ws-02-1-16?project_id="+project_id+"&sensorgroup_id="+sensorgroup_id+"&sensorgroup_type="+sensorgroup_type+"&date_time_start="+date_time_start+"&date_time_end="+date_time_end +"&intervalday="+intervalday+"&time="+time
            
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

function chartlocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-13?" +encodeURIComponent(uri)
}


function timelinelocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-14?" +encodeURIComponent(uri)
}
function datalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-15?" +encodeURIComponent(uri)
  
}

function fomulalocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-16?" +encodeURIComponent(uri)
 
}

function infolocation(){
    let uri = "cHJ="+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type+"&N0Y="+date_time_start+"&X2V="+date_time_end +"&aW5="+intervalday+"&dGl="+time
    window.location.href =  "/ws-02-1-17?" +encodeURIComponent(uri)
    
}
