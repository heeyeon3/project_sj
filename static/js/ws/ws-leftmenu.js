let alarmlist = []
let sensorcount = []
let placecount = []
let sensorgroupcount = []

$(function(){
    // console.log("!@")

    //프로젝트 아이디가 필요해

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    let project_id = urlParams.get('cHJ')
    let sensorgroup_id = urlParams.get('aWQ')
    let sensor_id1 = urlParams.get('c2V')
    let sensorgroup_type = urlParams.get('Hlw')
    let sensor_idx = urlParams.get('c2Vx')

    console.log(sensorgroup_id, sensor_id1, sensorgroup_type)

    if(sensorgroup_type=='0203'){
        sensor_id1 = sensor_idx
    }
    
    console.log("sensor_id1", sensor_id1)
    $.ajax({
        url:"/alarm/bo?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async:false,
        error:function(err){
            console.log(err);
         },
         success:function(data) {
            //  console.log(data.data)

             alarmlist = data.data
             sensorcount = data.sensor
             placecount = data.place
             sensorgroupcount = data.sensorgroup
            console.log("sensorcount", sensorcount)
            console.log("sensorgroupcount", sensorgroupcount)
             

             for(let idx=0; idx<sensorcount.length; idx++){
                 
                if(sensorcount[idx].sensor_id == sensor_id1){
                    console.log("!!")
                    if (sensorcount[idx].alarm_detail =='1'){
                        $('#data').append( "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount+"</span>")
                    }else if (sensorcount[idx].alarm_detail =='2'){
                        $('#data').append( "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount+"</span>")
                    }else if (sensorcount[idx].alarm_detail =='3'){
                        $('#data').append( "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount+"</span>")
                    }
                    
                }
             }


             for(let idx=0; idx<sensorgroupcount.length; idx++){
                 
                if(sensorgroupcount[idx].sensorgroup_id == sensorgroup_id){
                    console.log("!!")
                    if (sensorgroupcount[idx].alarm_detail =='1'){
                        $('#data').append( "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count+"</span>")
                    }else if (sensorgroupcount[idx].alarm_detail =='2'){
                        $('#data').append( "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count+"</span>")
                    }else if (sensorgroupcount[idx].alarm_detail =='3'){
                        $('#data').append( "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count+"</span>")
                    }
                    
                }
             }

             
         }
     })


    $.ajax({
        url:"/sensor/leftmenu?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async:false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            //  console.log(json.data)
            console.log(sensorgroup_id, sensor_id1, sensorgroup_type)
             let leftmenu = json.data
             console.log(leftmenu)
             
             let place = []
             let sensorgroup = []
             let scatter_sensor_name = []

             let place_id;
             if(!sensorgroup_id){
                console.log("inin", sensor_id1)
                for(let i=0; i<leftmenu.length; i++){
                    if(leftmenu[i].sensor_id == sensor_id1){
                        sensorgroup_id = leftmenu[i].sensorgroup_id
                        place_id = leftmenu[i].place_id
                    }
                }
             }else{
                for(let i=0; i<leftmenu.length; i++){
                    if(leftmenu[i].sensorgroup_id == sensorgroup_id){
                        
                        place_id = leftmenu[i].place_id
                    }
                }
             }
             console.log(sensorgroup_id, place_id, sensor_id1)


            for(let i=0; i<leftmenu.length; i++){

                let sensortype = "";
                let nexturl = ""
                let allurl = ""
                if(leftmenu[i].sensorgroup_type == "0201"){sensortype = "(가로형)"; nexturl="/ws-02-2-1"; allurl="ws-02-1-1";}
                    else if(leftmenu[i].sensorgroup_type == "0202"){sensortype = "(세로형)"; nexturl="/ws-02-2-1"; allurl="ws-02-1-2";}
                    else if(leftmenu[i].sensorgroup_type == "0203"){sensortype = "(스캐터)"; nexturl="/ws-02-2-6"; allurl="ws-02-1-7";}
                    else if(leftmenu[i].sensorgroup_type == "0204"){sensortype = "(로드셀)"; nexturl="/ws-02-2-1"; allurl="ws-02-1-13";}
                    else if(leftmenu[i].sensorgroup_type == "0205"){sensortype = "(독립형)"; nexturl="/ws-02-2-1"; allurl="ws-02-1-8";}
                    else if(leftmenu[i].sensorgroup_type == "0206"){sensortype = "(noall)"; nexturl="/ws-02-2-1"; allurl="ws-02-1-8";}

                if(i == 0){

                    place.push(leftmenu[i].place_id)
                    sensorgroup.push(leftmenu[i].sensorgroup_id)

                    if(leftmenu[i].sensorgroup_type == "0203" && scatter_sensor_name.indexOf(leftmenu[i].sensor_display_name) == -1){
                    
                        scatter_sensor_name.push(leftmenu[i].sensor_display_name)

                        let leftmenutag = "<li class='' id='placename"+leftmenu[i].place_id+"'><a class='uk-accordion-title ft-a' href='#'>"+leftmenu[i].place_name
                        for(let idx = 0; idx<placecount.length; idx++){
                            if(placecount[idx].place_id == leftmenu[i].place_id){
                                if (placecount[idx].alarm_detail =='1'){
                                    leftmenutag += "<span class='uk-badge-yellow'>"+placecount[idx].place_count +"</span>"
                                }else if (placecount[idx].alarm_detail =='2'){
                                    leftmenutag += "<span class='uk-badge-orange'>"+placecount[idx].place_count +"</span>"
                                }else if (placecount[idx].alarm_detail =='3'){
                                    leftmenutag += "<span class='uk-badge-red'>"+placecount[idx].place_count +"</span>"
                                }
                                
                            }
                        }
                        leftmenutag += "</a>"
                        leftmenutag += "<div class='uk-accordion-content'>"
                        leftmenutag += "<div>"
                        leftmenutag += "<ul class='uk-nav-default uk-nav-parent-icon' uk-nav='multiple: true' id='place_id_"+leftmenu[i].place_id+"'>"
                        leftmenutag += "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                        leftmenutag += "<a href='#' class='' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"'>"+leftmenu[i].sensorgroup_name
                        for(let idx = 0; idx<sensorgroupcount.length; idx++){
                            if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                if (sensorgroupcount[idx].alarm_detail =='1'){
                                    leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                    leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                    leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }
                                
                            }
                        }
                        leftmenutag += "</a>"
                        leftmenutag += "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                        if(leftmenu[i].sensorgroup_type != "0206"){
                            leftmenutag += "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>All"

                            for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                    if (sensorgroupcount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }
                                    
                                }
                            }
                            
                            leftmenutag += "</a></li>"
                        }
                       
                        // if(nexturl == "/ws-02-1-2"){nexturl = "/ws-02-1-1"}

                        for(let j=0; j<leftmenu.length; j++){
                            if(leftmenu[i].sensor_display_name == leftmenu[j].sensor_display_name && leftmenu[i].sensor_type != leftmenu[j].sensor_type){
                                if(leftmenu[i].sensor_type =='x'){
                                    leftmenutag += "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[i].sensor_id+"&c2Vy="+leftmenu[j].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                    for(let idx = 0; idx<sensorcount.length; idx++){
                                        if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                            if (sensorcount[idx].alarm_detail =='1'){
                                                leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                            }else if (sensorcount[idx].alarm_detail =='2'){
                                                leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                            }else if (sensorcount[idx].alarm_detail =='3'){
                                                leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                            }
                                            
                                        }
                                    }
                                    leftmenutag += "</a></li>"
                                    leftmenutag += "</ul></div></div></li>"
                                    $('#leftmenulist').append(leftmenutag)
                                }else{
                                    leftmenutag += "<li><a id='chart"+leftmenu[j].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[i].sensor_id+"&c2Vy="+leftmenu[j].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                    for(let idx = 0; idx<sensorcount.length; idx++){
                                        if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                            if (sensorcount[idx].alarm_detail =='1'){
                                                leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                            }else if (sensorcount[idx].alarm_detail =='2'){
                                                leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                            }else if (sensorcount[idx].alarm_detail =='3'){
                                                leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                            }
                                            
                                        }
                                    }
                                    leftmenutag += "</a></li>"
                                    leftmenutag += "</ul></div></div></li>"
                                    $('#leftmenulist').append(leftmenutag)
                                }
                                
                            }
                        }

                        
                        // leftmenutag += "</ul></div></div></li>"
                    }else if(leftmenu[i].sensorgroup_type != "0203"){
                        
                        let leftmenutag = "<li id='placename"+leftmenu[i].place_id+"'><a class='uk-accordion-title ft-a' href='#'>"+leftmenu[i].place_name
                        for(let idx = 0; idx<placecount.length; idx++){
                            if(placecount[idx].place_id == leftmenu[i].place_id){
                                if (placecount[idx].alarm_detail =='1'){
                                    leftmenutag += "<span class='uk-badge-yellow'>"+placecount[idx].place_count +"</span>"
                                }else if (placecount[idx].alarm_detail =='2'){
                                    leftmenutag += "<span class='uk-badge-orange'>"+placecount[idx].place_count +"</span>"
                                }else if (placecount[idx].alarm_detail =='3'){
                                    leftmenutag += "<span class='uk-badge-red'>"+placecount[idx].place_count +"</span>"
                                }
                                
                            }
                        }
                        leftmenutag += "</a>"
                        leftmenutag += "<div class='uk-accordion-content '>"
                        leftmenutag += "<div>"
                        leftmenutag += "<ul class='uk-nav-default uk-nav-parent-icon ' uk-nav='multiple: true' id='place_id_"+leftmenu[i].place_id+"'>"
                        leftmenutag += "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                        leftmenutag += "<a href='#' class='' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"' >"+leftmenu[i].sensorgroup_name
                        for(let idx = 0; idx<sensorgroupcount.length; idx++){
                            if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                if (sensorgroupcount[idx].alarm_detail =='1'){
                                    leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                    leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                    leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                }
                                
                            }
                        }
                        leftmenutag += "</a>"
                        leftmenutag += "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                        if(leftmenu[i].sensorgroup_type != "0206"){
                            leftmenutag += "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"' >All"
                            for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                    if (sensorgroupcount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }
                                    
                                }
                            }
                            
                            leftmenutag += "</a></li>"
                        }
                        
                        if(nexturl == "/ws-02-1-2"){nexturl = "/ws-02-1-1"}

                        // for(let j=0; j<leftmenu.length; j++){
                        //     if(leftmenu[i].sensor_display_name == leftmenu[j].sensor_display_name){
                        //         leftmenutag += "<li><a href='"+nexturl+"?sensor_idx="+leftmenu[i].sensor_id+"?sensor_idy="+leftmenu[j].sensor_id+"&sensor_namey="+leftmenu[j].sensor_name+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                        //         $('#leftmenulist').append(leftmenutag)
                        //     }
                        // }

                        leftmenutag += "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2V="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                        for(let idx = 0; idx<sensorcount.length; idx++){
                            if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                if (sensorcount[idx].alarm_detail =='1'){
                                    leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                }else if (sensorcount[idx].alarm_detail =='2'){
                                    leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                }else if (sensorcount[idx].alarm_detail =='3'){
                                    leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                }
                                
                            }
                        }
                        leftmenutag += "</a></li>"
                        leftmenutag += "</ul></div></div></li>"

                        $('#leftmenulist').append(leftmenutag)
                    }

                    
                    

                    
                }else{
                
                    if(place.indexOf(leftmenu[i].place_id) == -1){
                        place.push(leftmenu[i].place_id)
                        sensorgroup.push(leftmenu[i].sensorgroup_id)
                    
                        if(leftmenu[i].sensorgroup_type == "0203" && scatter_sensor_name.indexOf(leftmenu[i].sensor_display_name) == -1){
                            scatter_sensor_name.push(leftmenu[i].sensor_display_name)
                        
                            let leftmenutag = "<li id='placename"+leftmenu[i].place_id+"'><a class='uk-accordion-title ft-a' href='#'>"+leftmenu[i].place_name
                            for(let idx = 0; idx<placecount.length; idx++){
                                if(placecount[idx].place_id == leftmenu[i].place_id){
                                    if (placecount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+placecount[idx].place_count +"</span>"
                                    }else if (placecount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+placecount[idx].place_count +"</span>"
                                    }else if (placecount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+placecount[idx].place_count +"</span>"
                                    }
                                    
                                }
                            }
                            leftmenutag += "</a>"

                            leftmenutag += "<div class='uk-accordion-content '>"
                            leftmenutag += "<div>"
                            leftmenutag += "<ul class='uk-nav-default uk-nav-parent-icon' uk-nav='multiple: true' id='place_id_"+leftmenu[i].place_id+"'>"
                            leftmenutag += "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                            leftmenutag += "<a href='#' class='' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"'>"+leftmenu[i].sensorgroup_name
                            for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                    if (sensorgroupcount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }
                                    
                                }
                            }
                            leftmenutag += "</a>"
                            leftmenutag += "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                            if(leftmenu[i].sensorgroup_type != "0206"){
                                leftmenutag += "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"' >All"
                                for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                    if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                        if (sensorgroupcount[idx].alarm_detail =='1'){
                                            leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                            leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                            leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }
                                        
                                    }
                                }
                                
                                leftmenutag += "</a></li>"
                            }
                            if(nexturl == "/ws-02-1-2"){nexturl = "/ws-02-1-1"}

                            for(let j=0; j<leftmenu.length; j++){
                                if(leftmenu[i].sensor_display_name == leftmenu[j].sensor_display_name  && leftmenu[i].sensor_type != leftmenu[j].sensor_type){
                                    if(leftmenu[i].sensor_type =='x'){
                                        leftmenutag += "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[i].sensor_id+"&c2Vy="+leftmenu[j].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                        for(let idx = 0; idx<sensorcount.length; idx++){
                                            if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                if (sensorcount[idx].alarm_detail =='1'){
                                                    leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                }else if (sensorcount[idx].alarm_detail =='2'){
                                                    leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                }else if (sensorcount[idx].alarm_detail =='3'){
                                                    leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                }
                                                
                                            }
                                        }
                                        leftmenutag += "</a></li>"
                                        leftmenutag += "</ul></div></div></li>"
                                        $('#leftmenulist').append(leftmenutag)
                                    }else{
                                        leftmenutag += "<li><a id='chart"+leftmenu[j].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[j].sensor_id+"&c2Vy="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                        for(let idx = 0; idx<sensorcount.length; idx++){
                                            if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                if (sensorcount[idx].alarm_detail =='1'){
                                                    leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                }else if (sensorcount[idx].alarm_detail =='2'){
                                                    leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                }else if (sensorcount[idx].alarm_detail =='3'){
                                                    leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                }
                                                
                                            }
                                        }
                                        leftmenutag += "</a></li>"
                                        leftmenutag += "</ul></div></div></li>"
                                        $('#leftmenulist').append(leftmenutag)
                                    }
                                    
                                }
                            }

                            // leftmenutag += "<li><a href='"+nexturl+"?sensor_id="+leftmenu[i].sensor_id+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                            // leftmenutag += "</ul></div></div></li>"

                            // $('#leftmenulist').append(leftmenutag)
                        }else if(leftmenu[i].sensorgroup_type != "0203"){
                        
                            let leftmenutag = "<li id='placename"+leftmenu[i].place_id+"'><a class='uk-accordion-title ft-a' href='#'>"+leftmenu[i].place_name

                            for(let idx = 0; idx<placecount.length; idx++){
                                if(placecount[idx].place_id == leftmenu[i].place_id){
                                    if (placecount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+placecount[idx].place_count +"</span>"
                                    }else if (placecount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+placecount[idx].place_count +"</span>"
                                    }else if (placecount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+placecount[idx].place_count +"</span>"
                                    }
                                    
                                }
                            }
                            leftmenutag += "</a>"

                            leftmenutag += "<div class='uk-accordion-content '>"
                            leftmenutag += "<div>"
                            leftmenutag += "<ul class='uk-nav-default uk-nav-parent-icon ' uk-nav='multiple: true' id='place_id_"+leftmenu[i].place_id+"'>"
                            leftmenutag += "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                            leftmenutag += "<a href='#' class='' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"'>"+leftmenu[i].sensorgroup_name
                            for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                    if (sensorgroupcount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                    }
                                    
                                }
                            }
                            leftmenutag += "</a>"

                            leftmenutag += "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                            if(leftmenu[i].sensorgroup_type != "0206"){
                                leftmenutag += "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"' >All"
                                for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                    if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                        if (sensorgroupcount[idx].alarm_detail =='1'){
                                            leftmenutag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                            leftmenutag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                            leftmenutag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }
                                        
                                    }
                                }
                                
                                leftmenutag += "</a></li>"
                            }
                            if(nexturl == "/ws-02-1-2"){nexturl = "/ws-02-1-1"}

                            leftmenutag += "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2V="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                            
                            for(let idx = 0; idx<sensorcount.length; idx++){
                                if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                    if (sensorcount[idx].alarm_detail =='1'){
                                        leftmenutag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                    }else if (sensorcount[idx].alarm_detail =='2'){
                                        leftmenutag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                    }else if (sensorcount[idx].alarm_detail =='3'){
                                        leftmenutag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                    }
                                    
                                }
                            }
                            leftmenutag += "</a></li>"
                            leftmenutag += "</ul></div></div></li>"

                            $('#leftmenulist').append(leftmenutag)
                        }


                    

                        
                    }else{

                        if(sensorgroup.indexOf(leftmenu[i].sensorgroup_id) == -1){
                            sensorgroup.push(leftmenu[i].sensorgroup_id)
                            // console.log(leftmenu[i].sensorgroup_id)
                        
                            if(leftmenu[i].sensorgroup_type == "0203" && scatter_sensor_name.indexOf(leftmenu[i].sensor_display_name) == -1){
                                scatter_sensor_name.push(leftmenu[i].sensor_display_name)
                            
                                let grouptag = "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                                grouptag +=  "<a href='#' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"'>"+leftmenu[i].sensorgroup_name
                                for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                    if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                        if (sensorgroupcount[idx].alarm_detail =='1'){
                                            grouptag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                            grouptag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                            grouptag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }
                                        
                                    }
                                }
                                grouptag += "</a>"
                                grouptag +=  "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                                if(leftmenu[i].sensorgroup_type != "0206"){
                                    grouptag +=  "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"' >All"
                            
                                    for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                        if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                            if (sensorgroupcount[idx].alarm_detail =='1'){
                                                grouptag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                                grouptag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                                grouptag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }
                                            
                                        }
                                    }
                                    
                                    grouptag += "</a></li>"
                                }
                                
                                for(let j=0; j<leftmenu.length; j++){
                                    if(leftmenu[i].sensor_display_name == leftmenu[j].sensor_display_name && leftmenu[i].sensor_type != leftmenu[j].sensor_type){
                                        if(leftmenu[i].sensor_type =='x'){
                                            grouptag += "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[i].sensor_id+"&c2Vy="+leftmenu[j].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                            for(let idx = 0; idx<sensorcount.length; idx++){
                                                if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                    if (sensorcount[idx].alarm_detail =='1'){
                                                        grouptag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='2'){
                                                        grouptag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='3'){
                                                        grouptag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }
                                                    
                                                }
                                            }
                                            grouptag += "</a></li>"
                                            grouptag += "</ul></div></div></li>"
                                            $('#place_id_'+leftmenu[i].place_id).append(grouptag)
                                        }else{
                                            grouptag += "<li><a id='chart"+leftmenu[j].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[j].sensor_id+"&c2Vy="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                            for(let idx = 0; idx<sensorcount.length; idx++){
                                                if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                    if (sensorcount[idx].alarm_detail =='1'){
                                                        grouptag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='2'){
                                                        grouptag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='3'){
                                                        grouptag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }
                                                    
                                                }
                                            }
                                            grouptag += "</a></li>"
                                            grouptag += "</ul></div></div></li>"
                                            $('#place_id_'+leftmenu[i].place_id).append(grouptag)
                                        }
                                        // grouptag += "<li><a href='"+nexturl+"?sensor_idx="+leftmenu[i].sensor_id+"?sensor_idy="+leftmenu[j].sensor_id+"&sensor_namey="+leftmenu[j].sensor_name+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                                        // grouptag += "</ul></div></div></li>"
                                        // $('#place_id_'+leftmenu[i].place_id).append(grouptag)
                                    }
                                }
                            
                                // grouptag +=  "<li><a href='"+nexturl+"?sensor_id="+leftmenu[i].sensor_id+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                                // leftmenutag += "<li><a href='"+nexturl+"?sensor_idx="+leftmenu[i].sensor_id+"?sensor_idy="+leftmenu[j].sensor_id+"&sensor_namey="+leftmenu[j].sensor_name+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                                // grouptag +="</ul>"
                                // grouptag +="</li>"

                                // $('#place_id_'+leftmenu[i].place_id).append(grouptag)

                            
                            }else if(leftmenu[i].sensorgroup_type != "0203"){
                                // console.log(leftmenu[i])
                                let grouptag = "<li class='uk-parent' id='lm_sensorgroupname_"+leftmenu[i].sensorgroup_id+"'>"
                                grouptag +=  "<a href='#' class='' id='lm_sensorgroupname"+leftmenu[i].sensorgroup_id+"'>"+leftmenu[i].sensorgroup_name
                                for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                    if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                        if (sensorgroupcount[idx].alarm_detail =='1'){
                                            grouptag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                            grouptag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                            grouptag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                        }
                                        
                                    }
                                }
                                grouptag += "</a>"
                                grouptag +=  "<ul class='uk-nav-sub ' id='sensorgroup_id_"+leftmenu[i].sensorgroup_id+"'>"
                                if(leftmenu[i].sensorgroup_type != "0206"){
                                    grouptag +=  "<li><a id='allchart"+leftmenu[i].sensorgroup_id+"' href='"+allurl+"?"+encodeURIComponent("cHJ="+leftmenu[i].project_id+"&aWQ="+leftmenu[i].sensorgroup_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"' >All"
                            
                                    for(let idx = 0; idx<sensorgroupcount.length; idx++){
                                        if(sensorgroupcount[idx].sensorgroup_id == leftmenu[i].sensorgroup_id){
                                            if (sensorgroupcount[idx].alarm_detail =='1'){
                                                grouptag += "<span class='uk-badge-yellow'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }else if (sensorgroupcount[idx].alarm_detail =='2'){
                                                grouptag += "<span class='uk-badge-orange'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }else if (sensorgroupcount[idx].alarm_detail =='3'){
                                                grouptag += "<span class='uk-badge-red'>"+sensorgroupcount[idx].sensorgroup_count +"</span>"
                                            }
                                            
                                        }
                                    }
                                    
                                    grouptag += "</a></li>"
                                }
                                grouptag +=  "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2V="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                for(let idx = 0; idx<sensorcount.length; idx++){
                                    if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                        if (sensorcount[idx].alarm_detail =='1'){
                                            grouptag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                        }else if (sensorcount[idx].alarm_detail =='2'){
                                            grouptag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                        }else if (sensorcount[idx].alarm_detail =='3'){
                                            grouptag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                        }
                                        
                                    }
                                }
                                grouptag +="</a></li>"
                                grouptag +="</ul>"
                                grouptag +="</li>"

                                $('#place_id_'+leftmenu[i].place_id).append(grouptag)
                            }

                            

                        }else{
                        
                            if(leftmenu[i].sensorgroup_type == "0203" && scatter_sensor_name.indexOf(leftmenu[i].sensor_display_name) == -1){
                            
                                scatter_sensor_name.push(leftmenu[i].sensor_display_name)

                                for(let j=0; j<leftmenu.length; j++){
                                    if(leftmenu[i].sensor_display_name == leftmenu[j].sensor_display_name && leftmenu[i].sensor_type != leftmenu[j].sensor_type){
                                        if(leftmenu[i].sensor_type =='x'){
                                            let sensortag = "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[i].sensor_id+"&c2Vy="+leftmenu[j].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                            for(let idx = 0; idx<sensorcount.length; idx++){
                                                if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                    if (sensorcount[idx].alarm_detail =='1'){
                                                        sensortag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='2'){
                                                        sensortag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='3'){
                                                        sensortag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }
                                                    
                                                }
                                            }
                                            
                                            sensortag += "</a></li>"
                                            sensortag += "</ul></div></div></li>"
                                            $('#sensorgroup_id_'+leftmenu[i].sensorgroup_id).append(sensortag)

                                        }else{
                                            let sensortag = "<li><a id='chart"+leftmenu[j].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2Vx="+leftmenu[j].sensor_id+"&c2Vy="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+leftmenu[i].sensor_display_name
                                            for(let idx = 0; idx<sensorcount.length; idx++){
                                                if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                                    if (sensorcount[idx].alarm_detail =='1'){
                                                        sensortag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='2'){
                                                        sensortag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }else if (sensorcount[idx].alarm_detail =='3'){
                                                        sensortag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                                    }
                                                    
                                                }
                                            }
                                            
                                            sensortag += "</a></li>"
                                            sensortag += "</ul></div></div></li>"
                                            $('#sensorgroup_id_'+leftmenu[i].sensorgroup_id).append(sensortag)
                                        }
                                        
                                    }
                                }
                                // let sensortag = "<li><a href='"+nexturl+"?sensor_id="+leftmenu[i].sensor_id+"&project_id="+leftmenu[i].project_id+"&sensorgroup_type="+leftmenu[i].sensorgroup_type+"'>"+leftmenu[i].sensor_display_name+"</a></li>"
                                // $('#sensorgroup_id_'+leftmenu[i].sensorgroup_id).append(sensortag)
                            }else if(leftmenu[i].sensorgroup_type != "0203"){
                                
                                let sensortag = "<li><a id='chart"+leftmenu[i].sensor_id+"' href='"+nexturl+"?"+encodeURIComponent("c2V="+leftmenu[i].sensor_id+"&cHJ="+leftmenu[i].project_id+"&Hlw="+leftmenu[i].sensorgroup_type)+"'>"+ leftmenu[i].sensor_display_name 
                                for(let idx = 0; idx<sensorcount.length; idx++){
                                    if(sensorcount[idx].sensor_id == leftmenu[i].sensor_id){
                                        if (sensorcount[idx].alarm_detail =='1'){
                                            sensortag += "<span class='uk-badge-yellow'>"+sensorcount[idx].sensorcount +"</span>"
                                        }else if (sensorcount[idx].alarm_detail =='2'){
                                            sensortag += "<span class='uk-badge-orange'>"+sensorcount[idx].sensorcount +"</span>"
                                        }else if (sensorcount[idx].alarm_detail =='3'){
                                            sensortag += "<span class='uk-badge-red'>"+sensorcount[idx].sensorcount +"</span>"
                                        }
                                        
                                    }
                                }
                                    
                                
                                sensortag +="</a></li>"
                                $('#sensorgroup_id_'+leftmenu[i].sensorgroup_id).append(sensortag)
                            }
                            
                        }
                    }
                }
            }

            
            //left menu for문 끝!
            console.log('placename'+place_id)
            $('#placename'+place_id).addClass('uk-open')
            $('#lm_sensorgroupname_'+sensorgroup_id).addClass('uk-open')
            $('#lm_sensorgroupname'+sensorgroup_id).addClass('ft-a')
            if(sensor_id1 ){
                $('#chart'+sensor_id1).addClass('ms-a')
            }else{
                $('#allchart'+sensorgroup_id).addClass('ms-a')
            }

             
 
           
         }
    })
})