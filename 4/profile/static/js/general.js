var uri; 
var funcLaunchConverter = function(){
	$.get($(this).attr("href"),function(data){
		$(".dlg").html(data);
		$(".dlg").attr("title","Currency converter");
		$(".dlg").dialog({modal: true});
	})
	return false;
}
var transferItems = function(){
	var hid = $(this).attr("id");
	var id= 0;	
	if (hid.indexOf("l2rBox") == 0){//left to right command
		id = hid.replace("l2rBox","");	
		$("."+hid+" > option").each(function(){
			if ($(this).attr("selected")){				
				var option = $(this).detach();
				$("."+hid.replace("l2r","r2l")).append(option);				
			}			
		});
	}
	else{
		id = hid.replace("r2lBox","");	//right to left command
		$("."+hid+" > option").each(function(){
			if ($(this).attr("selected"))	{
				var option = $(this).detach();
				$("."+hid.replace("r2l","l2r")).append(option);				
			}
		});
	}	
	if (id > 0){
		$(".progressDlg").dialog({modal: true, title:"Loading...",width: 200, height: 100, closeOnEscape: false,    open: function(event, ui) { $(".ui-dialog-titlebar-close").hide();}});
		var ctypes = "";
		$(".r2lBox"+id+" > option").each(function(){
			ctypes += ","+$(this).attr("value");
		});
		if (ctypes.length > 1) ctypes = ctypes.substring(1);
		$.post(uri,{"ctypes":ctypes},function(data){		
			var start = data.indexOf("<!--form-->")+"<!--form-->".length;
			var end = data.lastIndexOf("<!--form-->")
			data = data.substring(start,end);
			var delRows = false;
			$("table.ctypes-table > tbody > tr").each(function(){
				if (delRows) $(this).remove();
				if (!delRows && ($(this).attr("class") == "results")) delRows = true;
			});
			$("table.ctypes-table > tbody").append(data);
			$(".progressDlg").dialog('close');
		});
	}
	return false;
}
function collectFormValues(formSelector){
    var postVars={};
    $(formSelector).find("input,textarea,select").each(function () {
        switch ($(this).attr("type")){
			case 'checkbox':
				postVars[$(this).attr("name")] = (postVars[$(this).attr("name")] == null || postVars[$(this).attr("name")] == '') ? $(this).attr("value") : postVars[$(this).attr("name")]+','+$(this).attr("value");
				break;
			case 'radio':			
				if ($(this).attr("checked")){
					postVars[$(this).attr("name")] = $(this).val();
				}
				break;
			default:
				postVars[$(this).attr("name")] = $(this).val();
		}
    });
    return postVars;
}

var schoolMainContactFormCallback = function(data){
	if (data == "1") 
		window.location.reload(false);
	else 
		$("div#key_school_data").html(data);
}

var schoolRatingSubmitCallback = function(data){
		window.location.reload(false);
	
}
//change coordinates of right panel in registration form
$(function(){
    $(".formField").click(function() {
        moveRightPanel(this);
    })
});
$(function(){
    $(".formField input").click(function() {
        moveRightPanel(this);
    })
});
function moveRightPanel(coordinateEl) {
    var rightPanelPosition = $(coordinateEl).position();
    $("#rightPanel").animate({top:rightPanelPosition.top - 120}, 1000); 
    $("#rightPanelBox").animate({ height: rightPanelPosition.top + 800 });
 
}

