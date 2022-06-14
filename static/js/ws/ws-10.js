let project_id = "";


$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)


   
    // $('#project_location').attr('href',"ws-10-1?project_id="+ project_id )
    // $('#datarogger').attr('href',"ws-10-2?project_id=" + project_id)
    // $('#site_drawing').attr('href',"ws-10-3?project_id=" + project_id)
    // $('#installation_point').attr('href',"ws-10-4?project_id="+ project_id )
    // $('#sensor_group').attr('href',"ws-10-5?project_id="+ project_id )
    // $('#sensor_installation').attr('href',"ws-10-6?project_id=" + project_id)

    $.ajax({
        url:"project/current?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            // console.log("succes")
            console.log(json.data)
            let project_data = json.data
            let edit_data = json.data[0]
            console.log(edit_data)
            
            $('#projectName').text(edit_data.project_name)

            $('#floorplan_project_name').text(edit_data.project_name)
            if(edit_data.project_fp_img){
                $('#floorplanyn').addClass("icon-guideline-b")
            }else{
                $('#floorplanyn').addClass("icon-guideline-d")
            }
        
        
            $('#project_create_date').text(edit_data.create_date )
            if(edit_data.extention_id){
                $('#project_date').text(edit_data.project_st_dt + " ~ " + edit_data.extention_ed_dt)
            }else{
                $('#project_date').text(edit_data.project_st_dt + " ~ " + edit_data.project_ed_dt)
            }
          
            $('#company_name').text(edit_data.company_name)
            // $('#project_cost').text(edit_data.project_cost+"원")
            let cost = 0 +parseInt(edit_data.project_cost)
            for(let i=0; i<project_data.length; i++){
                if(project_data[i].extention_id){
                    cost += parseInt(project_data[i].extention_cost)
                }
                
                if(i == project_data.length -1){
                    $('#project_cost').text(cost+"원")
                }


            }
            // console.log(edit_data.project_lat)
            // console.log($('#project_location').text())
            if(edit_data.project_lat ||edit_data.project_lng){
                $('#project_latlng').text(edit_data.project_lat +", "+edit_data.project_lng);
                $('#project_latlng_td').removeClass("uk-text-red")
            }
            if(edit_data.project_address){ 
                console.log("???")
                $('#projectaddress').text(edit_data.project_address);
                $('#projectaddress_td').removeClass("uk-text-red")
            }  
  
            if(edit_data.project_img){
                $('#project_img').text(edit_data.project_img);
                $('#project_img_td').removeClass("uk-text-red")
              }
            
            
        }
    })

    $.ajax({
        url:"datarogger/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            console.log(json.data)

            let dataroggerlist = json.data
            console.log(dataroggerlist)

            let dataroggername = []
            let sensortotallength = 0;
            let sensormappinlength = 0;

            for(let i=0; i<dataroggerlist.length; i++){
                
                // console.log(dataroggername)
                if(dataroggername.indexOf(dataroggerlist[i].datarogger_id) == -1){
                    dataroggername.push(dataroggerlist[i].datarogger_id)
                    sensormappinlength = 0
                    sensortotallength = 0

                    sensormappinlength+=1
                    if(dataroggerlist[i].use_yn == 'Y'){
                        sensortotallength +=1
                    }


                    let tdtag = "<tr>"
                    tdtag +=   "<td><a href='ws-10-2?"+encodeURIComponent("cHJ="+ project_id)+"'>"+dataroggerlist[i].datarogger_name+"</a></td>" 
                    tdtag +=     "<td class='uk-text-center' id='sensormapping_"+dataroggerlist[i].datarogger_id+"'>"+sensormappinlength+"</td>"
                    tdtag +=     "<td class='uk-text-center' id='sensortotal_"+dataroggerlist[i].datarogger_id+"'>"+sensortotallength+"</td>"
                    
                    // if(sensortotallength == sensormappinlength){tdtag +=      "<td class='uk-text-center'>"+sensormappinlength+"</td>"}
                    // else{"<td class='uk-text-center uk-text-red'>"+sensormappinlength+"</td>"}
                    
                    tdtag +=             "</tr>"
                    $('#datarogger_tbody').append(tdtag)
                }else{
                    sensormappinlength+=1
                    if(dataroggerlist[i].use_yn == 'Y'){
                        sensortotallength +=1
                    }else{
                        $('#sensormapping_'+dataroggerlist[i].datarogger_id).addClass("uk-text-red")
                    } 
                    // console.log(sensortotallength,sensormappinlength )
                    $('#sensortotal_'+dataroggerlist[i].datarogger_id).text(sensortotallength)
                    $('#sensormapping_'+dataroggerlist[i].datarogger_id).text(sensormappinlength)


                }
                // if(dataroggerlist[i].sensorgroup_id && dataroggerlist[i].sensorgroup_id >0){sensormappinlength += 1}
                // // console.log(sensortotallength, sensormappinlength)
                // if(dataroggername.indexOf(dataroggerlist[i].datarogger_name) == -1 && i==0){
                //     dataroggername.push(dataroggerlist[i].datarogger_name)
                // }

                // if(dataroggername.indexOf(dataroggerlist[i].datarogger_name) == -1){
                //     // console.log("!!!!!!")
                //     dataroggername.push(dataroggerlist[i].datarogger_name)
                //     let tdtag = "<tr>"
                //     tdtag +=   "<td><a href='ws-10-2?project_id="+project_id+"'>"+dataroggerlist[i-1].datarogger_name+"</a></td>" 
                //     tdtag +=     "<td class='uk-text-center'>"+sensortotallength+"</td>"
                //     if(sensortotallength == sensormappinlength){tdtag +=      "<td class='uk-text-center'>"+sensormappinlength+"</td>"}
                //     else{"<td class='uk-text-center uk-text-red'>"+sensormappinlength+"</td>"}
                    
                //     tdtag +=             "</tr>"
                //     $('#datarogger_tbody').append(tdtag)
                //     sensortotallength = 0
                //     sensormappinlength = 0
                //     if(i == dataroggerlist.length+1){return;}
                // }else if(i == dataroggerlist.length-1){
                //     console.log("!!!!!!dddsdgsgbfgd")
                //     let tdtag = "<tr>"
                //         tdtag +=   "<td><a href='ws-10-2?project_id="+project_id+"'>"+dataroggerlist[i].datarogger_name+"</a></td>" 
                        
                //         if(sensortotallength == sensormappinlength){tdtag +=      "<td class='uk-text-center'>"+sensormappinlength+"</td>"}
                //         else{tdtag +=  "<td class='uk-text-center uk-text-red'>"+sensormappinlength+"</td>"}
                //         tdtag +=     "<td class='uk-text-center'>"+sensortotallength+"</td>"
                //         tdtag +=     "<td class='uk-text-center'></td>"
                //         tdtag +=             "</tr>"
                //         $('#datarogger_tbody').append(tdtag)

                // }
            

                // if(i == 0){
                    
                // }else{
                //     if(dataroggername.indexOf(dataroggerlist[i].datarogger_name) == -1){
                //         dataroggername.push(dataroggerlist[i].datarogger_name)
                //         let tdtag = "<tr>"
                //         tdtag +=   "<td><a href='ws-10-2?project_id="+project_id+"'>"+dataroggerlist[i].datarogger_name+"</a></td>" 
                //         tdtag +=     "<td class='uk-text-center'>"+sensortotallength+"</td>"
                //         if(sensortotallength == sensormappinlength){tdtag +=      "<td class='uk-text-center'>"+sensormappinlength+"</td>"}
                //         else{"<td class='uk-text-center uk-text-red'>"+sensormappinlength+"</td>"}
                        
                //         tdtag +=             "</tr>"
                //         $('#datarogger_tbody').append(tdtag)
                //         sensortotallength = 0
                //         sensormappinlength = 0
                //     }else{
                //         sensortotallength += 1;
                //         if(dataroggerlist[i].sensorgroup_id && dataroggerlist[i].sensorgroup_id >0){sensormappinlength += 1}
                //     }
                    
                // }

                // if(i == dataroggerlist.length+1){
                //     let tdtag = "<tr>"
                //         tdtag +=   "<td><a href='ws-10-2?project_id="+project_id+"'>"+dataroggerlist[i].datarogger_name+"</a></td>" 
                //         tdtag +=     "<td class='uk-text-center'>"+sensortotallength+"</td>"
                //         if(sensortotallength == sensormappinlength){tdtag +=      "<td class='uk-text-center'>"+sensormappinlength+"</td>"}
                //         else{"<td class='uk-text-center uk-text-red'>"+sensormappinlength+"</td>"}
                //         tdtag +=     "<td class='uk-text-center'></td>"
                //         tdtag +=             "</tr>"
                //         $('#datarogger_tbody').append(tdtag)
                    
                // }
         
            }

         }
    });


    $.ajax({
        url:"place/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            // console.log("succes")

            let placelist = json.data
            // let company_info = JSON.parse(json.data)
            console.log(placelist) 
            for(let i=0; i<placelist.length; i++){
                let tdtag = "<tr>"
                tdtag +=     "<td>"+placelist[i].place_name+"</td>"
                tdtag +=     "<td>"+placelist[i].place_lat+"</td>"
                tdtag +=                  "<td>"+placelist[i].place_lng+"</td>"
                tdtag +=             "</tr>"

                $('#place_tbody').append(tdtag)
            }

         }
    })



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
            // console.log(json.data)

            let sensorgrouplist = json.data
            console.log(sensorgrouplist)

            for(let i=0; i<sensorgrouplist.length; i++){
                let sensortype = "";
                let tdtag = "<tr>"
                tdtag +=     "<td>"+sensorgrouplist[i].place_name+"</td>"
                tdtag +=     "<td>"+sensorgrouplist[i].sensorgroup_name+"</td>"
                if(sensorgrouplist[i].sensorgroup_type == "0201"){sensortype = "가로형"}
                else if(sensorgrouplist[i].sensorgroup_type == "0202"){sensortype = "세로형"}
                else if(sensorgrouplist[i].sensorgroup_type == "0203"){sensortype = "스캐터"}
                else if(sensorgrouplist[i].sensorgroup_type == "0204"){sensortype = "로드셀"}
                else if(sensorgrouplist[i].sensorgroup_type == "0205"){sensortype = "독립형"}
                else if(sensorgrouplist[i].sensorgroup_type == "0206"){sensortype = "개별형"}
                tdtag +=                  "<td>"+sensortype+"</td>"
                tdtag +=             "</tr>"

                $('#sensorgroup_tbody').append(tdtag)
            }

         }
    });


    $.ajax({
        url:"/sensordetail/list?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")
            // console.log(json.data)

            let sensorlist = json.data
            console.log(sensorlist)

            let nonesensor = 0;
            let sensorgroup = [];
            for(let i = 0; i<sensorlist.length; i++){
                if(sensorlist[i].sensorgroup_id && sensorgroup.indexOf(sensorlist[i].sensorgroup_id) == -1){
                    
                    sensorgroup.push(sensorlist[i].sensorgroup_id)
                    let sensortype = "";
                    let tdtag = "<tr>"
                    tdtag +=    "<td>"+sensorlist[i].place_name+"</td>"
                    tdtag +=      "<td>"+sensorlist[i].sensorgroup_name+"</td>"

                    if(sensorlist[i].sensorgroup_type == "0201"){sensortype = "가로형"}
                    else if(sensorlist[i].sensorgroup_type == "0202"){sensortype = "세로형"}
                    else if(sensorlist[i].sensorgroup_type == "0203"){sensortype = "스캐터"}
                    else if(sensorlist[i].sensorgroup_type == "0204"){sensortype = "로드셀"}
                    else if(sensorlist[i].sensorgroup_type == "0205"){sensortype = "독립형"}
                    tdtag +=       "<td>"+sensortype+"</td>"       
                    tdtag +=       "<td id='totalsensor_"+sensorlist[i].sensorgroup_id+"'>1</td>"       
                    
                    if((sensorlist[i].sensor_fx1 || sensorlist[i].sensor_fx2 || sensorlist[i].sensor_fx3 || sensorlist[i].sensor_fx4 || sensorlist[i].sensor_fx5) && (sensorlist[i].sensor_gl1_max || sensorlist[i].sensor_gl1_min || sensorlist[i].sensor_gl2_max || sensorlist[i].sensor_gl2_min || 
                        sensorlist[i].sensor_gl3_max || sensorlist[i].sensor_gl3_min) && (sensorlist[i].sensor_max || sensorlist[i].sensor_min ||  sensorlist[i].sensor_weight || sensorlist[i].sensor_deviation) && sensorlist[i].sensor_noti  
                    ){
                        tdtag +=       "<td id='completesensor_"+sensorlist[i].sensorgroup_id+"'>1</td>"    
                        
                    }else{
                        
                        tdtag +=       "<td id='completesensor_"+sensorlist[i].sensorgroup_id+"'>0</td>"       
                        $('#completesensor_'+sensorlist[i].sensorgroup_id).addClass("uk-text-red")
                  
                    }
                    
                    tdtag +=   " </tr>"

                    $('#sensortbody').append(tdtag)
                }else if(!sensorlist[i].sensorgroup_id){
                    nonesensor+=1
                }else{
                   
                    let totalsensor = $('#totalsensor_'+sensorlist[i].sensorgroup_id).text()
                    $('#totalsensor_'+sensorlist[i].sensorgroup_id).text(parseInt(totalsensor)+1)
                    if((sensorlist[i].sensor_fx1 || sensorlist[i].sensor_fx2 || sensorlist[i].sensor_fx3 || sensorlist[i].sensor_fx4 || sensorlist[i].sensor_fx5) && (sensorlist[i].sensor_gl1_max || sensorlist[i].sensor_gl1_min || sensorlist[i].sensor_gl2_max || sensorlist[i].sensor_gl2_min || 
                        sensorlist[i].sensor_gl3_max || sensorlist[i].sensor_gl3_min) && (sensorlist[i].sensor_max || sensorlist[i].sensor_min ||  sensorlist[i].sensor_weight || sensorlist[i].sensor_deviation) && sensorlist[i].sensor_noti  
                    ){
                     
                        let cpmpletesensor = $('#completesensor_'+sensorlist[i].sensorgroup_id).text()
                        $('#completesensor_'+sensorlist[i].sensorgroup_id).text(parseInt(cpmpletesensor)+1)
                    }else{
                        $('#completesensor_'+sensorlist[i].sensorgroup_id).addClass("uk-text-red")
                    }
                }


                if($('#totalsensor_'+sensorlist[i].sensorgroup_id).text() != $('#completesensor_'+sensorlist[i].sensorgroup_id).text()){
                    $('#completesensor_'+sensorlist[i].sensorgroup_id).addClass("uk-text-red")
                }

                
            }
            console.log("nonesensor", nonesensor)
            $('#nonesensor').text(nonesensor)

            

         }
    });

})



function project_location(){
    window.location.href = "ws-10-1?"+encodeURIComponent("cHJ="+ project_id) 
}

function datarogger(){
    window.location.href = "ws-10-2?"+encodeURIComponent("cHJ="+ project_id) 
}

function site_drawing(){
    window.location.href = "ws-10-3?"+encodeURIComponent("cHJ="+ project_id) 
}

function installation_point(){
    window.location.href = "ws-10-4?"+encodeURIComponent("cHJ="+ project_id) 
}

function sensor_group(){
    window.location.href = "ws-10-5?"+encodeURIComponent("cHJ="+ project_id) 
}

function sensor_installation(){
    window.location.href = "ws-10-6?"+encodeURIComponent("cHJ="+ project_id) 
}