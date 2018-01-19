/* tslint:disable:no-unused-variable */
import { RollerService } from './roller.service';

describe('RollerService', () => {

    let rollerService: RollerService;

    beforeEach(() => {
        rollerService = new RollerService();
    });

    it('should roll nothing', () => {
        rollerService.evaluate('');
        expect(rollerService.rollerModel.grandTotal).toEqual(0);
        rollerService.clear();
        rollerService.evaluate('   ');
        expect(rollerService.rollerModel.grandTotal).toEqual(0);
    });

    it('should roll 1d6 and then 1d8', () => {
        rollerService.evaluate('1d6');
        expect(rollerService.rollerModel.grandTotal).toBeLessThanOrEqual(6);
        expect(rollerService.rollerModel.rollStats.find(item => item.dieSides === 6).rolls.length).toBeGreaterThan(0);
        rollerService.clear();
        rollerService.evaluate('1d8');
        expect(rollerService.rollerModel.grandTotal).toBeLessThanOrEqual(8);
        expect(rollerService.rollerModel.rollStats.find(item => item.dieSides === 6)).toBeUndefined();
    });

    it('should roll 1d6 + 10', () => {
        const res: number = rollerService.evaluate('1d6 + 10');
        expect(res).toBeGreaterThanOrEqual(11);
        expect(res).toBeLessThan(17);
    });

    it('should roll ((1d6) + (10))', () => {
      const res: number = rollerService.evaluate('((1d6) + (10))');
      expect(res).toBeGreaterThanOrEqual(11);
      expect(res).toBeLessThan(17);
    });

    it('should roll 1d6 + 2d8 + 10', () => {
        const res: number = rollerService.evaluate('1d6 + 2d8 + 10');
        const model = rollerService.rollerModel;
        expect(res).toBeGreaterThan(13);
        expect(res).toBeLessThan(33);
        expect(model.rollStats.find(item => item.dieSides === 6).rolls.length).toBeGreaterThan(0);
        expect(model.rollStats.find(item => item.dieSides === 8).rolls.length).toBeGreaterThan(0);
    });

    it('should fail to roll ((1d6) + (10)', () => {
        expect(() => {
            rollerService.evaluate('((1d6) + (10)');
        }).toThrow(new Error('The number of ( and ) does not match'));
    });

    it('should run math pow function', () => {
        const res = rollerService.evaluate('pow(3, 2)');
        expect(res).toEqual(9);
    });

});
