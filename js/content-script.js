var isSleeping = false;
      
const coord =  async function(e){
        if(isSleeping) return;
        isSleeping = true
        var x = e.pageX;
        var y = e.pageY;
        alert("x: "+x+"| y: "+y);
        await sleep(5000);
        isSleeping = false;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('mousemove', coord, true);  