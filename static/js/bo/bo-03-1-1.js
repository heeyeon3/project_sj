let company_id = "";
let modal_project_id = "";
let modal_extention_id = "";

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    company_id = urlParams.get('pZA')
    // let company_set_id = urlParams.get('company_set_id')
    // let company_name = urlParams.get('company_name')
    console.log(company_id)

    $('#date_time_start').change(function () {
        console.log("!")
        let datetime = $('#date_time_start').val()
        $('#date_time_end').datetimepicker({})
        $('#date_time_end').datetimepicker({theme:'dark', timepicker:false, format:'Y-m-d', minDate:new Date($('#date_time_start').val())});
    })

    $('#date_time_end').change(function () {
        console.log("date_time_end change")
        let startdatetime = $('#date_time_start').val()
        let enddatetime = $('#date_time_end').val()
        console.log(new Date(startdatetime),new Date(enddatetime) )
        if(new Date(startdatetime) > new Date(enddatetime)){
            console.log("ininin")
            $('#date_time_end').val('')
        }
    })

    $.ajax({
        url:"company?company_id="+company_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let company_info = json.data[0]
            // let company_info = JSON.parse(json.data)
            console.log(company_info) 


            $("#top_name").prepend("<h4>"+company_info.company_name+"<span class='title-id'><a href='/' target='_blank' >"+company_info.company_set_id+"</a></span></h4>")
            
            $('#customer_info_location').append("<a href='/bo-03-1?"+encodeURIComponent("pZA="+company_info.company_id)+"'>Customer Info</a>")
            $('#project_location').append("<a href='/bo-03-1-1?"+encodeURIComponent("pZA="+company_info.company_id)+"'>Project</a>")
            
            
            
        }
    })

  

    //페이지 이동
    $('#btn_project_add').click(function(){
        console.log("click!!")
        window.location.href = "/bo-03-1-2?type=add"+encodeURIComponent("&pZA="+company_id)
    })

    // $("#top_name").prepend("<h4>"+company_name+"<span class='title-id'><a href='/' target='_blank' >"+company_set_id+"</a></span></h4>")
    

    

    $.ajax({
        url : "/project/list?company_id="+company_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
        
            console.log(data.data)
            console.log(data.data.length)
            let project = data.data

            let list_project_id = "";

            let project_num = [];
            for(let i=0; i<project.length; i++){
                console.log(project[i])
                let project_status_type = ""

                let end_date = new Date(project[i].project_ed_dt)
                let today = new Date()
                if(project[i].project_status == 'C' || end_date < today){
                    project_status_type = "<span class='mg-l-10 uk-align-right uk-text-red'>완료</span>"
                }else if(project[i].project_status == 'N' && end_date > today){
                    project_status_type = "<span class='mg-l-10 uk-align-right uk-text-blue'>정상</span>"
                }else if(project[i].project_status == 'W' && end_date > today){
                    project_status_type = "<span class='mg-l-10 uk-align-right uk-text-yellow'>대기</span>"
                }

                if(project_num.indexOf(project[i].project_id) == -1){
                    project_num.push(project[i].project_id)
                    let project_list = "<div class='uk-child-width-1' uk-grid>"
                    project_list += "<div><div class='uk-card uk-card-secondary uk-card-large uk-card-body uk-light' id='"+project[i].project_id+"'>"
                    project_list += "<h4>" + project[i].project_name
                    project_list += "<span class='title-id'><a href='/ws-00?"+encodeURIComponent("cHJ="+project[i].project_id)+"' target='_blank'>"+project[i].project_set_id+"</a></span>"
                    project_list += project_status_type
                    project_list += "</h4><table class='uk-table uk-table-divider uk-table-justify'>"
                    project_list += " <thead class='br-t-3'><tr><th class='w-200'>등록일시</th>"
                    project_list += "<th>"+ project[i].create_date+"</th></tr>"
                    project_list += "</thead><tbody><tr><td>계약기간</td><td>"+project[i].project_st_dt +"~"+project[i].project_ed_dt+"</td></tr>"
                    project_list += " <tr><td>계약금액</td><td>"+ project[i].project_cost+"원</td></tr>"
                    project_list += "<tr><td>메모</td><td>"+ project[i].project_memo+"</td></tr><tr class='br-b-3'></tr></tbody></table>"
                    project_list += "<a href='/bo-03-1-2?type=edit"+encodeURIComponent("&cHJ="+project[i].project_id+"&pZA="+company_id)+"' class='uk-button uk-button-text' >프로젝트 정보 수정</a>"
                    // project_list += "<a href='#extension' class='uk-button uk-button-text uk-align-right' uk-toggle onclick=\"extention_modal('"+project[i].project_id+ "', '"+project[i].project_name+"')\">프로젝트 기간 연장</a>"
                    project_list += " </div> </div> </div>"
    
                    $('#project_list').append(project_list)
                }
                

                if(project[i].extention_id){
                   
                    let extention_list = "<h5>기간연장</h5>"
                    extention_list +=  "<table class='uk-table uk-table-divider uk-table-justify'><thead class='br-t-3'><tr>"
                    extention_list +=  "<th class='w-200'>등록일시</th><th>"+project[i].extention_create_date+"</th></tr></thead>"
                    extention_list +=  "<tbody><tr><td>계약기간</td><td>"+project[i].extention_st_dt+"~"+project[i].extention_ed_dt+"</td></tr>"
                    extention_list +=  "<tr><td>계약금액</td><td>"+project[i].extention_cost+"원</td></tr>"
                    extention_list +=  "<tr><td>메모</td><td>"+project[i].extention_memo+"</td></tr>"
                    extention_list +=  "<tr class='br-b-3'></tr></tbody></table>"
                    extention_list +=  "<a href='#extension' class='uk-button uk-button-text' uk-toggle onclick=\"extention_modal('"+project[i].project_id+ "', '"+project[i].project_name+ "', '"+project[i].extention_id+"', 'edit')\">기간연장 정보 수정</a>"
                    $('#'+project[i].project_id).append(extention_list)
                       
                }
                if(list_project_id != project[i].project_id && i > 0){
                    console.log(project[i])
                    let extention_list =  "<a href='#extension' class='uk-button uk-button-text uk-align-right' uk-toggle onclick=\"extention_modal('"+project[i-1].project_id+ "', '"+project[i-1].project_name+"',null,'add')\">프로젝트 기간 연장</a>"
                    $('#'+project[i-1].project_id).append(extention_list)
                }
                if(i+1 == project.length){
                    console.log(project[i])
                    let extention_list =  "<a href='#extension' class='uk-button uk-button-text uk-align-right' uk-toggle onclick=\"extention_modal('"+project[i].project_id+ "', '"+project[i].project_name+"',null,'add')\">프로젝트 기간 연장</a>"
                    $('#'+project[i].project_id).append(extention_list)
                }

                list_project_id = project[i].project_id
            }

            
            

            
       }

       
    });

    $('#date_time_start').change(function () {
        console.log("!")
        let datetime = $('#date_time_start').val()
        $('#date_time_end').datetimepicker({})
        $('#date_time_end').datetimepicker({theme:'dark', timepicker:false, format:'Y-m-d', minDate:new Date($('#date_time_start').val())});
    })

    $('#date_time_end').change(function () {
        console.log("date_time_end change")
        let startdatetime = $('#date_time_start').val()
        let enddatetime = $('#date_time_end').val()
        console.log(new Date(startdatetime),new Date(enddatetime) )
        if(new Date(startdatetime) > new Date(enddatetime)){
            console.log("ininin")
            $('#date_time_end').val('')
        }
    })



})

