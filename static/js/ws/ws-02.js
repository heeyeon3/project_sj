var iseditmode = false;
let project_id = "";
let dataLogger_id = "";
let floorlist = [];
let idx = 0
$(function(){
    $('#img_cont')
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log("project_id", project_id)

    console.log($('#img_cont').css('width'));
    console.log($('#img_cont').css('height'));
    $('#google_map_area').css('width','1000px')
    $('#google_map_area').css('height','600px')




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
            $('#img_cont').attr('src', edit_data.project_fp_img)

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

    // 매핑 뱃지 가져오기
    console.log("project_id", project_id)

    $.ajax({
        url:"/floorplan/mapdata?project_id="+project_id,
        type:"get",
        // data: JSON.stringify(floorlist),
        // contentType: "application/json",
        async : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("success")
            console.log(json.data)
            let floorplan_data = json.data

            for(let i=0; i<floorplan_data.length; i++){
                var floor_cont ;
                if(floorplan_data[i].sensor_id == 'All'){
                    if(sensorgroupcount.length > 0){
                        for(let j=0; j<sensorgroupcount.length; j++){
                            if (floorplan_data[i].sensorgroup_id == sensorgroupcount[j].sensorgroup_id){
                                if (sensorgroupcount[j].alarm_detail == "1"){
                                    floor_cont = "<div class='btn bg-y' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensorgroup_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }else if(sensorgroupcount[j].alarm_detail == "2"){
                                    floor_cont = "<div class='btn bg-o' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensorgroup_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }else if(sensorgroupcount[j].alarm_detail == "3"){
                                    floor_cont = "<div class='btn bg-r' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensorgroup_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }
                            }else{
                                floor_cont = "<div class='btn bg-b' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensorgroup_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                            }
                        }
                    } else {
                        floor_cont = "<div class='btn bg-b' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensorgroup_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                    }
                    
                } else{
                    if(sensorgroupcount.length > 0){

                        for(let j=0; j<sensorgroupcount.length; j++){
                            if (floorplan_data[i].sensorgroup_id == sensorgroupcount[j].sensorgroup_id){
                                if (sensorgroupcount[j].alarm_detail == "1"){
                                    floor_cont = "<div class='btn bg-y' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensor_display_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }else if(sensorgroupcount[j].alarm_detail == "2"){
                                    floor_cont = "<div class='btn bg-o' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensor_display_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }else if(sensorgroupcount[j].alarm_detail == "3"){
                                    floor_cont = "<div class='btn bg-r' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensor_display_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                                }
                            }else{
                                floor_cont = "<div class='btn bg-b' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensor_display_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                        
                            }
                        }
                    } else{
                        floor_cont = "<div class='btn bg-b' style='left: "+floorplan_data[i].floorplan_x+"px; top: "+floorplan_data[i].floorplan_y+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"' onclick=\"location.href='"+floorplan_data[i].sensor_url+"'\">"+floorplan_data[i].sensor_display_name+"<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+floorplan_data[i].floorplan_x+","+floorplan_data[i].floorplan_y+")\" id='atag"+idx+"'></a>";
                    }
                }
                // floor_cont += "<button class='uk-icon uk-close' name='delete_btn' type='button' ><svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><line fill='none' stroke='#000' stroke-width='1.1' x1='1' y1='1' x2='13' y2='13'></line><line fill='none' stroke='#000' stroke-width='1.1' x1='13' y1='1' x2='1' y2='13'></line></svg></button></div>";
                floor_cont += "<button class='uk-icon uk-close' name='delete_btn' type='button' id='btn"+idx+"'><svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><line fill='none' stroke='#000' stroke-width='1.1' x1='1' y1='1' x2='13' y2='13'></line><line fill='none' stroke='#000' stroke-width='1.1' x1='13' y1='1' x2='1' y2='13'></line></svg></button></div>"
               
                $("#floorplan").append(floor_cont);
                $('#atag'+idx).hide()
                $('#btn'+idx).hide()
                
                
                floorlist.push({"sensor_id":floorplan_data[i].sensor_id, "sensorgroup_id" : floorplan_data[i].sensorgroup_id, "project_id":project_id, "floorplan_x":floorplan_data[i].floorplan_x, "floorplan_y":floorplan_data[i].floorplan_y, "id": 'location'+idx, "use_yn": 'Y', 'floorplan_id': String(floorplan_data[i].floorplan_id)})
                idx+=1
            }

            
        }
    })


    // 클릭시 센서매핑
    
    const div = document.getElementById('img_cont');
    div.addEventListener('click', (e) => {
       
        if(iseditmode){
            var floor_cont = "<div class='btn bg-p' style='left: "+e.offsetX+"px; top: "+(e.offsetY+44)+"px; font-size : 0.875rem !important; font-weight : 400 !important;' id='location"+idx+"'>들어갑니다.<a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+e.offsetX+","+(e.offsetY+44)+")\"></a>";
            floor_cont += "<button class='uk-icon uk-close' name='delete_btn' type='button' ><svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><line fill='none' stroke='#000' stroke-width='1.1' x1='1' y1='1' x2='13' y2='13'></line><line fill='none' stroke='#000' stroke-width='1.1' x1='13' y1='1' x2='1' y2='13'></line></svg></button></div>";
    
            $("#floorplan").append(floor_cont);
    
            $("button[name='delete_btn']").on('click',function(){
                var btn_component = $(this).closest("div");
                console.log(btn_component[0].id)
                btn_component.remove();

                for(let i=0; i<floorlist.length;i++){
                    if(floorlist[i]['id'] == btn_component[0].id){
                        floorlist[i]['use_yn'] = 'N'
                        // floorlist.pop(floorlist[i])
                    }
                }
            });
            idx += 1
        }
        
    });


    // 현장도면 <-> 구글맵 라디오 박스
    $("input[name='main_img']").on('change',function(){
        let radiocheck =$('input[name="main_img"]:checked').val();
        if(radiocheck == "floorplan"){
            $("#floorplan").show();
            $('#google_map_area').hide();
            $("#floorplan_edit_btn").show();

        } else {
            $("#floorplan").hide();
            $('#google_map_area').show();
            $("#floorplan_edit_btn").hide();
        }
    });


    // EDIT <-> SAVE 버튼
    $("#floorplan_edit_btn").on('click',function(){
        if(iseditmode){
            if($("#floorplan .btn.bg-p").length > 0){
                alert('설정이 완료되지 않은 뱃지가 있습니다!');
                return
            } 
            $.ajax({
                url:"/floorplan/mapdata",
                type:"post",
                data: JSON.stringify(floorlist),
                contentType: "application/json",
                // async : false,
                error:function(err){
                    console.log(err);
                 },
                 success:function(json) {
                    console.log("success")
                    $("#floorplan_edit_btn").text('EDIT');
                    
                    console.log(json.data)
                    alert("매핑이 완료 되었습니다.")
                    // mapinfodata = json.data
                    window.location.href = 'ws-02?'+encodeURIComponent("cHJ="+ project_id) 
                }
            })

            iseditmode = false;
        } else {
            iseditmode = true;
            $("#floorplan_edit_btn").text('SAVE');

            for(let i=0; i<idx; i++){
                // let floor_cont = <a href='#label_modal' class='uk-icon-link uk-margin-small-left' uk-icon='pencil' uk-toggle onclick=\"locadata('location"+idx+"',"+e.offsetX+","+(e.offsetY+44)+")\"></a>";
                // let floor_cont = "<button class='uk-icon uk-close' name='delete_btn' type='button' id='btn"+idx+"'><svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><line fill='none' stroke='#000' stroke-width='1.1' x1='1' y1='1' x2='13' y2='13'></line><line fill='none' stroke='#000' stroke-width='1.1' x1='13' y1='1' x2='1' y2='13'></line></svg></button>"
                // $('#location'+idx).append(floor_cont)

                $('#atag'+i).show()
                $('#btn'+i).show()
                $('#location'+i).attr('onclick', '');
            }

            $("button[name='delete_btn']").on('click',function(){
                var btn_component = $(this).closest("div");
                btn_component.remove();
                let floorlist_ck = false
                for(let i=0; i<floorlist.length;i++){
                    if(floorlist[i]['id'] == btn_component[0].id){
                        floorlist[i]['use_yn'] = 'N'
                        // floorlist_ck = true
                        // floorlist.pop(floorlist[i])
                    }
                }

                // if(!floorlist_ck){
                //     floorlist.push({"sensor_id":select_sensor, "project_id":project_id, "floorplan_x":x, "floorplan_y":y, "id": id, "use_yn": 'N', 'floorplan_id': ''})
                // }
            });
        }
    });

    

    // 센서매핑 MODAL SELECT BOX - sensor
    $("#select_sensor").on('change',function(){
        var optionVal = $("#select_sensor option:selected").val();
        
    });


    // 해당 프로젝트 설치지점
    $.ajax({
        url:"place/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let placelist = json.data
            // let company_info = JSON.parse(json.data)
            console.log(placelist) 
            for(let i = 0; i <placelist.length; i++){
           
                $('#place').append("<option value='"+placelist[i].place_id+"'>"+placelist[i].place_name+"</option>")
            }
        
         }
    })

    //설치장소 변경할떄 마다 매핑된 그룹 표츌
    $('#place').change(function(){
      
        console.log("project_id", project_id)
        let current_place = $("#place option:selected").val();
        let sensorgrouplist ; 
        $.ajax({
            url:"sensorgroup/list?project_id="+project_id,
            type:"get",
            async : false,
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                console.log("succes")
                console.log(json.data)
    
                sensorgrouplist = json.data
                console.log(sensorgrouplist)
             }
        })

        $('#sensorgroup').empty()
        $('#sensorgroup').append("<option selected=''>센서그룹 불러오기</option>")
        $('#select_sensor').empty()
        $('#select_sensor').append("<option selected=''>센서 불러오기</option>")

        
        for(let i = 0; i < sensorgrouplist.length ; i++){
            if(sensorgrouplist[i].place_id == current_place){
                $('#sensorgroup').append("<option value='"+sensorgrouplist[i].sensorgroup_id+"' displayname='"+sensorgrouplist[i].sensorgroup_name+"' grtype='"+sensorgrouplist[i].sensorgroup_type+"'>"+sensorgrouplist[i].sensorgroup_name+"</option>")
                // $('#sensorgroup').append("<option value='"+sensorgrouplist[i].sensorgroup_id+"' displayname='"+sensorgrouplist[i].sensorgroup_name+"'>"+sensorgrouplist[i].sensorgroup_name+"</option>")
            }
        }

    })

    // 센서매핑 MODAL SELECT BOX - sensor
    $("#sensorgroup").on('change',function(){
        var grtypeVal = $("#sensorgroup option:selected").attr('grtype');
        var optionVal = $("#sensorgroup option:selected").val();

        $('#select_sensor').empty()
        $('#select_sensor').append("<option selected=''>센서 불러오기</option>")


        $.ajax({
            url:"/sensorgroup/sensor/list?sensorgroup_id="+optionVal,
            type:"GET",
            contentType: false,
            processData : false,
            async : false,
            error:function(err){
                console.log(err);
            },
            success:function(json) {
                console.log("success");

                let sensorlist = json.data
                for(let i=0; i<sensorlist.length; i++){
                    if(i == 0){
                        if(grtypeVal != "0206"){
                            $('#select_sensor').append("<option value='"+sensorlist[i].sensorgroup_id+"' displayname='All'>All</option>")
                        }
                        // $('#select_sensor').append("<option value='"+sensorlist[i].sensorgroup_id+"' displayname='All'>All</option>")
                        $('#select_sensor').append("<option value='"+sensorlist[i].sensor_id+"' displayname='"+sensorlist[i].sensor_display_name+"'>"+sensorlist[i].sensor_display_name+"</option>")
                    }else{
                        $('#select_sensor').append("<option value='"+sensorlist[i].sensor_id+"' displayname='"+sensorlist[i].sensor_display_name+"'>"+sensorlist[i].sensor_display_name+"</option>")
                    }
                }
            }
        })
    });

    

})

