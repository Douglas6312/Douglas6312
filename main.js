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

async function loadCandidates(){

    const Elections = Moralis.Object.extend("Elections");
    const query = new Moralis.Query(Elections);

    query.get("Ge19sfrKyE5oY8iQ5b0URvFQ").then(
        (res) => {

            if(res.attributes.election !== undefined){

                res.attributes.election.candidates.forEach(candidate => {

                    let candidateCard = `<div class="col-3">
                                    <div class="card" style="width: 18rem;">
                                        <img class="card-img-top" src="${candidate.img}" height="400" alt="Card image cap">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">${candidate.name}</h5>
                                            <button class="btn center btn-outline-success rounded-5 col-12 mt-3" id="btn-login" onclick="castVote(${candidate.candidateID})"><p class="h5">Cast vote</p></button>
                                        </div>
                                    </div>
                                </div>`;

                    $("#candidates").append(candidateCard);
                });
            }
        },
        (error) => {
            alert("Failed to find object: " + error.message);
        }
    );

}

async function castVote(candidateID){

    const Elections = Moralis.Object.extend("Elections");
    const query = new Moralis.Query(Elections);

    query.get("Ge19sfrKyE5oY8iQ5b0URvFQ").then(
        (res) => {

            if(res.attributes.election !== undefined) {
                let user = Moralis.User.current();
                let userVoted = res.attributes.election.votes.find(vote => vote.userID === user.id);

                if(userVoted !== undefined){
                    alert("User has already voted!!");
                } else {
                    res.attributes.election.votes.push({
                        userID: user.id,
                        candidateID: candidateID
                    });

                    res.save().then(
                        (res) => {
                            window.location.href = "voteCaptured.html";
                        },
                        (error) => {
                            alert("Failed to create new object, with error code: " + error.message);
                        }
                    );
                }
            }
        },
        (error) => {
            alert("Failed to find object: " + error.message);
        }
    );
}

async function loadResultsGraph(){

    const Elections = Moralis.Object.extend("Elections");
    const query = new Moralis.Query(Elections);

    query.get("Ge19sfrKyE5oY8iQ5b0URvFQ").then(
        (res) => {

            if(res.attributes.election !== undefined){

                let labels = res.attributes.election.candidates.map(candidate => candidate.name);
                let pieData = [];
                let winnerCandidate = "";
                let highestVote = 0;

                res.attributes.election.candidates.forEach(candidate => {
                    let numVotes = res.attributes.election.votes.filter(vote => vote.candidateID === candidate.candidateID).length;
                    pieData.push(numVotes);

                    if(numVotes >= highestVote){
                        highestVote = numVotes;
                        winnerCandidate = candidate;
                    }
                });

                const data = {
                    labels: labels,
                    datasets: [{
                        label: 'My First Dataset',
                        data: pieData,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                        ],
                        hoverOffset: 4
                    }]
                };

                const config = {
                    type: 'pie',
                    data: data,
                };

                const myChart = new Chart(
                    document.getElementById('myChart'),
                    config,
                );

                let winnerCard = `<div class="col-3">
                                        <div class="card" style="width: 18rem;">
                                           <img class="card-img-top" src="${winnerCandidate.img}" height="400" alt="Card image cap">
                                            <div class="card-body">
                                               <h4 class="card-title text-center">${winnerCandidate.name}</h4>
                                                <h3 class="text-center">Winner</h3>
                                                <h5 class="text-center">${highestVote} votes</h5>
                                            </div>
                                        </div>
                                    </div>`;

                $("#winnerCard").append(winnerCard);

            }
        },
        (error) => {
            alert("Failed to find object: " + error.message);
        }
    );

}


/*const Elections = Moralis.Object.extend("Elections");
const election = new Elections();
election.set("election", {
    electionID: 1,
    name: "classRepresentative",
    candidates: [
        {
            candidateID: 1,
            name: "Johannes",
            img:"img/p1.png"
        },
        {
            candidateID: 2,
            name: "Petrus",
            img:"img/p2.png"
        },
        {
            candidateID: 3,
            name: "Samuel",
            img:"img/p3.jpg"
        },
        {
            candidateID: 4,
            name: "Kian",
            img:"img/p4.png"
        }
    ],
    votes: [

    ]
})

election.save().then(
    (res) => {
        alert("New object created with objectId: " + res.id);
    },
    (error) => {
        alert("Failed to create new object, with error code: " + error.message);
    }
);*/

/*{
    userID: "2",
    candidateID:"asd3r324g24vc"
}*/


// document.getElementById("btn-login").onclick = login;
// document.getElementById("btn-logout").onclick = logOut;