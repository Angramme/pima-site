

/**
 * 
 * @param {*} user 
 * @returns 
 */
export function user_data_into_forms(user){
    if(!user) return [];
    return [
        {n:"Ecoles", l:[
            {k:"admis", l:"admis dans", v:user.admis, t:"textlist", ro:false},
            {k:"choisi", l:"choisi", v:user.choisi, t:"text", ro:false},
            {k:"grad_year", l:"année fin L3", v:user.grad_year, t:"number", ro:false},
        ]},
        {n:"Vie profesionelle", l:[
            {k:"travails", l:"à travaillé/e dans ces entreprises/labos", v:user.travails, t:"textlist", ro:false},
        ]},
        {n:"Contact", l:[
            {k:"email", l:"email", v:user.email, t:"email", ro:false},
            {k:"contact", l:"autres moyens de contacter", v:user.contact, t:"textlist", ro:false},
        ]},
        {n:"Infos personelles", l:[
            {k:"nom", l:"nom de famille (facultatif)", v:user.nom, t:"text", ro:false},
            {k:"prenom", l:"prénom", v:user.prenom, t:"text", ro:false},
            {k:"nationalite", l:"nationalité/s", v:user.nationalite, t:"textlist", ro:false},
            {k:"description", l:"description et conseils pour les futurs pima", v:user.description, t:"longtext", ro:false},
        ]},
        {n:"Autres (Lecture seule)", l:[
            {k:"id", l:"id", v:user.id, t:"text", ro:true},
            {k:"login", l:"login", v:user.login, t:"text", ro:true},
            {k:"admin", l:"admin privileges", v:user.admin, t:"text", ro:true},
            {k:"createdAt", l:"date création", v:user.createdAt, t:"date", ro:true},
            {k:"updatedAt", l:"derniere mise a jour", v:user.updatedAt, t:"date", ro:true},
        ]},
    ];
}