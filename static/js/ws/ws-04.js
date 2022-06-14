let project_id = ""
let servicecenter_list = [];
let click_pagenum = "";

$(function(){
    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    project_id = urlParams.get('cHJ')

    console.log(project_id)


    $.ajax({
        url : "servicecenter/list?project_id="+project_id,
        type : "get",
        contentType : false,
        processData : false,
        error:function(err){
            console.log(err)
           console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
          
           console.log("고객센터 리스트 조회 성공.")
           console.log(data.data)
           servicecenter_list = data.data


           for(let i = 0; i<servicecenter_list.length; i++){
             
            let tdtag = "<tr data-state='done' id='row_"+i+"'>"
            tdtag += "<td>"+(servicecenter_list.length - i)+"</td>"
            tdtag +=  "<td>"+servicecenter_list[i].create_date+"</td>"
            tdtag +=  "<td><a href='/ws-04-1?"+encodeURIComponent("srD="+servicecenter_list[i].servicecenter_id+"&cHJ="+project_id)+"'>"+servicecenter_list[i].servicecenter_name+"</a></td>"
            if(servicecenter_list[i].servicecenter_status == 0){
                tdtag+= "<td>처리중</td>"
            }else{tdtag+= "<td class='uk-text-blue'>완료</td>"}
          
            tdtag +=  "</tr>"
    

            $('#tbl_tbody').append(tdtag)

            // $('row_'+i).hide()

        }

        // pagenation()
        
        $("#data-list").DataTable({
            "order": [[ 0, "desc" ]],
            "displayLength": 50, 
            "info": false,
            "language": {
                "search": "",
                "show": "",
                "sLengthMenu": "<span style='position: absolute; top: 8px; left: 0; display:none;'>보기</span> _MENU_ <span style='position: absolute; top: 5px;'></span>",
                "emptyTable": "데이타가 없습니다.",
                "infoEmpty": "데이타가 없습니다.",
                "zeroRecords": "검색 결과가 없습니다."
            },
            "bDestroy": true
        });
       
       }
    });


})



function pagenation(){

    let tablelen = 10
    // console.log(tablelen)
  
    let datalen = servicecenter_list.length
    console.log("datalen", datalen)

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)


    $('#pagenation').empty()
    $('#pagenation').append("<li><a onclick='pagemove(0)'><span uk-pagination-previous></span></a></li>")
    for(let i =0; i<pagelen; i++){
        
        $('#pagenation').append("<li id='page_"+i+"'><a onclick='pagemove("+i+")'>"+(i+1)+"</a></li>")
       
        if(i == pagelen-1){
            $('#pagenation').append("<li><a onclick='pagemove("+i+")'><span uk-pagination-next></span></a></li>")
        }
        $('#page_'+i).hide()
        
    }
 

    if(click_pagenum == 0){
        pagemove(0)
    }

}


function pagemove(pagenum){
    console.log("pagemove")
    click_pagenum = pagenum

    let tablelen = 10
  
    console.log(tablelen)

    let datalen = servicecenter_list.length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

    for(let i =0; i <servicecenter_list.length; i++){
        if(tablelen*pagenum <= i && i < last ){
            // console.log("row", i)
            $('#row_'+i).show()
        }else{
            $('#row_'+i).hide()
        }
    }

    for(let i = 0; i <pagelen; i++){
        if(click_pagenum < 5){
            if(0 <= i && i <10){
                // console.log("1",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else if(click_pagenum > pagelen-6){
            
            if(pagelen-11 < i && i <= pagelen-1){
                // console.log("2",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }else{
            if(click_pagenum-5 < i && i <= click_pagenum+5){
                // console.log("3",i)
                $('#page_'+i).show()
            }else{$('#page_'+i).hide()}
        }

        if(i == click_pagenum){
            $('#page_'+i).addClass('uk-active')
        }else{
            $('#page_'+i).removeClass('uk-active')
        }

    }

    // pagenation()

}

function inquirybtn(){
    window.location.href='/ws-04-2?'+encodeURIComponent("cHJ="+project_id)
}