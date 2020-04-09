DataPrizes = function () {
    let self = this;

    this.giveOutPrizes = function (userId, prizes) {
        prizes.forEach(function (prize) {
            self.giveOutPrize(userId, prize);
        })
    };

    this.giveOutPrize = function (userId, prize) {
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_GOLD:
                DataStuff.giveAGold(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_HUMMER:
                DataStuff.giveAHummer(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                DataStuff.giveAShuffle(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTNING:
                DataStuff.giveAlightning(userId, prize.count);
                break;
        }
    };
};

DataPrizes = new DataPrizes;

DataPrizes.PRIZE_STUFF_HUMMER = 1;
DataPrizes.PRIZE_STUFF_SHUFFLE = 2;
DataPrizes.PRIZE_STUFF_LIGHTNING = 3;

DataPrizes.PRIZE_STUFF_GOLD = 100;
