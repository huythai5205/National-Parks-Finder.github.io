

//second slide

let slideIndex2 =0;
carouselTwo();

function carouselTwo(){
    let i;
    let x = document.getElementsByClassName("featured1");


for (i=0; i <x.length; i++){
    x[i].style.display = "none";
};

slideIndex2++;
if (slideIndex2 > x.length)
{
    slideIndex2 = 1
};

x[slideIndex2-1].style.display = "block";
setTimeout(carouselTwo, 2000);
};

// //third slide

let slideIndex3 =0;
carouselThree();

function carouselThree(){
    let i;
    let x = document.getElementsByClassName("featured2");


for (i=0; i <x.length; i++){
    x[i].style.display = "none";
};

slideIndex3++;
if (slideIndex3 > x.length)
{
    slideIndex3 = 1
};

x[slideIndex3-1].style.display = "block";
setTimeout(carouselThree, 2000);
};

// //fourth slide

let slideIndex4 =0;
carouselFour();

function carouselFour(){
    let i;
    let x = document.getElementsByClassName("featured3");


for (i=0; i <x.length; i++){
    x[i].style.display = "none";
};

slideIndex4++;
if (slideIndex4 > x.length)
{
    slideIndex4 = 1
};

x[slideIndex4-1].style.display = "block";
setTimeout(carouselFour, 2000);
};