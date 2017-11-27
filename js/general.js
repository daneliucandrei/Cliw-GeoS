//console.log('se incarca');
var $ = document;
function onHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25.gif");
}

function offHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25-0.png");
}

window.onscroll = function () {
    var header = $.getElementsByClassName('header-container')[0];
    if (window.scrollY > 160) {
        if (!header.classList.contains('header-container-scroll'))
            header.classList += " header-container-scroll";
    }
    else {
        header.classList.remove("header-container-scroll");
    }
}

function toggleElement(thisId,classToAdd) {
   var $this= $.getElementById(thisId);
   if(!$this.classList.contains(classToAdd)) {
       $this.classList+= " "+classToAdd;
   }
   else {
       $this.classList.remove(classToAdd);
   }
}
function toggleThis(thisId,classToAdd){
    var $this= $.getElementById(thisId);
    if(!$this.classList.contains(classToAdd)) {
        $this.classList+= " "+classToAdd;
    }
    else {
        $this.classList.remove(classToAdd);
    }

}
