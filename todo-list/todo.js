//form elementini seçelim

const form = document.querySelector("#todo-form");

//input elementini seçme
const todoInput = document.querySelector("#todo");

//ul etiketini seç
const todoList = document.querySelector(".list-group");

//alert ekleyebilmek için card-bodyleri seçiyoruz
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];


const filter = document.querySelector("#filter");

const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){ //Bu fonksiyonun görevi sadece event listenerları atamak
    //Tüm event listenerlar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);

}

function clearAllTodos(e){
    if(confirm("Tüm todoarı silmek istediğinize emin misiniz?")) {
        //todoList.innerHTML = "";  //En kolay ve yavaş yöntem, küçük projelerde kullanımı okey

        while( todoList.firstElementChild != null){
        todoList.removeChild(todoList.firstElementChild);
        }

        localStorage.removeItem("todos");
    }

}





//event objesi (e) javascript otomatik olarak gönderir zaten
function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    console.log(e.target)
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLocaleLowerCase();
        if(text.indexOf(filterValue) === -1){ // === -1 indexOf eğer böyle bir dizi bulamazsa -1 döner yoksa stringin bulunduğu yerin indeksini döner
            //Bulamadı
            listItem.setAttribute("style", "display : none !important");
        }
        //ekranda todolar display: none özelliğini kazanmıyor çünkü bootstrapın d-flex özelliğini almışlar
        //Bu özellik display:block u important şeklinde kullanıyor ve bu bizim yazdığımız display : none ı baskılıyor
        //Bunu engellemek için !important ekliyoruz
        else{
            listItem.setAttribute("style", "display : block");
        }


    });

    
}

function deleteTodo(e){  // Sayfa yenilendiğinde eski todolar geri geliyor çünkü sadece arayüzden silindi şimdilik
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);  //todos arrayindeki elemanlara eşit
        showAlert("success", "Todo başarıyla silindi...")
    }

}

function deleteTodoFromStorage(deletedtodo){ //Saanırım javascripte deletetodo diye bir fonksiyon var 
    //parametrenin adını deletetodo verip o fonksiyonu seçtiğimden kod çalışmadı
    //karışıklık olmasın diye "deletedtodo" şeklinde parametremin adını güncelledim :) 
    let todos = getTodosFromStorage();
    todos.forEach(function(todo, index){
        if(todo === deletedtodo){
            todos.splice(index,1);  //Arrayden değeri silmek için splice methodunu kullandım
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos));

}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo) {
        addTodoToUI(todo);
        
    });
}

function addTodo(e){

    const newTodo = todoInput.value.trim(); //yeni todo eklenirken başında ve sonunda gereksiz boşluklar var ise siler
   
    if(newTodo === "") {

        // <div class="alert alert-danger">
        // <strong>Success!</strong> Indicates a successful or positive action.
        // </div>



        showAlert("danger", "Lütfen bir todo girin...");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Yeni todo başarı ile eklendi.");
    }

    e.preventDefault();
}
function getTodosFromStorage(){ //Storagedan bütün todoları alıyoruz
    let todos;
    if( localStorage.getItem("todos") === null){
        todos = [];


    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;

}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

}

function showAlert(type, message){
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    //setTimeout (window objesinin içinde bir method), bu method ile alertimizin bir iki saniye sonra dokümandan silinmesini sağlayabiliriz
    setTimeout(function(){
        alert.remove();
    }, 1000)

}

function addTodoToUI(newTodo){ //string değerini list-item olarak ekleme

    // <li class="list-group-item d-flex justify-content-between">
    //     Todo 1
    //     <a href = "#" class ="delete-item">
    //         <i class = "fa fa-remove"></i>
    //     </a>

    // </li>

    //HTML deki bu elementi burda dinamik bir şekilde üretiyoruz

    //List-item oluşturma
    const listItem = document.createElement("li");

    //link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className ="list-group-item d-flex justify-content-between";

    //Text node ekleme

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo List e List-item ı ekleme
    //const todoList = document.querySelector(".list-group"); zaten yukarda bu şeklide seçmiştik

    todoList.appendChild(listItem);

    todoInput.value = "";  // todo ekledikten sonra input alınan yerin temizlenmesi için
}


//Dikkat edersen sayfa yenilendiğinde todolar gidiyor çünkü storage kısmına daha bir şey eklemedik


//Dikkat edersen input alanını boş bıraktığında da boş bir todo ekleniyor bunu önlemek ve "todo giriniz" şeklinde bir mesaj
//bırakmak için

