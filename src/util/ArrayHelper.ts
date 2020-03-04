
export function Array_Remove(inputArray: Array<any>, index: number): any {
    // Removes an item in the array by swapping it. 
    // Returns the item removed
    // Does not maintain sort order
    let swap = inputArray[index];
    inputArray[index] = inputArray[inputArray.length - 1];
    inputArray.pop();
    return swap;
}