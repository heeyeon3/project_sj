let project_id = "";
let placelist = []
let removedata = []


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)



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

            placelist = json.data
            // let company_info = JSON.parse(json.data)
            console.log(placelist) 


            if(placelist.length == 0){

                console.log("12")
                let tabletrtd =  "<tr>"
                tabletrtd += "<td id='index_0'>1</td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_0'><input type='hidden' id='placeid_0' value=''></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_0'><input type='hidden' id='useyn_0' value='Y'></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_0'></td>"
                tabletrtd +="<td></td>"
                tabletrtd +="<td>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow(0)'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow(0)'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow(0)'></a>"
                tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow(0)'></a>"
                tabletrtd +="</td>"
                tabletrtd +="</tr>"

                $('#placetbody').append(tabletrtd)
            }else{
                console.log(placelist)
                for(let i = 0; i < placelist.length; i++){
                    let tabletrtd =  "<tr>"
                    tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
                    tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value='"+placelist[i].place_id+"'></td>"
                    tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
                    tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"' ></td>"
                    tabletrtd +="<td></td>"
                    tabletrtd +="<td>"
                    tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                    tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                    tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                    tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                    tabletrtd +="</td>"
                    tabletrtd +="</tr>"

                    $('#placetbody').append(tabletrtd)

                    $('#placename_'+i).val(placelist[i].place_name)
                    $('#placelat_'+i).val(placelist[i].place_lat)
                    $('#placelng_'+i).val(placelist[i].place_lng)
                }

            }




                
        }
    })

    $('#canclebtn').click(function(){
        window.location.href = '/ws-10?'+encodeURIComponent("cHJ="+project_id)
    })

    $('#topproject').attr("href", "/ws-10?" +encodeURIComponent("cHJ="+project_id))
})


function savebtn(){
    let tablelength = $('#placetable >tbody tr').length  //table 개수
    console.log(tablelength)


    // let td = $('#sensortable >tbody tr:eq(0)>td:eq(1)')
    // console.log(td.html())
    // console.log(td.eq(0).text())
    // console.log($('#sensortable >tbody tr:eq(2)'))
    // console.log($('#sensortable >tbody tr:eq(3)'))


    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let placeid = $("#placeid_" + i).val()
        let placename = $("#placename_" + i).val()
        let placelat = $("#placelat_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let placelng = $("#placelng_" + i).val()
        let useyn = $("#useyn_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let place_index = i+1
        if(placename.length == 0){alert("설치지점명을 입력해주세요.");$("#placename_" + i).focus(); return;}
        else if(placelat.length == 0){alert("위도를 입력해주세요.");$("#placelat_" + i).focus(); return;}
        else if(placelng.length == 0){alert("경도를 입력해주세요.");$("#placelng_" + i).focus(); return;}
        tabledata.push({"place_id":placeid,"place_name":placename, "place_lat":placelat,  "place_lng": placelng, "project_id":project_id, "place_index": place_index, "use_yn":useyn})
    }

    console.log(removedata)


    if(removedata.length != 0){
        for(let i =0; i < removedata.length; i++ ){
            tabledata.push(removedata[i])
        }
    }
    console.log(tabledata)


    // JSON.stringify(tabledata)


    ////데이터 여러개
    $.ajax({
        url:"/place/list",
        type:"post",
        data: JSON.stringify(tabledata),
        contentType: "application/json",
        // processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
           
            if(json.resultCode == "10"){
                alert(json.resultString)
                window.location.reload()
            }else{
                alert("저장되었습니다.")
                window.location.href = 'ws-10?'+encodeURIComponent("cHJ="+project_id)
            }
            
                
        }
    })
}


