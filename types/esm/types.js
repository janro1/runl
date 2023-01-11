export var LambdaMode;
(function (LambdaMode) {
    LambdaMode["Ephemeral"] = "Ephemeral";
    LambdaMode["Persistent"] = "Persistent";
})(LambdaMode = LambdaMode || (LambdaMode = {}));
const hasProperty = (value, key) => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    return key in value;
};
export const isOption = (value) => hasProperty(value, 'lambdaPath') && hasProperty(value, 'mode');
export const isWithRequestNumber = (value) => hasProperty(value, 'requestNumber');
export const isWithEvent = (value) => hasProperty(value, 'event');
export const isLambdaResponse = (value) => hasProperty(value, 'result');
const isErrorContainer = (value) => hasProperty(value, 'error');
const isError = (value) => hasProperty(value, 'message');
export const isLambdaError = (value) => isErrorContainer(value) && isError(value.error);
