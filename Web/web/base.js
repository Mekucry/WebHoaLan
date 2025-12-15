window.onscroll = function() {showButton()};
function showButton() {
    const button = document.getElementById("vedautrang");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}
document.getElementById("vedautrang").addEventListener("click", function(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('user').innerHTML+=`
    <br>
    <input type=text id="iptim"></input>
`;

let timkiem=document.getElementById('timkiem');
const iptim=document.getElementById('iptim');
timkiem.addEventListener('click',function(event){
    if(1==1){
        iptim.style='transform: scale(1)';
        iptim.focus();
        event.stopPropagation();
    }
});
document.addEventListener('click', function(event) {
    if (!iptim.contains(event.target )) {
        iptim.style.transform = 'scale(0)';
        iptim.value="";
    }
});

document.getElementById('timkiem').addEventListener('click', () => {
    if(iptim.value!=""){
        let ndtk=iptim.value;
        iptim.value="";
        const url = `timkiem.html?ndtk=${encodeURIComponent(ndtk)}`;
        window.location.href = url;
    }
});

function getUniqueRandomNumbers(count, min, max) {
    const numbers = [];
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
}