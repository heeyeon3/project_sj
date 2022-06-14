let project_id = "";


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)


   
    $('#projectsetup').attr('href',"ws-10?"+encodeURIComponent("cHJ="+project_id) )

    $('#canclebtn').click(function(){
        window.location.href = "ws-10?"+encodeURIComponent("cHJ="+project_id)
    })
    
   
    $.ajax({
        url:"/datalogger/list",
        type:"post",
        data: {
            "project_id": project_id
        },
        // contentType: false,
        // processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            let datalogger = json.data
            // let company_info = JSON.parse(json.data)
            console.log(datalogger) 

            for(let i=0; i<datalogger.length; i++){
                $('#dataloggerlist').append("<option value='"+datalogger[i].datarogger_id+"'>"+datalogger[i].datarogger_name+"</option>")
                datalogger[i].datarogger_name
            }

            dataLogger_id = datalogger[0].datarogger_id
            console.log(dataLogger_id)

            searchdatarogger(dataLogger_id)


                
        }
    })


    $('#dataloggerlist').change(function(){
        console.log($("#dataloggerlist option:selected").val())
        $('#tablebody').empty()
        $('#tablebody2').empty()
        let dataLogger_id = $("#dataloggerlist option:selected").val()

        searchdatarogger(dataLogger_id)
        
    })

    $("#apply_btn").on('click',function(){
        console.log($("#dataloggerlist option:selected").val())
        $('#tablebody').empty()
        $('#tablebody2').empty()
        let dataLogger_id = $("#dataloggerlist option:selected").val()

        searchdatarogger(dataLogger_id)
    })
    
})