function next_page_url(){

    // window.location.href = "/bo-03-1-2?type=edit&company_id="+company_id
    window.location.href = "/bo-03-1-2?type=edit"+encodeURIComponent("&pZA="+company_id)
}

function project_extention(){
    console.log("click!!", modal_project_id, modal_extention_id)

    

    let date_time_start =  $('#date_time_start').val()
    let date_time_end = $('#date_time_end').val()
    let modal_project_cost = $('#modal_project_cost').val()

    if(date_time_start == ''){
        alert("계약 시작 날짜를 입력해 주세요");
        $("#date_time_start").focus();
        return;
    }else if(date_time_end == ''){
        alert("계약 종료 날짜를 입력해 주세요");
        $("#date_time_end").focus();
        return;
    }else if(modal_project_cost == ''){
        alert("계약 금액을 입력해 주세요.");
        $("#modal_project_cost").focus();
        return;
    }
    let form_data = new FormData($('#modal_extention')[0])

    form_data.append("project_id", modal_project_id)

    if(modal_extention_id){
        console.log('edit')
        $.ajax({
            url : "/extention?extention_id="+modal_extention_id,
            data : form_data,
            type : "put",
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                alert(data.resultString)
                window.location.reload()
               console.log("succes")
        
           }
        });
        
    }else{
        console.log('add')

        $.ajax({
            url : "/extention",
            data : form_data,
            type : "post",
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                alert(data.resultString)
                window.location.reload()
               console.log("succes")
           
           }
        });
    }

    

}

function extention_modal(project_id, project_name, extention_id, type){
    console.log("12", project_id, project_name, extention_id, type)

    modal_project_id = project_id
    modal_extention_id = extention_id
    console.log
    //프로젝트명 넣어줌
    $('#modal_project_name').text(project_name)


    $('#date_time_start').val("")
    $('#date_time_end').val("")
    $('#modal_project_memo').val("")
    $('#modal_project_cost').val("")

    if(type == 'add'){
        console.log("add")
    }else if(type == 'edit'){
        console.log('edit')
        $.ajax({
            url : "/extention?extention_id="+extention_id,
            type : "get",
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
               alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                // alert(data.resultString)
               let edit_data = JSON.parse(data.data)
               console.log("succes",edit_data)

                $('#date_time_start').val(edit_data.extention_st_dt)
                $('#date_time_end').val(edit_data.extention_ed_dt)
                $('#modal_project_cost').val(edit_data.extention_cost)
                $('#modal_project_memo').val(edit_data.extention_memo)
         
           }
        });


       

    }

    




}