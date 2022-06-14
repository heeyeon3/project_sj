$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    // let company_id = urlParams.get('company_id')
    let company_id = urlParams.get('pZA')
    let project_id = urlParams.get('cHJ')
    let type = urlParams.get('type')
    // console.log(company_id)


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

            $('#company_name').append("<a href='/bo-03-1-1?"+encodeURIComponent("pZA="+company_info.company_id)+"'><span uk-icon='icon: chevron-left' class='uk-margin-right'></span>"+company_info.company_name+"</a>")
            
        }
    })

    

    if(type == "add"){
        $('#btn_save').click(function(){
            console.log("click!")
    
            let project_name = $("#project_name").val()
            let project_set_id = $("#project_set_id").val()
            let date_time_start = $("#date_time_start").val()
            let date_time_end = $("#date_time_end").val()
            let project_cost = $("#project_cost").val()
            let project_memo = $("#project_memo").val()
            let project_status = $("#project_status").val()

            if(project_name == ""){
                alert("프로젝트명을 입력해주세요.");
                $("#project_name").focus();
                return;
            }else if(project_set_id == ''){
                alert("프로젝트 주석을 입력해 주세요");
                $("#project_set_id").focus();
                return;
            }else if(date_time_start == ''){
                alert("계약 시작 날짜를 입력해 주세요");
                $("#date_time_start").focus();
                return;
            }else if(date_time_end == ''){
                alert("계약 종료 날짜를 입력해 주세요");
                $("#date_time_end").focus();
                return;
            }else if(project_cost == ''){
                alert("계약금액을 입력해주세요");
                $("#project_cost").focus();
                return;
            }
    
            let form_data = new FormData($('#project_info')[0])
            console.log(company_id)

            form_data.append("company_id", company_id)
    
            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };
    
    
            $.ajax({
                url : "/project",
                data : form_data,
                type : "post",
                contentType : false,
                processData : false,
                error:function(err){
                    console.log(err)
                   alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    alert("프로젝트가 추가 되었습니다")
                    location.href ='/bo-03-1-1?'+encodeURIComponent("pZA="+company_id)
                    console.log("succes")
                    console.log(data)
               }
            });
    
    
        })
    }else if(type =='edit'){
        console.log('edit')

        $.ajax({
            url:"project?project_id="+project_id,
            type:"get",
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                console.log("succes")

                let edit_data = JSON.parse(json.data)
                console.log(edit_data)
                // let company_info = json.data[0]
                // let company_info = JSON.parse(json.data)
                $('#project_name').val(edit_data.project_name)
                $('#project_set_id').val(edit_data.project_set_id)
                $('#date_time_start').val(edit_data.project_st_dt)
                $('#date_time_end').val(edit_data.project_ed_dt)
                $('#project_cost').val(edit_data.project_cost)
                $('#project_memo').val(edit_data.project_memo)
                $('#project_status').val(edit_data.project_status)  
                
            }
        })


        $('#btn_save').click(function(){
            console.log("click!")
    
            let project_name = $("#project_name").val()
            let project_set_id = $("#project_set_id").val()
            let date_time_start = $("#date_time_start").val()
            let date_time_end = $("#date_time_end").val()
            let project_cost = $("#project_cost").val()
            let project_memo = $("#project_memo").val()
            let project_status = $("#project_status").val()

            if(project_name == ""){
                alert("프로젝트명을 입력해주세요.");
                $("#project_name").focus();
                return;
            }else if(project_set_id == ''){
                alert("프로젝트 주석을 입력해 주세요");
                $("#project_set_id").focus();
                return;
            }else if(date_time_start == ''){
                alert("계약 시작 날짜를 입력해 주세요");
                $("#date_time_start").focus();
                return;
            }else if(date_time_end == ''){
                alert("계약 종료 날짜를 입력해 주세요");
                $("#date_time_end").focus();
                return;
            }else if(project_cost == ''){
                alert("계약금액을 입력해주세요");
                $("#project_cost").focus();
                return;
            }
    
            let form_data = new FormData($('#project_info')[0])
            // console.log(company_id)

            // form_data.append("company_id", company_id)
    
            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };
    
    
            $.ajax({
                url : "/project?project_id="+project_id,
                data : form_data,
                type : "put",
                contentType : false,
                processData : false,
                error:function(err){
                    console.log(err)
                   alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    alert("프로젝트가 수정 되었습니다")

                   location.href='bo-03-1-1?'+encodeURIComponent("pZA="+company_id)
                  
                   console.log("succes")
                   console.log(data)
               }
            });
    
    
        })


        // $.ajax({
        //     url : "/project?project_id="+project_id,
        //     data : form_data,
        //     type : "put",
        //     contentType : false,
        //     processData : false,
        //     error:function(err){
        //         console.log(err)
        //        alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        //     },
        //     success:function(data) {
        //         href.location='/bo-03-1-1&company_id='+company_id
        //        console.log("succes")
        //    }
        // });
    }



    $('#date_time_start').change(function () {
        console.log("!")
        let datetime = $('#date_time_start').val()
        $('#date_time_end').datetimepicker({})
        $('#date_time_end').datetimepicker({theme:'dark', timepicker:false, format:'Y-m-d', minDate:new Date($('#date_time_start').val())});
    })



    $('#canclebtn').click(function(){
        window.location.href = "/bo-03-1-1?"+encodeURIComponent("pZA="+company_id)
    })


    
})