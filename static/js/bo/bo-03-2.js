$(function(){
    
    
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;
    let type = urlParams.get('type')
    company_id = urlParams.get('pZA')
    console.log(type)
    console.log(company_id)

    if(type == 'add'){
        $('#btn_save').click(function(){
            console.log("btn_save click")

            let company_set_id = $("#company_set_id").val()
            let user_id = $("#user_id").val()
            let user_pwd = $("#user_pwd").val()
            let company_picname = $("#company_picname").val()
            let company_picnum = $("#company_picnum").val()
            let company_picemail = $("#company_picemail").val()

            let company_name = $("#company_name").val()
            let company_ceo = $("#company_ceo").val()
            let company_regnum = $("#company_regnum").val()
            let company_worktype = $("#company_worktype").val()
            let company_workcate = $("#company_workcate").val()
            let company_number = $("#company_number").val()
            let company_email = $("#company_email").val()
            let company_faxnum = $("#company_faxnum").val()
            let company_address = $("#company_address").val()
            // let company_image = $("#company_img").val()

            if(company_set_id.length == 0){
                alert("고객사를 입력해 주세요.")
                return;
            }else if(user_id.length == 0){
                alert("고객사 계정 ID를 입력해 주세요.")
                return;
            }else if(user_pwd.length == 0){
                alert("고객사 계정 비밀번호를 입력해 주세요.")
                return;
            }else if(company_name.length == 0){
                alert("상호를 입력해 주세요.")
                return;
            }else if(company_ceo.length == 0){
                alert("대표자를 입력해 주세요.")
                return;
            }else if(company_regnum.length == 0){
                alert("사업자등록번호를 입력해 주세요.")
                return;
            }else if(company_worktype.length == 0){
                alert("업태를 입력해 주세요.")
                return;
            }else if(company_workcate.length == 0){
                alert("종목을 입력해 주세요.")
                return;
            }else if(company_email.length == 0){
                alert("수신 이메일을 입력해 주세요.")
                return;
            }else if(company_number.length == 0){
                alert("대표번호를 입력해 주세요.")
                return;
            }else if(company_faxnum.length == 0){
                alert("팩스번호를 입력해 주세요.")
                return;
            }else if(company_address.length == 0){
                alert("주소를 입력해 주세요.")
                return;
            }else if(company_picname.length == 0){
                alert("이름을 입력해 주세요.")
                return;
            }else if(company_picnum.length == 0){
                alert("연락처를 입력해 주세요.")
                return;     
            }else if(company_picemail.length == 0){
                alert("이메일를 입력해 주세요.")
                return;
            }

    
            let form_data = new FormData($('#company_info_detail')[0]);
    
            form_data.append("company_set_id", $("#company_set_id").val())
            form_data.append("user_id", $("#user_id").val())
            form_data.append("user_pwd", $("#user_pwd").val())
            form_data.append("company_picname", $("#company_picname").val())
            form_data.append("company_picnum", $("#company_picnum").val())
            form_data.append("company_picemail", $("#company_picemail").val())
            // form_data.append("company_img", $("#company_img").val())
            // let company_img = document.querySelector("#company_img").files[0];
            // console.log(company_img)
          
            // form_data.append("company_img", company_img)


    
          
    
            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };
    
            $.ajax({
                url : "/company",
                data : form_data,
                type : "post",
                contentType : false,
                processData : false,
                error:function(){
                   alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                   console.log("succes")
                   alert(data.resultString);
                   window.location.href ="/bo-03"

               }
            });
    
            
        })

        $('#btn_cancle').click(function(){
            window.location.href ="/bo-03"
        })
        $('#locatop').attr("href", "/bo-03")
        
    }else if(type =='edit'){

        $("#user_id").attr("readonly" , true);
        $("#company_set_id").attr("readonly" , true);
 
        
        $.ajax({
            url:"company?company_id="+company_id,
            type:"get",
            contentType: false,
            processData : false,
            error:function(err){
                console.log(err);
             },
             success:function(json) {
                console.log("succes")
    
                let company_info = json.data[0]
                // let company_info = JSON.parse(json.data)
                console.log(company_info) 
    
                $('#company_set_id').val(company_info.company_set_id)
                $('#user_id').val(company_info.user_id)
                $('#company_name').val(company_info.company_name)
                $('#company_ceo').val(company_info.company_ceo)
                $('#company_regnum').val(company_info.company_regnum)
                $('#company_worktype').val(company_info.company_worktype)
                $('#company_workcate').val(company_info.company_workcate)
                $('#company_email').val(company_info.company_email)
                $('#company_number').val(company_info.company_number)
                $('#company_faxnum').val(company_info.company_faxnum)
                $('#company_address').val(company_info.company_address)
                $('#company_picname').val(company_info.company_picname)
                $('#company_picnum').val(company_info.company_picnum)
                $('#company_picemail').val(company_info.company_picemail)
                $('#user_pwd').val(company_info.user_pwd)

                // let compant_img = company_info.company_img
                // let companyname = compant_img.split('/')
                // console.log(companyname)
                // $('#filename').text(companyname[companyname.length-1])
                // $('#company_img').val(company_info.company_img)
    
               
                
                
                
            }
        })


        $('#btn_save').click(function(){
            console.log("btn_save edit click")

            let company_set_id = $("#company_set_id").val()
            let user_id = $("#user_id").val()
            let user_pwd = $("#user_pwd").val()
            let company_picname = $("#company_picname").val()
            let company_picnum = $("#company_picnum").val()
            let company_picemail = $("#company_picemail").val()

            let company_name = $("#company_name").val()
            let company_ceo = $("#company_ceo").val()
            let company_regnum = $("#company_regnum").val()
            let company_worktype = $("#company_worktype").val()
            let company_workcate = $("#company_workcate").val()
            let company_number = $("#company_number").val()
            let company_email = $("#company_email").val()
            let company_faxnum = $("#company_faxnum").val()
            let company_address = $("#company_address").val()
            // let company_image = $("#company_img").val()

            if(company_set_id.length == 0){
                alert("고객사를 입력해 주세요.")
                return;
            }else if(user_id.length == 0){
                alert("고객사 계정 ID를 입력해 주세요.")
                return;
            }else if(user_pwd.length == 0){
                alert("고객사 계정 비밀번호를 입력해 주세요.")
                return;
            }else if(company_name.length == 0){
                alert("상호를 입력해 주세요.")
                return;
            }else if(company_ceo.length == 0){
                alert("대표자를 입력해 주세요.")
                return;
            }else if(company_regnum.length == 0){
                alert("사업자등록번호를 입력해 주세요.")
                return;
            }else if(company_worktype.length == 0){
                alert("업태를 입력해 주세요.")
                return;
            }else if(company_workcate.length == 0){
                alert("종목을 입력해 주세요.")
                return;
            }else if(company_email.length == 0){
                alert("수신 이메일을 입력해 주세요.")
                return;
            }else if(company_number.length == 0){
                alert("대표번호를 입력해 주세요.")
                return;
            }else if(company_faxnum.length == 0){
                alert("팩스번호를 입력해 주세요.")
                return;
            }else if(company_address.length == 0){
                alert("주소를 입력해 주세요.")
                return;
            }else if(company_picname.length == 0){
                alert("이름을 입력해 주세요.")
                return;
            }else if(company_picnum.length == 0){
                alert("연락처를 입력해 주세요.")
                return;     
            }else if(company_picemail.length == 0){
                alert("이메일을 입력해 주세요.")
                return;
            }
    
            let form_data = new FormData($('#company_info_detail')[0]);
    
            form_data.append("company_set_id", $("#company_set_id").val())
            form_data.append("user_id", $("#user_id").val())
            form_data.append("user_pwd", $("#user_pwd").val())
            form_data.append("company_picname", $("#company_picname").val())
            form_data.append("company_picnum", $("#company_picnum").val())
            form_data.append("company_picemail", $("#company_picemail").val())
            form_data.append("company_id", company_id)
            // form_data.append("company_img", $("#company_img").val())
            // form_data.append("company_img", "/static/img/bg/project-bg.jpg")
    
            // let company_img = document.querySelector("#company_img").files[0];
            // console.log(company_img)
          
            // form_data.append("company_img", company_img)
    
            for (var pair of form_data.entries()){
                console.log(pair[0] + ":" + pair[1])
            };
    
            $.ajax({
                url : "/company" ,
                data : form_data,
                type : "put",
                contentType : false,
                processData : false,
                error:function(){
                   alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
                },
                success:function(data) {
                    console.log("SUCCESS SAVE!")
                    alert(data.resultString);
                    window.location.href ="/bo-03-1?"+encodeURIComponent("pZA="+company_id)
               }
            });


        })

        $('#btn_cancle').click(function(){
            console.log("???")
            window.location.href ="/bo-03-1?"+encodeURIComponent("pZA="+company_id)
        })

        $('#locatop').attr("href", "/bo-03-1?"+encodeURIComponent("pZA="+company_id))
    }


    
})