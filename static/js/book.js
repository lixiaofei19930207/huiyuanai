function selectItem(dom,item){

  if(item != "chapter"){
    $("#chapter").hide();
    $("#chapter_tab").removeClass("active");
    $("#comment_tab").addClass("active");
  }else{
    $("#chapter").show();
    $("#chapter_tab").addClass("active");
    $("#comment_tab").removeClass("active");
  }

}
