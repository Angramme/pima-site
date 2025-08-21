import { marked, type MarkedOptions } from "marked";
import { browser } from '$app/environment';
// import * as DOMPurify from 'dompurify';

export const generate_password = (
        length: number = 30,
        wishlist: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ): string =>
    Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join('');


/**
 * 
 * @param {any[][]} arrays 
 * @returns 
 */
export function zip(arrays: any[][]) {
    return arrays[0].map(
        /**
         * 
         * @param {*} _ 
         * @param {number} i 
         * @returns 
         */
        function(_: any, i: number){
        return arrays.map(
            /**
             * 
             * @param {any[]} array 
             * @returns 
             */
            function(array: any[]){return array[i]})
    });
}

/** Capitalize first letter
 * @param {string} str 
 * @return {string}
 */
export function capFirst(str: string): string {
    str = str.toLowerCase();
    if(str.length == 0) return str;
    const s = str.split(" ");
    if(s.length > 1) return s.map(capFirst).join(" ");
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Purifies and displays markdown as HTML
 * @param {string | undefined} str 
 * @param {MarkedOptions | undefined} options 
 * @returns {Promise.<string>}
 */
export async function display_mardkown(str: string | undefined, options: MarkedOptions | undefined = undefined): Promise<string> {
    if(str == undefined) return "???";
    const m = (await import("dompurify")).default;
    return browser ? m.sanitize(marked(str, options)) : "not browser";
}
