$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;



    let alarm_id = urlParams.get('bTe')
    console.log(alarm_id)

    $.ajax({
        url : "/alarm/all",
        type : "post",
        data:{
            "alarm_id": alarm_id
        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data.data)

            let alarmlist = data.data

            $('#alarm_time').text(alarmlist[0].create_date)
            $('#company_name').text(alarmlist[0].company_name)
            $('#project_name').text(alarmlist[0].project_name)
            $('#place_name').text(alarmlist[0].place_name)
            $('#sensorgroup_name').text(alarmlist[0].sensorgroup_name)
            $('#sensor_display_name').text(alarmlist[0].sensor_display_name)
            if(alarmlist[0].alarm_detail == '1'){
                $('#alarm_detail').text("Guideline Lv.1 초과")
            }else if(alarmlist[0].alarm_detail == '2'){
                $('#alarm_detail').text("Guideline Lv.2 초과")
            }else if(alarmlist[0].alarm_detail == '3'){
                $('#alarm_detail').text("Guideline Lv.3 초과")
            }
            $('#sensor_url').text(alarmlist[0].sensor_url)
            $('#sensor_url').attr("href",alarmlist[0].sensor_url)

        
        }

    })
})