//@flow
/**
 * @author dskgry
 */
type YupShape = {
    [key: string]: YupType;
};

type Config = {
    stripUnknown?: boolean;
    abortEarly?: boolean;
    useExpress?: boolean;
}