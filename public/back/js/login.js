/**
 * Created by lsy on 2020/6/1.
 */
$(function(){

//1.进行表单校验配置
    $("#form").bootstrapValidator({
        //1.1配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //1.2配置字段 和input框中指定的name关联
        fields:{
            username:{
                //配置校验规则
                validators:{
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必啥须在2-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }


                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码有误"
                    }

                }
            }

        }

    });


//2.登录功能
    //表单校验插件会在提交表单时进行校验
    //(1)校验成功，默认就提交表单，会发生页面跳转，注册表单校验成功事件，阻止默认的提交，通过ajax发送请求
    //(2)校验失败，不会提交表单，配置插件提示用户即可
    $("#form").on("success.form.bv",function(e){
        e.preventDefault();
        //console.log("校验成功后的表单提交被阻止了")
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                    location.href="index.html";
                }
                if(info.error===1000){
                    //alert("用户名不存在");
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
                }
                if(info.error===1001){
                    //alert("密码错误");
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }


        })
    });

//3.重置功能
    $('[type="reset"]').click(function(){
        //resetForm(), 传true 校验内容以及校验状态  传false或不写，校验状态
        //创建实例，调用方法
        $("#form").data('bootstrapValidator').resetForm();
    })





});