function searchdatarogger(dataLogger_id){


    $.ajax({
        url:"sensor/list?datarogger_id="+dataLogger_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            $('#tablebody').empty()
            let sensorlist = json.data
            // let company_info = JSON.parse(json.data)
            console.log(sensorlist) 

            for(let i =0; i< sensorlist.length; i++){
                let sensor_sn = sensorlist[i].sensor_sn
                if(sensorlist[i].sensor_sn){
                    sensor_sn = sensorlist[i].sensor_sn
                }else{
                    sensor_sn = "";
                }

                if(sensorlist[i].use_yn == 'Y'){
                    let sensortable =  " <tr data-state='done'>"
                    sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensorlist[i].sensor_display_index+"'>"+sensorlist[i].sensor_index+"</td>"
                    sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+sensorlist[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+sensorlist[i].sensor_id+"' use_yn = '"+sensorlist[i].use_yn+"' ></td>"
                    sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+sensor_sn+"'></td>"
                    sensortable +=     "<td></td>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' checked='' value='single'> Single</label>"
                    sensortable +=     "</td>"

                    // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
                    // sensortable +=            " <option selected='' value='x'>x</option>"
                    // sensortable +=            "<option value='y'>y</option>"
                    // sensortable +=             "<option value='single'>single</option>"
                    // sensortable +=        " </select>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' value='x'> X-Axis</label>"
                    sensortable +=     "</td>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' value='y'> Y-Axis</label>"
                    sensortable +=     "</td>"
                    sensortable +=     "<td></td>"
                    sensortable +=    "<td id='sensorname_"+i+"'>"+sensorlist[i].sensor_name+"</td>"
                    sensortable +=     "<td>"
                    sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                    sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                    sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus'></a>"
                    sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashrow("+i+")'></a>"
                    sensortable +=     "</td>"
                    sensortable += "</tr>"
    
                    $('#tablebody').append(sensortable)
    
                    $('#sensorname_'+i).val(sensorlist[i].sensor_display_name)
                    // $("#sensoroption_"+i).val(sensorlist[i].sensor_type).prop("checked", true )
                    $("input:radio[name='sensoroption_"+i+"']:radio[value='"+sensorlist[i].sensor_type+"']").prop('checked', true); 
                }else{
                    console.log(i)
                    let sensortable =  " <tr data-state='done'>"
                    sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensorlist[i].sensor_display_index+"'>"+sensorlist[i].sensor_index+"</td>"
                    sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+sensorlist[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+sensorlist[i].sensor_id+"' use_yn = '"+sensorlist[i].use_yn+"' ></td>"
                    sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+sensor_sn+"'></td>"
                    sensortable +=     "<td></td>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' checked='' value='single'> Single</label>"
                    sensortable +=     "</td>"

                    // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
                    // sensortable +=            " <option selected='' value='x'>x</option>"
                    // sensortable +=            "<option value='y'>y</option>"
                    // sensortable +=             "<option value='single'>single</option>"
                    // sensortable +=        " </select>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' value='x'> X-Axis</label>"
                    sensortable +=     "</td>"
                    sensortable +=     "<td>"
                    sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' id='sensoroption_"+i+"' value='y'> Y-Axis</label>"
                    sensortable +=     "</td>"
                    sensortable +=     "<td></td>"
                    sensortable +=    "<td id='sensorname_"+i+"'>"+sensorlist[i].sensor_name+"</td>"
                    sensortable +=     "<td>"
                    // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up'></a>"
                    // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down'></a>"
                    sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                    // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash'></a>"
                    sensortable +=     "</td>"
                    sensortable += "</tr>"

                    $('#tablebody2').append(sensortable)

                    $('#sensorname_'+i).val(sensorlist[i].sensor_display_name)
                    // $('#sensorname_'+i).prop("readonly", true)
                    // $('#sensorname_'+i).val(sensorlist[i].sensor_name)
                    // $('#sensorname_'+i).prop("readonly", true)
                    // $("#sensoroption_"+i).val(sensorlist[i].sensor_type).prop("selected", true )
                    $("input:radio[name='sensoroption_"+i+"']:radio[value='"+sensorlist[i].sensor_type+"']").prop('checked', true); 

                }
                
            }

            
                
        }
    })

}

function datasave(){
    console.log("datasace")
    tablelength = $('#sensortable >tbody tr').length  //table 개수
    console.log(tablelength)

    let tabledata = []
    let sensornamelist = []
    let sensornamelist_single = []
    let sensornamelist_x = []
    let sensornamelist_y = []
    let sensornamelisttype = []
    let sensornamelisttype_single = []
    let sensornamelisttype_x = []
    let sensornamelisttype_y = []

    for(let i =0; i < tablelength; i++){
        let sensordisplayname = $("#sensordisplayname_" + i).val()
        let sensorname = $("#sensorname_" + i).text()
        let sensorsn = $("#sensorsn_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let sensoroption = $("input[name='sensoroption_"+i+"']:checked").val();
        let sensorid = $("#sensorid_" + i).val()
        let use_yn = $("#sensorid_" + i).attr("use_yn")
        let sensordiplayindex = $("#sensorindex_" + i).attr("value")
        let sensor_index = $("#sensorindex_" + i).text()

        
        if(sensordisplayname.length == 0 && use_yn == 'Y'){
            alert("센서명을 모두 입력 해 주세요.")
            return;
        }
        

        if(sensoroption == 'single'){
            if(sensornamelist_single.indexOf(sensordisplayname) != -1 || sensornamelist.indexOf(sensordisplayname) != -1){
                alert("중복된 센서명을 사용하실 수 없습니다.")
                return;
            }
            sensornamelist_single.push(sensordisplayname)
            sensornamelisttype_single.push({'sensordisplayname':sensordisplayname, 'sensor_type':sensoroption})
        }

        // X, Y 센서명 중복 테스트
        if(sensoroption == 'x'){
            if(sensornamelist_x.indexOf(sensordisplayname) != -1){
                let idx = sensornamelist_x.indexOf(sensordisplayname)
                // console.log(sensornamelisttype_x[idx].sensor_type == sensoroption)
                if(sensornamelisttype_x[idx].sensor_type == sensoroption){
                    alert("같은 타입의 중복된 센서명을 사용하실 수 없습니다.")
                    return;
                }
            } else if(sensornamelist_single.indexOf(sensordisplayname) != -1){
                alert("같은 타입의 중복된 센서명을 사용하실 수 없습니다.")
                return;
            }
            
            sensornamelist_x.push(sensordisplayname)
            sensornamelisttype_x.push({'sensordisplayname':sensordisplayname, 'sensor_type':sensoroption})

        } else if(sensoroption == 'y'){
            if(sensornamelist_y.indexOf(sensordisplayname) != -1){

                let idx = sensornamelist_y.indexOf(sensordisplayname)
                console.log(sensornamelisttype_y[idx].sensor_type, sensoroption)
    
                if(sensornamelisttype_y[idx].sensor_type == sensoroption){
                    alert("같은 타입의 중복된 센서명을 사용하실 수 없습니다.")
                    return;
                }
    
            } else if(sensornamelist_single.indexOf(sensordisplayname) != -1){
                alert("같은 타입의 중복된 센서명을 사용하실 수 없습니다.")
                return;
            }
            sensornamelist_y.push(sensordisplayname)
            sensornamelisttype_y.push({'sensordisplayname':sensordisplayname, 'sensor_type':sensoroption})
        }



        sensornamelist.push(sensordisplayname)
        sensornamelisttype.push({'sensordisplayname':sensordisplayname, 'sensor_type':sensoroption})

        tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex ,"project_id": project_id}) 
    }

    console.log(tabledata)

    JSON.stringify(tabledata)


    ////데이터 여러개
    $.ajax({
        url:"sensor/list",
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
            window.location.href = 'ws-10?'+encodeURIComponent("cHJ="+project_id)

          
                
        }
    })




}



