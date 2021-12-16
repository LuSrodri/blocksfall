

function openDialog(){

    if(document.getElementById("dialogMenu").hasAttribute("open")){
        document.getElementById("dialogMenu").removeAttribute("open");
        return true;
    }
    else{
        document.getElementById("dialogMenu").setAttribute("open",null);
        return false;
    }
}