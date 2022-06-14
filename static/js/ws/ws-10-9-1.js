let project_id = "";


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)

    $('#projectsetup').attr('href',"ws-10?"+ encodeURIComponent("cHJ="+project_id) )

    //project user
    $.ajax({
        url : "/project/user?project_id="+project_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(){
           alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            
           console.log("succes")
           console.log(data.data)

           let user_list = data.data
            if(user_list){
                if(user_list > 0){
                    console.log("!2")
                }else{
                    $('#ManagementId').val(user_list[0].user_id)
                    $('#MonitoringId').val(user_list[1].user_id)
                
                    $('#ManagementId').attr('readonly', true)
                    $('#MonitoringId').attr('readonly', true)
        
                    $('#ManagementPwd').val(user_list[0].user_pwd)
                    $('#MonitoringPwd').val(user_list[0].user_pwd)
                }
            } 
           
       }
    });

   
    $('#projectsetup').attr('href',"ws-10?"+ encodeURIComponent("cHJ="+project_id) )

   
    $('#ManagementId').val()
    $('#ManagementPwd').val()
    $('#MonitoringId').val()
    $('#MonitoringPwd').val()

    $('#cancel_btn').on('click', function(){
    
        window.location.href = "ws-10?"+ encodeURIComponent("cHJ="+project_id) 
    })

    $('#ok_btn').on('click', function(){
        let ManagementId = $('#ManagementId').val()
        let ManagementPwd = $('#ManagementPwd').val()
        let MonitoringId = $('#MonitoringId').val()
        let MonitoringPwd = $('#MonitoringPwd').val()

        console.log(ManagementId, ManagementPwd, MonitoringId, MonitoringPwd, project_id )

        if(ManagementId == ""){
            alert("프로젝트 관리자 아이디를 입력해 주세요.");
            $("#ManagementId").focus();
            return;
        }else if(ManagementPwd == ''){
            alert("프로젝트 관리자 비밀번호를 입력해 주세요");
            $("#ManagementPwd").focus();
            return;
        }else if(MonitoringId == ''){
            alert("프로젝트 모니터 계정 아이디를 입력해 주세요");
            $("#MonitoringId").focus();
            return;
        }else if(MonitoringPwd == ''){
            alert("프로젝트 모니터 계정 비밀번호를 입력해 주세요");
            $("#MonitoringPwd").focus();
            return;
        }


        $.ajax({
        url : "/project/user",
        type : "post",
        data : {
            "ManagementId" : ManagementId, 
            "ManagementPwd" : ManagementPwd, 
            "MonitoringId" : MonitoringId, 
            "MonitoringPwd" : MonitoringPwd, 
            "project_id" : project_id
        },
        error:function(){
           alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            alert("등록되었습니다.")
           console.log("succes")
       
       }
    });

       
    })

})
