const gameController = (() => {
    // create an object for all arrays
    const allArrays = {
        allCards: ['c-ace','c-2','c-3','c-4','c-5','c-6','c-7','c-8','c-9','c-10','c-jack','c-king','c-queen',
                    'd-ace','d-2','d-3','d-4','d-5','d-6','d-7','d-8','d-9','d-10','d-jack','d-king','d-queen',
                    'h-ace','h-2','h-3','h-4','h-5','h-6','h-7','h-8','h-9','h-10','h-jack','h-king','h-queen',
                    's-ace','s-2','s-3','s-4','s-5','s-6','s-7','s-8','s-9','s-10','s-jack','s-king','s-queen',],
        playerCards: [],
        comCards: [],
        shuffleArray: [],
        tableCards: [],
        currentCard: [],
        count: 0
    };
    //return an object of all necessities
    return {
        getAllArrays: () => {
            return allArrays;
        },
        // create a function to generate a card array
        generateCardArray: (allCards , amount) => {
            let genArray = [];
            for (let i = 0; i < amount; i++) {
                genArray.push(allCards.pop());
            }
            return genArray;
        },
        // create a function to randomly generate an array of length len with a number not existing more tahn once
        generateRandomArray: (array, len)  => {
            const genRandNumber = () => {
                return Math.ceil(Math.random()*len - 1);
            }
            num =  genRandNumber();
            running = true;
            while (running) {
                if (array.length < len){
                    if (array.indexOf(num) < 0){
                        array.push(num);
                    }else {
                        num = genRandNumber();
                    } 
                } else {
                    running = false;
                }
            }
            return array;
        }
    };
})();


const interfaceController = (() => {
    let comScore = 0;
    let playerScore = 0;
    return {
        // create a function to display player starting cards
        displayPlayerStartingCard: (cardArr) => {
            let i = 0;
            let interval = setInterval(() => {
                let img = document.createElement('img');
                let div = document.querySelector('.player');
                img.src = `images/${cardArr[i]}.png`;
                img.classList.add('card');
                div.insertBefore(img, document.querySelector('.player').firstChild);
                img.setAttribute('id', cardArr[i]);
                i++;
                if ( i == 5) {
                    clearInterval(interval);
                }
            }, 500);
        },
        // create a function to display com starting cards
        displayComStartingCard: () => {
            let i = 0;
            let interval = setInterval(() => {
                let img = document.createElement('img');
                let div = document.querySelector('.com');
                img.src = `images/card-back.png`;
                img.classList.add('card');
                div.insertBefore(img, document.querySelector('.com').firstChild);
                i++;
                if ( i == 5) {
                    clearInterval(interval);
                }
            }, 500);
        },
        displayCard: (type, val, bool, dsp) => {
            if (type == 'com') {
                src = 'images/card-back.png';
                imgClass = 'card';
                thisdiv = '.com';
                pos = false;
            } else if (type == 'player') {
                src = `images/${val}.png`;
                imgClass =  'card';
                thisdiv = '.player';
                pos = false;
            } else {
                src = `images/${val}.png`;
                imgClass =  'card active';
                thisdiv = '.active-cards';
                pos = true;
            } 
            const displayImage = () => {
                let img = document.createElement('img');
                let div = document.querySelector(thisdiv);
                img.src = src;
                if (dsp) {
                    img.setAttribute('id', val);
                }
                img.setAttribute('class', imgClass);
                if (pos) {
                    div.appendChild(img);
                } else {
                    div.insertBefore(img, document.querySelector(thisdiv).firstChild);
                }
                
            }
            if (bool) {
                setTimeout(() => {
                    displayImage();
                }, 3000);
            } else {
                displayImage();
            } 
        },
        // create a function to shuffle cards
        shuffleCards: (array, shuffleIndex) => {
            inc = 0;
            helpingArray = [];
            while (inc < array.length) {
                helpingArray.push(array[shuffleIndex[inc]]);
                inc++;
            }
            return helpingArray;
        },
        paginateCards: () => {
            let children = document.querySelector('.player').childNodes;
            if (children.length > 11) {
                document.querySelector('.prev').style.display = 'block';
                document.querySelector('.next').style.display = 'block';
                document.querySelector('.no-cards-left').style.display = 'block';
                console.log('Hi Meezy');
                for (let i = 10; i < (children.length - 1); i++) {
                    children[i].style.display = 'none';
                }
            } else {
                document.querySelector('.prev').style.display = 'none';
                document.querySelector('.next').style.display = 'none';
                document.querySelector('.no-cards-left').style.display = '';
            }
        },
        checkWinner: (player, com) => {
            let win = document.querySelector('#win');
            if (player.length == 0){
                win.textContent = 'You Win!!!';
                win.style.display = 'block';
                playerScore++;
                document.querySelector('.player-point').textContent = playerScore;
                return false;
            } else if (com.length == 0){
                win.textContent = 'Com Wins!!!';
                win.style.display = 'block';
                comScore++;
                document.querySelector('.com-point').textContent = comScore;
                return false;
            }else {
                return true;
            }
        },
        resetCards: (table, active) => {
            if (active.length == 30){
                for (let i = 0; i < (table.length); i++) {
                    active.push(table.pop());
                }
            }
        }

    }
})();

