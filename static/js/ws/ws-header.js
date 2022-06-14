let usergr = "";
$(function(){
    

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

 
    let project_id = urlParams.get('cHJ')

    console.log("project_id", project_id)

    let fomulatr = $('#formula_btn').parent()
    
   

    $('#top').attr('href',"ws-02?"+ encodeURIComponent("cHJ="+ project_id))

    $('#displacement_management').attr('href',"ws-03?"+encodeURIComponent("cHJ="+ project_id))
    $('#customer_service').attr('href',"ws-04?"+encodeURIComponent("cHJ="+ project_id) )
    $('#notice').attr('href',"ws-05?"+encodeURIComponent("cHJ="+ project_id))
    $('#project').attr('href',"ws-10?"+encodeURIComponent("cHJ="+ project_id) )
    $('#project_location').attr('href',"ws-10-1?"+encodeURIComponent("cHJ="+ project_id))
    $('#datarogger').attr('href',"ws-10-2?"+encodeURIComponent("cHJ="+ project_id))
    $('#site_drawing').attr('href',"ws-10-3?"+encodeURIComponent("cHJ="+ project_id))
    $('#installation_point').attr('href',"ws-10-4?"+encodeURIComponent("cHJ="+ project_id) )
    $('#sensor_group').attr('href',"ws-10-5?"+encodeURIComponent("cHJ="+ project_id) )
    $('#sensor_installation').attr('href',"ws-10-6?"+encodeURIComponent("cHJ="+ project_id))
    $('#displacement_installation').attr('href',"ws-10-7?"+encodeURIComponent("cHJ="+ project_id))
    $('#manager_notice').attr('href',"ws-10-8?"+encodeURIComponent("cHJ="+ project_id))
    $('#manager_account').attr('href',"ws-10-9?"+encodeURIComponent("cHJ="+ project_id))


    $.ajax({
        url:"project/current?project_id="+project_id,
        type:"get",
        contentType: false,
        processData : false,
        async:false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            // console.log("succes")
            // console.log(json)

            if(json.resultCode =='10'){
                alert("해당 프로젝트의 접근 권한이 없습니다.")
                window.location.href = "/"
            }else{
                let edit_data = json.data[0]
                if(edit_data){
                    $('#project_name').text(edit_data.project_name)
                    if(edit_data.project_address){$('#project_address').text(edit_data.project_address)}
                }
            }
            
        }
    })

    


    $.ajax({
        url : "current/user",
        type : "POST",
        async : false,
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            // console.log(data.data)
            let currentdata =JSON.parse(data.data)
            usergr = currentdata.user_grade
            console.log(usergr)

            // "ADMIN" 계정이 아닐 때
            if(usergr !='0101'){
                
                $('#displacement_management').hide()
          
         
                $('#project').hide()
                $('#project_location').hide()
                $('#datarogger').hide()
                $('#site_drawing').hide()
                $('#installation_point').hide()
                $('#sensor_group').hide()
                $('#sensor_installation').hide()
                $('#displacement_installation').hide()
                $('#manager_notice').hide()
                $('#manager_account').hide()
                $('#back_office').hide()

                $('#line01, #line02, #line03, #line04').hide()

                // 모니터링 계정

                if(usergr =='0103'){
                    $('#project_list').hide()
                }

                if(usergr =='0104'){
                    $('#line00, #line05').hide()

                    $('#alarmreset').hide()
                    $('#project_list').hide()
                    $('#customer_service').hide()
                    $('#notice').hide()
                }

                $('#originaldata').hide()
                $('#recorddata').hide()
                $('#Upload').hide()

                $('#fomulamodal').hide()
                $('#fomulasensorsave').hide() // 개인 fomula 공식 save btn
                $('#funcionmanage').hide() //로드셀 fomula 변위공식 관리
            }

           

            // admin 일때 
            if(usergr == '0101'){
                $('#floorplan_edit_btn').show();
                $('#gaugefactormodal').show();
                $('#originaldata').show();
                $('#recorddata').show();
                $('#Upload').show();
                $('#initaildate_btn').show();
                $('#guideline_btn').show();
                $('#formula_btn').show()
                $('#fomulasensorsave').show()
                $('#fomulali').show()
            } 

            // 고객사일때
            if(usergr == '0102'){
                $('#gaugefactormodal').show()
                $('#guideline_btn').show();
                $('#formula_btn').show()
                $('#fomulasensorsave').show()
                $('#fomulali').show()
            } 

            // 사이트 관리자일때
            if(usergr == '0103'){
                $('#gaugefactormodal').show()
                $('#guideline_btn').show();
                
            } 

            // 모니터링 계정
            if(usergr == '0104'){
                $('#fomula').hide()
                $('#formula_btn').hide()
            }

        }
    })



    $('#alarmresetbtn').click(function(){
        console.log("!!!!")


        $.ajax({
            url : "/alarm/bo",
            type : "put",
            async : false,
            data : {
          
                'project_id':project_id,
               
            },
            // contentType : false,
            // processData : false,
            error:function(err){
                console.log(err)
               console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
            },
            success:function(data) {
               
                alert("센서 오류 알림을 초기화 처리 되었습니다.")
                window.location.reload()
            }
        })
    })

    
})