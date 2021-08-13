var wsCache;

$(document).ready(function(){
	
	//加载北京图片
	loadBgImg();
	
	//初始化wsCache
	wsCache = new WebStorageCache();
	
	//绑定搜索按钮事件
	bindSearchBtnEvent();
	
	//加载搜索引擎
	loadSearch();
	
	//显示时间
	showTime();
	
	//绑定搜索引擎输入自动提示事件
	bindAutoCompleteEvennt();
	
	//显示TIPS
	showTips();
	
	//加载待做事项
	loadToDos();
	
	//重新加载待做事项的事件监听
	reloadToDoEvent();
	
	//绑定待做事项的时间
	bindToDoInput();
});

function bindSearchBtnEvent(){
	$("#moresearch").click(function(){
		$(".selectlist").slideToggle();
	});
	
	$(".searchlist .item").click(function(){
		$(".search_logo").css("background-position","0px "+$(this).attr("offset")+"px");
		$("#searchurl").attr("href",$(this).attr("url"));
		$("#searchform").attr("action",$(this).attr("searchurl"));
		$(".searchinput").attr("name",$(this).attr("searchkey"));
		$(".selectlist").slideUp();
		wsCache.set("defaultsearch",$(this).attr("name"));
	});
}

function showTime(){
	setInterval(function(){
		var date = new Date();
		$(".time .timehm").text(date.format("HH:mm"));
		$(".time .ss").text(date.format("ss"));
		$(".time .date").text(date.format("MM月dd日 EEE"));
	},1000);
}

function bindToDoInput(){
	$('#todoinput').focus(function(){
		$(".greybg").fadeIn(200);
	});

	$('#todoinput').blur(function(){
		$(".greybg").fadeOut(200);
	});
	$("#todoinput").on("keypress",function(event){
		if(event.keyCode == 13){
			var value = $("#todoinput").val().trim();
			if(value != ""){
				addToDo(value);
				$("#todoinput").val("");
			}
		}
	});
}


function loadBgImg(){
	var id = parseInt(new Date().format("dd")) % 7;
	$(".container").css("background","url('./image/background"+id+".jpg')");
}

function reloadToDoEvent(){
	$(".deletebtn").click(function(){
		deleteTodo($(this));
	});
	$(".donebtn").click(function(){
		doneTodo($(this));
	});
	$(".undonebtn").click(function(){
		unDoneTodo($(this));
	});
}

function loadSearch(){
	var searchname = wsCache.get("defaultsearch");
	if(searchname != null){
		var searchitem = $(".searchlist ."+searchname);
		$(".search_logo").css("background-position","0px "+searchitem.attr("offset")+"px");
		$("#searchurl").attr("href",searchitem.attr("url"));
		$("#searchform").attr("action",searchitem.attr("searchurl"));
		$(".searchinput").attr("name",searchitem.attr("searchkey"));
	}
}

function loadToDos(){
	
	var todolist = wsCache.get("todolist");
	if(todolist == null || todolist.length == 0){
		showDefaultToDo();
	}else{
		for(var i = 0; i < todolist.length; i++){
			var todo = todolist[i];
			var todo = "<li id=\""+todo.id+"\">"+
					"<div class=\"todoitem\">"+
						"<div class=\"thing\" style=\"text-decoration:"+ (todo.done ? "line-through" : "none") +"\" ><span>"+todo.value+"</span></div>"+
						"<div class=\"opera\">"+
							"<a class=\"deletebtn\">删除</a>&nbsp;&nbsp;"+
							"<a class=\"donebtn\" style=\"display:"+(todo.done ? "none" : "auto")+"\">完成</a>"+
							"<a class=\"undonebtn\" style=\"display:"+( !todo.done ? "none" : "auto")+"\">撤销完成</a>"+
						"</div>"+
					"</div>"+
				"</li>";
				
			$("#todoList").append(todo);			
		}
	}
}


function showDefaultToDo(){
	if($("#todoList li").length == 0){
		var todo = "<li id=\"defaultdoto\" style=\"display:none\">"+
					"<div class=\"todoitem\">"+
						"<div class=\"thing\"><span>您还没有代办事项喔，快到TODO输入框里添加第一条待办事项吧。</span><br/><span style=\"color:red\">注意:您的待办事项将在凌晨后清空</span></div>"+
					"</div>"+
				"</li>";
		if(!wsCache.isSupported()){
			todo = "<li id=\"defaultdoto\" style=\"display:none\">"+
					"<div class=\"todoitem\">"+
						"<div class=\"thing\"><span>您的浏览器不支持最新的本地存储特性，因此您的添加的待办事项将在你关闭此标签后消失。如果您想保存您的待办事项，请使用最新的谷歌浏览器</span></div>"+
					"</div>"+
				"</li>";
		}
				
		$("#todoList").append(todo);
		$("#todoList").children("li:last-child").fadeIn();
	}
	
	
}

