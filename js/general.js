//console.log('se incarca');
var $ = document;
function onHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25.gif");
}

function offHover(selector) {
    $.getElementsByClassName(selector)[0].setAttribute("src", "media/earth-spinning-rotating-animation-25-0.png");
}

/*window.onscroll = function () {
    var header = $.getElementsByClassName('header-container')[0];
    if (window.scrollY > 160) {
        if (!header.classList.contains('header-container-scroll'))
            header.classList += " header-container-scroll";
    }
    else {
        header.classList.remove("header-container-scroll");
    }
}
*/

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
function cbclick(e) {
    e = e || event;
    var cb = e.srcElement || e.target;
    if (cb.type !== 'checkbox') {
        return true;
    }
    var cbxs = document.getElementById('radiocb').getElementsByTagName('input'), i = cbxs.length;
    while (i--) {
        if (cbxs[i].type && cbxs[i].type == 'checkbox' && cbxs[i].id !== cb.id) {
            cbxs[i].checked = false;
        }
    }
}
