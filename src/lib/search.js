/** @param {string} st*/
export const matches = (st) =>
    /** @param {*} v */
    (v) => {
        let x = st.toLowerCase().trim();
        if (st[0] == '<') return Number(st.substring(1)) > Number(v);
        if (st[0] == '>') return Number(st.substring(1)) < Number(v);
        if (typeof v == "number") return v.toString().toLowerCase().includes(x);
        else if (typeof v == "string") return v.toLowerCase().includes(x);
        else if (Array.isArray(v)) return v.some(y => y.toLowerCase().includes(x));
        else return false;
    };

/**
*    @typedef {{
*        op: string,
*        left: AST,
*        right: AST,
*    } | string} AST
*/

/** @param {string} str 
 * @returns {AST | null}
*/
export const parse_ast = (str) => {
    str = str.trim();
    if (str.length == 0) return null;

    let I = 0;
    let simple = true;

    if (str[0] == '(') {
        let down = false;
        let i = 1;
        let c = 1;
        while (c > 0 && i < str.length) {
            if (str[i] == '(') {
                if (down) simple = false;
                c++;
            }
            else if (str[i] == ')') {
                down = true;
                c--;
            }
            i++;
        }
        I = i;
        console.log(I, str[I - 1], str);
    }

    /** @param {string} str @returns {[string, boolean]}*/
    const redu = (str, rex = false) => {
        str = str.trim();
        const r = str[0] == '(' && str[str.length - 1] == ')';
        str = str.substring(
            r ? 1 : 0,
            r ? str.length - 1 : str.length);

        return [r && rex ? redu(str, rex)[0] : str, r];
    }

    if (I == str.length) {
        const [s, r] = redu(str);
        return r ? parse_ast(s) : s;
    }

    let i = /[&\|:]/g.exec(str.substring(I))?.index;
    i = i == null ? Infinity : i + I;

    if (i == Infinity && (!simple || (I && I != str.length))) {
        console.error("bad expression", i, I, str);
        return null;
    }

    if (i == Infinity) return redu(str.trim(), true)[0];

    const left = parse_ast(redu(str.substring(0, i), true)[0]);
    const right = parse_ast(str.substring(i + 1));
    if (!left || !right) return null;

    return {
        op: str[i],
        left: left,
        right: right,
    }
};


export const ast_match =
    /** @param {AST} ast 
        @param {Object[]} vals
        @param {Object.<string, *>} obj
        @return {boolean}
        */
    (ast, vals, obj) => {
        if (typeof ast == "string") return vals.some(matches(ast));
        switch (ast.op) {
            case "&": return ast_match(ast.left, vals, obj) && ast_match(ast.right, vals, obj);
            case "|": return ast_match(ast.left, vals, obj) || ast_match(ast.right, vals, obj);
            case ":": {
                if (typeof ast.left == 'string') return ast_match(ast.right, [obj[ast.left]], obj);
                switch (ast.left.op) {
                    case "&": return ast_match({ op: ":", left: ast.left.left, right: ast.right }, vals, obj) && ast_match({ op: ":", left: ast.left.right, right: ast.right }, vals, obj);
                    case "|": return ast_match({ op: ":", left: ast.left.left, right: ast.right }, vals, obj) || ast_match({ op: ":", left: ast.left.right, right: ast.right }, vals, obj);
                }
            }
        }
        console.error("bad");
        return false;
    }