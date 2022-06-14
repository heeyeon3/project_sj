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
           
           

           if(servicecenter_list[0].servicecenter_file){
            let filename = servicecenter_list[0].servicecenter_file.split('/') 
            $('#servicecenter_file').text(filename[filename.length-1])
            $('#servicecenter_file').attr("href",servicecenter_list[0].servicecenter_file)
           }
           

           
        
        }

    })

    $('#savebtn').click(function(){
        console.log("savebtn click!!")

        let servicecenter_answer = $('#servicecenter_answer').val()
        if(servicecenter_answer.length == 0){
            alert("답변을 입력해 주세요.")
            return;
        }

        let form_data = new FormData($('#servicecenteranswer')[0])
            console.log(servicecenter_id)

            form_data.append("servicecenter_id", servicecenter_id)
    
            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };

            $.ajax({
                url : "/servicecenter/inquiry/bo?servicecenter_id="+servicecenter_id,
                type : "post",
                data : form_data,
                contentType : false,
                processData : false,
                error:function(err){
                    console.log(err)
                    alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    console.log("success")
                 
                    alert('답변이 저장되었습니다.')
                    window.location.href='/bo-06'

        
                   
                
                }
        
            })
    

    })
})