const gameInterface = ((gameCtrl, interfaceCtrl) => {
    // get allArray from the gameController IIFE
    allArrays = gameCtrl.getAllArrays();

    //set the shuffling array
    allArrays.shuffleArray = gameCtrl.generateRandomArray(allArrays.shuffleArray, 52);

    // Shuffle cards
    allArrays.allCards = interfaceCtrl.shuffleCards(allArrays.allCards, allArrays.shuffleArray);

    // Set player Cards and display
    allArrays.playerCards = gameCtrl.generateCardArray(allArrays.allCards, 5);
    isReady = interfaceCtrl.displayPlayerStartingCard(allArrays.playerCards);

    // Set com Cards and display
    allArrays.comCards = gameCtrl.generateCardArray(allArrays.allCards, 5);
    interfaceCtrl.displayComStartingCard();

    //set table Cards and display
    allArrays.tableCards = gameCtrl.generateCardArray(allArrays.allCards, 1);
    interfaceCtrl.displayCard('active-cards', allArrays.tableCards[allArrays.tableCards.length - 1], allArrays.tableCards.length == 1, true);
    allArrays.currentCard = allArrays.tableCards[allArrays.tableCards.length - 1].split('-');
    
    //Setup event listeners for all player cards
    isReady = false;
    playerIsPlaying = true;
    setTimeout (() => {
        isReady = true;
        document.querySelector('.turn').style.display = 'block';
    }, 5000);
    document.querySelector('.player').addEventListener('click', (event) => {
        if (playerIsPlaying && isReady) {
            let id, splitId
            id = event.target.id;
            if (id) {
                splitId = id.split('-');
                // check if card is valid
                if (splitId[0] == allArrays.currentCard[0] || splitId[1] == allArrays.currentCard[1]){
                    // display the card on table
                    interfaceCtrl.displayCard('active',id,false,false);
                    child = document.querySelector('.active-cards');
                    if (child.childNodes.length > 7) {
                        child.childNodes[3].style.display = 'block';
                        child.childNodes[1].style.display = 'block';
                    } else if (child.childNodes.length > 6) {
                        child.childNodes[3].style.display = 'block';
                    }

                    // remove the card from players cards
                    let el = document.getElementById(id);
                    el.parentNode.removeChild(el);
                    allArrays.playerCards.splice(allArrays.playerCards.indexOf(id), 1);


                    // remove the card from player array and add it to table array
                    allArrays.tableCards.push(id);

                    // update current card
                    allArrays.currentCard = allArrays.tableCards[allArrays.tableCards.length - 1].split('-');

                    let children = document.querySelector('.player').childNodes;
                    for (let i = 0; i < (children.length - 1); i++) {
                        children[i].style.display = 'block';
                    }
                    //paginate cards i.e prevent cards from going out of scope
                    interfaceCtrl.paginateCards();

                    //Check winner
                    isReady = interfaceCtrl.checkWinner(allArrays.playerCards, allArrays.comCards);

                    //update no of cards left
                    document.querySelector('h2').textContent = allArrays.playerCards.length;
                    document.querySelector('.turn').style.display = 'none';
                    if (splitId[1] == 'ace'){
                        playerIsPlaying = true;
                        document.querySelector('.turn').style.display = 'block';
                    } else if (splitId[1] == 2) {
                        setTimeout(() => comMarket(),500);
                        setTimeout(() => comMarket(),1000);
                        playerIsPlaying = true;
                        document.querySelector('.turn').style.display = 'block';
                    } else {
                        playerIsPlaying = false;
                        comPlay();
                    }
                }
            }
        }
    });

    // add market event listener
    document.querySelector('.card-stack-3').addEventListener('click', (event) => {
        if (playerIsPlaying && isReady) {
            playerMarket();

            //update no of cards left
            document.querySelector('h2').textContent = allArrays.playerCards.length;
            document.querySelector('.turn').style.display = 'none';
            playerIsPlaying = false;
            comPlay();
        } else {
            comPlay();
        }
    });

    // teach computer the game 
    const comPlay = () => {
        if (!playerIsPlaying && isReady) {
            setTimeout(() => {
                for (let i = 0; i < allArrays.comCards.length; i++) {
                    cur = allArrays.comCards[i];
                    splitCur = cur.split('-');
                    found = false;
                    if (splitCur[0] == allArrays.currentCard[0] || splitCur[1] == allArrays.currentCard[1]) {
                        interfaceCtrl.displayCard('active',cur,false,false);
                        child = document.querySelector('.active-cards');
                        if (child.childNodes.length > 7) {
                            child.childNodes[3].style.display = 'block';
                            child.childNodes[1].style.display = 'block';
                        } else if (child.childNodes.length > 6) {
                            child.childNodes[3].style.display = 'block';
                        }
                        allArrays.tableCards.push(cur);
                        allArrays.comCards.splice(allArrays.comCards.indexOf(cur), 1);
                        allArrays.currentCard = allArrays.tableCards[allArrays.tableCards.length - 1].split('-');
                        let el = document.querySelector('.com');
                        if (allArrays.comCards.length < 11) {
                            el.removeChild(el.childNodes[0]);
                        }
                        if (splitCur[1] == 'ace'){
                            playerIsPlaying = false;
                            comPlay();
                        } else if (splitCur[1] == 2) {
                            playerIsPlaying = false;
                            setTimeout(() => playerMarket(),500);
                            setTimeout(() => playerMarket(),1000);
                            comPlay();
                        } else {
                            playerIsPlaying = true;
                            document.querySelector('.turn').style.display = 'block';
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    comMarket();
                    document.querySelector('.turn').style.display = 'block';
                    playerIsPlaying = true;
                }
                //Check winner
                isReady = interfaceCtrl.checkWinner(allArrays.playerCards, allArrays.comCards);
            },1500)
        }
    }
    comPlay();
    // add event listener to the next button 
    document.querySelector('.next').addEventListener('click', () => {
        console.log(allArrays.count)
        let children = document.querySelector('.player').childNodes;
        if (allArrays.count < (allArrays.playerCards.length - 10)) {
            allArrays.count++;
            console.log('Pressed');
            for (let i = 0; i < (children.length - 1); i++) {
                children[i].style.display = 'none';
            }
            console.log(allArrays.count);
            for (let i = allArrays.count; i < (allArrays.count + 10); i++ ){
                children[i].style.display = 'block';
            }
        }
        // }else {
        //     allArrays.count--;
        //     console.log(allArrays.count)
        // }
    });

    const comMarket = () => {
        // remove from active cards array and add to players array
        let collectedCard =allArrays.allCards.pop();
        allArrays.comCards.push(collectedCard);
        if (allArrays.comCards.length < 11) {
            interfaceCtrl.displayCard('com', collectedCard, false, true);
        }
        // reset cards
        interfaceCtrl.resetCards(allArrays.tableCards, allArrays.allCards);
    }
    const playerMarket = () => {
        // remove from active cards array and add to players array
        let collectedCard =allArrays.allCards.pop();
        allArrays.playerCards.push(collectedCard);
        interfaceCtrl.displayCard('player', collectedCard, false, true);

        let children = document.querySelector('.player').childNodes;
        for (let i = 0; i < (children.length - 1); i++) {
            children[i].style.display = 'block';
        }
        
        // reset cards
        interfaceCtrl.resetCards(allArrays.tableCards, allArrays.allCards);

        //paginate cards i.e prevent cards from going out of scope
        interfaceCtrl.paginateCards();
    }
    // add event listener to the prev button 
    document.querySelector('.prev').addEventListener('click', () => {
        if (allArrays.count > 1){
            allArrays.count--;
            console.log(allArrays.count)
            let children = document.querySelector('.player').childNodes;
            console.log('Pressed');
            for (let i = 0; i < (children.length - 1); i++) {
                children[i].style.display = 'none';
            }
            console.log(allArrays.count);
            for (let i = allArrays.count; i < (allArrays.count + 10); i++ ){
                children[i].style.display = 'block';
            }
        }
    });
    console.log(allArrays)
})(gameController,interfaceController);
