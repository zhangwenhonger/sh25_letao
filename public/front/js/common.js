    //1.对页面所有滚动 初始化scroll控件 区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    })
    //2.获得slider插件对象 自动轮播
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
    });
    //3.解析地址栏参数
    function getSearch(k){
        var search=location.search;
        search=decodeURI(search);
        search=search.slice(1);
        var arr=search.split("&");
        var obj={};
        arr.forEach(function(v,i){
            var key=v.split('=')[0];
            var value=v.split('=')[1];
            obj[key]=value;
        })
        return obj[k];
    }
