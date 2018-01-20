import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RollerService } from './calculator/roller.service';
import { PresetsService } from './persistance/presets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Die Roller';
  toRoll = '1d6';
  repeat = 1;
  grandTotal = 0;
  rolls: string[] = [];
  resRolls: string[] = [];
  presets: string[];
  presetEditMode = false;
  editedPresets: string[] = [];

  constructor(private rollerService: RollerService,
              private presetService: PresetsService) {
  }

  ngOnInit() {
    this.presets = this.presetService.getPresets();
  }

  submitRollForm(rollObj: any) {
    this.doRoll(rollObj.toRoll, rollObj.repeat);
  }

  submitRollPreset(preset: string) {
    this.doRoll(preset, 1);
  }

  doRoll(roll: string, repeat: number) {
    if (!roll || repeat < 1) {
      return;
    }

    this.rollerService.clear();
    this.grandTotal = 0;

    for (let i = 0; i < repeat; i++) {
      this.rollerService.evaluate(roll);

      if (i + 1 < repeat) {
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

  enterEditMode() {
    this.presetEditMode = true;
    this.editedPresets = Array.from(this.presets);
  }

  savePresets() {
    this.presetService.savePresets(this.editedPresets);
    this.presets = this.presetService.getPresets();
    this.presetEditMode = false;
    this.editedPresets = [];
  }

  editPreset(event, idx) {
    this.editedPresets[idx] = event.target.value;
  }
}
