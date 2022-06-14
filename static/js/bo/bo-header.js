$(function(){
    
    $.ajax({
        url : "/servicecenter/count",
        type : "get",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log("success")
            // console.log(data)
            if(data.resultCode =="10"){
                alert("접근 권한이 없습니다.")
                window.location.href ="/"
            }else{
                let servicecenter_list = data.data
                console.log(servicecenter_list)
                if(servicecenter_list[0].servicecenter_count >0){
                    $('#servicecenter').append("<span class='uk-badge' >"+servicecenter_list[0].servicecenter_count+"</span>")
                }
            }
            

            

           
        
        }

    })
})