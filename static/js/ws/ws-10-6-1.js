let project_id = "";
let sensorgrouplist = [];
let sensordetail_id = "";
let sensor_id = "";
let datarogger_id = "";
let sensordata = [];


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    sensor_id = urlParams.get('c2V')
    // datarogger_id = urlParams.get('datarogger_id')
    sensordetail_id = urlParams.get('aWd')
    console.log(project_id)
    console.log(sensor_id)

    console.log(sensordetail_id)

    $('#topmove').attr('href', "/ws-10-6?"+encodeURIComponent("cHJ="+project_id))

    

    ///ws-02-2-1?sensor_id=2&datarogger_id=8&sensor_name=1P02&project_id=1&sensorgroup_type=0202
    $.ajax({
        url:"sensordetail/select?datarogger_id="+datarogger_id+"&sensor_id="+sensor_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
             console.log(json.data)

             sensordata = json.data
             console.log(sensordata[0].create_date)

            $('#sensortopname').text(sensordata[0].sensor_display_name)
            $('#sensor_create_date').text(sensordata[0].create_date)
            $('#datarogger_name').text(sensordata[0].datarogger_name)
            $('#sensor_sn').text(sensordata[0].sensor_sn)

            if(sensordata[0].sensor_type =='single'){
                $('#sensor_type').addClass('sc-s');
                $('#sensor_type').text(sensordata[0].sensor_type)
            } else if(sensordata[0].sensor_type =='x'){
                $('#sensor_type').addClass('sc-x');
                $('#sensor_type').text(sensordata[0].sensor_type+"-Axis")
            } else if(sensordata[0].sensor_type =='y'){
                $('#sensor_type').addClass('sc-y');
                $('#sensor_type').text(sensordata[0].sensor_type+"-Axis")
            }
            $('#sensor_index').text(sensordata[0].sensor_index)
            if(!sensordata[0].sensor_interval){$('#sensor_sn').text('')}
            else{$('#sensor_interval').text(sensordata[0].sensor_interval)}


            if(sensordata[0].sensor_gl1_max){$('#sensor_gl1_max').val(sensordata[0].sensor_gl1_max)}
            if(sensordata[0].sensor_gl1_min){$('#sensor_gl1_min').val(sensordata[0].sensor_gl1_min)}
            if(sensordata[0].sensor_gl2_max){$('#sensor_gl2_max').val(sensordata[0].sensor_gl2_max)}
            if(sensordata[0].sensor_gl2_min){$('#sensor_gl2_min').val(sensordata[0].sensor_gl2_min)}
            if(sensordata[0].sensor_gl3_max){$('#sensor_gl3_max').val(sensordata[0].sensor_gl3_max)}
            if(sensordata[0].sensor_gl3_min){$('#sensor_gl3_min').val(sensordata[0].sensor_gl3_min)}

            $('#sensor_max').val(sensordata[0].sensor_max)
            $('#sensor_min').val(sensordata[0].sensor_min)
            $('#sensor_weight').val(sensordata[0].sensor_weight)
            $('#sensor_deviation').val(sensordata[0].sensor_deviation)

            if(sensordata[0].sensor_st_over_ex == 'Y'){
                $('#sensor_st_over_ex').val(sensordata[0].sensor_st_over_ex).prop("checked", true)
            }
            if(sensordata[0].sensor_st_over_wt == 'Y'){
                $('#sensor_st_over_wt').val(sensordata[0].sensor_st_over_wt).prop("checked", true)
            }
            if(sensordata[0].sensor_dev_over_ex == 'Y'){
                $('#sensor_dev_over_ex').val(sensordata[0].sensor_dev_over_ex).prop("checked", true)
            }
            if(sensordata[0].sensor_dev_over_wt == 'Y'){
                $('#sensor_dev_over_wt').val(sensordata[0].sensor_dev_over_wt).prop("checked", true)
            }
            if(sensordata[0].sensor_null_ex == 'Y'){
                $('#sensor_null_ex').val(sensordata[0].sensor_null_ex).prop("checked", true)
            }
            if(sensordata[0].sensor_default_wt == 'Y'){
                $('#sensor_default_wt').val(sensordata[0].sensor_default_wt).prop("checked", true)
            }
         

            console.log("sensor_url", sensordata[0].sensor_url)
            if(sensordata[0].sensor_url){
                $('#sensor_url').text(sensordata[0].sensor_url)
                $('#sensor_url').attr("href",sensordata[0].sensor_url)
            }
           
            if(sensordata[0].sensor_noti == "" || !sensordata[0].sensor_noti){
                $('#sensor_noti').val("N").prop("selected", true)
            }else{
                $('#sensor_noti').val(sensordata[0].sensor_noti).prop("selected", true)
            }
            // $('#sensor_noti').val("None").prop("selected", true)
            // $('#sensor_noti').val(sensordata[0].sensor_noti).prop("selected", true)


            if(sensordata[0].sensor_fx1 == ""){
                $('#sensor_fx1').val("None").prop("selected", true)
            }else{
                $('#sensor_fx1').val(sensordata[0].sensor_fx1).prop("selected", true)
            }

            $.ajax({
                url : '/fomula/list/project?project_id='+project_id,
                type : "get",
                contentType : false,
                processData : false,
                error:function(){
                   alert("공식이 올바르지 않습니다.");
                },
                success:function(data) {
        
                    console.log(data.data)
        
                    fomulalist = data.data
        
                    for(let i=0; i<fomulalist.length; i++){
                        $('#fomula01, #fomula02, #fomula03, #fomula04, #fomula05').append("<option value='"+fomulalist[i].function_id+"' function_fomula='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
                    }

                    if(sensordata[0].sensor_fx1_id == ""){
                        $('#fomula01').prop("selected", true)
                    }else{
                        console.log("1212", sensordata[0].sensor_fx1_id)
                        $('#fomula01').val(sensordata[0].sensor_fx1_id).prop("selected", true)
                    }

                    if(sensordata[0].sensor_fx2_id == ""){
                        $('#fomula02').prop("selected", true)
                    }else{
                        console.log("1212", sensordata[0].sensor_fx2_id)
                        $('#fomula02').val(sensordata[0].sensor_fx2_id).prop("selected", true)
                    }

                    if(sensordata[0].sensor_fx3_id == ""){
                        $('#fomula03').prop("selected", true)
                    }else{
                        console.log("1212", sensordata[0].sensor_fx3_id_id)
                        $('#fomula03').val(sensordata[0].sensor_fx3_id).prop("selected", true)
                    }

                    if(sensordata[0].sensor_fx4_id == ""){
                        $('#fomula04').prop("selected", true)
                    }else{
                        console.log("1212", sensordata[0].sensor_fx4_id)
                        $('#fomula04').val(sensordata[0].sensor_fx4_id).prop("selected", true)
                    }

                    if(sensordata[0].sensor_fx5_id == ""){
                        $('#fomula05').prop("selected", true)
                    }else{
                        console.log("1212", sensordata[0].sensor_fx5_id)
                        $('#fomula05').val(sensordata[0].sensor_fx5_id).prop("selected", true)
                    }
        
                    
               }
            });



            // $.ajax({
            //     url:"/function_formula",
            //     type:"get",
            //     contentType: false,
            //     processData : false,
            //     error:function(err){
            //         console.log(err);
            //      },
            //     success:function(json) {
            //         console.log(json.data)
            //         let fomulalist = json.data
        
            //         for(let i=0; i<fomulalist.length; i++){
            //             $('#fomula01, #fomula02, #fomula03, #fomula04, #fomula05').append("<option value='"+fomulalist[i].function_formula+"'>"+fomulalist[i].function_name+"</option>")
            //         }

            //         if(sensordata[0].sensor_fx1 == ""){
            //             $('#fomula01').prop("selected", true)
            //         }else{
            //             console.log("1212", sensordata[0].sensor_fx1)
            //             $('#fomula01').val(sensordata[0].sensor_fx1).prop("selected", true)
            //         }

            //         if(sensordata[0].sensor_fx2 == ""){
            //             $('#fomula02').prop("selected", true)
            //         }else{
            //             console.log("1212", sensordata[0].sensor_fx2)
            //             $('#fomula02').val(sensordata[0].sensor_fx2).prop("selected", true)
            //         }

            //         if(sensordata[0].sensor_fx3 == ""){
            //             $('#fomula03').prop("selected", true)
            //         }else{
            //             console.log("1212", sensordata[0].sensor_fx3)
            //             $('#fomula03').val(sensordata[0].sensor_fx3).prop("selected", true)
            //         }

            //         if(sensordata[0].sensor_fx4 == ""){
            //             $('#fomula04').prop("selected", true)
            //         }else{
            //             console.log("1212", sensordata[0].sensor_fx4)
            //             $('#fomula04').val(sensordata[0].sensor_fx4).prop("selected", true)
            //         }

            //         if(sensordata[0].sensor_fx5 == ""){
            //             $('#fomula05').prop("selected", true)
            //         }else{
            //             console.log("1212", sensordata[0].sensor_fx5)
            //             $('#fomula05').val(sensordata[0].sensor_fx5).prop("selected", true)
            //         }
        
            //     }
        
            // })



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
                    console.log("sensordata", sensordata)
        
                    placelist = json.data
                    // let company_info = JSON.parse(json.data)
                    console.log(placelist) 
                    for(let i = 0; i <placelist.length; i++){
                   
                        $('#place').append("<option value='"+placelist[i].place_id+"'>"+placelist[i].place_name+"</option>")
                    }
        
                    if(sensordata[0].place_id){$('#place').val(sensordata[0].place_id).prop("selected", true)}


                    //센서 그룹 리스트 
                    $.ajax({
                        url:"sensorgroup/list?project_id="+project_id,
                        type:"get",
                        contentType: false,
                        processData : false,
                        error:function(err){
                            console.log(err);
                        },
                        success:function(json) {
                            // console.log("succes")
                
                            sensorgrouplist = json.data
                            console.log(sensorgrouplist)
                
                            for(let i = 0; i < sensorgrouplist.length ; i++){
                                console.log("1")
                                if(sensorgrouplist[i].place_id == sensordata[0].place_id){
                                    console.log("1")
                                    $('#sensorgroup').append("<option value='"+sensorgrouplist[i].sensorgroup_id+"'>"+sensorgrouplist[i].sensorgroup_name+"</option>")
                                }
                            }

                            if(sensordata[0].sensorgroup_id){$('#sensorgroup').val(sensordata[0].sensorgroup_id).prop("selected", true)}
                
                
                        }
                    })
                
                 }
            })
        
        
            


           
         }
    })

    



    

    //설치장소 변경할떄 마다 매핑된 그룹 표츌
    $('#place').change(function(){
      

        let current_place = $("#place option:selected").val();

        $('#sensorgroup').empty()

        $('#sensorgroup').append("<option selected=''>선택</option>")
        
        console.log(current_place)
        for(let i = 0; i < sensorgrouplist.length ; i++){
            console.log("1")
            if(sensorgrouplist[i].place_id == current_place){
                console.log("1")
                $('#sensorgroup').append("<option value='"+sensorgrouplist[i].sensorgroup_id+"'>"+sensorgrouplist[i].sensorgroup_name+"</option>")
            }
        }



    })


});


