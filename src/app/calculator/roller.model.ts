
export class RollResult {
    dieSides: number;
    rolls: number[];

    constructor(dieSides: number, rolls: number[]) {
        this.dieSides = dieSides;
        this.rolls = rolls;
    }
}

export class RollerModel {
    resRolls: string[];
    rolls: string[];
    rollStats: RollResult[];
    grandTotal: number;

    constructor() {
        this.resRolls = [];
        this.rolls = [];
        this.rollStats = [];
        this.grandTotal = 0;
    }

    public addRollSeries(dieSides: number, rolls: number[]) {
        this.rollStats.push(new RollResult(dieSides, rolls));
    };
}
