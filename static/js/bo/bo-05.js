$(function(){
    console.log("!!!")


    $.ajax({
        url : "/alarm/all",
        type : "get",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data.data)

            let alarmlist = data.data

            for(let i=0; i<alarmlist.length; i++){
                let tbodytag = "<tr data-state='done'>"
                tbodytag +=   "<td>"+(alarmlist.length - i)+"</td>"
                tbodytag +=    "<td>"+alarmlist[i].create_date+"</td>"
                tbodytag +=    "<td>"+alarmlist[i].company_name+"</td>"
                tbodytag +=   "<td>"+alarmlist[i].project_name+"</td>"
                tbodytag +=   "<td>"+alarmlist[i].sensor_display_name+"</td>"
                if(alarmlist[i].alarm_detail =='1'){
                    tbodytag +=   "<td><a href='/bo-05-1?"+encodeURIComponent("bTe="+alarmlist[i].alarm_id)+"'>Guideline Lv.1 초과</a></td>"
                }else if(alarmlist[i].alarm_detail =='2'){
                    tbodytag +=   "<td><a href='/bo-05-1?"+encodeURIComponent("bTe="+alarmlist[i].alarm_id)+"'>Guideline Lv.2 초과</a></td>"
                }else if(alarmlist[i].alarm_detail =='3'){
                    tbodytag +=   "<td><a href='/bo-05-1?"+encodeURIComponent("bTe="+alarmlist[i].alarm_id)+"'>Guideline Lv.3 초과</a></td>"
                }
                // alarm_status == 'Y' 일림 정상 상태 (가이드라인 초과 안되게 수정됨) alarm_status = 'N' :수정필요
                if(alarmlist[i].alarm_status =='N'){
                    tbodytag +=   "<td><span class='icon-guideline-b'></span></td>"
                }else if(alarmlist[i].alarm_status =='Y'){
                    tbodytag +=   "<td><span class='icon-guideline-d'></span></td>"
                }
                
                tbodytag +=   "</tr>"

                $('#tbl_tbody').append(tbodytag)
            }

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