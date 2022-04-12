searchBar = document.getElementById("searchBar");
searchButton = document.getElementById("searchButton");
form = document.getElementsByName("form");
const Url = "https://healthdata.gov/resource/rxn6-qnx8.json";
var docFrag = document.createDocumentFragment();
searchButton.addEventListener("click", processRequest, false);
var ul = document.getElementById("list");

function processRequest(event) {
    while (ul.childNodes.length > 3) {
        console.log("remove");
        ul.removeChild(ul.lastChild);
    }
    $.ajax({
        url: Url,
        type: "get", //send it through get method
        data: {
            Zip: searchBar.value,
        },
        success: function (response) {
            for (var location of response) {
                var tempNode = document
                    .getElementById("template")
                    .cloneNode(true);
                tempNode.querySelector("#providerName").innerHTML +=
                    location["provider_name"];
                tempNode.querySelector("#orderName").innerHTML +=
                    location["order_label"];
                tempNode.querySelector("#status").innerHTML +=
                    location["provider_status"];
                tempNode.querySelector("#address1").innerHTML +=
                    location["address1"] + ", " + location["address2"];
                tempNode.querySelector("#zip").innerHTML +=
                    location["city"] +
                    " " +
                    location["state_code"] +
                    ", " +
                    location["zip"];
                tempNode.querySelector("a").href = getHref(location);
                tempNode.style.display = "flex";
                if (location["provider_status"] == "ACTIVE") {
                    // tempNode.querySelector("#status").style.color = "#9fb391";
                    tempNode.querySelector("#status").style.color = "#98b877";
                } else {
                    tempNode.querySelector("#status").style.color = "#d6c069";
                }
                ul.appendChild(tempNode);
            }
            console.log(response);
        },
        error: function (xhr) {
            console.log(xhr);
        },
    });
    event.preventDefault();
    return false;
}

function getHref(location) {
    var baseUrl = "https://www.google.com/maps/search/?api=1&query=";
    address1 = location["address1"];
    address2 = location["address2"];
    city = location["city"];
    zip = location["zip"];
    return (
        baseUrl +
        encodeURIComponent(address1 + " " + address2 + " " + city + " " + zip)
    );
}
