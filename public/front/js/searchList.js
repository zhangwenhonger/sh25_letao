$(function(){
//  1.获取地址栏传递过来的搜索关键字 赋值给input，一进入页面,渲染一次
    var key=getSearch("key");
    $('.search_input').val(key);
    render();
//   根据搜索关键字 发送ajax请求 进行页面渲染
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            data:{
                proName:$('.search_input').val(),
                page:1,
                pageSize:100
            },
            datatype:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("productTpl",info);
                $(".lt_product").html(htmlStr);
            }
        });
    }

//  2.点击搜索按钮，实现搜索功能
    $('.search_btn').click(function(){
        var key=$('.search_input').val();
        if(key.trim()===""){
            alert("请输入关键字");
            return;
        }
        render();


        //    需要将搜索关键字，追加存储到本地存储中
        var history=localStorage.getItem("search_list")||'[]';
        var arr =JSON.parse(history);
        //2.1删除重复的项
        var index=arr.indexOf(key);
        if(index!=-1){
            arr.splice(index,1);
        }
        //2.2长度控制在10
        if(arr.length>=10){
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list",JSON.stringify(arr));

    })

});