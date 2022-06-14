let project_id = "";
let placelist = [];
let removedata = [];


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)

    $('#canclebtn').click(function(){
        window.location.href = "ws-10?"+encodeURIComponent("cHJ="+project_id)
    })
    $('#topproject').attr("href", "/ws-10?" +encodeURIComponent("cHJ="+project_id))
    $.ajax({
        url:"place/list?project_id="+project_id,
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
            placelist = json.data


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
        
                    let sensorgrouplist = json.data
        
                    if(sensorgrouplist.length == 0){
                        let sensorgrouptbl = "<tr>"
                        sensorgrouptbl +=   "<td >1</td>"
                        sensorgrouptbl +=     "<td>"
                        sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_0'><input type='hidden' id='sensorgroupid_0' value=''><input type='hidden' id='useyn_0' value='Y'>"
                        sensorgrouptbl +=       "</td>"
                        sensorgrouptbl +=        "<td>"
                        sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_0'>"
                        sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
                        sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                        sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                        sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                        sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                        sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                        sensorgrouptbl +=          "</select>"
                        sensorgrouptbl +=          "</td>"
                        sensorgrouptbl +=        "<td>"
                        sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_0'>"
                        // sensorgrouptbl +=       "<option selected=''>차량기지</option>"
                        // sensorgrouptbl +=        "<option>진입도로</option>"
                        // sensorgrouptbl +=     "<option>서해연결선</option>"
                        sensorgrouptbl +=          "</select>"
                        sensorgrouptbl +=         "</td>"
                        // sensorgrouptbl +=        "<td>"
                        // sensorgrouptbl +=        "</td>"
                        sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+0+"'></td>"
                        sensorgrouptbl +=      "<td>"
                        sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow(0)'></a>"
                        sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow(0)'></a>"
                        sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow(0)'></a>"
                        sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow(0)'></a>"
                        sensorgrouptbl +=          "</td>"
                        sensorgrouptbl +=         "</tr>"
        
                        $('#sensorgrouptbody').append(sensorgrouptbl)
        
                        for(let j=0; j<placelist.length; j++){
                            console.log(placelist[j].place_name)
                            $('#placepoint_0').append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                        }
                        // $("#sensoroption_"+i).val(sensorlist[i].sensor_type).prop("selected", true )
        
        
                    }else{

                        for(let i =0; i<sensorgrouplist.length; i++){
                            let sensorgrouptbl = "<tr>"
                            sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
                            sensorgrouptbl +=     "<td>"
                            sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                            sensorgrouptbl +=       "</td>"
                            sensorgrouptbl +=        "<td>"
                            sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
                            sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
                            sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                            sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                            sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                            sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                            sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                            sensorgrouptbl +=          "</select>"
                            sensorgrouptbl +=          "</td>"
                            sensorgrouptbl +=        "<td>"
                            sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                            // sensorgrouptbl +=       "<option selected=''>차량기지</option>"
                            // sensorgrouptbl +=        "<option>진입도로</option>"
                            // sensorgrouptbl +=     "<option>서해연결선</option>"
                            sensorgrouptbl +=          "</select>"
                            sensorgrouptbl +=         "</td>"
                            // sensorgrouptbl +=        "<td>"
                            // sensorgrouptbl +=        "</td>"
                            sensorgrouptbl +=        "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                            sensorgrouptbl +=      "<td>"
                            sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                            sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                            sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                            sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                            sensorgrouptbl +=          "</td>"
                            sensorgrouptbl +=         "</tr>"
            
                            $('#sensorgrouptbody').append(sensorgrouptbl)
            
                            for(let j=0; j<placelist.length; j++){
                                console.log(placelist[j].place_name)
                                $("#placepoint_"+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                            }

                            $("#sensorgroupid_"+i).val(sensorgrouplist[i].sensorgroup_id)
                            $("#sensorgroupname_"+i).val(sensorgrouplist[i].sensorgroup_name)
                            console.log($("#sensorgroupname_"+i).val(), sensorgrouplist[i].sensorgroup_name)
                            $("#grouptype_"+i).val(sensorgrouplist[i].sensorgroup_type).prop("selected", true)
                            $("#placepoint_"+i).val(sensorgrouplist[i].place_id).prop("selected", true)
                            $("#interval_"+i).val(sensorgrouplist[i].sensorgroup_interval)
                            if(sensorgrouplist[i].sensorgroup_type == '0203' || sensorgrouplist[i].sensorgroup_type == '0204' || sensorgrouplist[i].sensorgroup_type == '0205'|| sensorgrouplist[i].sensorgroup_type == '0206'){
                                $("#interval_"+i).hide()
                            }
                            console.log($("#sensorgroupname_1").val())
                        }
        
                        
                    }
                 }
            });

         }
    });

    $("select[name='selecttype']").change(function(){ 
        // console.log(this.value); 
        // console.log(this.id); 
        let thisid = this.id
        let thisnum = thisid.substr(10, thisid.length)
        // console.log(thisid, thisnum)

        if(this.value == '0203' || this.value == '0204' || this.value == '0205'|| this.value == '0206'){
            $("#interval_"+thisnum).hide()
        }else{
            $("#interval_"+thisnum).show()
        }
    });

    // $("select").change(function(){ console.log(this.value); });



    // $("select[name='selectBox']").on('click',function () {
    //     console.log("!!")
    //     console.log($('input:checkbox[name="sensor"]:checked').length);
    //     $('#selected_sensor').text($('input:checkbox[name="sensor"]:checked').length);

    //     // console.log($(this).attr("datarogger"));
    //     // var chk_logger_id = $(this).attr("datarogger")
    //     // var ul_id ='';

    //     // // 전체선택에서 하위 하나 뺏을때... 데이터로거 체크박스 선택해제.
    //     // if(!$(this).is(':checked')){
    //     //     console.log("INININININ")
    //     //     $("#checkbox_"+chk_logger_id).prop('checked',false);
    //     // }
    // })


    
    
})