function savebtn(){

    let sensorgroup_id = $('#sensorgroup option:selected').val();
    
    console.log(sensorgroup_id)
    if(sensordetail_id == "undefined" ||sensordetail_id == "null"){
        sensordetail_id = ''
    }
    let sensor_max = $('#sensor_max').val()
    let sensor_min = $('#sensor_min').val()
    let sensor_weight = $('#sensor_weight').val()
    let sensor_deviation = $('#sensor_deviation').val()

    let fomula01 = $('#fomula01 option:selected').attr('function_fomula')
    let fomula02 = $('#fomula02 option:selected').attr('function_fomula')
    let fomula03 = $('#fomula03 option:selected').attr('function_fomula')
    let fomula04 = $('#fomula04 option:selected').attr('function_fomula')
    let fomula05 = $('#fomula05 option:selected').attr('function_fomula')

    let fomula01_name = $('#fomula01 option:selected').text()
    let fomula02_name = $('#fomula02 option:selected').text()
    let fomula03_name = $('#fomula03 option:selected').text()
    let fomula04_name = $('#fomula04 option:selected').text()
    let fomula05_name = $('#fomula05 option:selected').text()

    let sensor_fx_id1 = $('#fomula01 option:selected').val()
    let sensor_fx_id2 = $('#fomula02 option:selected').val()
    let sensor_fx_id3 = $('#fomula03 option:selected').val()
    let sensor_fx_id4 = $('#fomula04 option:selected').val()
    let sensor_fx_id5 = $('#fomula05 option:selected').val()
    console.log("sensor_fx_id1", sensor_fx_id1)

    console.log(fomula01)

    if(fomula01.length == 0){
        alert("공식을 선택해 주세요.")
        return;
    }


    let form_data = new FormData($('#formdata')[0])

    form_data.append("sensor_max", sensor_max)
    form_data.append("sensor_min", sensor_min)
    form_data.append("sensor_weight", sensor_weight)
    form_data.append("sensor_deviation", sensor_deviation)

    form_data.append("sensor_detail_id", sensordetail_id)
    form_data.append("sensor_id", sensor_id)
    form_data.append("datarogger_id", datarogger_id)

    form_data.append("sensor_fx1", fomula01)
    form_data.append("sensor_fx2", fomula02)
    form_data.append("sensor_fx3", fomula03)
    form_data.append("sensor_fx4", fomula04)
    form_data.append("sensor_fx5", fomula05)
    
    form_data.append("sensor_fx1_name", fomula01_name)
    form_data.append("sensor_fx2_name", fomula02_name)
    form_data.append("sensor_fx3_name", fomula03_name)
    form_data.append("sensor_fx4_name", fomula04_name)
    form_data.append("sensor_fx5_name", fomula05_name)

    form_data.append("sensor_fx1_id", sensor_fx_id1)
    form_data.append("sensor_fx2_id", sensor_fx_id2)
    form_data.append("sensor_fx3_id", sensor_fx_id3)
    form_data.append("sensor_fx4_id", sensor_fx_id4)
    form_data.append("sensor_fx5_id", sensor_fx_id5)

    if(sensorgroup_id == 'select'){form_data.append("sensorgroup_id", '')}else{form_data.append("sensorgroup_id", sensorgroup_id)}


    let sensor_st_over_ex = document.getElementById('sensor_st_over_ex').checked;
    if(sensor_st_over_ex){form_data.append("sensor_st_over_ex", 'Y')}else{form_data.append("sensor_st_over_ex", 'N')}
    
    let sensor_st_over_wt = document.getElementById('sensor_st_over_wt').checked;
    if(sensor_st_over_wt){form_data.append("sensor_st_over_wt", 'Y')}else{form_data.append("sensor_st_over_wt", 'N')}
    
    let sensor_dev_over_ex = document.getElementById('sensor_dev_over_ex').checked;
    if(sensor_dev_over_ex){form_data.append("sensor_dev_over_ex", 'Y')}else{form_data.append("sensor_dev_over_ex", 'N')}
    
    let sensor_dev_over_wt = document.getElementById('sensor_dev_over_wt').checked;
    if(sensor_dev_over_wt){form_data.append("sensor_dev_over_wt", 'Y')}else{form_data.append("sensor_dev_over_wt", 'N')}
    
    let sensor_null_ex = document.getElementById('sensor_null_ex').checked;
    if(sensor_null_ex){form_data.append("sensor_null_ex", 'Y')}else{form_data.append("sensor_null_ex", 'N')}
    
    let sensor_default_wt = document.getElementById('sensor_default_wt').checked;
    if(sensor_default_wt){form_data.append("sensor_default_wt", 'Y')}else{form_data.append("sensor_default_wt", 'N')}
    
    let sensor_noti = $('#sensor_noti').val()
    console.log(sensor_noti)
    if(sensor_noti == 'None'){form_data.append("sensor_noti", '')}else{form_data.append("sensor_noti", sensor_noti)}

    for (var pair of form_data.entries()){
        console.log(pair[0] + ":" + pair[1])
    };



    $.ajax({
        url : "/sensordetail/select",
        type : "POST",
        data : form_data,
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            alert("등록되었습니다.")
           console.log("succes")
           window.location.href = '/ws-10-6?'+encodeURIComponent("cHJ="+project_id)
        //    history.go(-1)
       
       }
    });


  

}

function canclebtn(){
    window.location.href='/ws-10-6?'+encodeURIComponent("cHJ="+project_id)
}





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