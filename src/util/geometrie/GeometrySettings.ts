export enum GeometryMode {
  MATHEMATICS,
  SCREEN,
}

export abstract class GeometrySettings {
  private static mode: GeometryMode = GeometryMode.MATHEMATICS;

  static setMode(mode: GeometryMode): void {
    GeometrySettings.mode = mode;
  }

  static getMode(): GeometryMode {
    return GeometrySettings.mode;
  }
}
