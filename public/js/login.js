
$(".wapper").addClass("active-popup");

$(".register-link").click(function () { 
    $(".wapper").addClass("active");  
});
$(".login-link").click(function () { 
    $(".wapper").removeClass("active");  
});
$(".btnLogin-popup").click(function () { 
    $(".wapper").addClass("active-popup");  
});
$(".icon-close").click(function () { 
    $(".wapper").removeClass("active-popup");  
});


