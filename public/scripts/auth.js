document.addEventListener("DOMContentLoaded", (e) => {
    if(document.getElementById("inputFormRegister")){
        document.getElementById("inputFormRegister").addEventListener("submit", function (event) {
            event.preventDefault();

            let password = document.getElementById('password').value
            let passwordRepeat = document.getElementById('passwordRepeat').value
            let name = document.getElementById("inputFormRegister").children[1].value
            let email = document.getElementById("inputFormRegister").children[3].value

            if (!email.includes("@") || !email.includes(".")) {
                alert("Please fill in a email at email")
                email.value = "";
                return "failed";
            }

            if (password !== passwordRepeat) {
                alert("The passwords do not match")
                document.getElementById("password").value = "";
                document.getElementById("passwordRepeat").value = "";
                return "failed;"
            }

            if (password.length <= 5) {
                alert("The password atleast has to be 6 characters")
                document.getElementById("password").value = "";
                document.getElementById("passwordRepeat").value = "";
                return "failed";
            }

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/register/attempt', true);
            xhr.setRequestHeader('Content-type', 'application/json');

            let data = {
                name: name,
                email: email,
                password: password
            };

            let JSONData = JSON.stringify(data);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    document.getElementById("message").innerHTML = xhr.responseText.replaceAll('"', "");
                    document.getElementById("message").style.display = "inherit";
                    document.querySelectorAll('input').forEach((e) => {
                        e.value = "";
                    })
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            };

            xhr.onerror = function () {
                console.error('request failed')
            }

            xhr.send(JSONData);
        })
    } else if (document.getElementById("inputFormLogin")) {
        document.getElementById("inputFormLogin").addEventListener("submit", function (event) {
            event.preventDefault();

            let password = document.getElementById('password').value
            let name = document.getElementById("inputFormLogin").children[0].value
            let email = document.getElementById("inputFormLogin").children[1 ].value

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/login/attempt', true);
            xhr.setRequestHeader('Content-type', 'application/json');

            let data = {
                name: name,
                email: email,
                password: password
            };

            let JSONData = JSON.stringify(data);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    document.getElementById("message").innerHTML = xhr.responseText;
                    document.getElementById("message").style.display = "inherit";
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            };

            xhr.onerror = function () {
                console.error('request failed')
            }

            xhr.send(JSONData);
        })
    }
})
