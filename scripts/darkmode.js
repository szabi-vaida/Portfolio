var isDarkMode = localStorage.getItem('isDarkMode');
var checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        localStorage.setItem('isDarkMode', 'true');
    } else {
        localStorage.setItem('isDarkMode', 'false'); 
    }
    DarkMode();
});

if (isDarkMode === 'true') {
    checkbox.checked = true;
    DarkMode(); 
}

function DarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }
