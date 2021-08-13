$(document).ready(function() {
  	loadLocalLinks();
	bindAutoCompleteEvennt();
});

function loadLocalLinks(){
  //清除已经显示的链接
  $(".locallink").remove();
  var currentLink = getCookie("urls");
  if(currentLink == "") return;
  var linkarray= currentLink.split(",");
  for(var i = 0; i < linkarray.length; i++){
    var link = linkarray[i];
    var ss = link.split("|");
    var webname = ss[0];
    var weblink = ss[1];
    $("#addlinkbtn").before('<li class="locallink"><a href="'+weblink+'" target="_blank" rel="nofollow">'+webname+'</a></li>')
  }
}

var bedelete = [];

function manageLinks(){
  bedelete = [];
  $("#managelink").addClass('uk-hidden');
  $("#managelinkdone").removeClass('uk-hidden');
  $("#managelinkcancle").removeClass('uk-hidden');

  $(".locallink").each(function(index, el) {
    $(this).append('<a href="javascript:void(0)" onclick="deleteLink('+index+',this)"> <i class="uk-icon-trash"></i></a>');
    $(this).addClass('beseting');
  });
}

function deleteLink(index,dom){
  $(dom).parent().remove();
  bedelete.push(index);
}

function manageLinksDone(){
  //从cookies中删除指定的链接
  var currentLink = getCookie("urls");
  if(currentLink == "") return;
  var linkarray= currentLink.split(",");
  for(var i = 0; i < bedelete.length;i++){
    linkarray[bedelete[i]] = "delete";
  }
  var newlink = "";
  for(var i = 0; i < linkarray.length;i++){
    if(linkarray[i] != "delete"){
      if(newlink == ""){
        newlink = linkarray[i];
      }else{
        newlink = newlink + ","+linkarray[i];
      }
    }
  }

  setCookie("urls",newlink,null);
  manageLinksCancle();
}

function manageLinksCancle(){
  loadLocalLinks();
  bedelete = [];
  $("#managelink").removeClass('uk-hidden');
  $("#managelinkdone").addClass('uk-hidden');
  $("#managelinkcancle").addClass('uk-hidden');
}

function validataInput(){
  var webname = $("input[name='webname']").val();
  var weblink = $("input[name='weblink']").val();

  if(webname == ""){
    $("input[name='webname']").addClass("uk-form-danger");
    $("#addlinkmsg").text("网站名称不能为空");
    $("#addlinkmsg").removeClass('uk-hidden');
    return false;
  }else{
    if(webname.indexOf(",") != -1 || webname.indexOf("|") != -1 ){
	  $("input[name='webname']").addClass("uk-form-danger");
      $("#addlinkmsg").text("网站名称中不能包含|和，两个特殊字符");
      $("#addlinkmsg").removeClass('uk-hidden');
      return false;
    }

  }
  if(weblink == ""){
    $("input[name='weblink']").addClass("uk-form-danger");
    $("#addlinkmsg").text("网站链接不能为空");
    $("#addlinkmsg").removeClass('uk-hidden');
    return false;
  }else{
    if(weblink.indexOf(",") != -1 || weblink.indexOf("|") != -1 ){
	  $("input[name='weblink']").addClass("uk-form-danger");
      $("#addlinkmsg").text("网站链接中不能包含|和，两个特殊字符");
      $("#addlinkmsg").removeClass('uk-hidden');
      return false;
    }
	if(weblink.indexOf("http://") != 0){
		weblink = "http://"+weblink;
		$("input[name='weblink']").val(weblink);
	}
  }

  $("input[name='webname']").removeClass("uk-form-danger");
  $("input[name='weblink']").removeClass("uk-form-danger");
  $("#addlinkmsg").addClass('uk-hidden');
  return true;
}

function addlink(){
  	
	if(!validataInput()) return;

	 var webname = $("input[name='webname']").val();
  	var weblink = $("input[name='weblink']").val();

  if(webname != "" && weblink != ""){
    var currentLink = getCookie("urls");
    if(currentLink == ""){
      currentLink = webname + "|" + weblink;
    }else{
      currentLink = currentLink +","+ webname + "|" + weblink;
    }
    setCookie("urls",currentLink,null);
    loadLocalLinks();
    $("input[name='webname']").val("");
    $("input[name='weblink']").val("");
    var modal = UIkit.modal("#addlink");
    modal.hide();
  }
}

function bindAutoCompleteEvennt(){
  $('#keyword').bind('input propertychange', function(event,data) {
    var keyword = $("#keyword").val();
    if(keyword.length <= 0)
    {
      $(".autobox").html("");
      $(".autobox").css("display","none");
    }
    var url = "https://gsp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=?&wd="+keyword+"&sc=huiyuanai";

    var html = "<ul class='uk-list'>";

    $.getJSON(url, function(data) {

        for(var i = 0 ;i < data.s.length; i++){

          html = html +'<li><a href="https://www.baidu.com/s?ie=utf-8&wd='+data.s[i]+'" target="_blank">'+data.s[i]+'</a></li>';
        }

        html = html +"</ul>";

        $(".autobox").html(html);
        $(".autobox").css("display","block");

    });


  });

  $('#keyword').blur(function(){

    setTimeout(function(){

      $(".autobox").html("");
      $(".autobox").css("display","none");

    },200);


  });
}
