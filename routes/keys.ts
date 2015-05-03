/**
 * Created by jonashansen on 02/05/15.
 */

export interface KeyChecker{
    check(key:string):boolean;
}

export class DefaultKeyChecker implements KeyChecker{
    check(key:string):boolean {
        console.log("Checking key "+key);
        return true;
    }
}