function savebtn(){
    let tablelength = $('#sensorgrouptable >tbody tr').length 
    console.log("tablelength", tablelength)
    console.log("!")
    console.log($("#sensorgroupname_2").val()    )
    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorgroupid = $("#sensorgroupid_" + i).val()
        let sensorgroupname = $("#sensorgroupname_" + i).val()

        let grouptype = $("#grouptype_" + i+" option:selected").val()
        let placepoint = $("#placepoint_" + i+" option:selected").val()

        let useyn = $("#useyn_" + i).val()
        let interval = $("#interval_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensorgroup_index = i+1
        console.log(sensorgroupid, sensorgroupname, grouptype, placepoint,useyn,interval)
        console.log( $("#sensorgroupname_" + i).val())
        if(!sensorgroupname){alert("센서 그룹 명을 입력해 주세요."); $("#sensorgroupname_" + i).focus(); return; }
        else if((grouptype == '0201' ||grouptype == '0202') && !interval){
            alert("간격을 입력해 주세요.");
            $("#interval_" + i).focus(); return;
        }
        
        tabledata.push({"sensorgroup_id":sensorgroupid,"sensorgroup_name":sensorgroupname, "sensorgroup_type":grouptype,  "sensorgroup_index": sensorgroup_index, "project_id":project_id, "place_id": placepoint, "use_yn":useyn, "sensorgroup_interval":interval})
    }

    console.log(tabledata)

    if(removedata.length != 0){
        for(let i =0; i < removedata.length; i++ ){
            tabledata.push(removedata[i])
        }
    }
    console.log(tabledata)


    $.ajax({
        url:"/sensorgroup/list",
        type:"post",
        data: JSON.stringify(tabledata),
        contentType: "application/json",
        // processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            alert("저장되었습니다.")
            window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+project_id)
                
        }
    })



}



