export function stableMergeSort<T>(
    array: T[],
    compareFn: (a: T, b: T) => number
): T[] {
    const n = array.length;
    if (n < 2) {
        return array;
    }
    const aux = new Array<T>(n);
    sort(array, aux, compareFn, 0, n - 1);
    return array;
}

function sort<T>(
    array: T[],
    aux: T[],
    compareFn: (a: T, b: T) => number,
    low: number,
    high: number
): void {
    if (high <= low) {
        return;
    }
    const mid = low + Math.floor((high - low) / 2);
    sort(array, aux, compareFn, low, mid);
    sort(array, aux, compareFn, mid + 1, high);
    merge(array, aux, compareFn, low, mid, high);
}

function merge<T>(
    array: T[],
    aux: T[],
    compareFn: (a: T, b: T) => number,
    low: number,
    mid: number,
    high: number
): void {
    let i = low,
        j = mid + 1;

    for (let k = low; k <= high; k++) {
        aux[k] = array[k];
    }

    for (let k = low; k <= high; k++) {
        if (i > mid) {
            array[k] = aux[j++];
        } else if (j > high) {
            array[k] = aux[i++];
        } else if (compareFn(aux[i], aux[j]) <= 0) {
            array[k] = aux[i++];
        } else {
            array[k] = aux[j++];
        }
    }
}
