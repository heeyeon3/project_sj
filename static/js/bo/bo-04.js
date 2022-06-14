let start_year = [];
let year_month = [];
let year_month_cost = [];
let companyProject;
let chart;
let project_create_date = [];

let costtabledata = [];
let click_pagenum = "";
let newdata = [];

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

            companyProject = data.data;

            let today = new Date()
            let todayYear = today.getFullYear()

         

            for(let i=0; i < companyProject.length; i++){

                if(companyProject[i].project_st_dt){
                    let project_start_year = companyProject[i].project_st_dt.substr(0,4)
                // console.log(i, companyProject[i].extention_st_dt)
                // console.log(companyProject[i].project_st_dt)

                if(start_year.indexOf(project_start_year) == -1){
                    start_year.push(project_start_year)
                }
                if(companyProject[i].extention_st_dt){
                    let extend_start_year = companyProject[i].extention_st_dt.substr(0,4)
                    if(start_year.indexOf(extend_start_year) == -1){
                        start_year.push(extend_start_year)
                    }
                }

                let project_year_month = companyProject[i].project_st_dt.substr(0,4) + "."+ companyProject[i].project_st_dt.substr(5,2)

                if(year_month.indexOf(project_year_month) == -1){
                    year_month.push(project_year_month)
                    year_month_cost.push(companyProject[i].project_cost)
                }else{
                    let idx = year_month.indexOf(project_year_month)
                    let current_cost = parseInt(year_month_cost[idx]) + parseInt(companyProject[i].project_cost)
                    year_month_cost[idx] = current_cost
                }

                if(companyProject[i].extention_id){
                    let extention_year_month = companyProject[i].project_st_dt.substr(0,4) + "."+ companyProject[i].extention_st_dt.substr(5,2)

                    if(year_month.indexOf(extention_year_month) == -1){
                        year_month.push(extention_year_month)
                        year_month_cost.push(companyProject[i].extention_cost)
                    }else{
                        let idx = year_month.indexOf(extention_year_month)
                        let current_cost = parseInt(year_month_cost[idx]) + parseInt(companyProject[i].extention_cost)
                        year_month_cost[idx] = current_cost
                    }
                }

                // project_create_date.indexOf(companyProject[i].create_date)
                }
            
                

                
                
            }
            // console.log(year_month)
            // console.log(year_month_cost)
            // console.log(start_year)

            // let test=['2022','2021','1990','2024']
            // test = test.sort((a, b) => b - a)
            // console.log(test)

            start_year = start_year.sort((a, b) => b - a) //내림차순 정렬
            console.log(start_year.length)
            for(let i=0; i<start_year.length; i++){
                $('#option_year').append( "<option>"+start_year[i]+"</option>")
            }

            //최신년도 그래프
            barchart(todayYear)
            
            // console.log(companyProject[0].project_st_dt.substr(0,4))

            let extend_id_list = [];
            let company_id_list = [];
            for(let i=0; i<companyProject.length; i++){
                console.log(companyProject[i])
                if(companyProject[i].project_st_dt){
                    if(company_id_list.indexOf(companyProject[i].project_id) == -1){
                        company_id_list.push(companyProject[i].project_id)
                        costtabledata.push({"create_date":companyProject[i].project_create_date, "start_day":companyProject[i].project_st_dt, "end_day":companyProject[i].project_ed_dt,"company_name":companyProject[i].company_name, "project_name":companyProject[i].project_name, "type":"new", "cost":companyProject[i].project_cost,"project_status":companyProject[i].project_status, "project_id":companyProject[i].project_id, "company_id": companyProject[i].company_id})
    
                        if(companyProject[i].extention_id){
                            extend_id_list.push(companyProject[i].extention_id)
                            costtabledata.push({"create_date":companyProject[i].extention_create_date, "start_day":companyProject[i].extention_st_dt, "end_day":companyProject[i].extention_ed_dt,"company_name":companyProject[i].company_name, "project_name":companyProject[i].project_name, "type":"add", "cost":companyProject[i].extention_cost,"project_status":companyProject[i].project_status, "project_id":companyProject[i].project_id, "company_id": companyProject[i].company_id})
                        }
                        
                    }else{
                        if(companyProject[i].extention_id){
                            extend_id_list.push(companyProject[i].extention_id)
                            costtabledata.push({"create_date":companyProject[i].extention_create_date, "start_day":companyProject[i].extention_st_dt, "end_day":companyProject[i].extention_ed_dt, "company_name":companyProject[i].company_name, "project_name":companyProject[i].project_name, "type":"add", "cost":companyProject[i].extention_cost,"project_status":companyProject[i].project_status, "project_id":companyProject[i].project_id, "company_id": companyProject[i].company_id})
                        }
                    }
                }
                

            }
            console.log(costtabledata)
            click_pagenum = 0
            costable(todayYear)
            $('#selectyear').text(todayYear + "년")
            // console.log(costtabledata)
        }
    })


    $('#option_year').change(function(){
        console.log("1")
        let test = $("option:selected", this).text(); 
        console.log(test)
        barchart(test)
        costable(test)
        // $(this).find("option:selected").text();

        $('#selectyear').text(test+"년")

    })

   
   
    
})

