let vars = {
    // statistics variables
    "additions": 0,
    "deletions": 0,
    "total_time": 1,
    "selected_row_id": "",
    "toast_timeout": undefined,

    //constants
    "add_message": "Add Record",
    "delete_message": "Delete Record",
    "display_message": "Display Record",
};

const elems = {
    "modal": document.getElementById('modal'),
    "add_div": document.getElementById('add-div'),
    "del_dis_div": document.getElementById('del-dis-div'),
    "title": document.getElementById('modal-title'),
    "add": document.getElementById("add"),
    "del": document.getElementById("delete"),
    "dis": document.getElementById("display"),
    "submit": document.getElementById("submit"),
    "no": document.getElementById("no"),
    "span": document.getElementsByClassName("close")[0]
};

// When the user clicks on the button, open the modal
elems.add.onclick = function () {
    elems.title.innerText = vars.add_message;
    elems.submit.innerText = "Submit";
    elems.add_div.style.display = "block";
    elems.modal.style.display = "block";
};

elems.del.onclick = function () {
    if (vars.selected_row_id === "") {
        toast_show("Please select a record in table");
        return;
    }
    elems.title.innerText = vars.delete_message;
    elems.submit.innerText = "Yes";
    elems.no.style.visibility = 'visible';
    document.getElementById("del-dis-text").innerText = "Delete record " + vars.selected_row_id + "?";
    elems.del_dis_div.style.display = "block";
    elems.modal.style.display = "block";
};

elems.dis.onclick = function () {
    if (vars.selected_row_id === "") {
        toast_show("Please select a record in table");
        return;
    }
    elems.dis.innerText = "Fetching...";
    display_ajax("/notes/" + vars.selected_row_id);
};

function statistic_update() {
    let additions_per_hour = vars.additions / (vars.total_time / 60),
        deletions_per_hour = vars.deletions / (vars.total_time / 60);

    document.getElementById("additions").innerText = additions_per_hour.toFixed(3);
    if (deletions_per_hour === 0) {
        document.getElementById('ratio').innerText = "N/A";
    }
    else {
        document.getElementById('ratio').innerText = (additions_per_hour / deletions_per_hour).toFixed(3) + ":1";
    }
}

function clear_modal() {
    Array.prototype.forEach.call(document.getElementsByClassName('form-set'), function (element) {
        element.style.display = 'none';
    });
    Array.prototype.forEach.call(document.getElementsByClassName('text-box'), function (element) {
        element.value = '';
    });
    Array.prototype.forEach.call(document.getElementsByClassName('error'), function (element) {
        element.style.display = 'none';
    });
    elems.no.style.visibility = 'hidden';
    elems.modal.style.display = "none";
}

function click_row() {
    Array.prototype.forEach.call(document.getElementsByClassName('table_row'), function (element) {
        if (element.rowIndex % 2 === 0) {
            element.style.background = "white";
        } else {
            element.style.background = "lightgrey";
        }
    });
    if (this.id !== vars.selected_row_id) {
        document.getElementById(this.id).style.background = "#D46250";
        vars.selected_row_id = this.id;
    } else {
        vars.selected_row_id = "";
    }
}

function table_add_row(id, name) {
    let table = document.getElementById("record_table");

    let row = table.insertRow();
    row.id = id;
    row.onclick = click_row;
    row.className = "table_row";

    let id_cell = row.insertCell(0);
    let name_cell = row.insertCell(1);

    id_cell.innerHTML = id;
    name_cell.innerHTML = name;
}

function table_delete_row(id) {
    let row = document.getElementById(id);
    row.parentNode.removeChild(row);
}

