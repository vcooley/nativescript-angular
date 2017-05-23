import {
    KeyframeDeclaration,
    KeyframeInfo,
} from "tns-core-modules/ui/animation/keyframe-animation";
import { CssAnimationProperty } from "tns-core-modules/ui/core/properties";
import { AnimationCurve } from "tns-core-modules/ui/enums";

export type Keyframe = {
    [key: string]: string | number;
};

type Transformation = {
    property: string;
    value: TransformationValue;
};

type TransformationValue = number | { x: number, y: number };

const TRANSFORM_SPLITTER = new RegExp(/([a-zA-Z\-]+)\((.*?)\)/g);

const STYLE_TRANSFORMATION_MAP = Object.freeze({
    "scale": value => ({ property: "scale", value }),
    "scale3d": value => ({ property: "scale", value }),
    "scaleX": value => ({ property: "scale", value: { x: value, y: 1 } }),
    "scaleY": value => ({ property: "scale", value: { x: 1, y: value } }),

    "translate": value => ({ property: "translate", value }),
    "translate3d": value => ({ property: "translate", value }),
    "translateX": value => ({ property: "translate", value: { x: value, y: 0 } }),
    "translateY": value => ({ property: "translate", value: { x: 0, y: value } }),

    "rotate": value => ({ property: "rotate", value }),

    "none": _value => [
        { property: "scale", value: { x: 1, y: 1 } },
        { property: "translate", value: { x: 0, y: 0 } },
        { property: "rotate", value: 0 },
    ],
});

const STYLE_CURVE_MAP = Object.freeze({
    "ease": AnimationCurve.ease,
    "ease-in": AnimationCurve.easeIn,
    "ease-in-out": AnimationCurve.easeInOut,
    "ease-out": AnimationCurve.easeOut,
    "linear": AnimationCurve.linear,
    "spring": AnimationCurve.spring,
});

export function getAnimationCurve(value: string): any {
    return value ?
        STYLE_CURVE_MAP[value] || parseCubicBezierCurve(value) :
        AnimationCurve.ease;
}

export function parseAnimationKeyframe(styles: Keyframe) {
    let keyframeInfo = <KeyframeInfo>{};
    keyframeInfo.duration = <number>styles.offset;
    keyframeInfo.declarations = Object.keys(styles).reduce((declarations, prop) => {
        let value = styles[prop];

        const property = CssAnimationProperty._getByCssName(prop);
        if (property) {
            if (typeof value === "string" && property._valueConverter) {
                value = property._valueConverter(<string>value);
            }
            declarations.push({ property: property.name, value });
        } else if (typeof value === "string" && prop === "transform") {
            declarations.push(...calculateTransformation(<string>value));
        }

        console.dir(declarations);

        return declarations;
    }, new Array<KeyframeDeclaration>());

    return keyframeInfo;
}

function parseCubicBezierCurve(value: string) {
    const coordsString = /\((.*?)\)/.exec(value);
    const coords = coordsString && coordsString[1]
        .split(",")
        .map(stringToBezieCoords);

    if (value.startsWith("cubic-bezier") &&
        coordsString &&
        coords.length === 4) {

        return (<any>AnimationCurve).cubicBezier(...coords);
    } else {
        throw new Error(`Invalid value for animation: ${value}`);
    }
}

function stringToBezieCoords(value: string): number {
    let result = parseFloat(value);
    if (result < 0) {
        return 0;
    } else if (result > 1) {
        return 1;
    }

    return result;
}

function calculateTransformation(text: string): KeyframeDeclaration[] {
    return parseTransformString(text)
        .reduce((transformations, style) => {
            const transform = STYLE_TRANSFORMATION_MAP[style.property](style.value);

            if (Array.isArray(transform)) {
                transformations.push(...transform);
            } else if (typeof transform !== "undefined") {
                transformations.push(transform);
            }

            return transformations;
        }, new Array<Transformation>());
}

function parseTransformString(text: string): Transformation[] {
    let matches: Transformation[] = [];
    let match;
    // tslint:disable-next-line
    while ((match = TRANSFORM_SPLITTER.exec(text)) !== null) {
        const property = match[1];
        const value = parseValue(match[2]);

        matches.push({property, value });
    }

    return matches;
}

function parseValue(stringValue: string): TransformationValue {
    const [x, y] = stringValue.split(",").map(parseFloat);

    if (x && y) {
        return { x, y };
    } else {
        return stringValue.slice(-3) === "rad" ?
            x * (180.0 / Math.PI) :
            x;
     }
}
