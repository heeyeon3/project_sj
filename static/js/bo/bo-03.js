$(function(){


    $.ajax({
        url : "/company/list",
        type : "post",
        // contentType : false,
        // processData : false,
        error:function(err){
            console.log(err)
            console.log("서버 응답이 없습니다. 서버 확인후 다시 시도해 주세요.");
        },
        success:function(data) {
            console.log("success")
            console.log(data)

            company_list = data.data

          
            for(let i = 0; i<company_list.length; i++){
             
                // let tdtag = "<tr data-state='done' id='row_"+i+"'>"
                // tdtag += "<td>"+(notice_list.length - i)+"</td>"
                // tdtag +=  "<td>"+notice_list[i].create_date+"</td>"
                // tdtag +=  "<td><a href='/ws-05-1?notice_id="+notice_list[i].notice_id+"&project_id="+project_id+"'>"+notice_list[i].notice_title+"</a></td>"
                // tdtag +=  "</tr>"
        

                // $('#tbl_tbody').append(tdtag)

                // $('row_'+i).hide()

                let tdtag = "<tr data-state='done'>"
                 tdtag +=     " <td>"+(i+1)+"</td>"
                 tdtag +=      "<td><a href='/bo-03-1?"+encodeURIComponent("pZA="+company_list[i].company_id)+"'>"+company_list[i].company_name+"</a></td>"
                 tdtag +=       "<td>"+company_list[i].company_set_id+"</td>"
                 tdtag +=       "<td>"+company_list[i].company_regnum+"</td>"
                 tdtag +=      "<td class='uk-text-center'>"+company_list[i].N+"</td>"
                 tdtag +=     " <td class='uk-text-center'>"+company_list[i].C+"</td>"
                 tdtag +=      "<td class='uk-text-center'>"+company_list[i].create_date+"</td>"
                 tdtag +=   "</tr>"

                 $('#tbl_tbody').append(tdtag)

            }

            // pagenation()
            $("#data-list").DataTable({
            "order": [[ 6, "desc" ]],
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
    //고객사 테이블
    // var dataList = $('#tbl_list').DataTable({
    //     "lengthChange": false,
    //     "destroy": true,
    //     "searching": false,
    //     "ordering": false,
    //     "info": false,
    //     // "autoWidth": true,
    //     // "processing": true,
    //     // "serverSide": true,
    //     "responsive": true,
    //     "pagingType": "simple_numbers",
    //     ajax : {
    //         "url": "/company/list",
    //         "type":"POST",
    //         "async" :"false"
    //     },
    //     "columns": [
    //             { data: "rownum"},
    //             {
    //                 data: null,

    //                 render: function(data, type, full, meta){
                      
    //                     return "<a href='/bo-03-1?company_id="+data.company_id+"'>"+data.company_name+"</a>";
    //                 }
    //             },
    //             // { data: "rownum"},
    //             // { data: "company_name"},
    //             { data: "company_set_id"},
    //             { data: "company_regnum"},
    //             { data: "rownum"},
    //             { data: "rownum"},
    //             // { data: null,

    //             //  render: function(data){ 
    //             //     if(data.project_description.length < 60){
    //             //         return data.project_description
    //             //     }else{
    //             //         return data.project_description.substr(0,60)+"..."
    //             //     }
                    
    //             //     }},
    //             { data: "create_date"}
               

    //     ],
    //     // "select": {
    //     //     'style': 'multi',
    //     //     // 'selector': 'td:first-child'    //only checkbox can select row
    //     // },
    //     "columnDefs": [
    //         // {
    //         //     'targets': 0,
    //         //     'checkboxes': {
    //         //          'selectRow': true
    //         //      }
    //         //  },
    //         {"className": "text-center", "targets": "_all"}
    //     ],
    //     "rowCallback": function( row, data, iDisplayIndex ) {


    //     },

        
        
    //     "paging": true,
    //     "pageLength": 5,
    //     "language": {
    //       "zeroRecords": "데이터가 존재하지 않습니다.",
    //        paginate: {
    //             previous: "<span uk-pagination-previous></span>",
    //             next: "<span uk-pagination-next></span>",
    //        }
            
        
    //     },
    //     dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
    //          "<'row'<'col-sm-12'tr>>" +
    //          "<'row'<'col-sm-12'p>>",
    // });

    // dataList.ajax.url("/company/list").load();

})