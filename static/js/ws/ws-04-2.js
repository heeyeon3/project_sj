let project_id = ""

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')

    console.log(project_id)


    $('#cancle_btn').click(function(){
        window.location.href='/ws-04?'+encodeURIComponent("cHJ="+project_id)
    })
    $('#toplocation').attr('href','/ws-04?'+encodeURIComponent("cHJ="+project_id) )

    $('#send_btn').click(function(){
        
        
        let servicecenter_name = $('#servicecenter_name').val()
        let servicecenter_inquiry = $('#servicecenter_inquiry').val()
        let servicecenter_file = $('#servicecenter_file').val()
        
        console.log(servicecenter_name)
        console.log(servicecenter_inquiry)

        if(servicecenter_name.length == 0){
            alert("제목을 입력해 주세요.")
            $('servicecenter_name').focus()
            return;
        }else if(servicecenter_inquiry.length == 0){
            alert("문의내용을 입력해 주세요.")
            $('servicecenter_inquiry').focus()
            return;
        }

        let form_data = new FormData($('#inquiry')[0])
        form_data.append("project_id", project_id)

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };

        console.log(servicecenter_file)
        if(servicecenter_file){
            let filesize = document.getElementById('servicecenter_file').files[0].size;
            let maxsize = 20 * 1024 * 1024
            console.log(filesize)
            if(filesize > maxsize){
                alert("20MB 이하의 파일만 가능합니다.")
                return;
            }
    
            var ext = $('#servicecenter_file').val().split('.').pop().toLowerCase();
            console.log(ext)
            if($.inArray(ext, ['png','jpg','jpeg','xls','xlsx','zip']) == -1) {
                alert("'png','jpg','jpeg','xls','xlsx','zip' 파일만 등록 가능 합니다.");
                return;
            }
    
        }
        


        $.ajax({
            url: "/servicecenter/inquiry",
            type:"post",
            data : form_data,
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(data) {
                console.log("succes")
                alert("문의가 접수 되었습니다.")
                window.location.href='/ws-04?'+encodeURIComponent("cHJ="+project_id)
             
             }
        })

    })

    // var fileInput = document.querySelector("#servicecenter_file");
    // var sendButton = document.querySelector("#sendButton");

    // sendButton.addEventListener("click",function(){

    //     var formData = new FormData();
    //     // form Data 객체 생성
    //     formData.append("attachedImage",fileInput.files[0]);
    //     // 파일 인풋에 들어간 파일들은 files 라는 리스트로 저장된다.
    //     // input에 multiple을 선언해 여러개의 파일을 선택한 경우가 아니라면
    //     // files[0] 으로 input에 추가한 파일 객체를 찾을 수 있다.
    //     console.log(fileInput.files[0])
        
    // });

    
})