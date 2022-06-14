$(function(){
    console.log("!!!")
    var url = new URL(window.location.href);
    const urlParams = url.searchParams;

    sensor_id = urlParams.get('sensor_id')
    project_id = urlParams.get('project_id')
    alarm_id = urlParams.get('alarm_id')

    console.log(sensor_id, project_id, alarm_id )


    $.ajax({
        url : "/alarm/bo",
        type : "POST",
        async : false,
        data : {
            'sensor_id':sensor_id,
            'project_id':project_id,
            'alarm_id':alarm_id,
        },
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.data)
            currentdata =data.data

            $('#projectName').text(currentdata[0].project_name)
            $('#placeName').text(currentdata[0].place_name)
            $('#sensorgroupName').text(currentdata[0].sensorgroup_name)
            $('#sensordisplayName').text(currentdata[0].sensor_display_name)
            $('#alarm_time').text(currentdata[0].alarm_date)

            $('#checkbtn').click(function(){
                window.location.href = currentdata[0].sensor_url
            })
            
            

        }
    })
    
})