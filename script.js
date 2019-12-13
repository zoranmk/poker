var numP = 5; //broj igrača
var deck = [];
var players = []; 
var table = [];
var playersCombs = [];

//Napravi špil
for(var i=0; i<52; i++){
    deck.push(new Card(Math.floor(i/13), i%13));
}
shuffle();

//Napravi igrače
for(var i=0; i<numP; i++){
    players.push(new Player);
}

//Deli igračima
dealP();

//Deli sto
flop();
turn();
river();

function Card(suit,value){
    this.suit = suit;
    this.value = value;
}

function Player(){
    this.money = 1000;
    this.pos = players.length;
    this.hand = [];
}

function bestScore(scores){
    var bestType = scores[0].type;
    var bestTypeInd = [];
    for(var i=1; i<scores.length; i++){
        if(scores[i].type>bestType){
            bestType = scores[i].type;
        }
    }
    for(var i=0; i<scores.length; i++){
        if(scores[i].type==bestType){
            bestTypeInd.push(i);
        }
    }
    var bestInd = bestTypeInd[0];
    for(var i=1; i<bestTypeInd.length; i++){
        if(compareVal(scores[bestInd].value, scores[bestTypeInd[i]].value)==1){
            bestInd = i;
        }
    }
    return {comb: scores[bestInd], ind: bestInd};
}

function sortVal(comb){
    do{
        var swapDone = false;
        for(var i=0; i<comb.length-1; i++){
            if(comb[i].value>comb[i+1].value){
                var tmp = comb[i];
                comb[i] = comb[i+1];
                comb[i+1] = tmp;
                swapDone = true;
            }
        }
    } while(swapDone);
    return comb;
}

function sortSuit(comb){
    do{
        var swapDone = false;
        for(var i=0; i<comb.length-1; i++){
            if(comb[i].suit>comb[i+1].suit){
                var tmp = comb[i];
                comb[i] = comb[i+1];
                comb[i+1] = tmp;
                swapDone = true;
            }
        }
    } while(swapDone);
    return comb;
}

function shuffle(moves = 100) {
    for(var i=0; i<moves; i++){
        var k1 = Math.floor(Math.random() * 52);
        var k2;
        do {
            k2 = Math.floor(Math.random() * 52);
        } while (k2 == k1);
        tmp = deck[k1];
        deck[k1] = deck[k2];
        deck[k2] = tmp;
    }
}

function dealP(){
    for(var i=0; i<numP; i++){
        players[i].hand.push(deck.pop());
        players[i].hand.push(deck.pop());
    }
}

function flop(){
    for(var i=0; i<3; i++){
        table.push(deck.pop());
    }
}

function turn(){
    table.push(deck.pop());
}

function river(){
    turn();
}

function compareVal(a, b){
    for(var i=0; i<a.length; i++){
        if(a[i]<b[i]){
            return 1; //b je veće
        } else if(a[i]>b[i]){
            return 0; //a je veće
        } else{
            i++;
        }
    }
}

