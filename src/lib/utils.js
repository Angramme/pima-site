import { marked } from "marked";
import { browser } from '$app/environment';
// import * as DOMPurify from 'dompurify';

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

/**
 * Purifies and displays markdown as HTML
 * @param {string | undefined} str 
 * @returns {Promise.<string>}
 */
export async function display_mardkown(str) {
    if(!str) return new Promise(()=>"null");
    const m = (await import("dompurify")).default;
    console.log(m.sanitize(marked(str)))
    return browser ? m.sanitize(marked(str)) : new Promise(()=>"not browser");
}