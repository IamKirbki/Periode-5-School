let perPage = 50;
let page = 1;
let direction = false;

function changePerPage(per) {
    perPage = per;
    paginationFix();
}

function search(e) {
    let elementList = document.querySelectorAll('.container');
    for (const element of elementList) {
        if (element.lastChild.innerHTML.includes(e)) {
            element.dataset['isHidden'] = "false";
            element.style.display = 'inherit';
        } else {
            element.style.display = 'none';
            element.dataset['isHidden'] = "true";
        }
        if (e === "") {
            element.style.display = 'inherit';
            delete element.dataset['isHidden'];
        }
    }
    if (e === "") {
        page = 1;
        paginationFix();
    }
}

function paginationFix() {
    let elementList = document.querySelectorAll('.container');
    let filteredElementList = [];
    for (const element of elementList) {
        if (element.dataset['isHidden']) {
            if (element.dataset['isHidden'] === "false") {
                filteredElementList.push(element);
            }
        } else {
            filteredElementList = elementList;
            break;
        }
    }
    for (const element of elementList) {
        element.style.display = 'none';
    }
    for (let i = perPage * (page - 1); i < perPage * page; i++) {
        if (filteredElementList[i]) {
            filteredElementList[i].style.display = 'inherit';
        } else {
            break;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    paginationFix();
})

function next() {
    let elementList = document.querySelectorAll('.container');
    let filteredElementList = [];
    for (const element of elementList) {
        if (element.dataset['isHidden']) {
            if (element.dataset['isHidden'] === "false") {
                filteredElementList.push(element);
            }
        } else {
            filteredElementList = elementList;
            break;
        }
    }
    if (page !== Math.round(filteredElementList.length / perPage) + 1) {
        page++;
        paginationFix();
    }
}

function prev() {
    if (page !== 1) {
        page--;
        paginationFix();
    }
}

function sort(sortBy) {
    let html = document.querySelectorAll('.container');
    let oldHtml = [...html]
    for (const htmlElement of oldHtml) {
        htmlElement.remove();
    }
    oldHtml.sort((A, B) => {
        let a = parseInt(A.dataset[sortBy]);
        let b = parseInt(B.dataset[sortBy]);
        return a - b;
    })
    if(direction === true){
        oldHtml.reverse();
    }
    for (const htmlElement of oldHtml) {
        document.body.appendChild(htmlElement);
    }
    paginationFix();
}

function reverseSort(){
    if(direction === true){
        direction = false
    } else if (direction === false) {
        direction = true
    }else {
        return "How is direction removed?";
    }
    sort(document.querySelector('select').value)
}