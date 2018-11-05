// signature_pad's props 
// (taken from https://github.com/szimek/signature_pad/blob/e2af461bca7ceb7cc5afb8349930908ca19f2f56/src/signature_pad.ts#L23)
export interface IOptions {
    dotSize?: number | (() => number);
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    backgroundColor?: string;
    penColor?: string;
    throttle?: number;
    velocityFilterWeight?: number;
    onBegin?: (event: MouseEvent | Touch) => void;
    onEnd?: (event: MouseEvent | Touch) => void;
}

// props specific to the React wrapper
export interface SignatureCanvasProps extends IOptions {
    canvasProps: any;
    clearOnResize: boolean;
}

export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {}
