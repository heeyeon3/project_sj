let project_id ="";
let removedata = [];

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')
    console.log(project_id)

    $.ajax({
        url : '/notimanager/add?project_id='+project_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(){
            alert("실패");
        },
        success:function(data) {
            console.log(data.resultString)
            let notilist = data.data
            console.log(notilist)

            for(let i=0; i<notilist.length; i++){
                let tag = "<tr data-state='done'>"
                tag += "<td id='notimanager_"+i+"' notimanager_id='"+notilist[i].notimanager_id+"'>"+(notilist.length-i)+"</td>"
                tag +=  "<td id='name_"+i+"'>"+notilist[i].notimanager_name+"</td>"
                tag +=   "<td id='num_"+i+"'>"+notilist[i].notimanager_num+"</td>"
                if(notilist[i].notimanager_kakao == 'Y'){
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='kakao_"+i+"'></td>"
                }else{
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='kakao_"+i+"'></td>"
                }

                if(notilist[i].notimanager_lv1 == 'Y'){
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv1_"+i+"'></td>"
                }else{
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv1_"+i+"'></td>"
                }

                if(notilist[i].notimanager_lv2 == 'Y'){
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv2_"+i+"'></td>"
                }else{
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv2_"+i+"'></td>"
                }

                if(notilist[i].notimanager_lv3 == 'Y'){
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv3_"+i+"'></td>"
                }else{
                    tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv3_"+i+"'></td>"
                }
             
                tag +=   " <td>"
                tag +=         "<a href='#contact' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick=\"notiedit('"+notilist[i].notimanager_id+"','"+notilist[i].notimanager_name+"','"+notilist[i].notimanager_num+"',"+")\"></a>"
                tag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick=\"trashbtn('"+i+"')\" useyn='Y' id='trash_"+i+"'></a>     "
                tag +=     "</td>"
                tag +=  "</tr>"

                $('#tbltbody').append(tag)
    
            }

            
        }
    });

    $('#manageradd').click(function(){
        $('#savebtn').show()
        $('#editbtn').hide()
    })

    $('#savebtn').click(function(){

        let form_data = new FormData($('#notimanagermodal')[0])
        form_data.append("project_id", project_id)
        $.ajax({
            url : '/notimanager/add',
            type : "post",
            data: form_data,
            contentType : false,
            processData : false,
            error:function(){
                alert("실패");
            },
            success:function(data) {
                console.log(data.resultString)
                alert("추가되었습니다.")

                window.location.reload()
            }
        });
    })

    $('#toplocation').attr("href", "/ws-10?"+encodeURIComponent("cHJ="+project_id))
    
})

function notiedit(id, name, num){
    $('#savebtn').hide()
    $('#editbtn').show()
    console.log(id, name, num)

    $('#notimanager_name').val(name)
    $('#notimanager_num').val(num)

    $('#editbtn').click(function(){

        let notimanager_name = $('#notimanager_name').val()
        let notimanager_num = $('#notimanager_num').val()

        if(notimanager_name.length ==0){
            alert("이름을 입력해 주세요.")
            return;
        }else if(notimanager_name.length ==0){
            alert("전화번호 입력해 주세요.")
            return;
        }       
        let form_data = new FormData($('#notimanagermodal')[0])
        form_data.append("project_id", project_id)
        form_data.append("notimanager_id", id)
        $.ajax({
            url : '/notimanager/add',
            type : "put",
            data: form_data,
            contentType : false,
            processData : false,
            error:function(){
                alert("실패");
            },
            success:function(data) {
                console.log(data.resultString)
                alert("추가되었습니다.")
                window.location.reload()

    
            }
        });
    })

}

function canclebtn(){
    window.location.href='ws-10?'+encodeURIComponent("cHJ="+project_id)
}