function getCombinations(){
    
    //Pravljenje svih kombinacija svih karata igrača i zajedničkih
    
    playersCombs = [];
    var playersScores = [];
    for(var i=0; i<numP; i++){
        set = [players[i].hand[0], players[i].hand[1], table[0], table[1], table[2], table[3], table[4]]; //Sastavljanje skupa 7 karata
        combs = [];
        numCom = 0; //Broj kombinacija vec dodatih (od 21)
        ex1 = 0, ex2 = 1; //Karte koje se ne koriste u kombinaciji
        while(numCom<21){
            var j = 0; //Indeks skupa 7 karata
            var k = 0; //Broj karata dodatih u kombinaciju
            comb = [];
            while(k<5){
                if(j!=ex1 && j!=ex2){
                    comb[k] = set[j];
                    k++;
                }
                j++;
            }
            combs.push(comb);
            numCom++;
            if(ex2<6){
                ex2++;
            } else if (ex1!=5){
                ex1++;
                ex2=ex1+1;
            }
        }
        playersCombs.push(combs);
    }
    for(var pInd=0; pInd<numP; pInd++){ //za svakog igrača
        var playerScore = [];
        for (var combInd=0; combInd<21; combInd++){ //i sveku njegovu kombinaciju
            var tmpComb = sortVal(playersCombs[pInd][combInd]); //sortiranje kombinacije po vrednosti karte
            var score;
            var numC = [0,0,0,0,0,0,0,0,0,0,0,0,0];
            for(var cardInd=0; cardInd<5; cardInd++){
                numC[tmpComb[cardInd].value]++;
            }
            var kickers = false;
            for(var numCInd=12; numCInd>=0; numCInd--){ //za svaki broj karata sa istom vrednoscu (iz kombinacije)
                score = {type: null, value:[]};
                switch(numC[numCInd]){
                    case 4:
                        score.type = 7; //poker
                        score.value.push(numCInd);
                        break;
                    case 3:
                        score.type = 3; //triling
                        score.value.push(numCInd);
                        for(var numCInd2=numCInd-1; numCInd2>=0; numCInd2--){
                            if(numC[numCInd2]==2){
                                score.type = 6; //full
                                score.value.push(numCInd2);
                                break;
                            }
                        }
                        break;
                    case 2:
                        score.value.push(numCInd);
                        for(var numCInd2=numCInd-1; numCInd2>=0; numCInd2--){
                            score.type = 1; //par
                            if(numC[numCInd2]==3){
                                score.type = 6; //full
                                score.value.unshift(numCInd2);
                                break;
                            } else if(numC[numCInd2]==2){
                                score.type = 2; //dva para
                                score.value.push(numCInd2);
                                break;
                            }
                        }
                            if(score.type == 1 || score.type == 2){
                                for(var numCInd2=12; numCInd2>=0; numCInd2--){
                                    if(numC[numCInd2]===1){
                                        score.value.push(numCInd2);
                                    }
                                }
                            }
                        break;
                    
                    }
                    if(!score.type){ //ako nema istih karata
                        var straight = true;
                        if(tmpComb[0].value==0){ //može biti wheel kenta
                            for(var cardInd=0; cardInd<3; cardInd++){
                                if(tmpComb[cardInd].value!=tmpComb[cardInd+1].value+1){
                                    straight = false;
                                    break;
                                }
                            }
                            if(straight){
                                switch(tmpComb[4].value){
                                    case 12: //wheel kenta
                                        score.type = 4; //kenta
                                        score.value.push(0);
                                        break;
                                    case 4: // 23456 kenta
                                        score.type = 4; //kenta
                                        score.value.push(1);
                                        break;
                                }
                            }
                        } else{
                            for(var cardInd=0; cardInd<4; cardInd++){
                                if(tmpComb[cardInd].value!=tmpComb[cardInd+1].value+1){
                                    straight = false;
                                    break;
                                }
                            }
                            if(straight){
                                score.type = 4; //kenta;
                                score.value.push(tmpComb[0].value + 1);
                            }
                        }
                        var flush = true;
                        for(var cardInd=0; cardInd<4; cardInd++){
                            if(tmpComb[cardInd].suit!=tmpComb[cardInd+1].suit){
                                flush = false;
                                break;
                            }
                        }
                        if(flush){
                            if(straight){
                                if(tmpComb[0] == 8){
                                    score.type = 9; //royal flush
                                } else{
                                    score.type = 8; //straight flush
                                    score.value = tmpComb[0].value + 1;
                                }
                            } else {
                                score.type = 5; //flush
                                for(var cardInd=4; cardInd>=0; cardInd--){
                                    score.value.push(tmpComb[cardInd]);
                                }
                            }
                        }
                    }
                    if(!score.type){
                        score.type = 0; //high card
                        for(var cardInd=4; cardInd>=0; cardInd--){
                            score.value.push(tmpComb[cardInd].value);
                        }
                    }
                    if(score.type!=0){
                        break;
                    }
                }
                playerScore.push(score);
            }
            playersScores.push(playerScore);
            // console.log(numC);
        }
        return playersScores;
}

function eval(){
    var pScores = getCombinations(); //sve kombinacije svih igrača
    var bestPCombInd = []; //indeksi najboljih kombinacija svakog od igrača
    var bestPCombs = [];
    var bestP;
    for (var i=0; i<pScores.length; i++){
        var best = bestScore(pScores[i]);
        bestPCombInd.push(best.ind);
        bestPCombs.push(best.comb);
    }
    bestP = bestScore(bestPCombs).ind;
    return {player: bestP, combInd: bestPCombInd[bestP]};
}