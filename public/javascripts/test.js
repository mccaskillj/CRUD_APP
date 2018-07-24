QUnit.test("click add", function (assert) {
    document.getElementById("add").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["add_message"], "set title to add")
});

QUnit.test("click delete", function (assert) {
    document.getElementById("delete").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["delete_message"], "set title to delete")
});

QUnit.test("click display", function (assert) {
    document.getElementById("display").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["display_message"], "set title to display")
});

QUnit.test("click delete then add", function (assert) {
    document.getElementById("delete").click();
    document.getElementById('modal').style.display = "none";
    document.getElementById("add").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["add_message"], "set title to add")
});

QUnit.test("click add then delete", function (assert) {
    document.getElementById("add").click();
    document.getElementById('modal').style.display = "none";
    document.getElementById("delete").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["delete_message"], "set title to delete")
});

QUnit.test("click add then display", function (assert) {
    document.getElementById("add").click();
    document.getElementById('modal').style.display = "none";
    document.getElementById("display").click();
    document.getElementById('modal').style.display = "none";
    assert.ok(document.getElementById("modal-title").innerText === vars["display_message"], "set title to delete")
});

QUnit.test("statistics update 1.000", function (assert) {
    vars["additions"] = 1;
    vars["deletions"] = 1;
    vars["total_time"] = 60;
    statistic_update();
    assert.ok(document.getElementById("additions").innerText === "1.000", "got the correct additions per hour")
    assert.ok(document.getElementById("ratio").innerText === "1.000:1", "got the correct ratio")
});

QUnit.test("statistics update 2.000", function (assert) {
    vars["additions"] = 2;
    vars["deletions"] = 1;
    vars["total_time"] = 60;
    statistic_update();
    assert.ok(document.getElementById("additions").innerText === "2.000", "got the correct additions per hour")
    assert.ok(document.getElementById("ratio").innerText === "2.000:1", "got the correct ratio")
});

QUnit.test("update results", function (assert) {
    results_update("line1", "line2", "line3");
    assert.ok(document.getElementById("results1").innerHTML === "line1", "set line 1 properly");
    assert.ok(document.getElementById("results2").innerHTML === "line2", "set line 2 properly");
    assert.ok(document.getElementById("results3").innerHTML === "line3", "set line 3 properly");
});

QUnit.test("clear modal form-sets", function (assert) {
    Array.prototype.forEach.call(document.getElementsByClassName('form-set'), function (element) {
        element.style.display = 'block';
    });
    clear_modal();
    Array.prototype.forEach.call(document.getElementsByClassName('form-set'), function (element) {
        assert.ok(element.style.display === 'none', "form-set cleared properly");
    });
});

QUnit.test("clear modal text-boxes", function (assert) {
    Array.prototype.forEach.call(document.getElementsByClassName('text-box'), function (element) {
        element.value = 'hello';
    });
    clear_modal();
    Array.prototype.forEach.call(document.getElementsByClassName('text-box'), function (element) {
        assert.ok(element.value === '', "text-box cleared properly");
    });
});

QUnit.test("clear modal errors", function (assert) {
    Array.prototype.forEach.call(document.getElementsByClassName('error'), function (element) {
        element.style.display = 'block';
    });
    clear_modal();
    Array.prototype.forEach.call(document.getElementsByClassName('error'), function (element) {
        assert.ok(element.style.display === 'none', "errors hidden properly");
    });
});

QUnit.test("clear modal modal", function (assert) {
    elems["modal"].style.display = "block";
    clear_modal();
    assert.ok(elems["modal"].style.display === "none", "modal hidden properly");
});

QUnit.test("name valid good", function (assert) {
    let outcome = null;
    if (name_valid("hello")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, true, "returned true successfully");
});

QUnit.test("name valid bad", function (assert) {
    let outcome = null;
    if (name_valid("name4")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, false, "returned false successfully");
});

QUnit.test("phone valid good", function (assert) {
    let outcome = null;
    if (phone_valid("(123) 123-1234")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, true, "returned true successfully");
});

QUnit.test("phone valid bad", function (assert) {
    let outcome = null;
    if (phone_valid("1234")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, false, "returned false successfully");
});

QUnit.test("record valid good", function (assert) {
    let outcome = null;
    if (record_valid("1234567890")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, true, "returned true successfully");
});

QUnit.test("record valid bad", function (assert) {
    let outcome = null;
    if (record_valid("123456")) {
        outcome = true;
    }
    else {
        outcome = false;
    }
    assert.equal(outcome, false, "returned false successfully");
});

QUnit.test("check add good both", function (assert) {
    let outcome = null;
    if (check_add("name", "1234567890")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, true, "evaluated to true");
    assert.equal(document.getElementById('name-error').style.display, "none", "error stayed hidden");
    assert.equal(document.getElementById('phone-error').style.display, "none", "error stayed hidden");
});

QUnit.test("check add good name", function (assert) {
    let outcome = null;
    if (check_add("n1ame", "1234567890")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, false, "evaluated to false");
    assert.equal(document.getElementById('name-error').style.display, "inline", "error stayed hidden");
    assert.equal(document.getElementById('phone-error').style.display, "none", "error stayed hidden");
});

QUnit.test("check add good phone", function (assert) {
    let outcome = null;
    if (check_add("name", "123456")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, false, "evaluated to false");
    assert.equal(document.getElementById('name-error').style.display, "none", "error stayed hidden");
    assert.equal(document.getElementById('phone-error').style.display, "inline", "error stayed hidden");
});

QUnit.test("check add good bad", function (assert) {
    let outcome = null;
    if (check_add("n1ame", "1234")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, false, "evaluated to false");
    assert.equal(document.getElementById('name-error').style.display, "inline", "error stayed hidden");
    assert.equal(document.getElementById('phone-error').style.display, "inline", "error stayed hidden");
});

QUnit.test("check del/dis good", function (assert) {
    let outcome = null;
    if (check_del_dis("1234567890")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, true, "evaluated to true");
    assert.equal(document.getElementById('record-error').style.display, "none", "error stayed hidden");
});

QUnit.test("check del/dis good", function (assert) {
    let outcome = null;
    if (check_del_dis("1234")) {
        outcome = true;
    } else {
        outcome = false;
    }
    assert.equal(outcome, false, "evaluated to false");
    assert.equal(document.getElementById('record-error').style.display, "inline", "error stayed hidden");
});

QUnit.test("parse phone full", function (assert) {
    assert.equal(parse_phone("(123) 456-7890"), "(123) 456-7890", "parsed phone number");
});

QUnit.test("parse phone mid", function (assert) {
    assert.equal(parse_phone("123-456-7890"), "(123) 456-7890", "parsed phone number");
});

QUnit.test("parse phone minimal", function (assert) {
    assert.equal(parse_phone("1234567890"), "(123) 456-7890", "parsed phone number");
});
