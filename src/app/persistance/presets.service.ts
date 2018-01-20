import { Injectable } from '@angular/core';
import { range } from 'lodash';

@Injectable()
export class PresetsService {

  public getPresets(): string[] {
    return range(1, 21).map((item) => {
      let preset = localStorage.getItem(`preset${item}`);

      if (!preset) {
        preset = `${item}d6`;
      }

      return preset;
    });
  }

  public savePreset(preset: string, idx: number) {
    localStorage.setItem(`preset${idx}`, preset);
  }

  public savePresets(presets: string[]) {
    presets.map((preset, idx) => {
      this.savePreset(preset, idx + 1);
    });
  }

}