function addrow(idx){
    let current_idx = idx+1
    console.log(current_idx)
    // let tablelength = $('#sensorgrouptable >tbody tr').length 

    let tablelength = $('#sensortable >tbody tr').length  //table 개수
    console.log(tablelength)

    let tabledata = []
    for(let i =0; i < tablelength; i++){

        if(i != idx){
            let sensordisplayname = $("#sensordisplayname_" + i).val()
            let sensorname = $("#sensorname_" + i).text()
            let sensorsn = $("#sensorsn_" + i).val()

            // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
            let sensoroption = $("input[name='sensoroption_"+i+"']:checked").val();
            
            let sensorid = $("#sensorid_" + i).val()
            let use_yn = $("#sensorid_" + i).attr("use_yn")
            let sensordiplayindex = $("#sensorindex_" + i).attr("value")
            let sensor_index = $("#sensorindex_" + i).text()
            
            tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
        }
        
    }

    let sensordisplayname = $("#sensordisplayname_" + idx).val()
    let sensorname = $("#sensorname_" + idx).text()
    let sensorsn = $("#sensorsn_" + idx).val()
    // let sensoroption = $("#sensoroption_" + idx+" option:selected").text()
    let sensoroption = $("input[name='sensoroption_"+idx+"']:checked").val();
    let sensorid = $("#sensorid_" + idx).val()
    let use_yn = 'Y'
    let sensordiplayindex = $("#sensorindex_" + idx).attr("value")
    let sensor_index = $("#sensorindex_" + idx).text()
    
    tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
    console.log(tabledata)
    $('#tablebody').empty()   
    $('#tablebody2').empty()

    let sensordisplayindex =1
    for(let i =0; i< tabledata.length; i++){
        if(tabledata[i].use_yn == 'Y'){
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensordisplayindex+"'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' ></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashrow("+i+")'></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody').append(sensortable)
    
          
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 

            sensordisplayindex +=1
        }

        else{
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='0'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' ></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody2').append(sensortable)
    
        
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 
        }
        
     }
}





function uprow(idx){
    if(idx == 0){
        return;
    }

    let current_idx = idx+1
    console.log(current_idx)
    // let tablelength = $('#sensorgrouptable >tbody tr').length 

    let tablelength = $('#sensortable >tbody tr').length  //table 개수
    console.log(tablelength)

    let tabledata = []
    for(let i =0; i < tablelength; i++){
       
        let sensordisplayname = $("#sensordisplayname_" + i).val()
        let sensorname = $("#sensorname_" + i).text()
        let sensorsn = $("#sensorsn_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let sensoroption = $("input[name='sensoroption_"+i+"']:checked").val();

        let sensorid = $("#sensorid_" + i).val()
        let use_yn = $("#sensorid_" + i).attr("use_yn")
        let sensordiplayindex = $("#sensorindex_" + i).attr("value")
        let sensor_index = $("#sensorindex_" + i).text()
        
        tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
        
    }
    console.log(tabledata)

    $('#tablebody').empty()
    $('#tablebody2').empty()



    tabledata_idx = tabledata[idx]
    tabledata_idxup = tabledata[idx-1]

    tabledata[idx] = tabledata_idxup
    tabledata[idx-1] = tabledata_idx

    let sensordisplayindex = 1
    for(let i = 0; i < tabledata.length; i++){

        if(tabledata[i].use_yn == 'Y'){
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensordisplayindex+"'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"' checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' ></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashrow("+i+")'></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody').append(sensortable)
          
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 


            sensordisplayindex+=1
        } else{
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='0'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' ></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody2').append(sensortable)
    
        
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 
        }
     
        
    }

}


function downrow(idx){

   
    let tablelength = $('#sensortable >tbody tr').length  //table 개수
    if(idx == tablelength-1){
        return;
    }

    let tabledata = []
    for(let i =0; i < tablelength; i++){
       
        let sensordisplayname = $("#sensordisplayname_" + i).val()
        let sensorname = $("#sensorname_" + i).text()
        let sensorsn = $("#sensorsn_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let sensoroption = $("input[name='sensoroption_"+i+"']:checked").val();
        let sensorid = $("#sensorid_" + i).val()
        let use_yn = $("#sensorid_" + i).attr("use_yn")
        let sensordiplayindex = $("#sensorindex_" + i).attr("value")
        let sensor_index = $("#sensorindex_" + i).text()
        
        tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
        
    }
    console.log(tabledata)

    $('#tablebody').empty()
    $('#tablebody2').empty()



    tabledata_idx = tabledata[idx]
    tabledata_idxdown = tabledata[idx+1]

    tabledata[idx] = tabledata_idxdown
    tabledata[idx+1] = tabledata_idx

    let sensordisplayindex = 1
    for(let i = 0; i < tabledata.length; i++){

        if(tabledata[i].use_yn == 'Y'){
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensordisplayindex+"'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' ></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashrow("+i+")'></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody').append(sensortable)
          
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 

            sensordisplayindex+=1
        } else{
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='0'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' ></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody2').append(sensortable)
    
        
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 
        }
     
        
    }
}


