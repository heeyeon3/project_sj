$(function(){
    $('#save_btn').on('click', function(){
        // window.location.href = "ws-10-9-1?project_id="+ project_id 

        let form_data = new FormData($('#passwardcheck')[0])

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };



        $.ajax({
            url : '/passward/check',
            data:form_data,
            type: 'post',
            contentType: false,
            processData: false,
            success:function(data) {
                console.log(data)
                if(data.resultString == 'SUCCESS'){
                    window.location.href = "/bo-08-1" 
                }else{
                    alert(data.resultString)
                }
   
          }
        });
    })
})