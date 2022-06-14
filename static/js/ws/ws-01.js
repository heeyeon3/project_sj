let usergr = ""

$(function(){

    // $.ajax({
    //     url : "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=Eq6Jwlawb5k2crN6QtO7WMCep3AkyFYNCHC%2FtyJ7JSY2drD8vRIJ3m6bfVPOg1tmn%2FyuvKopW1vteBA8%2Bxxr5g%3D%3D&numOfRows=10&pageNo=1&base_date=20220401&base_time=0630&nx=55&ny=127",
    //     type : "get",
    //     // contentType : false,
    //     // processData : false,
    //     error:function(err){
    //         console.log(err)
    //        console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
    //     },
    //     success:function(data) {
            
    //         let currentdata =JSON.parse(data.data)
    //         usergr = currentdata.user_grade
         

    //     }

    //     // http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=Eq6Jwlawb5k2crN6QtO7WMCep3AkyFYNCHC%2FtyJ7JSY2drD8vRIJ3m6bfVPOg1tmn%2FyuvKopW1vteBA8%2Bxxr5g%3D%3D&numOfRows=10&pageNo=10&base_date=20220401&base_time=0630&nx=55&ny=127

    // })



    $.ajax({
        url : "current/user",
        type : "POST",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            
            let currentdata =JSON.parse(data.data)
            usergr = currentdata.user_grade
         

        }
    })

   

    
  
    $.ajax({
        url: "/project/list/ws",
        type:"get",
        contentType: false,
        processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(data) {
            console.log("succes")

            let project = data.data
            console.log(project)

            let projectidlist = []
            
            if(usergr!='0101'){
                $('#topcompany').text(project[0].company_name)
            }

            



            for(let i=0; i<project.length; i++){
                let project_list = "";
                
                if(projectidlist.indexOf(project[i].project_id) == -1){
                    projectidlist.push(project[i].project_id)
                    let today = new Date();
                    let lastday = "";
                    if(project[i].extention_id){lastday = project[i].extention_ed_dt}else{lastday = project[i].project_ed_dt}
                    console.log(lastday)

                    let endday = new Date(parseInt(lastday.substr(0,4)), parseInt(lastday.substr(5,2))-1, parseInt(lastday.substr(8,2)))
                    console.log(endday)
                   if(today < endday && project[i].project_status =='N'){
                       console.log("안끝남")

                       project_list = "<div class='prj-list'>"
                        if(project[i].project_img ){
                            project_list+= "<div class='prj-bg' style='background: linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.0)), url("+project[i].project_img+") no-repeat center center/cover; filter: grayscale(0%);'>"
                        }else{
                            project_list+= "<div class='prj-bg' style='background: linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.0)), url(/static/img/bg/project-bg.jpg) no-repeat center center/cover; filter: grayscale(0%);'>"
                        }
                        
                        project_list+="<div><h2>"+project[i].project_name+"</h2>"
                        project_list+="<p>"+ project[i].project_st_dt + "~" + lastday+"</p>"
                        project_list+="<button class='uk-button uk-button-primary' onClick=location.href="+"'ws-00?"+encodeURIComponent("cHJ="+project[i].project_id)+"'"+">Project</button>"
                        project_list+="</div></div></div>"
                    }else{
                        console.log("끝")

                        project_list = "<div class='prj-list'>"
                        if(project[i].project_img ){
                                
                            project_list+= "<div class='prj-bg' style='background: linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.0)), url("+project[i].project_img+") no-repeat center center/cover; filter: grayscale(100%);'>"
                        }else{
                            project_list+= "<div class='prj-bg' style='background: linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.0)), url(/static/img/bg/project-bg.jpg) no-repeat center center/cover; filter: grayscale(100%);'>"
                        }
                        
                        project_list+="<div><h2>"+project[i].project_name+"</h2>"
                        project_list+="<p>"+ project[i].project_st_dt + "~" + lastday+"</p>"
                        project_list+="<button class='uk-button uk-button-primary' disabled uk-tooltip='완료된 프로젝트입니다.'>Project</button>"
                        project_list+="</div></div></div>"
                    }

                }
            

                $('#project_list').append(project_list)

            }
      
            
        }
    })

})