function trashrow(idx) {

    let current_idx = idx+1
    console.log(current_idx)
    // let tablelength = $('#sensorgrouptable >tbody tr').length 

    let tablelength = $('#sensortable >tbody tr').length  //table 개수
    console.log(tablelength)

    let tabledata = []
    for(let i =0; i < tablelength; i++){

        if(i != idx){
            let sensordisplayname = $("#sensordisplayname_" + i).val()
            let sensorname = $("#sensorname_" + i).text()
            let sensorsn = $("#sensorsn_" + i).val()
            // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
            let sensoroption = $("input[name='sensoroption_"+i+"']:checked").val();
            let sensorid = $("#sensorid_" + i).val()
            let use_yn = $("#sensorid_" + i).attr("use_yn")
            let sensordiplayindex = $("#sensorindex_" + i).attr("value")
            let sensor_index = $("#sensorindex_" + i).text()
          
            tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
        }
        
    }

    let sensordisplayname = $("#sensordisplayname_" + idx).val()
    let sensorname = $("#sensorname_" + idx).text()
    let sensorsn = $("#sensorsn_" + idx).val()
    // let sensoroption = $("#sensoroption_" + idx+" option:selected").text()
    let sensoroption = $("input[name='sensoroption_"+idx+"']:checked").val();

    let sensorid = $("#sensorid_" + idx).val()
    let use_yn = 'N'
    let sensordiplayindex = $("#sensorindex_" + idx).attr("value")
    let sensor_index = $("#sensorindex_" + idx).text()
    
    tabledata.push({"sensor_id":sensorid, "sensor_name":sensorname, "sensor_display_name":sensordisplayname, "sensor_sn": sensorsn, "sensor_type":sensoroption, "sensor_index":sensor_index, "use_yn":use_yn ,"sensor_display_index": sensordiplayindex})
    console.log(tabledata)

    $('#tablebody').empty()
    $('#tablebody2').empty()

    let sensordisplayindex =1
    for(let i =0; i< tabledata.length; i++){
        if(tabledata[i].use_yn == 'Y'){
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='"+sensordisplayindex+"'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' ></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='trashrow("+i+")'></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody').append(sensortable)
    
            sensordisplayindex += 1
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 
        }

        else{
            let sensortable =  " <tr data-state='done'>"
            sensortable +=     "<td id='sensorindex_"+i+"' value='0'>"+tabledata[i].sensor_index+"</td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensordisplayname_"+i+"' value='"+tabledata[i].sensor_display_name+"' ><input type='hidden' id='sensorid_"+i+"' value='"+tabledata[i].sensor_id+"' use_yn = '"+tabledata[i].use_yn+"' ></td>"
            sensortable +=     "<td><input class='uk-input' type='text' placeholder='' id='sensorsn_"+i+"' value='"+tabledata[i].sensor_sn+"'></td>"
            sensortable +=     "<td></td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  checked='' value='single'> Single</label>"
            sensortable +=     "</td>"

            // sensortable +=         "<select class='uk-select w-100' id='sensoroption_"+i+"'>"
            // sensortable +=            " <option selected='' value='x'>x</option>"
            // sensortable +=            "<option value='y'>y</option>"
            // sensortable +=             "<option value='single'>single</option>"
            // sensortable +=        " </select>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='x'> X-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td>"
            sensortable +=         "<label><input class='uk-radio' type='radio' name='sensoroption_"+i+"'  value='y'> Y-Axis</label>"
            sensortable +=     "</td>"
            sensortable +=     "<td></td>"
            sensortable +=    "<td id='sensorname_"+i+"'>"+tabledata[i].sensor_name+"</td>"
            sensortable +=     "<td>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down'></a>"
            sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            // sensortable +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' ></a>"
            sensortable +=     "</td>"
            sensortable += "</tr>"
    
            $('#tablebody2').append(sensortable)
    
        
            // $("#sensoroption_"+i).val(tabledata[i].sensor_type).prop("selected", true )
            $("input:radio[name='sensoroption_"+i+"']:radio[value='"+tabledata[i].sensor_type+"']").prop('checked', true); 
        }
        
     }




}