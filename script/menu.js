

function openDialog(){

    if(document.getElementById("dia").hasAttribute("open")){
        document.getElementById("dia").removeAttribute("open");
        return true;
    }
    else{
        document.getElementById("dia").setAttribute("open",null);
        return false;
    }
}