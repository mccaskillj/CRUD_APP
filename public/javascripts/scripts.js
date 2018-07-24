let vars = {
    // statistics variables
    "additions": 0,
    "deletions": 0,
    "total_time": 1,

    //constants
    "add_message": "Add Record",
    "delete_message": "Delete Record",
    "display_message": "Discard Record",
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
    "span": document.getElementsByClassName("close")[0]
};

// When the user clicks on the button, open the modal
elems.add.onclick = function () {
    elems.title.innerText = vars.add_message;
    elems.add_div.style.display = "block";
    elems.modal.style.display = "block";
};

elems.del.onclick = function () {
    elems.title.innerText = vars.delete_message;
    elems.del_dis_div.style.display = "block";
    elems.modal.style.display = "block";
};

elems.dis.onclick = function () {
    elems.title.innerText = vars.display_message;
    elems.del_dis_div.style.display = "block";
    elems.modal.style.display = "block";
};

function statistic_update() {
    let additions_per_hour = vars.additions / (vars.total_time / 60),
        deletions_per_hour = vars.deletions / (vars.total_time / 60);

    document.getElementById("additions").innerText = additions_per_hour.toFixed(3);
    if (deletions_per_hour === 0) {
        document.getElementById('ratio').innerText = "No Deletions Have Been Made";
    }
    else {
        document.getElementById('ratio').innerText = (additions_per_hour / deletions_per_hour).toFixed(3) + ":1";
    }
}

function results_update(line1, line2, line3) {
    if (line1 === undefined) {
        line1 = "";
    }
    if (line2 === undefined) {
        line2 = "";
    }
    if (line3 === undefined) {
        line3 = "";
    }
    document.getElementById("results1").innerHTML = line1;
    document.getElementById("results2").innerHTML = line2;
    document.getElementById("results3").innerHTML = line3;
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
    elems.modal.style.display = "none";
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
            results_update(
                "<b>Name:</b> " + name,
                "<b>Phone:</b> " + phone,
                "Added with ID " + response.id
            );
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
            if ("Error" in response) {
                results_update("ID " + record + " does not exist", "", "");
            }
            else {
                results_update("ID " + record + " deleted", "", "");
                vars.deletions = vars.deletions + 1;
                statistic_update();
            }
        }
    };
    xhttp.open("DELETE", url, true);
    xhttp.send();
}

function display_ajax(url, record) {
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
            if ("Error" in response) {
                results_update("ID " + record + " does not exist", "", "");
            }
            else {
                results_update(
                    "<b>Name:</b> " + response.Name,
                    "<b>Phone Number:</b> " + response.PhoneNumber,
                    "");
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

function record_valid(record) {
    if (record === undefined) {
        record = "";
    }
    document.getElementById('record-error').style.display = "none";
    return record.match('^\\d{10}$');
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

function check_del_dis(record) {
    if (record === undefined) {
        record = "";
    }
    if (!(record_valid(record))) {
        document.getElementById('record-error').style.display = "inline";
        return false;
    }
    return true;
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
    let record = document.getElementById("record").value;
    if (elems.title.innerText === vars.add_message) {
        if (!(check_add(name, phone))) {
            return false;
        }
        add_ajax("/notes", name, phone);
    }
    if (elems.title.innerText === vars.delete_message) {
        if (!(check_del_dis(record))) {
            return false;
        }
        delete_ajax("/notes/" + record, record);
    }
    if (elems.title.innerText === vars.display_message) {
        if (!(check_del_dis(record))) {
            return false;
        }
        display_ajax("/notes/" + record, record);
    }
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
        }
    };
    xhttp.open("GET", "/statistics", true);
    xhttp.send();
};