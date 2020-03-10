import { Observable, Observer } from "rxjs";
import { AbstractControl } from "@angular/forms";

export const mimeType = (
  control: AbstractControl // what is gonna return is a promise or obs error
):  Promise<{ [key: string]: any}> | Observable<{ [key: string]: any}> => {
  // fn body
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{ [key: string]: any}>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
        let header ="";
        let isValid = false; // png jpg if is found in file gives true
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16); // add parts to string as string hexadecimal
        }
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if(isValid) {
          observer.next(null);  // return true it mean and emit to Observable(the answer)
        } else {
          observer.next({invalidMimeType: true}); // strange js object to any error u want
        }
        observer.complete(); // let know all subs we are done.
      });
      fileReader.readAsArrayBuffer(file);
  });
  return frObs; // we return this observable
};