function toast_show(message) {
    let toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "show";

    clearTimeout(vars.toast_timeout);

    vars.toast_timeout = setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

function add_ajax(url, name, phone) {
    if (url === undefined) {
        url = "/";
    }
    if (name === undefined) {
        name = "";
    }
    if (phone === undefined) {
        phone = "";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let response = {};
        if (this.readyState === 4 && this.status === 200) {
            response = JSON.parse(this.responseText);
            table_add_row(response.id, name);
            toast_show("Record added. ID: " + response.id);
            vars.additions = vars.additions + 1;

            statistic_update();
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("Name=" + name + "&PhoneNumber=" + phone);
}

function delete_ajax(url, record) {
    if (url === undefined) {
        url = "/";
    }
    if (record === undefined) {
        record = "";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let response = {};
        if (this.readyState === 4 && this.status === 200) {
            response = JSON.parse(this.responseText);
            if ("Error" in response) {}
            else {
                vars.deletions = vars.deletions + 1;
                table_delete_row(record);
                vars.selected_row_id = "";
                toast_show("Record deleted. ID: " + record);
                statistic_update();
            }
        }
    };
    xhttp.open("DELETE", url, true);
    xhttp.send();
}

function display_ajax(url) {
    if (url === undefined) {
        url = "/";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let response = {};
        if (this.readyState === 4 && this.status === 200) {
            response = JSON.parse(this.responseText);
            if ("Error" in response) {}
            else {
                elems.dis.innerText = "Display Record";
                elems.dis.disabled = false;
                elems.title.innerText = vars.display_message;
                elems.submit.innerText = "Done";
                document.getElementById("del-dis-text").innerHTML = "<br>Phone Number: </br>" + response.PhoneNumber;
                elems.del_dis_div.style.display = "block";
                elems.modal.style.display = "block";
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function name_valid(name) {
    if (name === undefined) {
        name = "";
    }
    document.getElementById('name-error').style.display = "none";
    return name.match('^[\\D\\s]+$');
}

function phone_valid(phone) {
    if (phone === undefined) {
        phone = "";
    }
    document.getElementById('phone-error').style.display = "none";
    return phone.match('^\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$');
}

function check_add(name, phone) {
    if (name === undefined) {
        name = "";
    }
    if (phone === undefined) {
        phone = "";
    }
    let name_is_valid = name_valid(name);
    let phone_is_valid = phone_valid(phone);
    if (!(name_is_valid)) {
        document.getElementById('name-error').style.display = "inline";
    }
    if (!(phone_is_valid)) {
        document.getElementById('phone-error').style.display = "inline";
    }

    return name_is_valid && phone_is_valid;
}


function parse_phone(phone) {
    if (phone === undefined) {
        phone = "";
    }
    phone = phone.replace(/\D/g, '');
    phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "\($1\) $2-$3");
    return phone;
}

elems.submit.onclick = function () {
    let name = document.getElementById("name").value;
    let phone = parse_phone(document.getElementById("phone").value);
    if (elems.title.innerText === vars.add_message) {
        if (!(check_add(name, phone))) {
            return false;
        }
        add_ajax("/notes", name, phone);
    }
    if (elems.title.innerText === vars.delete_message) {
        delete_ajax("/notes/" + vars.selected_row_id, vars.selected_row_id);
    }

    clear_modal();
};

elems.no.onclick = function () {
    clear_modal();
};

setInterval(function () {
    vars.total_time = vars.total_time + 1;
    statistic_update();
}, 60000);

// When the user clicks on <span> (x), close the modal
elems.span.onclick = function () {
    clear_modal();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === elems.modal) {
        clear_modal();
    }
};

window.onload = function () {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let response = {};
        if (this.readyState === 4 && this.status === 200) {
            response = JSON.parse(this.responseText);
            vars.additions = response.Additions;
            vars.deletions = response.Deletions;
            vars.total_time = response.Time;
            statistic_update();
            let arrayLength = response.Records.length;
            for (let i = 0; i < arrayLength; i++) {
                table_add_row(response.Records[i].ID, response.Records[i].Name);
            }
        }
    };
    xhttp.open("GET", "/statistics", true);
    xhttp.send();
};

//W3schoools
function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("record_table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