function addrow(idx){
    console.log(idx)

    let current_idx = idx+1
    console.log(current_idx)
    let tablelength = $('#sensorgrouptable >tbody tr').length 

    console.log("tablelength", tablelength)

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorgroupid = $("#sensorgroupid_" + i).val()
        let sensorgroupname = $("#sensorgroupname_" + i).val()

        let grouptype = $("#grouptype_" + i+" option:selected").val()
        let placepoint = $("#placepoint_" + i+" option:selected").val()

        let useyn = $("#useyn_" + i).val()
        let interval = $("#interval_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensorgroup_index = i+1
        
        tabledata.push({"sensorgroup_id":sensorgroupid,"sensorgroup_name":sensorgroupname, "sensorgroup_type":grouptype,  "sensorgroup_index": sensorgroup_index, "project_id":project_id, "place_id": placepoint, "use_yn":useyn, "sensorgroup_interval":interval})
    }

    console.log(tabledata)

    $('#sensorgrouptbody').empty()
    for(let i = 0; i< tablelength+1; i++){
    
        if(i==current_idx){
            let sensorgrouptbl = "<tr>"
                sensorgrouptbl +=   "<td>"+(i+1)+"</td>"
                sensorgrouptbl +=     "<td>"
                sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                sensorgrouptbl +=       "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
                sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
                sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=         "</td>"
                // sensorgrouptbl +=        "<td>"
                // sensorgrouptbl +=        "</td>"
                sensorgrouptbl +=        "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                sensorgrouptbl +=      "<td>"
                sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=         "</tr>"
                $('#sensorgrouptbody').append(sensorgrouptbl)
                
                for(let j=0; j<placelist.length; j++){
                    // console.log(placelist[j].place_name)
                    if( j ==0 ){$('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"' selected=''>"+placelist[j].place_name+"</option>")}
                    else{$('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")}
                }

                // $('#sensorgroupname_'+i).val(tablelength.sensorgroup_name)
                // $('#sensorgroup_'+i).val(tablelength.sensorgroup_name)
                // $('#useyn_'+i).val(tablelength.sensorgroup_name)
                // $('#grouptype_'+i).val(tablelength.grouptype_).prop('selected', true)
                // $('#placepoint_'+i).val(tablelength.project_id).prop('selected', true)


        }else if(i<current_idx){
            let sensorgrouptbl = "<tr>"
                sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
                sensorgrouptbl +=     "<td>"
                sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                sensorgrouptbl +=       "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
                sensorgrouptbl +=        " <option value='0201'>가로형</option>"
                sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=         "</td>"
                // sensorgrouptbl +=        "<td>"
                // sensorgrouptbl +=        "</td>"
                sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                sensorgrouptbl +=      "<td>"
                sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=         "</tr>"
                $('#sensorgrouptbody').append(sensorgrouptbl)
                for(let j=0; j<placelist.length; j++){
                    // console.log(placelist[j].place_name)
                    $('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                }
                
                if(tabledata[i].sensorgroup_name){$('#sensorgroupname_'+i).val(tabledata[i].sensorgroup_name)}
                if(tabledata[i].sensorgroup_id){$('#sensorgroupid_'+i).val(tabledata[i].sensorgroup_id)}
                $('#useyn_'+i).val(tabledata[i].use_yn)
                
                $('#grouptype_'+i).val(tabledata[i].sensorgroup_type).prop('selected', true)
                $('#placepoint_'+i).val(tabledata[i].place_id).prop('selected', true)

                $("#interval_"+i).val(tabledata[i].sensorgroup_interval)
                    if(tabledata[i].sensorgroup_type == '0203' || tabledata[i].sensorgroup_type == '0204' || tabledata[i].sensorgroup_type == '0205' || tabledata[i].sensorgroup_type == '0206'){
                        $("#interval_"+i).hide()
                }



        }else if(i>current_idx){
            let sensorgrouptbl = "<tr>"
                sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
                sensorgrouptbl +=     "<td>"
                sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                sensorgrouptbl +=       "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
                sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
                sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=         "</td>"
                // sensorgrouptbl +=        "<td>"
                // sensorgrouptbl +=        "</td>"
                sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                sensorgrouptbl +=      "<td>"
                sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=         "</tr>"
                $('#sensorgrouptbody').append(sensorgrouptbl)
                let changeI = i-1
                for(let j=0; j<placelist.length; j++){
                    // console.log(placelist[j].place_name)
                    $('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                }
                console.log(tabledata[changeI])
                if(tabledata[changeI].sensorgroup_name){$('#sensorgroupname_'+i).val(tabledata[changeI].sensorgroup_name)}
                if(tabledata[changeI].sensorgroup_id){$('#sensorgroupid_'+i).val(tabledata[changeI].sensorgroup_id)}
                $('#useyn_'+i).val(tabledata[changeI].use_yn)
                $('#grouptype_'+i).val(tabledata[changeI].sensorgroup_type).prop('selected', true)
                $('#placepoint_'+i).val(tabledata[changeI].place_id).prop('selected', true)

                $("#interval_"+i).val(tabledata[changeI].sensorgroup_interval)
                    if(tabledata[changeI].sensorgroup_type == '0203' || tabledata[changeI].sensorgroup_type == '0204' || tabledata[changeI].sensorgroup_type == '0205' || tabledata[changeI].sensorgroup_type == '0206'){
                        $("#interval_"+i).hide()
                }
        }
    }

    $("select[name='selecttype']").change(function(){ 
    
        let thisid = this.id
        let thisnum = thisid.substr(10, thisid.length)
       

        if(this.value == '0203' || this.value == '0204' || this.value == '0205'|| this.value == '0206'){
            $("#interval_"+thisnum).hide()
        }else{
            $("#interval_"+thisnum).show()
        }
    });

}



function removerow(idx){
    console.log(idx)

    let tablelength = $('#sensorgrouptable >tbody tr').length 

    console.log("tablelength", tablelength)

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorgroupid = $("#sensorgroupid_" + i).val()
        let sensorgroupname = $("#sensorgroupname_" + i).val()

        let grouptype = $("#grouptype_" + i+" option:selected").val()
        let placepoint = $("#placepoint_" + i+" option:selected").val()

        let useyn = $("#useyn_" + i).val()
        let interval = $("#interval_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensorgroup_index = i+1
        
        tabledata.push({"sensorgroup_id":sensorgroupid,"sensorgroup_name":sensorgroupname, "sensorgroup_type":grouptype,  "sensorgroup_index": sensorgroup_index, "project_id":project_id, "place_id": placepoint, "use_yn":useyn, "sensorgroup_interval":interval})
    }

    tabledata[idx].use_yn = 'N'
    if(tabledata[idx].sensorgroup_id.length != 0){
        removedata.push(tabledata[idx])
    }

    console.log(removedata)

    tabledata.splice(idx,1)
    console.log(tabledata)


    $('#sensorgrouptbody').empty()
    if(tabledata.length>0){
        for(let i =0; i<tabledata.length; i++){
            let sensorgrouptbl = "<tr>"
            sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
            sensorgrouptbl +=     "<td>"
            sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
            sensorgrouptbl +=       "</td>"
            sensorgrouptbl +=        "<td>"
            sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
            sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
            sensorgrouptbl +=         "<option value='0202'>세로형</option>"
            sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
            sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
            sensorgrouptbl +=         "<option value='0205'>독립형</option>"
            sensorgrouptbl +=         "<option value='0206'>개별형</option>"
            sensorgrouptbl +=          "</select>"
            sensorgrouptbl +=          "</td>"
            sensorgrouptbl +=        "<td>"
            sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
            // sensorgrouptbl +=       "<option selected=''>차량기지</option>"
            // sensorgrouptbl +=        "<option>진입도로</option>"
            // sensorgrouptbl +=     "<option>서해연결선</option>"
            sensorgrouptbl +=          "</select>"
            sensorgrouptbl +=         "</td>"
            // sensorgrouptbl +=        "<td>"
            // sensorgrouptbl +=        "</td>"
            sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
            sensorgrouptbl +=      "<td>"
            sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
            sensorgrouptbl +=          "</td>"
            sensorgrouptbl +=         "</tr>"

            $('#sensorgrouptbody').append(sensorgrouptbl)

            for(let j=0; j<placelist.length; j++){
                // console.log(placelist[j].place_name)
                $("#placepoint_"+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
            }

            $("#sensorgroupid_"+i).val(tabledata[i].sensorgroup_id)
            $("#sensorgroupname_"+i).val(tabledata[i].sensorgroup_name)
            $("#grouptype_"+i).val(tabledata[i].sensorgroup_type).prop("selected", true)
            $("#placepoint_"+i).val(tabledata[i].place_id).prop("selected", true)

            $("#interval_"+i).val(tabledata[i].sensorgroup_interval)
                    if(tabledata[i].sensorgroup_type == '0203' || tabledata[i].sensorgroup_type == '0204' || tabledata[i].sensorgroup_type == '0205'|| tabledata[i].sensorgroup_type == '0206'){
                        $("#interval_"+i).hide()
                }
        }

        
    
    }else{
        let sensorgrouptbl = "<tr>"
            sensorgrouptbl +=   "<td >1</td>"
            sensorgrouptbl +=     "<td>"
            sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_0'><input type='hidden' id='sensorgroupid_0' value=''><input type='hidden' id='useyn_0' value='Y'>"
            sensorgrouptbl +=       "</td>"
            sensorgrouptbl +=        "<td>"
            sensorgrouptbl +=       "<select name='test' class='uk-select w-100' id='grouptype_0'>"
            sensorgrouptbl +=        " <option selected='' value='0201'>가로형</option>"
            sensorgrouptbl +=         "<option value='0202'>세로형</option>"
            sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
            sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
            sensorgrouptbl +=         "<option value='0205'>독립형</option>"
            sensorgrouptbl +=         "<option value='0206'>개별형</option>"
            sensorgrouptbl +=          "</select>"
            sensorgrouptbl +=          "</td>"
            sensorgrouptbl +=        "<td>"
            sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_0'>"
            // sensorgrouptbl +=       "<option selected=''>차량기지</option>"
            // sensorgrouptbl +=        "<option>진입도로</option>"
            // sensorgrouptbl +=     "<option>서해연결선</option>"
            sensorgrouptbl +=          "</select>"
            sensorgrouptbl +=         "</td>"
            // sensorgrouptbl +=        "<td>"
            // sensorgrouptbl +=        "</td>"
            sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
            sensorgrouptbl +=      "<td>"
            sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow(0)'></a>"
            sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow(0)'></a>"
            sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow(0)'></a>"
            sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow(0)'></a>"
            sensorgrouptbl +=          "</td>"
            sensorgrouptbl +=         "</tr>"

            $('#sensorgrouptbody').append(sensorgrouptbl)

            for(let j=0; j<placelist.length; j++){
                console.log(placelist[j].place_name)
                $('#placepoint_0').append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
            }

            $("#interval_"+i).val(tabledata[i].sensorgroup_interval)
                if(tabledata[i].sensorgroup_type == '0203' || tabledata[i].sensorgroup_type == '0204' || tabledata[i].sensorgroup_type == '0205'|| tabledata[i].sensorgroup_type == '0206'){
                    $("#interval_"+i).hide()
            }
    }

    $("select[name='selecttype']").change(function(){ 
    
        let thisid = this.id
        let thisnum = thisid.substr(10, thisid.length)
       

        if(this.value == '0203' || this.value == '0204' || this.value == '0205'|| this.value == '0206'){
            $("#interval_"+thisnum).hide()
        }else{
            $("#interval_"+thisnum).show()
        }
    });
    
}

function uprow(idx){

    if(idx == 0){
        return;
    }

    let tablelength = $('#sensorgrouptable >tbody tr').length 

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorgroupid = $("#sensorgroupid_" + i).val()
        let sensorgroupname = $("#sensorgroupname_" + i).val()

        let grouptype = $("#grouptype_" + i+" option:selected").val()
        let placepoint = $("#placepoint_" + i+" option:selected").val()

        let useyn = $("#useyn_" + i).val()
        let interval = $("#interval_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensorgroup_index = i+1
        
        tabledata.push({"sensorgroup_id":sensorgroupid,"sensorgroup_name":sensorgroupname, "sensorgroup_type":grouptype,  "sensorgroup_index": sensorgroup_index, "project_id":project_id, "place_id": placepoint, "use_yn":useyn, "sensorgroup_interval":interval})
    }

    tabledata_idx = tabledata[idx]
    tabledata_idxup = tabledata[idx-1]

    tabledata[idx] = tabledata_idxup
    tabledata[idx-1] = tabledata_idx
    console.log(tabledata)

    $('#sensorgrouptbody').empty()
    for(let i = 0; i< tablelength; i++){
        let sensorgrouptbl = "<tr>"
                sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
                sensorgrouptbl +=     "<td>"
                sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                sensorgrouptbl +=       "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=       "<select  name='test' class='uk-select w-100' id='grouptype_"+i+"'>"
                sensorgrouptbl +=        " <option value='0201'>가로형</option>"
                sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=         "</td>"
                // sensorgrouptbl +=        "<td>"
                // sensorgrouptbl +=        "</td>"
                sensorgrouptbl +=         "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                sensorgrouptbl +=      "<td>"
                sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=         "</tr>"
                $('#sensorgrouptbody').append(sensorgrouptbl)
                for(let j=0; j<placelist.length; j++){
                    // console.log(placelist[j].place_name)
                    $('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                }

                console.log(tabledata[i])
                if(tabledata[i].sensorgroup_name){$('#sensorgroupname_'+i).val(tabledata[i].sensorgroup_name)}
                if(tabledata[i].sensorgroup_id){$('#sensorgroupid_'+i).val(tabledata[i].sensorgroup_id)}
                $('#useyn_'+i).val(tabledata[i].use_yn)
               
                $('#grouptype_'+i).val(tabledata[i].sensorgroup_type).prop('selected', true)
                $('#placepoint_'+i).val(tabledata[i].place_id).prop('selected', true)

                $("#interval_"+i).val(tabledata[i].sensorgroup_interval)
                    if(tabledata[i].sensorgroup_type == '0203' || tabledata[i].sensorgroup_type == '0204' || tabledata[i].sensorgroup_type == '0205'|| tabledata[i].sensorgroup_type == '0206'){
                        $("#interval_"+i).hide()
                }

    }


    $("select[name='selecttype']").change(function(){ 
    
        let thisid = this.id
        let thisnum = thisid.substr(10, thisid.length)
       

        if(this.value == '0203' || this.value == '0204'|| this.value == '0205'|| this.value == '0206'){
            $("#interval_"+thisnum).hide()
        }else{
            $("#interval_"+thisnum).show()
        }
    });
}

function downrow(idx){


    let tablelength = $('#sensorgrouptable >tbody tr').length 

    if(idx == tablelength-1){return;}

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let sensorgroupid = $("#sensorgroupid_" + i).val()
        let sensorgroupname = $("#sensorgroupname_" + i).val()

        let grouptype = $("#grouptype_" + i+" option:selected").val()
        let placepoint = $("#placepoint_" + i+" option:selected").val()

        let useyn = $("#useyn_" + i).val()
        let interval = $("#interval_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let sensorgroup_index = i+1
        
        tabledata.push({"sensorgroup_id":sensorgroupid,"sensorgroup_name":sensorgroupname, "sensorgroup_type":grouptype,  "sensorgroup_index": sensorgroup_index, "project_id":project_id, "place_id": placepoint, "use_yn":useyn, "sensorgroup_interval":interval})
    }

    tabledata_idx = tabledata[idx]
    tabledata_idxdown = tabledata[idx+1]

    tabledata[idx] = tabledata_idxdown
    tabledata[idx+1] = tabledata_idx

    $('#sensorgrouptbody').empty()
    console.log(tabledata)
    for(let i = 0; i< tablelength; i++){
        let sensorgrouptbl = "<tr>"
                sensorgrouptbl +=   "<td >"+(i+1)+"</td>"
                sensorgrouptbl +=     "<td>"
                sensorgrouptbl +=       "<input class='uk-input uk-form-width-medium' type='text' id='sensorgroupname_"+i+"'><input type='hidden' id='sensorgroupid_"+i+"' value=''><input type='hidden' id='useyn_"+i+"' value='Y'>"
                sensorgrouptbl +=       "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=       "<select name='selecttype' class='uk-select w-100' id='grouptype_"+i+"'>"
                sensorgrouptbl +=        " <option value='0201'>가로형</option>"
                sensorgrouptbl +=         "<option value='0202'>세로형</option>"
                sensorgrouptbl +=         "<option value='0203'>스캐터</option>"
                sensorgrouptbl +=         "<option value='0204'>로드셀</option>"
                sensorgrouptbl +=         "<option value='0205'>독립형</option>"
                sensorgrouptbl +=         "<option value='0206'>개별형</option>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=        "<td>"
                sensorgrouptbl +=        "<select class='uk-select w-200' id='placepoint_"+i+"'>"
                sensorgrouptbl +=          "</select>"
                sensorgrouptbl +=         "</td>"
                // sensorgrouptbl +=        "<td>"
                // sensorgrouptbl +=        "</td>"
                sensorgrouptbl +=        "<td><input class='uk-input uk-form-width-small' type='number' placeholder='간격(m)' id='interval_"+i+"'></td>"
                sensorgrouptbl +=      "<td>"
                sensorgrouptbl +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                sensorgrouptbl +=             "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                sensorgrouptbl +=                "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                sensorgrouptbl +=      "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                sensorgrouptbl +=          "</td>"
                sensorgrouptbl +=         "</tr>"
                $('#sensorgrouptbody').append(sensorgrouptbl)
                for(let j=0; j<placelist.length; j++){
                    // console.log(placelist[j].place_name)
                    $('#placepoint_'+i).append("<option value='"+placelist[j].place_id+"'>"+placelist[j].place_name+"</option>")
                }

                if(tabledata[i].sensorgroup_name){$('#sensorgroupname_'+i).val(tabledata[i].sensorgroup_name)}
                if(tabledata[i].sensorgroup_id){$('#sensorgroupid_'+i).val(tabledata[i].sensorgroup_id)}
                $('#useyn_'+i).val(tabledata[i].use_yn)
               
                $('#grouptype_'+i).val(tabledata[i].sensorgroup_type).prop('selected', true)
                $('#placepoint_'+i).val(tabledata[i].place_id).prop('selected', true)

                $("#interval_"+i).val(tabledata[i].sensorgroup_interval)
                    if(tabledata[i].sensorgroup_type == '0203' || tabledata[i].sensorgroup_type == '0204' || tabledata[i].sensorgroup_type == '0205' || tabledata[i].sensorgroup_type == '0206'){
                        console.log( tabledata[i].sensorgroup_type )
                        $("#interval_"+i).hide()
                }

    }

    $("select[name='selecttype']").change(function(){ 
    
        let thisid = this.id
        let thisnum = thisid.substr(10, thisid.length)
       

        if(this.value == '0203' || this.value == '0204' || this.value == '0205' || this.value == '0206'){
            $("#interval_"+thisnum).hide()
        }else{
            $("#interval_"+thisnum).show()
        }
    });
}