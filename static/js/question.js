$(document).ready(function(){
  $(".answer li").click(function(){
    $(this).parent('ul').children('li').removeClass('selectitem');
    $(this).parent('ul').children('li').removeAttr('isanswer');
    $(this).addClass('selectitem');
    $(this).attr('isanswer', 'true');
  });

  $(".submitbutton").click(function(){
      count();
  });

});

function count(){

  //一共有多少道题目
  var selectnum = $(".select").size();
  var packnum = $(".pack").size();
  var total = selectnum + packnum;

  //已经做了多少道??
  //先看一下选择题
  var finishnum = 0;
  $(".answer ul").each(function(index, el) {
    var isanswer = false;
    $(this).children('li').each(function(index, el) {
      if($(this).attr("isanswer") == "true"){
        isanswer = true;
      }
    });

    if(isanswer == true)
    finishnum++;

  });

  //再看一下填空题
  $(".answerarea input").each(function(index, el) {
    if($(this).val() != ""){
      finishnum++;
    }
  });

  var message = "一共有"+total+"道题,你已经做了"+finishnum+"道题."
  if(finishnum < total ){
    message = message + "还有"+ (total - finishnum) + "道题没有做.";
  }
  message = message + "你确定要提交试卷吗?";
  UIkit.modal.confirm(message, function(){
    $(".submitbutton").attr('disabled', '');
    $(".submitbutton").text("正在计算你的得分，请稍等");
    setTimeout(function(){
      submit1(total);
      $(".submitbutton").text("计算完毕");
    },1000);

  });
}


function submit1(total){


  var correctnum = 0;

  //检查一下选择题做的怎么样
  $(".answer ul").each(function(index, el) {
    var iscorrect = false;
    $(this).children('li').each(function(index, el) {
      if($(this).attr("isanswer") == "true" && $(this).attr("iscorrect") == "true"){
        iscorrect = true;
      }
      if($(this).attr("isanswer") == "true" && $(this).attr("iscorrect") != "true"){
        $(this).addClass('erroritem');
      }
      if($(this).attr("isanswer") != "true" && $(this).attr("iscorrect") == "true"){
        $(this).addClass('correctitem');
      }

    });

    if(iscorrect == true)
       correctnum++;

  });

  //再看一下填空题
  $(".answerarea input").each(function(index, el) {
    if($(this).val() != "" && $(this).val() == $(this).attr("correctanswer")){
      correctnum++;
      $(this).addClass('correctinput');
    }else{
      $(this).addClass('errorinput')
    }
  });

  $(".analysisarea").removeClass('uk-hidden');
  var score = Math.round( 100 * correctnum / total);
  $(".scorenum").text(score);
  $(".score").removeClass('uk-hidden');

  wenan = "我在【灰原哀导航】上的测试得了"+score+"分，你们也快来试试吧";

  // 页面滚动到指定位置
  var scroll_offset = $(".submitbutton").offset();
  $("body,html").animate({
    scrollTop:scroll_offset.top
  },0);

}
