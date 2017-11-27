console.log('se incarca');
var $ = document;
function onHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25.gif");
}

function offHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25-0.png");
}

window.onscroll = function () {
    var header = $.getElementsByClassName('header-container')[0];
    if (window.scrollY > 150) {
        if (!header.classList.contains('header-container-scroll'))
            header.classList += " header-container-scroll";
    }
    else {
        header.classList.remove("header-container-scroll");
    }
}

function toggleNext(thisId) {
   var next= $.getElementById(thisId).nextElementSibling;
   if(!next.classList.contains('filter-toggle--active')) {
       next.classList+= " filter-toggle--active";
   }
   else {
       next.classList.remove("filter-toggle--active");
   }
}
function toggleThis(thisId){
    var $this= $.getElementById(thisId);
    console.log($this.classList);
    if(!$this.classList.contains('button-filter--active')) {
        $this.classList+= " button-filter--active";
    }
    else {
        $this.classList.remove("button-filter--active");
    }

}