function savebtn(){
    console.log("준구리망구리")

    tablelength = $('#notitable >tbody tr').length
    console.log(tablelength)

    let tabledata = []

    let kakaocheck ="";
    let lv1check ="";
    let lv2check ="";
    let lv3check ="";
    for(let i=0; i<tablelength; i++){
        let name = $('#name_'+i).text();
        let num = $('#num_'+i).text();
        let notimanager_id = $('#notimanager_'+i).attr('notimanager_id');

        let kakao = $('#kakao_'+i).is(':checked');
        if(kakao){kakaocheck='Y'}else{kakaocheck='N'}
        let lv1 = $('#lv1_'+i).is(':checked');
        if(lv1){lv1check='Y'}else{lv1check='N'}
        let lv2 = $('#lv2_'+i).is(':checked');
        if(lv2){lv2check='Y'}else{lv2check='N'}
        let lv3 = $('#lv3_'+i).is(':checked');
        if(lv3){lv3check='Y'}else{lv3check='N'}

        let useyn = $('#trash_'+i).attr("useyn")
    
        tabledata.push({'notimanager_id':notimanager_id,'notimanager_name':name,'notimanager_num':num,'notimanager_kakao':kakaocheck, 'notimanager_lv1': lv1check, 'notimanager_lv2': lv2check, 'notimanager_lv3':lv3check, "use_yn": useyn})
        

        

    }

    console.log("removedata", removedata)
    console.log("tabledata", tabledata)

    for(let i=0; i< removedata.length; i++){
        tabledata.push(removedata[i])
    }

    console.log(tabledata)


    $.ajax({
        url:"/notimanager/all",
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

function trashbtn(idx){

    console.log(idx)
    tablelength = $('#notitable >tbody tr').length
    console.log(tablelength)

    let useyn = $('#trash_'+idx).attr("useyn")
    console.log(useyn)
    $('#trash_'+idx).attr("useyn", 'N')
    console.log(useyn)

    // let kakao = $('#kakao_'+idx).is(':checked');
    // console.log(kakao)

    let tabledata = []

    let kakaocheck ="";
    let lv1check ="";
    let lv2check ="";
    let lv3check ="";
    for(let i=0; i<tablelength; i++){
        let name = $('#name_'+i).text();
        let num = $('#num_'+i).text();
        let notimanager_id = $('#notimanager_'+i).attr('notimanager_id');


        let kakao = $('#kakao_'+i).is(':checked');
        if(kakao){kakaocheck='Y'}else{kakaocheck='N'}
        let lv1 = $('#lv1_'+i).is(':checked');
        if(lv1){lv1check='Y'}else{lv1check='N'}
        let lv2 = $('#lv2_'+i).is(':checked');
        if(lv2){lv2check='Y'}else{lv2check='N'}
        let lv3 = $('#lv3_'+i).is(':checked');
        if(lv3){lv3check='Y'}else{lv3check='N'}

        let useyn = $('#trash_'+i).attr("useyn")
        if(i == idx){
            removedata.push({'notimanager_id':notimanager_id,'notimanager_name':name,'notimanager_num':num,'notimanager_kakao':kakaocheck, 'notimanager_lv1': lv1check, 'notimanager_lv2': lv2check, 'notimanager_lv3':lv3check, "use_yn": 'N'})
        }else{
            tabledata.push({'notimanager_id':notimanager_id,'notimanager_name':name,'notimanager_num':num,'notimanager_kakao':kakaocheck, 'notimanager_lv1': lv1check, 'notimanager_lv2': lv2check, 'notimanager_lv3':lv3check, "use_yn": useyn})
        }

        

    }

    

    console.log("tabledata", tabledata)
    console.log("tabledata", removedata)
    $('#tbltbody').empty()
    for(let i=0; i<tabledata.length; i++){

        if(tabledata[i].use_yn ='Y'){
            let tag = "<tr data-state='done'>"
            tag += "<td id='notimanager_"+i+"' notimanager_id='"+tabledata[i].notimanager_id+"'>"+(tabledata.length-i)+"</td>"
            tag +=  "<td id='name_"+i+"'>"+tabledata[i].notimanager_name+"</td>"
            tag +=   "<td id='num_"+i+"'>"+tabledata[i].notimanager_num+"</td>"
            if(tabledata[i].notimanager_kakao == 'Y'){
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='kakao_"+i+"'></td>"
            }else{
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='kakao_"+i+"'></td>"
            }
    
            if(tabledata[i].notimanager_lv1 == 'Y'){
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv1_"+i+"'></td>"
            }else{
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv1_"+i+"'></td>"
            }
    
            if(tabledata[i].notimanager_lv2 == 'Y'){
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv2_"+i+"'></td>"
            }else{
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv2_"+i+"'></td>"
            }
    
            if(tabledata[i].notimanager_lv3 == 'Y'){
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' checked id='lv3_"+i+"'></td>"
            }else{
                tag +=   "<td><input class='uk-checkbox' type='checkbox' name='' id='lv3_"+i+"'></td>"
            }
         
            tag +=   " <td>"
            tag +=         "<a href='#contact' class='uk-icon-button uk-margin-small-right' uk-icon='file-edit' uk-toggle onclick=\"notiedit('"+tabledata[i].notimanager_id+"','"+tabledata[i].notimanager_name+"','"+tabledata[i].notimanager_num+"',"+")\"></a>"
            tag +=         "<a class='uk-icon-button uk-margin-small-right' uk-icon='trash' onclick=\"trashbtn('"+i+"')\" useyn='Y' id='trash_"+i+"'></a>     "
            tag +=     "</td>"
            tag +=  "</tr>"
    
            $('#tbltbody').append(tag)
        }
        

    }



}