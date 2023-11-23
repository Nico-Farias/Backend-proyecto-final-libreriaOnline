import { createTransport } from "nodemailer";


const transporter = createTransport({
    service:'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


const emailRegistro = (nombre) => {


    return `<h1>Hola ${
        nombre
    }, ¡Gracias por registrarte!</h1>`


}




const emailCambiarPassword = (nombre,token) => {
    return `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        </p>

        <a href='http://localhost:5173/reset-password/${token}'>Reestablecer password</a>

        <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>

        `
}


export const sendEmail = async (user, service, token = null) => {
    try {

        const {email, nombre} = user;

        let msg = '';
        service === 'register' ? msg = emailRegistro(nombre) : service === 'resetPass' ? msg = emailCambiarPassword(nombre,token) : msg = '';

        let subj = '';
        subj = service === 'register' ? 'Bienvenido/a' : service === 'resetPass' ? 'Restablecimiento de contraseña' : '';

        const gmailOptions = {
            from: '"CLICKBOOK" <usuarios@clickbook.com>',
            to: email,
            subject: subj,
            html: msg
        };

        const response = await transporter.sendMail(gmailOptions);
        console.log(response)
        if (token !== null) {
            return token;
        }


    } catch (error) {
        console.log(error)
    }
}

export const emailDeleteProduct = async (datos) => {

    const {emailVendedor,nombreVendedor,nombreProducto} = datos;

    transporter.sendMail({


        from: '"CLICKBOOK" <usuarios@clickbook.com>',
        to: emailVendedor,
        subject: "ClickBook",
        text: "Produto eliminado",
        html: `<p>Hola: ${nombreVendedor} tu producto ${nombreProducto} ah sido eliminado por el administrador</p>
    
        `
    })

}


export const emailFinalizarCompra = async (datos) => {
    const {email,nombre,ticket} = datos;

    transporter.sendMail({


        from: '"CLICKBOOK" <ventas@clickbook.com>',
        to: email,
        subject: "ClickBook",
        text: "Compra finalizada ",
        html: `<p>Hola: ${nombre} has finalizado tu compra correctamente</p>
        <p>Aqui tiene tu ticket :</p>
        <p>codigo : ${ticket.code}</p>
        <p>Productos : ${ticket.productsInCart}</p>
        <p>Datetime : ${ticket.purchase_datetime}</p>
        <p>Total: $${ticket.amount}</p>
        
    
        `
    })

}