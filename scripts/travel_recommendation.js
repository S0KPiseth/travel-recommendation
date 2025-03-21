const video = document.getElementById("video");
const box = video.getBoundingClientRect();

function applyMargin(){
    if(window.scrollY<410){
        video.style.marginTop=`-${window.scrollY}px`;

    }
}
applyMargin();
window.addEventListener("scroll", applyMargin);