export const generate_password = (
        length = 30,
        wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) =>
    Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join('');


/**
 * 
 * @param {*} arrays 
 * @returns 
 */
export function zip(arrays) {
    return arrays[0].map(
        /**
         * 
         * @param {*} _ 
         * @param {*} i 
         * @returns 
         */
        function(_,i){
        return arrays.map(
            /**
             * 
             * @param {*} array 
             * @returns 
             */
            function(array){return array[i]})
    });
}

/** Capitalize first letter
 * @param {string} str 
 * @return {string}
 */
export function capFirst(str){
    str = str.toLowerCase();
    if(str.length == 0) return str;
    const s = str.split(" ");
    if(s.length > 1) return s.map(capFirst).join(" ");
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}