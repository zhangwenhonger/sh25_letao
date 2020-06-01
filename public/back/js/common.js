/**
 * Created by lsy on 2020/6/1.
 */

$(document).ajaxStart(function(){
    NProgress.start();
});
$(document).ajaxStop(function(){
    NProgress.done();


})