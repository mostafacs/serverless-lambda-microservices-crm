
module.exports.copyProps = (src, target, skipProps) => {
    Object.keys(src).filter( k => skipProps.indexOf(k) === -1).forEach( k => {
        target[k] = src[k];
    });
};
