import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RollerService } from './calculator/roller.service';
import { PresetsService } from './persistance/presets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Die Roller';
  toRoll = '';
  repeat = 1;
  grandTotal = 0;
  rolls: string[] = [];
  resRolls: string[] = [];

  constructor(private rollerService: RollerService,
              private presetService: PresetsService) {
  }

  doRoll(form: NgForm) {
    if (!this.toRoll || this.repeat < 1) {
      return;
    }
    this.rollerService.clear();
    this.grandTotal = 0;

    for (let i = 0; i < this.repeat; i++) {
      this.rollerService.evaluate(this.toRoll);

      if (i + 1 < this.repeat) {
        this.rollerService.rollerModel.rolls.push('------------------\n');
        this.rollerService.rollerModel.resRolls.push('------------------\n');
      }

      this.grandTotal += this.rollerService.rollerModel.grandTotal;
    }

    this.rollerService.rollerModel.resRolls.push('------------------\n');
    this.rollerService.rollerModel.resRolls.push(`Grand Total: ${this.grandTotal}\n`);

    this.rolls = this.rollerService.rollerModel.rolls;
    this.resRolls = this.rollerService.rollerModel.resRolls;
  }

  spread(input: string[]): string {
    return input
      .map(item => `${item}\n`)
      .reduce((curr, item) => {
        return curr + item;
      }, '');
  }


}
