$(function(){
    
    $('#savebtn').click(function(){
        let notice_title = $('#notice_title').val()
        let notice_contents = $('#notice_contents').val()


        console.log(notice_title)
        console.log(notice_contents)

        $.ajax({
            url : "/notice/add",
            type : "post",
            data:{
                "notice_title": notice_title,
                "notice_contents": notice_contents,
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
                alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                console.log("success")
                alert(data.resultString)
                window.location.href ='/bo-07'
            }

        })
    })


})