$(document).ready(function(){
	

	uri = document.location.href;
	uri = uri.substring(uri.indexOf("/edit/"))+"_refresh";
	$("#school-info-edit > a").click(function(){
		$.get($(this).attr("href"),function (data){
			$("div#key_school_data").html(data);
		});
		return false;
	});
	$("input.submit-action").live("click",function(){
		var postData = collectFormValues(".schoolMainContactForm");
		$.ajax({async:true,url:"/edit"+$("#school-info-edit > a").attr("href")+"/maincontact",data:postData,success:schoolMainContactFormCallback,type:"POST"});
		return false;
	});
	if ($("input.dte").length > 0)$("input.dte").datepicker({dateFormat:"dd/mm/yy"});
	$("img.dtePicker").click(function(){
		var id = $(this).attr("class").replace("dtePicker ","");
		$("#"+id).datepicker("show");
	});
	
	$("a.rate-school").click(function(){
		var uri = $(this).attr("href");
		$.get(uri,{"rnd":Math.floor(Math.random()*1000)},function (data){			
			if (data["status"] == null)
				$("#school-rate-content").html(data);
			else 
				window.location.href = "/user/logon?from="+uri.replace("/rate/","/");
		});
		return false;
	});
	$("input.submit-rating").live("click",function(){
		var postData = collectFormValues(".school-ratings-form");
		$.ajax({async:true,url:$(".school-ratings-form").attr("action"),data:postData,success:schoolRatingSubmitCallback,type:"POST"});
		return false;
	});
	$("div.rate-manager > a").live("click",function(){
		//on click
		var rating = $(this).attr("id").replace("star","");
		var holder = $(this).parents("div.rate-manager");
		$(holder).find("a").toggleClass("star-on","star-off");
		$(holder).find("a").each(function(){
			//console.debug(rating);
			if ($(this).attr("id").replace("star","") <= rating){
				$(this).removeClass("star-off");
				$(this).addClass("star-on");
			}
			else{
				$(this).removeClass("star-on");
				$(this).addClass("star-off");
			}
		});
		$(holder).find("input[type='hidden']").attr("value",rating);
	});
	$("a.forexFrame").live("click",funcLaunchConverter);
	$("input.l2rBox").live("click",transferItems);
	$("input.r2lBox").live("click",transferItems);
	$("a.spp-status").click(function(){
		var el = $(this); 
		$.get($(el).attr("href"),function(data){
			$(el).toggleClass("verified");
			if ($(el).attr("class").indexOf("verified") > -1)
				$(el).text('Set as "Unverified"');
			else 
				$(el).text('Set as "Verified"');
				
		})
		return false;
	});
	$("a.tpp-status").click(function(){
		var el = $(this); 
		$.post($(el).attr("href"),{},function(data){
			$(el).toggleClass("approved");
			if ($(el).attr("class").indexOf("approved") > -1)
				$(el).text('Reject');
			else 
				$(el).text('Approve');
				
		})
		return false;
	});
	$("a.popup").click(function(){
		var title = $(this).attr("title");
		var uri = $(this).attr("href");
		var pw = window.open(uri,'','width=800,height=600');
		pw.focus();
		return false;
	});
	$(".my-account-menu").click(function(){
		$(".myaccount").slideToggle('slow','linear');
	});

	//changes made by V.K.
	//show-hide right menu sections 
	$(".oneStep button").click(function () {
		$(this).closest(".oneStep").children("ul").toggle("fast");
	}); 
	$(".oneStep a").click(function () {
		$(this).closest(".oneStep").children("ul").toggle("fast");
	});  
	//multiselect dropdown by Select2 library
	$("#role").select2(); 
	$("#subject").select2({ maximumSelectionSize: 3 }); 
	$("#qualification").select2(); 
	$("#reference_phonecode").select2(); 
	$("#reference_position").select2(); 
	$("#reference_type").select2(); 
	$("#education").select2(); 
	$("#curricula_of_interest").select2(); 
	$("#marital_status").select2(); 
	$("#year_of_birth").select2(); 
	$("#number_of_dependent_children").select2(); 
	$("#reduced_tuition").select2(); 
	$("#save_money").select2(); 
	$("#accommodation").select2(); 
	$("#health_insurance").select2(); 
	$("#professional_development").select2(); 
	$("#current_role").select2(); 
	$("#current_subject").select2({ maximumSelectionSize: 3 }); 
	$("#language").select2(); 
	$("#teaching_skills").select2(); 
	$("#computer_skills").select2(); 
	
	
	 //dropdown box with flags
    function format(state) {
        if (!state.id) return state.text; // optgroup
        return "<img class='flag' src='static/images/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
    }
    $("#country").select2({
        formatResult: format,
        formatSelection: format
    });
    $("#nationality").select2({
        formatResult: format,
        formatSelection: format
    });
    $("#countrycode").select2({
        formatResult: format,
        formatSelection: format
    });
    $("#country2").select2({
        formatResult: format,
        formatSelection: format
    });
	//slider, years, from 0 to 20
	 var select = $("#experience");
	        var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
	            min: 1,
	            max: 41,
	            range: "min",
	            value: select[ 0 ].selectedIndex + 1,
	            slide: function( event, ui ) {
	                select[ 0 ].selectedIndex = ui.value - 1;
	            }
	        });
    $("#experience").change(function() {
        slider.slider( "value", this.selectedIndex + 1 );
    });
     
});

//*jump to beginning of registration form
$(window).load(function() {
	$('body').animate({scrollTop:$("#startForm").offset().top - 30},1000);
});





