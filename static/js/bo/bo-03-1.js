let company_id

$(function(){

    var url = new URL(decodeURIComponent(window.location.href));
    const urlParams = url.searchParams;

    company_id = urlParams.get('pZA')
    console.log(company_id)

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

            $('#create_date').text(company_info.create_date)
            $('#company_name').text(company_info.company_name)
            $('#company_ceo').text(company_info.company_ceo)
            $('#company_regnum').text(company_info.company_regnum)
            $('#company_worktype').text(company_info.company_worktype)
            $('#company_workcate').text(company_info.company_workcate)
            $('#company_email').text(company_info.company_email)
            $('#company_number').text(company_info.company_number)
            $('#company_faxnum').text(company_info.company_faxnum)
            $('#company_address').text(company_info.company_address)
            $('#company_picname').text(company_info.company_picname)
            $('#company_picnum').text(company_info.company_picnum)
            $('#company_picemail').text(company_info.company_picemail)
            // if(company_info.company_img){
            //     $('#company_img').text(company_info.company_img)

            // }
            
            $("#top_name").prepend("<h4>"+company_info.company_name+"<span class='title-id'><a href='/' target='_blank' >"+company_info.company_set_id+"</a></span></h4>")
            
            $('#customer_info_location').append("<a href='/bo-03-1?"+encodeURIComponent("pZA="+company_info.company_id)+"'>Customer Info</a>")
            $('#project_location').append("<a href='/bo-03-1-1?"+encodeURIComponent("pZA="+company_info.company_id)+"'>Project</a>")
            
            
            
        }
    })

    
})


function edit_comapny(){
    console.log(encodeURIComponent('dHl=edit'))
    window.location.href = 'bo-03-2?'+encodeURIComponent('type=edit&pZA='+company_id)

}