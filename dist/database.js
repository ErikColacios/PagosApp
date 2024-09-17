import Database from "better-sqlite3";
import { Router } from 'express';
import express from 'express';
const db = new Database('./src/pagos.db');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
let pagos = [];
const router = Router();
router.post('/pago', (req, res) => {
    const data = [
        { metPago: "Tarjeta", moneda: "EUR", cantidad: "250" },
        { metPago: "Metalico", moneda: "EUR", cantidad: "643" },
    ];
    const sql = db.prepare('INSERT INTO pagos (metodo_pago, moneda, cantidad) VALUES (?,?,?)');
    data.forEach((pago) => {
        sql.run(pago.metPago, pago.moneda, pago.cantidad);
    });
    res.status(201).json(data);
    console.log("Insertados");
});
app.get('/', (req, res) => {
    const query = "SELECT * FROM pagos";
    const pagos = db.prepare(query).all();
    res.json({ pagos: pagos });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
export default router;
// let db:sqlite3.Database = new sqlite3.Database(dbName, (error) => {
//     if(error){
//         return console.error(error.message)
//     }
//     console.log("Conectado <3")
//     db.run('CREATE TABLE IF NOT EXISTS pagos (pago_id INTEGER PRIMARY KEY AUTOINCREMENT, metodo_pago TEXT, moneda TEXT, cantidad DECIMAL)', (err)=> {
//         if(err){
//             console.error(err.message)
//         }else{
//             console.log("Table created")
//         }
//     })
// })
// export const createItem = (metPago:string,  moneda:string, cantidad:string) => {
//     const sql = 'INSERT INTO pagos (metodo_pago, moneda, cantidad) VALUES (?,?,?)'
//     db.run(sql, [metPago, moneda, cantidad], (err)=> {
//         if(err){
//             return console.error("Error al insertar datos: ", err.message)
//         }else{
//             console.log("Fila insertada")
//         }
//     })
// }
