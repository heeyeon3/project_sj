let notice_list = []
let click_pagenum = "";

$(function(){
    $.ajax({
        url : "/notice/list",
        type : "get",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            alert("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data)

            notice_list = data.data

          
            for(let i = 0; i<notice_list.length; i++){
             
                let tdtag = "<tr data-state='done' id='row_"+i+"'>"
                tdtag += "<td>"+(notice_list.length - i)+"</td>"
                tdtag +=  "<td>"+notice_list[i].create_date+"</td>"
                tdtag +=  "<td><a href='/bo-07-1?"+encodeURIComponent("Acd="+notice_list[i].notice_id)+"'>"+notice_list[i].notice_title+"</a></td>"
                tdtag +=  "</tr>"
        

                $('#tbl_tbody').append(tdtag)

                // $('row_'+i).hide()

            }

            // pagenation()

            $("#data-list").DataTable({
                "order": [[ 1, "desc" ]],
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

    })
})




function pagenation(){

    let tablelen = 10
    // console.log(tablelen)
  
    let datalen = notice_list.length
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

    let datalen = notice_list.length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

    for(let i =0; i <notice_list.length; i++){
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