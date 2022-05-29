/* Moralis init code */
const serverUrl = "https://qdu3tulq5ntj.usemoralis.com:2053/server";
const appId = "XHcKyEO10snOHf6MfNYCgMijZ4MsDtVKJFumx7Bt";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
    console.log("logging in");
    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({
            signingMessage: "Log in using Moralis",
        })
            .then(function (user) {
                window.location.href = "election.html";
                console.log("logged in user:", user);
                console.log(user.get("ethAddress"));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

async function logOut() {
    console.log("logging out");
    await Moralis.User.logOut();
    console.log("logged out");
    window.location.href = "index.html";
}

// document.getElementById("btn-login").onclick = login;
// document.getElementById("btn-logout").onclick = logOut;