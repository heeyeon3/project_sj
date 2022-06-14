$(function(){
    // $('#img_cont')
    var url = new URL(window.location.href);
    const urlParams = url.searchParams;

    project_id = urlParams.get('project_id')
    console.log(project_id)

    console.log($('#img_cont').css('width'));
    console.log($('#img_cont').css('height'));
    $('#google_map_area').css('width',$('#img_cont').css('width'))
    $('#google_map_area').css('height',$('#img_cont').css('height'))




    // 종료일자 확인 후, 알림 표시!
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
            // let company_info = json.data[0]
            // let company_info = JSON.parse(json.data)
           
            let lastday = "";
            if(edit_data.extention_ed_dt){lastday = edit_data.extention_ed_dt}
            else{lastday = edit_data.project_ed_dt}


            let enddate = new Date(parseInt(lastday.substr(0,4)), parseInt(lastday.substr(5,2))-1, parseInt(lastday.substr(8,2)))

            console.log(enddate)

            let today = new Date()

            console.log((enddate - today) / (1000*60*60*24))

            if(((enddate - today) / (1000*60*60*24)) >30 ){
                $('#notification').hide()
            }
        }
    })


    // 클릭시 좌표입력입니다.
    const div = document.getElementById('img_cont');

    div.addEventListener('click', (e) => {
        console.log(e.offsetX+ " , " + e.offsetY)
        var floor_cont = "<div class='btn bg-p' style='left: "+e.offsetX+"px; top: "+e.offsetY+"px;'>들어갑니다.<a href='#data-modify' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle></a></div>";
        $("#floorplan").append(floor_cont);
    });


    
    $("input[name='main_img']").on('change',function(){
        let radiocheck =$('input[name="main_img"]:checked').val();
        console.log(radiocheck)

        if(radiocheck == "floorplan"){
            $("#floorplan").show();
            $('#google_map_area').hide();
            $("#floorplan_edit_btn").show();

        } else {
            $("#floorplan").hide();
            $('#google_map_area').show();
            $("#floorplan_edit_btn").hide();
        }
    })


})






function GoogleMap() {
    var mapinfodata;
    var center = [37.579286,126.977039];
    // 맵 데이터 가져오기
    $.ajax({
        url:"/floorplan/mapdata?project_id="+project_id,
        type:"get",
        async : false,
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("success")

            console.log(json.data)
            mapinfodata = json.data
        }
    })

    console.log(mapinfodata);
    if(mapinfodata.length > 0){
        center[0] = mapinfodata[0].project_lat
        center[1] = mapinfodata[0].project_lng
    }

    var google_map = new google.maps.Map(document.getElementById("google_map_area"), {
        zoom: 18,                                                               // 높을수록 확대
        center: { lat: parseFloat(center[0]), lng: parseFloat(center[1]) },
    });
    
    const image = {
        url: "/static/img/marker_bg.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
        
    }

    for (let i = 0; i < mapinfodata.length; ++i) {

        new google.maps.Marker({
            position: {
            lat: parseFloat(mapinfodata[i].place_lat),
            lng: parseFloat(mapinfodata[i].place_lng),
            },
            label: {
                text: mapinfodata[i].place_name,
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "14px",
                className: "map-label"
            },
            icon : image,
            map: google_map,
        });
    }
}

function floorplan_edit(){

}