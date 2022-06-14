$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)


    $.ajax({
        url:"project/current?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let edit_data = json.data[0]
            console.log(edit_data)

            let floorplan = edit_data.project_fp_img
            let floorplanname = floorplan.split('/')

           $('#imgname').text(floorplanname[floorplanname.length-1])
            
        }
    })

 
    $('#savebtn').click(function(){
        let form_data = new FormData($('#floorplan')[0])

        form_data.append("project_id", project_id)

        for (var pair of form_data.entries()){
            console.log(pair[0] + ":" + pair[1])
        };

        $.ajax({
            url : "/project/floorplan",
            type : "POST",
            data : form_data,
            contentType : false,
            processData : false,
            error:function(err){
                console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
                alert(data.resultString)
            console.log("Guide line이 등록 되었습니다.")
            window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+project_id)
        
        }
        });
    })


    $('#canclebtn').click(function(){
        window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+project_id)
    })

    $('#topproject').attr("href", "/ws-10?" +encodeURIComponent("cHJ="+project_id))


})