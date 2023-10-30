// import { PASSWORD_HASH_SALT } from "$env/static/private";
// yes, reusing hashes is bad...

// Structure
// 
//  global_secret = decrypt(user.secret_encrypted, user.clear_password)   
//  links_decrypted = decrypt(links_encrypted, global_secret)
//  
//  user1 creating user2 :
//  user2.secret_encrypted = encrypt(decrypt(user.secret_encrypted, user1.clear_password), user2.clear_password)
// 

const links_encrypted = {
    "Contact":{
        "Discord": "https://discord.gg/S8NJDG84",
        "Linkedin": "https://www.linkedin.com/groups/8184888/"
    },
    "Resources":{
        "Google Drive": "https://drive.google.com/drive/folders/1tAFv1qQaZ7c_C-_35OhXOIYn3r8iu9rs?usp=sharing"
    }
};

/**
 * @param {string} v 
 * @returns {string}
 */
const decrypt = (v)=>v;


/** @type {[string, string[]][]} */
export const categorized_keys = Object
    .entries(links_encrypted)
    .map(([k, e])=>[k, Object.keys(e)]);

/** @type {string[]} */
export const flat_keys = Object
    .values(links_encrypted)
    .flatMap((e)=>Object.keys(e));

/** @type {Object.<string, string>} */
export const flat_map = Object.assign({}, ...Object
    .values(links_encrypted)
    .flatMap(o=>Object
        .entries(o)
        .map(([k, v])=>({[k]: decrypt(v)}))));

