console.log(' aici');
var $=document;
console.log($);
function onHover(selector)
{
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25.gif");
}

function offHover(selector)
{
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25-0.png");
}