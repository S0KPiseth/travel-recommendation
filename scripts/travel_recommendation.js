const navLinks = document.getElementById("navLinks");
const navLinksChild = navLinks.children;
const video = document.getElementById("video");
const box = video.getBoundingClientRect();
const landingSect = document.getElementById("home")
const landingSectBox = landingSect.getBoundingClientRect();
const aboutSect = document.getElementById("contactWrapper");
const aboutSectBox = aboutSect.getBoundingClientRect();
const resultDisplay = document.getElementById("resultDisplay");
const resultDisplayBox = resultDisplay.getBoundingClientRect();
const searchIcon = document.getElementById("searchIcon");
const loadingSect = document.getElementById("loading");


const searchBar = document.getElementById("searchbar");

function applyMargin(){
    if(window.scrollY<410 || video.style.marginTop==0){
        video.style.marginTop=`-${window.scrollY}px`;
        if(window.scrollY > 410){
            video.style.marginTop="-410px"
        }

    }
    if(248<window.scrollY && window.scrollY <930 ){
        [...navLinksChild].forEach(e=>{
            e.classList="";
        })
        navLinksChild[1].classList="active"
        

    }else if(window.scrollY>930){
        [...navLinksChild].forEach(e=>{
            e.classList="";
        })
        navLinksChild[2].classList="active"
    }else{
        [...navLinksChild].forEach(e=>{
            e.classList="";
        })
        navLinksChild[0].classList="active"

    }
}
window.onload=applyMargin;
window.addEventListener("scroll", applyMargin);
//search function
const search = (e) => {
    if (e.key !== "Enter") return;

    const query = searchBar.value.toLowerCase().trim();
    if (!query) return;

    loadingSect.style.zIndex = "1";
    landingSect.classList.add("loadingAnimation");

    fetch("./travel_recommendationAPI.json")
        .then(res => res.json())
        .then(data => {
            const searchResult = data.filter(item =>
                item.category.some(cat =>
                    cat.toLowerCase().includes(query)
                )
            );
            setTimeout(() => {
                loadingSect.style.zIndex = "-1";
                if (searchResult.length === 0) {
                    showNotFoundAlert();
                }
                resultDisplay.innerHTML = searchResult.map(item => `
                    <div class="resultContainer rsRR">
                        <img src="${item.image}" alt="" width="100%" class="rsRR">
                        <div class="details rsRR">
                            <h2 class="rsRR">${item.name}</h2>
                            <p class="rsRR" id="des">${item.description}</p>
                            <br/>
                            <a class="call2Action rsRR" href="${item.link}" target="_blank">More info</a>
                        </div>
                    </div>
                `).join("");
                document.body.style.height = "fit-content";
                document.body.style.overflow = "visible";
                landingSect.classList.remove("loadingAnimation");
            }, 1500);
        })
        .catch(err => console.error("Error fetching data:", err));

    searchSideEffect();
    document.body.addEventListener("click", close);
};

function showNotFoundAlert() {
    const alertBox = document.getElementById("not-found-alert");
    alertBox.classList.add("showAlert");
    setTimeout(() => {
        alertBox.classList.remove("showAlert");
    }, 2500);
}


const searchSideEffect = ()=>{
    //set search icon to close icon
    searchIcon.style.d="path('m2 12.125 4.125 -4.125L2 3.875l1 -1 4.125 4.125L11.25 2.875l1 1 -4.125 4.125 4.125 4.125 -1 1 -4.125 -4.125L3 13.125z')";
    landingSect.classList.add("loadingAnimation");
    loadingSect.style.zIndex = "99";
    //disable scroll temporary
    document.body.style.height="100vh";
    document.body.style.overflow="hidden"

}
//handle close event
const close = (e)=>{
    searchIcon.style.d="path('m13 14 -3.031 -3.031q-1.313 1 -2.969 1 -1.344 0 -2.5 -0.656 -1.156 -0.688 -1.813 -1.844 -0.688 -1.156 -0.688 -2.5t0.688 -2.5q0.656 -1.156 1.813 -1.813 1.156 -0.688 2.5 -0.688t2.5 0.688q1.156 0.656 1.844 1.813 0.656 1.156 0.656 2.5 0 1.688 -1.031 3l3.031 3.031zM6.969 10.5q1.469 0 2.5 -1.031 1 -1.031 1 -2.469 0 -1.469 -1 -2.469 -1.031 -1.031 -2.5 -1.031 -1.438 0 -2.469 1.031 -1.031 1 -1.031 2.469 0 1.438 1.031 2.469t2.469 1.031')"
    if((!(resultDisplayBox.top < e.clientY && e.clientY < resultDisplayBox.bottom) || !(resultDisplayBox.left < e.clientX && e.clientX< resultDisplayBox.right)) && document.activeElement.id !="searchbar"){
    setTimeout(()=>{
        searchBar.value="";
        resultDisplay.innerHTML="";
        resultDisplay.classList=""
    }, 500)
    resultDisplay.className="resultDisplayAni";
    document.body.removeEventListener("click", close)
    }

}

searchBar.addEventListener('keypress', search)

