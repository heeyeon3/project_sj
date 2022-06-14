let project_id = "";
let calcvalue = "";
let curStart = "";

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')

    $.ajax({
        url : '/function_formula/company?project_id='+project_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(){
           alert("공식을 불러오는데 실패헸습니다.");
        },
        success:function(data) {

            console.log(data.data)

            function_list = data.data

            for(let i = 0; i< function_list.length; i++ ){
                let tdtag =" <tr data-state='done'>"
                tdtag += " <td>"+(function_list.length-i)+"</td>"
                tdtag +=    "<td>"+function_list[i].function_name+"</td>"
                tdtag +=   " <td><input class='uk-input' type='text' placeholder='"+function_list[i].function_formula+"' disabled ></td>"
                tdtag +=   " <td>"
                tdtag +=        "<a href='#formula' onclick=\"fomulaedit('"+function_list[i].function_id+"','"+function_list[i].function_name+"','"+function_list[i].function_formula+"')\" class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle></a>"
                tdtag +=       " <a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashbtn("+function_list[i].function_id+")'></a>"
                tdtag +=     "</td>"
                tdtag +=    "</tr>"

                $('#function_tbody').append(tdtag)
            }

            
       }
    });



    $('#savebtn').click(function(){
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
            alert("공식을 확인해 주세요.")
            return;
        }
        var form_data = new FormData();
        form_data.append("function_formula", function_formula)
        form_data.append("function_name", fomulaname)
        form_data.append("project_id", project_id)

        $.ajax({
            url : '/function_formula/company',
            data : form_data,
            type : "post",
            contentType : false,
            processData : false,
            error:function(){
               alert("공식이 올바르지 않습니다.");
            },
            success:function(data) {

                alert(data.resultString);
                window.location.href = '/ws-03?'+encodeURIComponent("cHJ="+project_id)
 
                
           }
        });

    });

    
    $('#calc').on('keydown', function(e){
        if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 17 || e.keyCode == 25 || e.keyCode == 67 || e.keyCode == 86){
            console.log("BACK SPACE");
            
        }else{
            e.preventDefault();
        }
    });

})

function setTextToPos(str) {
    var textarea = document.getElementById("calc");
    // console.log(textarea)

    curStart = textarea.selectionStart;
    console.log(curStart)
    let x = $("#calc").val();
    // console.log(x)
    // $("#textarea").val(x.slice(0, curStart) + str + x.slice(curStart));
}


function fomulaadd(type){
    console.log("fomula add")

    $('#editbtn').hide()
    $('#savebtn').show()

    $('#fomulaselect').empty()
    $('#fomulaname').val("")
    $('#test_result').text('-')
    $('#calc').val("")
    $('#fomulaselect').append("<option>변위공식 불러오기</option>")


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
                $('#fomulaselect').append("<option value='"+fomula_list[i].function_id+"' formula='"+fomula_list[i].function_formula+"'>"+fomula_list[i].function_name+"</option>")

            }


        }
    });

    $('#fomulaselect').change(function(){
        console.log("change")
        let function_fomula = $('#fomulaselect option:selected').attr('formula')
        console.log(function_fomula)

        $('#calc').val(function_fomula)
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
                window.location.href = '/ws-03?'+encodeURIComponent("cHJ="+project_id)
            
            }
        });
    }
    else{}

}

function refresh(){
    console.log("!")
    window.location.href = '/ws-03?'+encodeURIComponent("cHJ="+project_id)
}


function fomulaedit(id, name, formula) {
    console.log("!", id, name, formula)   
    $('#editbtn').show()
    $('#savebtn').hide()

    $('#fomulaselect').empty()
    $('#fomulaname').val("")
    $('#test_result').text('-')
    $('#calc').val("")
    $('#fomulaselect').append("<option>변위공식 불러오기</option>")


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
                $('#fomulaselect').append("<option value='"+fomula_list[i].function_id+"' formula='"+fomula_list[i].function_formula+"'>"+fomula_list[i].function_name+"</option>")

            }
            
            // $('#fomulaselect').val(id).prop("selected", true)


        }
    });
    $('#fomulaname').val(name)
    $('#calc').val(formula)

    $('#fomulaselect').change(function(){
        console.log("change")
        let function_id = $('#fomulaselect option:selected').attr("formula")
        console.log(function_id)

        $('#calc').val(function_id)
    })

    $('#editbtn').click(function(){

        let function_name = $('#fomulaname').val()
        let function_formula = $('#calc').val()

        if(function_name.length == 0){
            alert("공식명을 입력해 주세요.")
            $('#fomulaname').focus()
            return;
        }else if(function_formula.length == 0){
            alert("공식을 확인해주세요.")
            return;
        }

        

        let form_data = new FormData()
        form_data.append("function_name", function_name)
        form_data.append("function_id", id)
        form_data.append("function_formula", function_formula)
        $.ajax({
            url : '/fomula/list/project',
            type : "post",
            data: form_data,
            contentType : false,
            processData : false,
            error:function(){
               alert("공식이 올바르지 않습니다.");
            },
            success:function(data) {
                alert("수정되었습니다.")
                window.location.href = '/ws-03?'+encodeURIComponent("cHJ="+project_id)
            }
        })
    })
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