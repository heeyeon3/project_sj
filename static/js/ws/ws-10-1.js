$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    let project_id = urlParams.get('cHJ')


    console.log(project_id)


    $.ajax({
        url:"project?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
        },
        success:function(json) {
            console.log("succes")

            let edit_data = JSON.parse(json.data)
            console.log(edit_data)
           
            $('#project_lat').val(edit_data.project_lat)
            $('#project_lng').val(edit_data.project_lng)
            // $('#project_address').val(edit_data.project_address)
            console.log(edit_data.project_address)
            $('#projectAddress').val(edit_data.project_address)
            $('#weather_lat').val(edit_data.project_weather_nx)
            $('#weather_lng').val(edit_data.project_weather_ny)

            let project_img = edit_data.project_img

            let project_img_name =project_img.split('/')
            $('#imgname').text(project_img_name[project_img_name.length-1])
           
            
        }
    })

    

    $('#btn_save').click(function(){
        console.log("click!!")

        let project_lat = $('#project_lat').val()
        let project_lng = $('#project_lng').val()
        let projectAddress = $('#projectAddress').val()
        let weather_lat = $('#weather_lat').val()
        let weather_lng = $('#weather_lng').val()

        console.log(projectAddress)
        // console.log(weather_lat, weather_lng)
        console.log(weather_lat, weather_lng)

        if(project_lat.length ==0){
            alert("현장 위치(위도)를 입력해 주세요.")
            return;
        }else if(project_lng.length ==0){
            alert("현장 위치(경도)를 입력해 주세요.")
            return;
        }else if(projectAddress.length ==0){
            alert("현장 위치(주소)를 입력해 주세요.")
            return;
        }else if(!weather_lat || weather_lat.length ==0){
            alert("기상예보 X좌표 (위도)를 입력해 주세요.")
            return;
        }else if(!weather_lng || weather_lng.length ==0){
            alert("기상예보 Y좌표 (경도)를 입력해 주세요.")
            return;
        }

        var form_data = new FormData($('#projectlocation')[0]);

        form_data.append("project_id", project_id)

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };

        $.ajax({
            url : "/project/location",
            data : form_data,
            type : "post",
            contentType : false,
            processData : false,
            error:function(){
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
               alert(data.resultString);
               window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+ project_id);
               console.log("succes")
      
           }
        });

    })


    $('#canclebtn').click(function(){
        window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+ project_id)
    })

    $('#topproject').attr("href", "/ws-10?" +encodeURIComponent("cHJ="+ project_id))

})

$("input:text[doubleOnly]").on("focus", function() {
    var x = $(this).val();
    $(this).val(x);
}).on("focusout", function() {
    var x = $(this).val();
    if(x && x.length > 0) {
        if(!$.isNumeric(x)) {
            x = x.replace(/[^-0-9\.]/g,"");
            // x = x.replace(/[^-0-9\.]/g,"");
        } 
        if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
            if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                x = "-"+x.replace(/[-]/gi,'');
            }else{
                x = x.replace(/[-]/gi,'');
            }
        }
      //마침표 2개 허용 X
        if ( (x.match(/\./g) || []).length > 1 ){
                x =x.replace('.','');
        }
        $(this).val(x);
    }
}).on("keyup", function() {
    var x = $(this).val().replace(/[^-0-9\.]/g,"");
    if(x && x.length > 0) {
         if(x.lastIndexOf("-")>0){ //중간에 -가 있다면 replace
             if(x.indexOf("-")==0){ //음수라면 replace 후 - 붙여준다.
                 x = "-"+x.replace(/[-]/gi,'');
             }else{
                 x = x.replace(/[-]/gi,'');
             }
         }
    }		
     //마침표 2개 허용 X
     if ( (x.match(/\./g) || []).length > 1 ){
            x =x.replace('.','');
     }
    $(this).val(x);
});