function locadata(id,x,y) {
    console.log(id,x,y)
    console.log("CHECK FIRST!",floorlist)
    $("#place").val('all').prop("selected",true);
    $('#sensorgroup').empty()
    $('#sensorgroup').append("<option selected=''>센서그룹 불러오기</option>")
    $('#select_sensor').empty()
    $('#select_sensor').append("<option selected=''>센서 불러오기</option>")


    $('#savebtn').one('click',function(){


        
        let datalogger_id = $("#place option:selected").val();
        let select_sensorgroup = $("#sensorgroup option:selected").val();
        let select_sensorgroupname = $("#sensorgroup option:selected").attr('displayname');
        let select_sensor = $("#select_sensor option:selected").val();
        let sensor_display_name = $("#select_sensor option:selected").attr('displayname');

        var $cloneEle = $('#'+id).children();
        

        for(let i=0; i<floorlist.length;i++){
            if(floorlist[i]['id'] == id){
                floorlist[i]['use_yn'] = 'N'
            }
        }
        console.log("CHECK OUT!! ", floorlist);   

        // document.getElementById(id).innerHTML = sensor_display_name;
        // console.log($('#'+id).text())
        // $('#'+id).text(sensor_display_name)
        // var floor_cont = sensor_display_name 
        // var floor_cont = "<button class='uk-icon uk-close' name='delete_btn' type='button' ><svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><line fill='none' stroke='#000' stroke-width='1.1' x1='1' y1='1' x2='13' y2='13'></line><line fill='none' stroke='#000' stroke-width='1.1' x1='13' y1='1' x2='1' y2='13'></line></svg></button>";

        if(sensor_display_name == "All"){
            $('#'+id).text(select_sensorgroupname)
            floorlist.push({"sensor_id":"All", "sensorgroup_id" : select_sensorgroup, "project_id":project_id, "floorplan_x":x, "floorplan_y":y, "id": id, "use_yn": 'Y', 'floorplan_id': ''})
        } else {
            $('#'+id).text(sensor_display_name)
            floorlist.push({"sensor_id":select_sensor, "sensorgroup_id" : select_sensorgroup, "project_id":project_id, "floorplan_x":x, "floorplan_y":y, "id": id, "use_yn": 'Y', 'floorplan_id': ''})
        }
        $('#'+id).append($cloneEle)

        $('#'+id).removeClass('bg-p')
        $('#'+id).addClass('bg-b')
        $("button[name='delete_btn']").on('click',function(){
            var btn_component = $(this).closest("div");
            btn_component.remove();

            for(let i=0; i<floorlist.length;i++){
                if(floorlist[i]['id'] == btn_component[0].id){
                    floorlist[i]['use_yn'] = 'N'
                    // floorlist.pop(floorlist[i])
                }
            }
        });


        console.log("CHECK COMPLETE!! ", floorlist);
    })
}






function GoogleMap() {
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    var mapinfodata;
    var center = [37.579286,126.977039];
    // 맵 데이터 가져오기
    $.ajax({
        url:"/place/list?project_id="+project_id,
        // url:"/floorplan/mapdata?project_id="+project_id,
        type:"get",
        async : false,
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("success11")

            console.log(json.data);
            mapinfodata = json.data;
        }
    })
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