function addrow(idx){
    console.log(idx)
    let current_idx = idx+1
    console.log(current_idx)
    let tablelength = $('#placetable >tbody tr').length 

    console.log(placelist)

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let placeid = $("#placeid_" + i).val()
        let placename = $("#placename_" + i).val()
        let placelat = $("#placelat_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let placelng = $("#placelng_" + i).val()
        let useyn = $("#useyn_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let place_index = i+1
        tabledata.push({"place_id":placeid,"place_name":placename, "place_lat":placelat,  "place_lng": placelng, "project_id":project_id, "place_index": place_index, "use_yn":useyn})
    }

    console.log(tabledata[3])
    $('#placetbody').empty()
    for(let i = 0; i < tabledata.length+1; i++){
        console.log(i)
        if(i == current_idx){
            let tabletrtd =  "<tr>"
                tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
                tabletrtd +="<td></td>"
                tabletrtd +="<td>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                tabletrtd +="</td>"
                tabletrtd +="</tr>"

                $('#placetbody').append(tabletrtd)
        }else if(i<current_idx){
            let tabletrtd =  "<tr>"
            tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
            tabletrtd +="<td></td>"
            tabletrtd +="<td>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
            tabletrtd +="</td>"
            tabletrtd +="</tr>"

            $('#placetbody').append(tabletrtd)

            console.log(tabledata[i])
            $('#placeid_'+i).val(tabledata[i].place_id)
            $('#placename_'+i).val(tabledata[i].place_name)
            $('#placelat_'+i).val(tabledata[i].place_lat)
            $('#placelng_'+i).val(tabledata[i].place_lng)
        }else if(i>current_idx){
            let currentI = i-1
            let tabletrtd =  "<tr>"
            tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
            tabletrtd +="<td></td>"
            tabletrtd +="<td>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
            tabletrtd +="</td>"
            tabletrtd +="</tr>"

            $('#placetbody').append(tabletrtd)
            console.log(tabledata[currentI], currentI)
            $('#placeid_'+i).val(tabledata[currentI].place_id)
            $('#placename_'+i).val(tabledata[currentI].place_name)
            $('#placelat_'+i).val(tabledata[currentI].place_lat)
            $('#placelng_'+i).val(tabledata[currentI].place_lng)
            $('#placeid_'+i).val(tabledata[currentI].place_id)
        }
                
    }


}


function removerow(idx){
    console.log(idx)

    let tablelength = $('#placetable >tbody tr').length 

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let placeid = $("#placeid_" + i).val()
        let placename = $("#placename_" + i).val()
        let placelat = $("#placelat_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let placelng = $("#placelng_" + i).val()
        let useyn = $("#useyn_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let place_index = i+1
        tabledata.push({"place_id":placeid,"place_name":placename, "place_lat":placelat,  "place_lng": placelng, "project_id":project_id, "place_index": place_index, "use_yn":useyn})
    }

    tabledata[idx].use_yn = 'N'
    if(tabledata[idx].place_id.length != 0){
        removedata.push(tabledata[idx])
    }

    console.log(removedata)

    tabledata.splice(idx,1)
    console.log(tabledata)


    $('#placetbody').empty()
    if(tabledata.length>0){
        for(let i = 0; i < tabledata.length; i++){
            console.log(i)
    
            let tabletrtd =  "<tr>"
                tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
                tabletrtd +="<td></td>"
                tabletrtd +="<td>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
                tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
                tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
                tabletrtd +="</td>"
                tabletrtd +="</tr>"
    
                $('#placetbody').append(tabletrtd)
    
                console.log(tabledata[i])
                $('#placename_'+i).val(tabledata[i].place_name)
                $('#placelat_'+i).val(tabledata[i].place_lat)
                $('#placelng_'+i).val(tabledata[i].place_lng)
                $('#placeid_'+i).val(tabledata[i].place_id)
                    
        }
    }else{
        let tabletrtd =  "<tr>"
                tabletrtd += "<td id='index_0'>1</td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_0'><input type='hidden' id='placeid_0' value=''></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_0'><input type='hidden' id='useyn_0' value='Y'></td>"
                tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_0'></td>"
                tabletrtd +="<td></td>"
                tabletrtd +="<td>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow(0)'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow(0)'></a>"
                tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow(0)'></a>"
                tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow(0)'></a>"
                tabletrtd +="</td>"
                tabletrtd +="</tr>"

                $('#placetbody').append(tabletrtd)
    }
    
}


function uprow(idx){
    if(idx == 0){
        return;
    }

    let tablelength = $('#placetable >tbody tr').length 

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let placeid = $("#placeid_" + i).val()
        let placename = $("#placename_" + i).val()
        let placelat = $("#placelat_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let placelng = $("#placelng_" + i).val()
        let useyn = $("#useyn_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let place_index = i+1
        tabledata.push({"place_id":placeid,"place_name":placename, "place_lat":placelat,  "place_lng": placelng, "project_id":project_id, "place_index": place_index, "use_yn":useyn})
    }

    console.log(tabledata)

    tabledata_idx = tabledata[idx]
    tabledata_idxup = tabledata[idx-1]

    tabledata[idx] = tabledata_idxup
    tabledata[idx-1] = tabledata_idx

    console.log(tabledata)
    $('#placetbody').empty()
    for(let i = 0; i < tabledata.length; i++){
     

        let tabletrtd =  "<tr>"
            tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
            tabletrtd +="<td></td>"
            tabletrtd +="<td>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
            tabletrtd +="</td>"
            tabletrtd +="</tr>"

            $('#placetbody').append(tabletrtd)

            console.log(tabledata[i])
            $('#placename_'+i).val(tabledata[i].place_name)
            $('#placelat_'+i).val(tabledata[i].place_lat)
            $('#placelng_'+i).val(tabledata[i].place_lng)
            $('#placeid_'+i).val(tabledata[i].place_id)
                
    }

}


function downrow(idx){
    let tablelength = $('#placetable >tbody tr').length 

    if(idx == tablelength-1){
        return;
    }

    let tabledata = []
    for(let i =0; i < tablelength; i++){
        let placeid = $("#placeid_" + i).val()
        let placename = $("#placename_" + i).val()
        let placelat = $("#placelat_" + i).val()
        // let sensoroption = $("#sensoroption_" + i+" option:selected").text()
        let placelng = $("#placelng_" + i).val()
        let useyn = $("#useyn_" + i).val()
        // console.log((i+1), sensorname, sensorsn, sensoroption)

        let place_index = i+1
        tabledata.push({"place_id":placeid,"place_name":placename, "place_lat":placelat,  "place_lng": placelng, "project_id":project_id, "place_index": place_index, "use_yn":useyn})
    }

    tabledata_idx = tabledata[idx]
    tabledata_idxdown = tabledata[idx+1]

    tabledata[idx] = tabledata_idxdown
    tabledata[idx+1] = tabledata_idx



    $('#placetbody').empty()
    for(let i = 0; i < tabledata.length; i++){
     

        let tabletrtd =  "<tr>"
            tabletrtd += "<td id='index_"+i+"'>"+(i+1)+"</td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placename_"+i+"'><input type='hidden' id='placeid_"+i+"' value=''></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelat_"+i+"'><input type='hidden' id='useyn_"+i+"' value='Y'></td>"
            tabletrtd +="<td><input class='uk-input' type='text' placeholder='' id='placelng_"+i+"'></td>"
            tabletrtd +="<td></td>"
            tabletrtd +="<td>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-up' onclick='uprow("+i+")'></a>"
            tabletrtd +=    "<a class='uk-icon-button uk-margin-small-right' uk-icon='chevron-down' onclick='downrow("+i+")'></a>"
            tabletrtd +=    "<a  class='uk-icon-button uk-margin-small-right' uk-icon='plus' onclick='addrow("+i+")'></a>"
            tabletrtd +=   "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick='removerow("+i+")'></a>"
            tabletrtd +="</td>"
            tabletrtd +="</tr>"

            $('#placetbody').append(tabletrtd)

            console.log(tabledata[i])
            $('#placename_'+i).val(tabledata[i].place_name)
            $('#placelat_'+i).val(tabledata[i].place_lat)
            $('#placelng_'+i).val(tabledata[i].place_lng)
            $('#placeid_'+i).val(tabledata[i].place_id)
                
    }
}
