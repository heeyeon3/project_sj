let project_status = "";

$(function(){
    // $('#img_cont')
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log("project_id",project_id )


    $.ajax({
        url:"project/current?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let edit_data = json.data[0]
            console.log(edit_data)

            $('#topcompany').text(edit_data.project_name)
            project_status = edit_data.project_status
    
            let end_date = "";
            if(edit_data.extention_ed_dt){
                end_date = edit_data.extention_ed_dt
            }else{end_date = edit_data.project_ed_dt}
           
            // let extention_ed_dt = edit_data.extention_ed_dt

            let enddate = new Date(parseInt(end_date.substr(0,4)), parseInt(end_date.substr(5,2))-1, parseInt(end_date.substr(8,2)))

            console.log(enddate)

            let today = new Date()

            // console.log((enddate - today) / (1000*60*60*24))

            if(enddate > today){
                console.log("je")
                $('#endalarm').hide()
            }

            if(edit_data.project_img && edit_data.project_img.length != 0){
                $('#companybg').attr("style","background: linear-gradient(to bottom, rgba(0,0,0,.90), rgba(0,0,0,.40)), url("+edit_data.project_img+") no-repeat center center/cover; filter: grayscale(0%);")

            }else{
                $('#companybg').attr("style","background: linear-gradient(to bottom, rgba(0,0,0,.90), rgba(0,0,0,.40)), url(/static/img/bg/project-bg.jpg) no-repeat center center/cover; filter: grayscale(0%);")
            }
            
        }
    })


   
})



// project login
// var projectlogin = function(){

//     var url = new URL(window.location.href);
//     const urlParams = url.searchParams;

//     let project_id = urlParams.get('project_id')

//     var remember = $("#remember").is(":checked");
//     var user_id = $("#user_id").val();
//     var user_pwd = $("#user_pwd").val();

    

//     if(user_id == ""){
//        console.log("아이디를 입력하세요");
//        $("#user_id").focus();
//        return;
//     }

//     if(user_pwd == ""){
//        console.log("패스워드를 입력하세요");
//        $("#user_pwd").focus();
//        return;
//     }

//    var form_data = new FormData($('#frmLogin')[0]);
//    form_data.append("project_id", project_id)
//    for (var pair of form_data.entries()) {
//        // 예외처리 진행
//        console.log(pair[0]+ ', ' + pair[1]);
//    };
//    $.ajax({
//          url : '/web/login',
//          data:form_data,
//          type: 'post',
//          contentType: false,
//          processData: false,
//          success:function(data) {

//             console.log(data)
//            if(data.resultCode == "0"){

//                location.href="ws-02?project_id="+data.projectId;

//                if(remember){
//                localStorage.setItem("user_id",user_id);
//                }else{
//                localStorage.removeItem("user_id");
//                }
//                document.cookie=("fold=Y");

//            }else{
//                console.log(data.resultString)
//                if(data.resultCode == "101")
//                {
//                  $("#modalInsert").modal('show');
//                  $("#user_ide").val(user_id);
//                }
//            }
//        }
//    });
// }