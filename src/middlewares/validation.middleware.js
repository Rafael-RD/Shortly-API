
export default function validationMiddleware(schema){
    return ((req, res, next)=>{
        const validationLog=schema.validate(req.body,{abortEarly: false});
        if(validationLog.error) {
            return res.status(422).send(
                validationLog.error.details.map(e=>e.message.replaceAll("\"",""))
            );
        }
        next();
    })
}