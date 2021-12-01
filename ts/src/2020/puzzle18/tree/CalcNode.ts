export enum CalcMethod {
  ADDITION = 'ADDITION',
  MULTIPLICATION = 'MULTIPLICATION',
}

export abstract class CalcNode {
  private _leftChild: CalcNode | undefined;
  private _rightChild: CalcNode | undefined;

  protected constructor() {
    this._leftChild = undefined;
    this._rightChild = undefined;
  }

  get leftChild(): CalcNode | undefined {
    return this._leftChild;
  }

  set leftChild(value: CalcNode | undefined) {
    this._leftChild = value;
  }

  get rightChild(): CalcNode | undefined {
    return this._rightChild;
  }

  set rightChild(value: CalcNode | undefined) {
    this._rightChild = value;
  }

  /**
   * Calculates the result of this subtree.
   *
   * @returns Result of the subtree.
   * @throw `Error` - If the calculation method is not supported by this operation.
   */
  abstract calcResult(): number;
}

export class InnerCalcNode extends CalcNode {
  constructor(private readonly method: CalcMethod) {
    super();
  }

  calcResult(): number {
    const resultLeft: number = this.leftChild?.calcResult() ?? this.getUnitForCalcMethod();
    const resultRight: number = this.rightChild?.calcResult() ?? this.getUnitForCalcMethod();

    switch (this.method) {
      case CalcMethod.ADDITION:
        return resultLeft + resultRight;
      case CalcMethod.MULTIPLICATION:
        return resultLeft * resultRight;
      default:
        throw new Error(`Calculation methode not supported (${this.method}`);
    }
  }

  /**
   * @returns The unit number for the calculation method of this node (ie 0 for "+" and 1 for "*").
   * @throw `Error` - If the calculation method is not supported by this operation.
   * @private
   */
  private getUnitForCalcMethod(): number {
    switch (this.method) {
      case CalcMethod.ADDITION:
        return 0;
      case CalcMethod.MULTIPLICATION:
        return 1;
      default:
        throw new Error(`Calculation method not supported (${this.method}).`);
    }
  }
}

export class LeafNode extends CalcNode {
  constructor(private readonly value: number) {
    super();
  }

  calcResult(): number {
    return this.value;
  }
}
