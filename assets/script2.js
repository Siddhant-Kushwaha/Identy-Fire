const wave1 = "M0 108.306L50 114.323C100 120.34 200 132.374 300 168.476C400 204.578 500 264.749 600 246.698C700 228.647 800 132.374 900 108.306C1000 84.2382 1100 132.374 1150 156.442L1200 180.51V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V108.306Z",
      wave2 = "M0 250L50 244.048C100 238.095 200 226.19 300 226.19C400 226.19 500 238.095 600 232.143C700 226.19 800 202.381 900 196.429C1000 190.476 1100 202.381 1150 208.333L1200 214.286V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
      wave3 = "M0 250L50 238.095C100 226.19 200 202.381 300 166.667C400 130.952 500 83.3333 600 101.19C700 119.048 800 202.381 900 214.286C1000 226.19 1100 166.667 1150 136.905L1200 107.143V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
      wave4 = "M0 125L50 111.111C100 97.2222 200 69.4444 300 97.2222C400 125 500 208.333 600 236.111C700 263.889 800 236.111 900 229.167C1000 222.222 1100 236.111 1150 243.056L1200 250V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V125Z";

anime({
  targets: '.wave-top > path',
  easing: 'linear',
  duration: 7500,
  loop: true,
  d: [
    { value: [wave1, wave2] },
    { value: wave3 },
    { value: wave4 },
    { value: wave1 },
  ],
});


window.addEventListener('keyup',(e)=>{
    if(e.key==="Enter"){
        document.querySelector('.submitBtn').click();
    }
})
video=document.querySelector('video');
submit=document.querySelector('.submitBtn');
// div=document.querySelector('div');
console.log('hiii');
function getMedia(){
    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false
    })
    .then((stream)=>{
        video.srcObject=stream;
        video.load();
    })
    .catch((e)=>{
        console.log(e);
    })
}

getMedia();

submit.addEventListener('click',async(e)=>{
    e.preventDefault();
    let Canvas = document.createElement("canvas");
    let destCtx = Canvas.getContext('2d'); 
    Canvas.height = 500;  
    Canvas.width = 500; 
    destCtx.translate(video.videoWidth, 0);  
    destCtx.scale(-1, 1);  
    destCtx.drawImage(video, 0, 0);
    let imagebase64data = Canvas.toDataURL("image/png");  
    imagebase64data = imagebase64data.replace('data:image/png;base64,', '');
    document.querySelector('.hidden-field').value=imagebase64data;
    form=document.querySelector('.form1');
    // console.log(form);
    form.submit();
    // fetch('http://127.0.0.1:5000/test',{
    //     method: 'POST',  
    //     body: JSON.stringify({
    //         title: "Siddhant",
    //         data: imagebase64data ,
    //         userId: 1
    //     }),
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    // })
    // .then(data=>data.json())
    // .then(data=>{
    //     canvas=document.querySelector('.canvas2')
    //     ctx=canvas.getContext('2d');
    //     var myImage = new Image();
    //     for(let i=0;i<=100;i++){
    //         console.log(data.image[i]);
    //     }
    //     imageNew=data.image.split('\'')[1];

    //     for(let i=0;i<=100;i++){
    //         console.log(imageNew[i]);
    //     }
    //     myImage.onload = function() {
    //         ctx.drawImage(myImage, 0, 0);
    //       };
    //     myImage.src = 'data:image/jpeg;base64,'+imageNew;
    //     // ctx.drawImage(myImage, 0, 0);
    // })
    // .catch(e=>{
    //     console.log(e);
    // })
})