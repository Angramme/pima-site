import { createTransport, getTestMessageUrl } from "nodemailer";
import { SMTP_USER, SMTP_PWD } from '$env/static/private'
import { capFirst } from "./utils";


const nodemailer = createTransport({
        host: "smtp.postmarkapp.com",
        port: 587, // 25, 2525, or 587 
        secure: false, // upgrade later with STARTTLS
        // possible auth methods: Plain text, CRAM-MD5, or TLS
        auth: {
            user: SMTP_USER,
            pass: SMTP_PWD,
        },
    },
    { // default message fields

        // sender info
        from: 'PIMA alumni <pima@ozieblowski.dev>',
    });
export default nodemailer;

// verify connection configuration
nodemailer.verify(function (error, success) {
    if (error) console.log(error);
    else console.log("[info] SMTP server ready");
});

/**
 * 
 * @param {string} email 
 * @param {string} login 
 * @param {string} nom
 * @param {string} prenom 
 * @param {string} pwd in clear text
 */
export function sendCreationMail(email, login, nom, prenom, pwd) {
    // look here for more examples: https://github.com/nodemailer/nodemailer/blob/master/examples/full.js

    let message = {
        // Comma separated list of recipients
        to: `${nom} ${prenom} [${login}] <${email}>`,

        // Subject of the message
        subject: 'Ton compte sur pima.ozieblowski.dev ❤️',

        // plaintext body
        text: `Salut ${capFirst(prenom)}! 
Voici tes identifiants pour pima.ozieblowski.dev: 

\tlogin: ${login} 
\tmot-de-passe: ${pwd}

Il est fortement recommandé de changer ce mot de passe immédiatement :)
(Si tu souhaites supprimer ton compte, tu peux répondre "BANANE" a ce email.)

Kind regards 🤙,
La team alumni PIMA`,

        list: {
            // List-Help: <mailto:admin@example.com?subject=help>
            help: 'pima@ozieblowski.dev',
        }
    };

    return nodemailer.sendMail(message);
}