function barchart(year){
    console.log(year)

    // let year = year

    let yearmonth = []

    for(let i =1; i<13; i++ ){
        if(i < 10){
            yearmonth.push(year+".0"+i)
        }else{
            yearmonth.push(year+"."+i)
        }
        
    }
    console.log(yearmonth)
    let cost_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for(let i = 0; i < 12; i++){
        if(year_month.indexOf(yearmonth[i]) != -1){
            let idx = year_month.indexOf(yearmonth[i]) 
            cost_data[i] = year_month_cost[idx]
            console.log(year_month_cost[idx])
        }
    }
    
    console.log(cost_data)

    if(chart){
        chart.destroy()
    }

    // let labels = ['2021.01', '2021.02', '2021.03', '2021.04', '2021.05', '2021.06', '2021.07', '2021.08', '2021.09', '2021.10', '2021.11', '2021.12'];

    chart = new Chart('sales', {
        type: 'line',
        data: {
            labels: yearmonth,
            datasets: [{
                type: 'bar',
                label: 'Sales',
                data: cost_data,
                // data: [10000000, 12000000, 30000000, 50000000, 20000000, 12000000, 110000000, 13000000, 90000000, 140000000, 210000000, 120000000],
                backgroundColor: '#1e87f0',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#222',
                    }
                },
                x: {
                    grid: {
                        color: '#222',
                    }
                },

            },
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    padding: 10,
                    cornerRadius: 0,
                    bodySpacing: 4,
                    titleSpacing: 10,
                    multiKeyBackground: '#00000000',
                    displayColors: false,
                },
                legend: {
                    position: 'bottom',
                    align: 'start',
                    padding: 20,
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                    }
                }
            }
        }
    })
}


function costable(year){
    console.log(costtabledata)
    console.log(year)
   
    $('#tbl_tbody').empty()

    let graph_data = [];
    for(let i=0; i<costtabledata.length; i++){
        if (costtabledata[i].start_day.substr(0,4)==year){
            console.log("!!")
            graph_data.push(costtabledata[i])
        }
    }

    newdata = graph_data.sort((a,b) => {
        return new Date(b.create_date) - new Date(a.create_date)

    })

  

    
    console.log(newdata)
    

    for(let i =0; i< newdata.length; i++){

        let type = ""
        let status = ""
        let today = new Date()
        let endday = new Date(newdata[i].end_day)

        if(newdata[i].type == 'new'){
            type = "신규"
        }else{type = "연장"}

         
        let tabletag = "<tr data-state='done' id='row_"+i+"'>"
        tabletag += "<td>"+newdata[i].create_date+"</td>"
        tabletag += "<td><a href='/bo-03-1?"+encodeURIComponent("pZA="+newdata[i].company_id)+"'>"+newdata[i].company_name+"</a></td>"
        tabletag +=   "<td><a href='/bo-03-1-1?"+encodeURIComponent("pZA="+newdata[i].company_id)+"'>"+newdata[i].project_name+"</a></td>"
        tabletag +=   "<td>"+newdata[i].start_day.substr(0,10)+" ~ "+newdata[i].end_day.substr(0,10)+"</td>"
        tabletag +=  "<td>"+type+"</td>"
        tabletag +=  "<td>"+newdata[i].cost+"원</td>"

        if(newdata[i].project_status == 'N' && endday > today){
            tabletag +=  "<td class='uk-text-blue'>정상</td>"
        }else if(newdata[i].project_status == 'W' && endday > today){
            tabletag +=  "<td class='uk-text-yellow'>대기</td>"
        }else if(newdata[i].project_status == 'C' || endday < today){
            tabletag +=  "<td class='uk-text-red'>완료</td>"
        }

        
        tabletag += "</tr>"

        $('#tbl_tbody').append(tabletag)

        // $('#row_'+i).hide()

    }

    // pagenation()
    $("#data-list").DataTable({
        "order": [[ 0, "desc" ]],
        "displayLength": 10, 
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



function pagenation(){

    let tablelen = 3
    // console.log(tablelen)
  
    let datalen = costtabledata.length
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

    let tablelen = 3
  
    console.log(tablelen)

    let datalen = costtabledata.length

    let pagelen = Math.ceil(datalen/tablelen)

    console.log(datalen, datalen/tablelen, pagelen)

    console.log(tablelen*pagenum, parseInt(tablelen*pagenum) +parseInt(tablelen))

    let last = parseInt(tablelen*pagenum) + parseInt(tablelen)

    for(let i =0; i <costtabledata.length; i++){
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

function exceldown(){
    ////데이터 여러개
    $.ajax({
        url:"/project/cost/list",
        type:"post",
        data: JSON.stringify(newdata),
        contentType: "application/json",
        // processData : false,
        error:function(err){
            console.log(err);
         },
         success:function(json) {
            console.log("succes")

            window.location.href = json.url

          
                
        }
    })
}