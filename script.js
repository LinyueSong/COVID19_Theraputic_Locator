searchBar = document.getElementById("searchBar");
searchButton = document.getElementById("searchButton");
form = document.getElementsByName("form");
const Url = "https://healthdata.gov/resource/rxn6-qnx8.json";
var docFrag = document.createDocumentFragment();
searchButton.addEventListener("click", getNearbyZipCodes, false);
var ul = document.getElementById("list");

function processRequest(zipCodes) {
    for (var zipCode of zipCodes) {
        $.ajax({
            url: Url,
            type: "get", //send it through get method
            data: {
                Zip: zipCode,
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
                        location["address1"];
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
                        tempNode.querySelector("#status").style.color =
                            "#98b877";
                    } else {
                        tempNode.querySelector("#status").style.color =
                            "#d6c069";
                    }
                    ul.appendChild(tempNode);
                }
            },
            error: function (xhr) {
                console.log(xhr);
            },
        });
    }
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

function addWarning(text) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    li.style.color = "#eb4034";
    li.style.border = "none";
    ul.appendChild(li);
}

function getNearbyZipCodes(event) {
    while (ul.childNodes.length > 3) {
        console.log("remove");
        ul.removeChild(ul.lastChild);
    }
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(searchBar.value);
    if (!isValidZip) {
        addWarning("Invalid Zip Code!");
        searchBar.value = "";
    } else {
        api_key =
            "js-NBlgVQpcGbueVcE2X4N5SWEtV8xAIFoHTLASzkrOHXGOSq9L3IAEg0zLmiSiMqTC";
        // var api_key =
        //     "VmG2l7Mlxc0DCDnRhoC0WyBSPKXNdNULx0iEhlePDnEbJQ2u8jA2ut9czYUHbl7d";
        var url =
            "https://www.zipcodeapi.com/rest/" +
            api_key +
            "/radius.json/" +
            searchBar.value +
            "/5/miles?minimal";
        console.log(url);
        $.ajax({
            url: url,
            type: "get", //send it through get method,
            success: function (response) {
                console.log(response);
                processRequest(response["zip_codes"]);
            },
            error: function (xhr) {
                console.log(xhr);
                addWarning("Invalid Zip Code!");
                searchBar.value = "";
            },
        });
    }
    event.preventDefault();
    return false;
}
