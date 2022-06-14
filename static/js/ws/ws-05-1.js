$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    notice_id = urlParams.get('Acd')
 


    $.ajax({
        url : "/notice/add?notice_id="+notice_id,
        type : "get",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data)

            let notice_list = data.data

          
           $('#notice_date').text(notice_list[0].create_date)
           $('#notice_title').text(notice_list[0].notice_title)
           $('#notice_constents').text(notice_list[0].notice_contents)

           
        
        }

    })

    $('#topbtn').attr("href","/ws-05?" +encodeURIComponent("cHJ="+project_id))


    $('#listbtn').click(function(){
        window.location.href = "/ws-05?"+encodeURIComponent("cHJ="+project_id)
    })
})