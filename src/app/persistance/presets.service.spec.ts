import { PresetsService } from './presets.service';
import { TestBed } from '@angular/core/testing';

describe('Presets service', () => {

  let presetsService: PresetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [PresetsService],
    });

    presetsService = TestBed.get(PresetsService);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  it('should get default presets', () => {
    const presets = presetsService.getPresets();
    expect(presets.length).toEqual(20);
    expect(presets[0]).toEqual('1d6');
  });

  it('should get existing presets', () => {
    localStorage.setItem('preset10', '20d8');
    const presets = presetsService.getPresets();

    expect(presets.length).toEqual(20);
    expect(presets[9]).toEqual('20d8');
  });

  it('should save preset', () => {
    presetsService.savePreset('100d6', 1);
    expect(localStorage.getItem('preset1')).toEqual('100d6');
    expect(presetsService.getPresets()[0]).toEqual('100d6');
  });

});
