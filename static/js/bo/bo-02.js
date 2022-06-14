$(function(){

    $('#test').text(5)
    $.ajax({
        url : "/project/list?company_id=0",
        type : "get",
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log(data.data)

            let companyProject = data.data;

            let companyList = []
            let projectList = []

            let current_company_id = "";
            let current_project_id = "";

            let end_project_count = 0;
            let ing_project_count = 0;
            let endexpect_project_count = 0;


            let project_total_cost = 0;
            console.log(companyProject.length)
            for(let i = 0; i <companyProject.length; i++){

                current_company_id = companyProject[i].company_id
                
                if(companyList.indexOf(companyProject[i].company_id) == -1){

                    
                    companyList.push(companyProject[i].company_id)

                    

                    let projectprofile = "<div class='uk-card uk-card-secondary uk-card-hover uk-card-body uk-light bx-4by4'>"
                    projectprofile +=                 " <div>"
                    projectprofile +=                       "<h3 class='uk-card-title uk-margin-remove-bottom'><a href='/bo-03-1?"+encodeURIComponent("pZA="+companyProject[i].company_id)+"'>"+companyProject[i].company_name+"</a></h3>"
                    projectprofile +=                        "<p class='uk-margin-remove-top'><a href='/' target='_blank'>"+companyProject[i].company_set_id+"</a></p>"
                    projectprofile +=                    "</div>"
                    projectprofile +=                    "<div class='uk-column-1-3 uk-column-divider'>"
                    projectprofile +=                        "<div class='uk-text-center'>"
                    projectprofile +=                           " <h1 class='uk-text-center ft-w-l'><a href='bo-03-1-1?"+encodeURIComponent("pZA="+companyProject[i].company_id)+"' class='uk-text-yellow' id='endexpect_"+companyProject[i].company_id+"'>0</a></h1>"
                    projectprofile +=                         " <span class='uk-text-meta'>계약만료 예정</span>"
                    projectprofile +=                      "</div>"
                    projectprofile +=                      " <div class='uk-text-center'>"
                    projectprofile +=                          "<h1 class='uk-text-center ft-w-l'><a href='/' class='uk-text-blue' target='_blank' id='ing_"+companyProject[i].company_id+"'>0</a></h1>"
                    projectprofile +=                          "<span class='uk-text-meta'>진행중인 프로젝트</span>"
                    projectprofile +=                    " </div>"
                    projectprofile +=                    " <div class='uk-text-center'>"
                    projectprofile +=                          "<h1 class='uk-text-center ft-w-l'><a href='/' class='uk-text-red' target='_blank' id='end_"+companyProject[i].company_id+"'>0</a></h1>"
                    projectprofile +=                          "<span class='uk-text-meta'>완료된 프로젝트</span>"
                    projectprofile +=                      "</div>"
                    projectprofile +=                  "</div>"
                    projectprofile +=                 " <div class='uk-text-right uk-margin-medium-top'>"
                    projectprofile +=                     " <p class='uk-text-meta uk-margin-remove-bottom'>누적매출</p>"
                    projectprofile +=                       "<h3 class='mg-t-10' id='cost_"+companyProject[i].company_id+"'>0원</h3>"
                    projectprofile +=  "                 </div>"
                    projectprofile +=               "</div>"


                    $('#projectProfile').append(projectprofile)


                    
                }

                console.log(companyProject[i].project_id)
                console.log("projectList", projectList)

                if(projectList.indexOf(companyProject[i].project_id) == -1){
                    projectList.push(companyProject[i].project_id)
                    console.log(companyProject[i].project_id)
                    // console.log(companyProject[i].company_name,companyProject[i].project_id, current_company_id)

                    let cost = $('#cost_'+ current_company_id).text()
                    console.log("CHECK!!", cost.substr(0,cost.length-1), companyProject[i].project_cost)

                    if(companyProject[i].project_cost != null){
                        let current_cost = parseInt(cost.substr(0,cost.length-1))+parseInt(companyProject[i].project_cost)
                        console.log("current_cost", current_cost, current_company_id)
                        $('#cost_'+ current_company_id).text(current_cost + "원")
                        console.log("current_cost", $('#cost_'+ current_company_id).text())
                    }
                    

                    let current_end_day = ""
                    if(companyProject[i].extention_id){
                        current_end_day = companyProject[i].extention_ed_dt
                    }else if(companyProject[i].project_id){
                        
                        current_end_day = companyProject[i].project_ed_dt
                    }
                    

                    if(current_end_day.length != 0 ){
                        projectList.push(companyProject[i].project_id)
                        let lastdate = new Date(parseInt(current_end_day.substr(0,4)), parseInt(current_end_day.substr(5,2))-1, parseInt(current_end_day.substr(8,2)))
    
                        var now = new Date();
                        var oneMonthAgo = new Date(now.setMonth(now.getMonth() + 1));
                        now = new Date();

                        if( oneMonthAgo > lastdate &&  now < lastdate){
                            console.log("계약만료 예정" ,companyProject[i].company_name)
                            let endexpect_id = $("#endexpect_"+current_company_id).text()
                            $("#endexpect_"+current_company_id).text(parseInt(endexpect_id)+1)
                            endexpect_project_count += 1;
                        }else if(now> lastdate){
                            console.log("계약만료", companyProject[i].company_name, now, oneMonthAgo, lastdate)
                            end_project_count += 1;
                            let end_id = $("#end_"+current_company_id).text()
                            $("#end_"+current_company_id).text(parseInt(end_id)+1)
                        }else if(oneMonthAgo < lastdate){
                            console.log("진행중인 프로젝트", companyProject[i].company_name)
                            ing_project_count += 1;
                            let ing_id = $("#ing_"+current_company_id).text()
                            $("#ing_"+current_company_id).text(parseInt(ing_id)+1)
                        }
                    }

                    // let current_end_day = ""
                    if(companyProject[i].extention_id){
                        let cost = $('#cost_'+ current_company_id).text()
                        console.log("CHECK!!", cost.substr(0,cost.length-1), companyProject[i].project_cost, current_company_id)

                        let current_cost = parseInt(cost.substr(0,cost.length-1))+parseInt(companyProject[i].extention_cost)
                        console.log("current_cost", current_cost, current_company_id)
                        $('#cost_'+ current_company_id).text(current_cost + "원")


                        // current_end_day = companyProject[i].extention_ed_dt
                    }
                    // else if(companyProject[i].project_id){
                    //     projectList.push(companyProject[i].project_id)
                    //     current_end_day = companyProject[i].project_ed_dt
                    // }

                    
                    // if(current_end_day.length != 0 ){
                    //     let lastdate = new Date(parseInt(current_end_day.substr(0,4)), parseInt(current_end_day.substr(5,2))-1, parseInt(current_end_day.substr(8,2)))
    
                    //     var now = new Date();
                    //     var oneMonthAgo = new Date(now.setMonth(now.getMonth() + 1));
                    //     now = new Date();

                    //     if( oneMonthAgo > lastdate &&  now < lastdate){
                    //         console.log("계약만료 예쩡" ,companyProject[i].company_name)
                    //         let endexpect_id = $("#endexpect_"+current_company_id).text()
                    //         $("#endexpect_"+current_company_id).text(parseInt(endexpect_id)+1)
                    //         endexpect_project_count += 1;
                    //     }else if(now> lastdate){
                    //         console.log("계약만료", companyProject[i].company_name, now, oneMonthAgo, lastdate)
                    //         end_project_count += 1;
                    //         let end_id = $("#end_"+current_company_id).text()
                    //         $("#end_"+current_company_id).text(parseInt(end_id)+1)
                    //     }else if(oneMonthAgo < lastdate){
                    //         console.log("진행중인 프로젝트", companyProject[i].company_name)
                    //         ing_project_count += 1;
                    //         let ing_id = $("#ing_"+current_company_id).text()
                    //         $("#ing_"+current_company_id).text(parseInt(ing_id)+1)
                    //     }
                    // }

                 
                    
                } else {
                    let cost = $('#cost_'+ current_company_id).text()
                    console.log(cost, current_company_id)
                    console.log("CHECK!!", cost.substr(0,cost.length-1), companyProject[i].project_cost, current_company_id)
                    if(companyProject[i].extention_id){
                        console.log(cost, "!!!!!!")
                        let current_cost = parseInt(cost.substr(0,cost.length-1))+parseInt(companyProject[i].extention_cost)
                        console.log("current_cost", current_cost, current_company_id)
                        $('#cost_'+ current_company_id).text(current_cost + "원")
                    }

                }

                // if(companyProject[i].extention_id){
                //     let cost = $('#cost_'+ current_company_id).text()
                //     console.log(cost.substr(0,cost.length-1), companyProject[i].extention_cost, "연장")
                //     let current_cost = parseInt(cost.substr(0,cost.length-1))+parseInt(companyProject[i].extention_cost)
                //     $('#cost_'+ current_company_id).text(current_cost + "원")
                // }else{
                    
                // }
                // project_total_cost += parseInt(companyProject[i].project_cost)
                // console.log(project_total_cost)


                
            }

            var now = new Date();	// 현재 날짜 및 시간
            console.log("현재 : ", now);
            var oneMonthAgo = new Date(now.setMonth(now.getMonth() + 1));	// 한달 전
            console.log("한달 전 : ", oneMonthAgo);
        }
    })
})