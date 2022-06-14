$(function(){

    var url = new URL(window.location.href);
    const urlParams = url.searchParams;

    servicecenter_id = urlParams.get('servicecenter_id')
    project_id = urlParams.get('project_id')


    $.ajax({
        url : "/servicecenter/inquiry?servicecenter_id="+servicecenter_id,
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

            let servicecenter_list = data.data
            console.log(servicecenter_list)

          
           $('#servicecenter_date').text(servicecenter_list[0].create_date)
           $('#servicecenter_name').text(servicecenter_list[0].servicecenter_name)
           $('#servicecenter_inquiry').text(servicecenter_list[0].servicecenter_inquiry)
           if(servicecenter_list[0].servicecenter_answer_date){
            $('#servicecenter_answer_date').text(servicecenter_list[0].servicecenter_answer_date)
           }
           if(servicecenter_list[0].servicecenter_answer){
            $('#servicecenter_answer').text(servicecenter_list[0].servicecenter_answer)

           }
           
           if(servicecenter_list[0].servicecenter_file){
            let servicecenter_file = servicecenter_list[0].servicecenter_file
            let splitfile = servicecenter_file.split('/')
            let file_name = splitfile[splitfile.length-1]
 
            $('#file_link').text(file_name)
            $('#file_link').attr("href",servicecenter_file)
           }
           


        
        }

    })

    $('#topbtn').attr("href","/ws-04?project_id=" +project_id)


    $('#listbtn').click(function(){
        window.location.href = "/ws-04?project_id="+project_id
    })
})