function addToDo(value){
	
	var todoid = "todo-" + new Date().getTime();
	var todo = "<li id=\""+todoid+"\" style=\"display:none\">"+
					"<div class=\"todoitem\">"+
						"<div class=\"thing\"><span>"+value+"</span></div>"+
						"<div class=\"opera\">"+
							"<a class=\"deletebtn\">删除</a>&nbsp;&nbsp;"+
							"<a class=\"donebtn\">完成</a>"+
							"<a class=\"undonebtn\" style=\"display:none\">撤销完成</a>"+
						"</div>"+
					"</div>"+
				"</li>";
				
	$("#todoList").append(todo);
	$("#todoList").children("li:last-child").fadeIn();
	reloadToDoEvent();
	
	//将修改同步到存储中
	var todolist = wsCache.get("todolist");
	if(todolist == null || todolist.length == 0){
		todolist = [];	
	}
	var todoItem = {
		id : todoid,
		value : value,
		done: false
	};
	todolist.push(todoItem);
	//晚上24点
	var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	wsCache.set('todolist', todolist, {exp : end});
	
	//存储结束
	
	
	
	//如果存在默认todo的话就删除
	if($("#defaultdoto").length > 0) {
		$("#defaultdoto").slideUp(500,function(){
			$("#defaultdoto").remove();
		});
	} 
	
}

function deleteTodo(dom){
	var todo = dom.parents("li");
	todo.slideUp(500,function(){
		todo.remove();
		showDefaultToDo();
	});
	
	//将修改同步到存储中
	var todoId = todo.attr("id");
	var todolist = wsCache.get("todolist");
	if(todolist == null || todolist.length == 0){
		todolist = [];	
	}
	for(var i = 0; i < todolist.length; i++){
		var todoItem = todolist[i];
		if(todoItem.id == todoId){
			todolist.splice(i,1);;
			break;
		}
	}
	//晚上24点
	var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	wsCache.set('todolist', todolist, {exp : end});
	
	//存储结束
	
}

function doneTodo(dom){
	dom.parents("li").find(".thing").css("text-decoration","line-through");
	dom.parents("li").find(".donebtn").hide();
	dom.parents("li").find(".undonebtn").show();
	
	//将修改同步到存储中
	var todoId = dom.parents("li").attr("id");
	var todolist = wsCache.get("todolist");
	if(todolist == null || todolist.length == 0){
		todolist = [];	
	}
	for(var i = 0; i < todolist.length; i++){
		if(todolist[i].id == todoId){
			todolist[i].done = true;
			break;
		}
	}
	//晚上24点
	var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	wsCache.set('todolist', todolist, {exp : end});
	
}

function unDoneTodo(dom){
	dom.parents("li").find(".thing").css("text-decoration","none");
	dom.parents("li").find(".donebtn").show();
	dom.parents("li").find(".undonebtn").hide();
	
	//将修改同步到存储中
	var todoId = dom.parents("li").attr("id");
	var todolist = wsCache.get("todolist");
	if(todolist == null || todolist.length == 0){
		todolist = [];	
	}
	for(var i = 0; i < todolist.length; i++){
		if(todolist[i].id == todoId){
			todolist[i].done = false;
			break;
		}
	}
	//晚上24点
	var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	wsCache.set('todolist', todolist, {exp : end});
	
}

function showTips(){
	var tip = tips["zaoshang"];
	var hour = parseInt(new Date().format("HH"));
	if(hour >= 2 && hour < 5){
		tip = tips["lingchen"];
	}else if(hour >= 5 && hour < 8){
		tip = tips["zaoshang"];
	}else if(hour >= 8 && hour < 11){
		tip = tips["shangwu"];
	}else if(hour >= 11 && hour < 14){
		tip = tips["zhongwu"];
	}else if(hour >= 14 && hour < 18){
		tip = tips["xiawu"];
	}else if(hour >= 18 && hour < 22){
		tip = tips["wanshang"];
	}else{
		tip = tips["wuye"];
	}
	
	$(".tips p").hide();
	$(".tips p").text(tip);
	$(".tips p").fadeIn(2000);
	
}

var tips = {
	"zaoshang":"早上好,一年之计在于春,一日之计在于晨",
	"shangwu":"上午好,工作之间,别忘了喝杯咖啡喔",
	"zhongwu":"中午好,要注意饮食健康",
	"xiawu":"下午好,累了吧,工作期间要多多放松,注意劳逸结合",
	"wanshang":"晚上好,下班后请记着泡一杯茶犒劳一下自己",
	"wuye":"夜已深,请及时休息",
	"lingchen":"你永远看不到凌晨的太阳是什么样子",
};

function bindAutoCompleteEvennt(){
  $('.searchinput').bind('input propertychange', function(event,data) {
    var keyword = $(".searchinput").val();
    if(keyword.length <= 0)
    {
      $(".suggestword").html("");
      $(".suggestword").css("display","none");
    }
    var url = "https://gsp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=?&wd="+keyword+"&sc=huiyuanai";

    var html = "<ul>";

    $.getJSON(url, function(data) {
		var url = $("#searchform").attr("action");
		var attr = $(".searchinput").attr("name");
		for(var i = 0 ;i < data.s.length; i++){
		  html = html +'<li><a href="'+url+'?'+attr+'='+data.s[i]+'">'+data.s[i]+'</a></li>';
        }
		html = html +"</ul>";
		$(".suggestword").html(html);
        $(".suggestword").css("display","block");
		
    });


  });

 $('.searchinput').blur(function(){
    setTimeout(function(){
	  $(".suggestword").html("");
      $(".suggestword").css("display","none");

    },200);


  });
}



Date.prototype.format=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "1" : "一",         
    "2" : "二",         
    "3" : "三",         
    "4" : "四",         
    "5" : "五",         
    "6" : "六",         
    "7" : "日"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
} 
