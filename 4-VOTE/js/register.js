let regRender = (function () {
    let $userName=$('#userName'),
        $spanName=$('#spanName'),
        $userPhone=$('#userPhone'),
        $spanPhone=$('#spanPhone'),
        $userPass=$('#userPass'),
        $spanPass=$('#spanPass'),
        $userPassConfirm=$('#userPassConfirm'),
        $spanPassConfirm=$('#spanPassConfirm'),
        $userBio=$('#userBio'),
        $spanBio=$('#spanBio'),
        $man=$('#man'),
        $woman=$('#woman'),
        $submit=$('#submit');

   //记录表单是否都验证通过（true ：都通过）
    //用户名
    let checkUserName = ()=> {
        let reg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10})?$/;
        let value = $userName.val().trim();
        if (value.length === 0) {
            $spanName.html('用户名不能为空!').addClass('error');
            return false;
        }
        if (!reg.test(value)) {
            $spanName.html('请输入真实姓名（需要是中文汉字）!').addClass('error');
            return false;
        }
        $spanName.html('').removeClass('error');
        return true;
    };
//   手机验证
let checkPhone=()=>{
  let reg=/^1\d{10}$/,
      value=$userPhone.val().trim();
  if(value.length===0){
      $spanPhone.html('格式不对哦').addClass('error');
      return false;
  }
  if(!reg.test(value)){
      $spanPhone.html('格式不对哦').addClass('error');
      return false;
  }
  //是否存在
    let code=0;
    $.ajax({
        url:'/checkPhone',
        dataType:'json',
        cache:false,
        data:{phone:value},
        async:false,
        success:result=>{
            code=result.code;

        }
    });

    if(code==1){
        $spanPhone.html('已经被注册过了').addClass('error');
        return false;
    }
  $spanPhone.html('').addClass('error');
  return true;

};

    //提交
    let $plan=$.Callbacks();
    $plan.add(result=>{
       let {code,data}=result;
       if(code==0){
           localStorage.setItem('userInfo',JSON.stringify(data));
           Dialog.show('注册成功',{
               callBack:function () {
                   location.href='index.html';
               }
           })
       }
    });

    let submitFn=()=>{
        if(checkUserName()&&checkPhone()){
            $.ajax({
                url:'/register',
                type:'post',
                dataType:'json',
                data:{
                    name:$userName.val().trim(),
                    password:hex_md5($userPass.val().trim()),
                    phone:$userPhone.val().trim(),
                    bio:$userBio.val().trim(),
                    sex:$man[0].check?0:1
                },
                success:$plan.file
            })
        }
    };

    return {
        init: function () {
            $userName.on('blur',checkUserName);
             $userPhone.on('blur',checkPhone);

        //提交信息
            $submit.tap(submitFn);
        }
    }
})();
regRender.init();