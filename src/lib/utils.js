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