
$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    servicecenter_id = urlParams.get('srD')

    $.ajax({
        url : "/servicecenter/inquiry/bo?servicecenter_id="+servicecenter_id,
        type : "get",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data)

            let servicecenter_list = data.data
            console.log(servicecenter_list)

          
           $('#servicecenter_date').text(servicecenter_list[0].create_date)
           $('#servicecenter_name').text(servicecenter_list[0].servicecenter_name)
           $('#servicecenter_inquiry').text(servicecenter_list[0].servicecenter_inquiry)
           $('#company_name').text(servicecenter_list[0].company_name)
           $('#project_name').text(servicecenter_list[0].project_name)
           $('#servicecenter_answer_date').text(servicecenter_list[0].servicecenter_answer_date)
           $('#servicecenter_answer').text(servicecenter_list[0].servicecenter_answer)

           
        
        }

    })
})