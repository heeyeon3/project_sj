
$(function(){
    $("#user_put").on('click', function(){
        let id = $('#id').val()
        let pwd = $('#pwd').val()

        console.log(id, pwd)

        if(pwd == ""){
            alert("비밀번호를 입력해 주세요.");
            $("#pwd").focus();
        }


        $.ajax({
            url : "/user/change",
            type : "put",
            data : {
                "user_id" : id, 
                "user_pwd" : pwd, 
            },
            error:function(){
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                alert("수정되었습니다.")
                window.location.reload();
                console.log("succes")
            }
        });
    })
});
