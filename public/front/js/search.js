$(function(){
//   注意：要进行本地存储localStorage的操作，进行历史记录管理，
//     需要约定一个键名，search_list
//    将来通过search_list 进行读取或者设置操作

//  准备假数据：将下列三行代码，在控制台执行，可以添加假数据
//     var arr=["耐克","阿迪","新百伦","戈美琪"];
//     var jsonStr=JSON.stringify(arr);
//     localStorage.setItem("search_list",jsonStr);

//功能1：列表渲染功能
//     (1)从本地存储中读取历史记录，读取的是jsonStr
//     (2)转换成数组
//     (3)通过模板引擎动态渲染
    render();
    function getHistory(){
        var history=localStorage.getItem("search_list") || '[]';
        var arr=JSON.parse(history);
        return arr;
    };
    function render(){
        var arr=getHistory();
        var htmlStr=template("historyTpl",{arr:arr});
        $('.lt_history').html(htmlStr);
    };

//功能2：清空功能
    $(".lt_history").on("click",".btn_empty",function(){
       // 添加mui确认框
        mui.confirm("你确定要清空历史记录吗？","温馨提示",["取消","确认"],function(e){
            if(e.index===1){
                localStorage.removeItem("search_list");
                render();
            }
        })

   });


//功能3：删除单条历史记录
//     (1)注册事件，通过事件委托
//     (2)将下标存在删除按钮上，获取存储的下标
//     (3)从本地存储中读取数组
//     (4)通过下标从数组中将对应项删除 splice
//     (5)将修改后的数组，转成jsonStr,存到本地存储中
//     (6)页面重新渲染
//     (7)清空输入框

    $(".lt_history").on("click",".btn_del",function(){
        var that=this;
        // 添加mui确认框
        mui.confirm("你确定要清除该条历史记录吗？","温馨提示",["取消","确认"],function(e){
            if(e.index===1){
                var index=$(that).data("index");
                var arr=getHistory();
                arr.splice(index,1);
                localStorage.setItem("search_list",JSON.stringify(arr));
                render();
            }
        })

    });


//功能4：添加历史记录功能
    $('.search_btn').click(function(){
        var key=$('.search_input').val().trim();
        if(key===""){
            mui.toast("请输入搜索关键字");
            return;
        }
        var arr=getHistory();
     //需求：
        // 1.如果有重复的，现将重复的删除，将这项添加到最前面
        // 2.长度不能超过10个
        var index = arr.indexOf(key);
        if(index != -1){
            //说明在数组中可以找到重复的项，且索引为index
            arr.splice(index,1)
        }
        if(arr.length>=10){
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list",JSON.stringify(arr));
        render();
        $('.search_input').val("");
//功能5：跳转功能
        location.href="searchList.html?key="+key;

    });


})

