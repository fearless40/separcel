

export class Array2D<Value> {
    private rlength: number;
    private clength: number;
    data: Array<Value>

    constructor(row_length: number, col_length: number) {
        this.rlength = row_length;
        this.clength = col_length;
        this.data = new Array<Value>(row_length * col_length);
    }

    toIndex(row: number, col: number): number {
        return (this.clength * row) + col;
    }

    decodeIndex(index: number): { row: number, col: number } {
        const row = Math.floor(index / this.clength);
        const col = index - (row * this.clength);
        return {
            row: row,
            col: col
        };
    }

    get(row: number, col: number): Value {
        return this.data[this.toIndex(row, col)];
    }

    set(row: number, col: number, value: Value): void {
        this.data[this.toIndex(row, col)] = value;
    }

    get row_length(): number {
        return this.rlength;
    }

    get col_length(): number {
        return this.clength;
    }
}